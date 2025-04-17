from fastapi import APIRouter, Depends, Query, Request, HTTPException, Body
from typing import List, Optional, Any, Dict, Literal, Union
from pydantic import BaseModel, Field
from sqlalchemy import select, func, text, Column, Integer, String, Float, DateTime, JSON, Date, or_, and_, asc, desc, case
import os
import csv
import pandas as pd
from datetime import datetime, date
import glob
from pathlib import Path
from sqlalchemy.inspection import inspect
import json
import traceback

from schema import Forecast
from db.postgres_db import PostgresDatabase

router = APIRouter(prefix="/core", tags=["core"])

class ForecastResponse(BaseModel):
    id: Optional[int] = None
    p1_dc: Optional[str] = None
    format: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    segment_code: Optional[str] = None
    consensus_qty: Optional[float] = None
    brick_description: Optional[str] = None
    forecast_qty: Optional[float] = None
    brand: Optional[str] = None
    segment: Optional[str] = None
    division: Optional[str] = None
    brick_code: Optional[str] = None
    class_code: Optional[str] = None
    division_code: Optional[str] = None
    vertical: Optional[str] = None
    store_no: Optional[str] = None
    batchno: Optional[str] = None
    status: Optional[str] = None
    article_id: Optional[str] = None
    month_year: Optional[str] = None
    pin_code: Optional[str] = None
    region: Optional[str] = None
    wom: Optional[int] = None
    family_code: Optional[str] = None
    class_description: Optional[str] = None
    sd: Optional[str] = None
    article_description: Optional[str] = None
    kvi: Optional[str] = None
    npi: Optional[str] = None
    sold_qty: Optional[float] = None
    week_start_date: Optional[str] = None
    super_category: Optional[str] = None
    store_type: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    # This allows additional fields
    class Config:
        extra = "allow"

class PaginatedForecastResponse(BaseModel):
    total: int
    items: List[ForecastResponse]

def row_to_dict(row):
    """Convert a database row to a dictionary with proper date serialization"""
    result = {}
    # Use dictionary-like access instead of .items() method
    for key in row.keys():
        value = row[key]
        # Convert date and datetime objects to strings
        if isinstance(value, (date, datetime)):
            result[key] = value.isoformat()
        else:
            result[key] = value
    return result

async def get_postgres_db(request: Request):
    return request.app.state.postgres_db.database

class FilterRangeModel(BaseModel):
    type: Literal["range"]
    min: Optional[float] = None
    max: Optional[float] = None

class FilterDiscreteModel(BaseModel):
    type: Literal["discrete"]
    values: List[Any]

FilterModel = Union[FilterRangeModel, FilterDiscreteModel]

class SortModel(BaseModel):
    field: str
    direction: Literal["asc", "desc"] = "asc"

@router.get("/forecast", response_model=PaginatedForecastResponse)
async def get_forecast(
    request: Request,
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    week_start_date: Optional[str] = None,
    super_category: Optional[str] = None,
    store_type: Optional[str] = None,
    all_records: bool = Query(False, description="If true, returns all records (ignores limit/offset)"),
    search: Optional[str] = Query(None, description="JSON string for search criteria, format: {'field':'value'}"),
    filters: Optional[str] = Query(None, description="JSON string for filter criteria"),
    sort: Optional[str] = Query(None, description="JSON string for sort criteria, format: {'field':'field_name','direction':'asc|desc'}"),
    postgres_db=Depends(get_postgres_db),
):
    """
    Get paginated forecast data with optional filters, search, and sorting
    
    Query Parameters:
    - search: JSON string specifying search criteria (e.g. {"article_id":"12345"})
    - filters: JSON string specifying filter criteria (e.g. {"forecast_qty":{"type":"range","min":10,"max":100},"region":{"type":"discrete","values":["North","South"]}})
    - sort: JSON string specifying sort criteria (e.g. {"field":"forecast_qty","direction":"desc"})
    """
    # Build base query
    query = select(Forecast)
    count_query = select(func.count()).select_from(Forecast.__table__)
    
    # Apply filters if provided
    if week_start_date:
        try:
            date_obj = datetime.strptime(week_start_date, '%Y-%m-%d').date()
            query = query.where(Forecast.week_start_date == date_obj)
            count_query = count_query.where(Forecast.week_start_date == date_obj)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    if super_category:
        query = query.where(Forecast.super_category == super_category)
        count_query = count_query.where(Forecast.super_category == super_category)
    
    if store_type:
        query = query.where(Forecast.store_type == store_type)
        count_query = count_query.where(Forecast.store_type == store_type)
    
    # Apply search criteria if provided
    if search:
        try:
            search_criteria = json.loads(search)
            search_conditions = []
            
            for field, value in search_criteria.items():
                if hasattr(Forecast, field):
                    column = getattr(Forecast, field)
                    # Use LIKE for string fields
                    if isinstance(value, str):
                        search_conditions.append(column.ilike(f"%{value}%"))
                    else:
                        search_conditions.append(column == value)
            
            if search_conditions:
                query = query.where(or_(*search_conditions))
                count_query = count_query.where(or_(*search_conditions))
                
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON in search parameter")
    
    # Apply filter criteria if provided
    if filters:
        try:
            filter_criteria = json.loads(filters)
            filter_conditions = []
            
            for field, filter_spec in filter_criteria.items():
                if hasattr(Forecast, field):
                    column = getattr(Forecast, field)
                    
                    if filter_spec.get("type") == "range":
                        min_val = filter_spec.get("min")
                        max_val = filter_spec.get("max")
                        
                        if min_val is not None:
                            filter_conditions.append(column >= min_val)
                        if max_val is not None:
                            filter_conditions.append(column <= max_val)
                    
                    elif filter_spec.get("type") == "discrete":
                        values = filter_spec.get("values", [])
                        if values:
                            # Special handling for date fields
                            if field == 'week_start_date' and values:
                                date_values = []
                                for date_str in values:
                                    try:
                                        # Convert string dates to Python date objects
                                        date_values.append(datetime.strptime(date_str, '%Y-%m-%d').date())
                                    except (ValueError, TypeError):
                                        # Skip invalid dates
                                        pass
                                if date_values:
                                    filter_conditions.append(column.in_(date_values))
                            else:
                                filter_conditions.append(column.in_(values))
            
            if filter_conditions:
                query = query.where(and_(*filter_conditions))
                count_query = count_query.where(and_(*filter_conditions))
                
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON in filters parameter")
    
    # Apply sorting if provided
    if sort:
        try:
            sort_criteria = json.loads(sort)
            sort_field = sort_criteria.get("field")
            sort_direction = sort_criteria.get("direction", "asc")
            
            if sort_field and hasattr(Forecast, sort_field):
                column = getattr(Forecast, sort_field)
                if sort_direction == "desc":
                    query = query.order_by(desc(column))
                else:
                    query = query.order_by(asc(column))
                
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON in sort parameter")
    
    # Add pagination unless all_records is specified
    if not all_records:
        query = query.offset(offset).limit(limit)
    
    # Execute queries
    results = await postgres_db.fetch_all(query)
    total_count = await postgres_db.fetch_val(count_query)
    
    # Convert database rows to dictionaries with proper date handling
    items = [row_to_dict(row) for row in results]
    
    return {
        "total": total_count,
        "items": items
    }

class DataLoadResponse(BaseModel):
    total_files_processed: int
    total_records_loaded: int
    files_processed: List[str]
    errors: List[str] = []

def filter_valid_columns(records, model_class):
    """
    Filter records to include only columns that exist in the model
    
    Args:
        records: List of dictionaries with data
        model_class: SQLAlchemy model class
        
    Returns:
        List of filtered dictionaries
    """
    # Get valid column names from the model
    valid_columns = [column.key for column in inspect(model_class).columns]
    
    # Filter records to include only valid columns
    filtered_records = []
    for record in records:
        filtered_record = {k: v for k, v in record.items() if k in valid_columns}
        filtered_records.append(filtered_record)
    
    return filtered_records

@router.post("/load-data", response_model=DataLoadResponse)
async def load_forecast_data(
    request: Request,
    clear_existing: bool = Query(False, description="Clear existing data before loading"),
    debug: bool = Query(False, description="Display more detailed debug information"),
    postgres_db=Depends(get_postgres_db),
):
    """
    Load forecast data from CSV files in the data directory
    
    Parameters:
    - clear_existing: If True, clear all existing forecast data before loading
    - debug: If True, display more detailed debug information
    """
    # Clear existing data if requested
    if clear_existing:
        truncate_query = f"TRUNCATE TABLE {Forecast.__tablename__}"
        await postgres_db.execute(truncate_query)
        print("Cleared existing forecast data")
    
    # Path to data directory relative to the application root
    data_dir = Path("data")
    
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="Data directory not found")
    
    total_records = 0
    files_processed = []
    errors = []
    
    # Find all CSV files in the data directory structure
    csv_files = glob.glob(str(data_dir) + "/**/part-*.csv", recursive=True)
    
    for csv_file in csv_files:
        # Extract metadata from the file path
        path_parts = Path(csv_file).parts
        
        # Parse the folder structure to extract metadata
        week_start_date = None
        super_category = None
        store_type = None
        
        for part in path_parts:
            if part.startswith("week_start_date="):
                week_start_date = part.split("=")[1]
            elif part.startswith("family="):
                super_category = part.split("=")[1]
            elif part.startswith("channel_online_offline="):
                store_type = part.split("=")[1]
        
        if week_start_date and super_category and store_type:
            try:
                # Read the CSV file
                df = pd.read_csv(csv_file)
                
                if debug:
                    print(f"File {csv_file} loaded, columns: {df.columns.tolist()}")
                    print(f"Sample data types: {df.dtypes}")
                
                # Add the metadata columns
                df['week_start_date'] = pd.to_datetime(week_start_date).date()
                df['super_category'] = super_category
                df['store_type'] = store_type
                
                # Handle column mapping and type conversions
                # Ensure numeric columns are properly converted
                numeric_columns = ['consensus_qty', 'forecast_qty', 'sold_qty', 'wom']
                for col in numeric_columns:
                    if col in df.columns:
                        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
                
                # Convert class column to class_description (since 'class' is a reserved keyword)
                if 'class' in df.columns:
                    df['class_description'] = df['class']
                    df = df.drop('class', axis=1)
                
                # Make sure all values are strings, especially article_id
                string_columns = ['p1_dc', 'format', 'city', 'state', 'segment_code', 'brick_description', 
                                'brand', 'segment', 'division', 'brick_code', 'class_code', 'division_code',
                                'vertical', 'store_no', 'batchno', 'status', 'article_id', 'month_year',
                                'pin_code', 'region', 'family_code', 'sd', 'article_description', 'kvi', 'npi']
                for col in string_columns:
                    if col in df.columns:
                        df[col] = df[col].astype(str)
                        
                # Convert DataFrame to list of dictionaries
                records = df.to_dict(orient='records')
                
                # Skip empty files
                if not records:
                    continue
                
                # Filter records to include only valid columns
                valid_records = filter_valid_columns(records, Forecast)
                
                if debug:
                    # Display first record for debugging
                    print(f"Sample record after processing: {json.dumps(valid_records[0])}")
                
                # Insert batch size for large files
                batch_size = 1000
                for i in range(0, len(valid_records), batch_size):
                    batch = valid_records[i:i+batch_size]
                    try:
                        # Insert records into database using raw SQL
                        insert_stmt = Forecast.__table__.insert()
                        insert_sql = str(insert_stmt.compile(compile_kwargs={"literal_binds": False}))
                        
                        # Convert the SQLAlchemy parameterized query to a format databases library can use
                        # We'll just execute one by one for compatibility
                        for record in batch:
                            await postgres_db.execute(insert_stmt, record)
                            
                    except Exception as batch_error:
                        if debug:
                            # If in debug mode, try to identify problematic records
                            for idx, record in enumerate(batch):
                                try:
                                    await postgres_db.execute(insert_stmt, record)
                                except Exception as record_error:
                                    print(f"Error with record {i+idx}: {str(record_error)}")
                                    print(f"Record: {json.dumps(record)}")
                        raise batch_error
                
                total_records += len(valid_records)
                files_processed.append(csv_file)
                
            except Exception as e:
                error_msg = f"Error processing file {csv_file}: {str(e)}"
                print(error_msg)
                if debug:
                    print(traceback.format_exc())
                errors.append(error_msg)
                continue
    
    if errors and not files_processed:
        raise HTTPException(status_code=500, detail={"errors": errors})
    
    return {
        "total_files_processed": len(files_processed),
        "total_records_loaded": total_records,
        "files_processed": files_processed,
        "errors": errors
    }

class ForecastStatsResponse(BaseModel):
    total_records: int
    week_start_dates: List[str]
    super_categories: List[str]
    store_types: List[str]

@router.get("/forecast/stats", response_model=ForecastStatsResponse)
async def get_forecast_stats(
    request: Request,
    postgres_db=Depends(get_postgres_db),
):
    """
    Get statistics about the loaded forecast data
    """
    # Create queries using SQLAlchemy
    count_query = select(func.count()).select_from(Forecast.__table__)
    week_query = select(Forecast.week_start_date).distinct()
    category_query = select(Forecast.super_category).distinct()
    type_query = select(Forecast.store_type).distinct()
    
    # Execute queries
    total_records = await postgres_db.fetch_val(count_query)
    week_results = await postgres_db.fetch_all(week_query)
    category_results = await postgres_db.fetch_all(category_query)
    type_results = await postgres_db.fetch_all(type_query)
    
    # Format results - properly convert dates to strings
    week_start_dates = []
    for row in week_results:
        date_value = row["week_start_date"]
        if isinstance(date_value, date):
            week_start_dates.append(date_value.isoformat())
        else:
            week_start_dates.append(str(date_value))
    
    super_categories = [row["super_category"] for row in category_results]
    store_types = [row["store_type"] for row in type_results]
    
    return {
        "total_records": total_records,
        "week_start_dates": week_start_dates, 
        "super_categories": super_categories,
        "store_types": store_types
    }

@router.delete("/forecast/all")
async def delete_all_forecast_data(
    request: Request,
    postgres_db=Depends(get_postgres_db),
):
    """
    Delete all forecast data
    """
    truncate_query = f"TRUNCATE TABLE {Forecast.__tablename__}"
    await postgres_db.execute(truncate_query)
    
    return {"message": "All forecast data deleted successfully"}

@router.get("/forecast/table-info")
async def get_forecast_table_info(
    request: Request,
    postgres_db=Depends(get_postgres_db),
):
    """
    Get information about the forecast table structure
    """
    # Query to get table information
    query = text("""
    SELECT column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = 'forecast'
    ORDER BY ordinal_position
    """)
    
    # Execute query
    results = await postgres_db.fetch_all(query)
    
    # Convert results to dictionaries
    columns = []
    for row in results:
        columns.append(dict(row))
    
    return {
        "table_name": "forecast",
        "columns": columns
    }

@router.get("/forecast/filters")
async def get_forecast_filter_options(
    request: Request,
    postgres_db=Depends(get_postgres_db),
):
    """
    Get available filter options for the forecast data with counts
    
    Returns dictionary with field names, their distinct values, and counts for categorical fields
    """
    # Define categorical fields to get values for
    categorical_fields = [
        "p1_dc", "format", "city", "state", "segment_code", "brick_description",
        "brand", "segment", "division", "brick_code", "class_code", "division_code",
        "vertical", "status", "month_year", "region", "family_code", "super_category", 
        "store_type"
    ]
    
    results = {}
    
    # Query each field for distinct values with counts
    for field in categorical_fields:
        if hasattr(Forecast, field):
            column = getattr(Forecast, field)
            # Query for distinct values and their counts
            count_query = select(column, func.count().label('count')).group_by(column).order_by(column)
            field_results = await postgres_db.fetch_all(count_query)
            
            # Extract values, counts and handle None values
            values = []
            for row in field_results:
                value = row[field]
                count = row['count']
                if value is not None:
                    values.append({"value": value, "count": count})
            
            results[field] = values
    
    # Add range fields with min/max values
    range_fields = ["forecast_qty", "consensus_qty", "sold_qty", "wom"]
    
    for field in range_fields:
        if hasattr(Forecast, field):
            column = getattr(Forecast, field)
            min_query = select(func.min(column))
            max_query = select(func.max(column))
            
            min_value = await postgres_db.fetch_val(min_query)
            max_value = await postgres_db.fetch_val(max_query)
            
            results[field] = {
                "min": min_value if min_value is not None else 0,
                "max": max_value if max_value is not None else 0
            }
    
    # Add date ranges
    date_fields = ["week_start_date"]
    
    for field in date_fields:
        if hasattr(Forecast, field):
            column = getattr(Forecast, field)
            # Query for distinct dates and their counts
            count_query = select(column, func.count().label('count')).group_by(column).order_by(column)
            field_results = await postgres_db.fetch_all(count_query)
            
            # Extract dates, counts and format them
            values = []
            for row in field_results:
                date_val = row[field]
                count = row['count']
                if date_val is not None:
                    # Convert dates to string format
                    date_str = date_val.isoformat() if isinstance(date_val, date) else str(date_val)
                    values.append({"value": date_str, "count": count})
            
            results[field] = values
    
    return {
        "filter_options": results
    }

class MetricsResponse(BaseModel):
    model_absolute_error: float
    baseline_absolute_error: float
    model_percentage_error: float
    baseline_percentage_error: float
    model_rmse: float
    baseline_rmse: float
    total_qty_sold: float
    total_qty_predicted: float
    total_qty_baseline: float

@router.get("/forecast/metrics", response_model=MetricsResponse)
async def get_forecast_metrics(
    request: Request,
    postgres_db=Depends(get_postgres_db),
):
    """
    Get metrics comparing forecast accuracy with baseline (consensus) values
    """
    # Create a subquery to select the fields we need
    joined_query = select(
        Forecast.forecast_qty.label('max_qty'),
        Forecast.consensus_qty.label('baseline_forecast_qty'),
        Forecast.sold_qty.label('qty_sold'),
        Forecast.week_start_date,
        Forecast.region,
        Forecast.city,
        Forecast.state,
        Forecast.p1_dc
    ).select_from(Forecast)
    
    # Create the metrics query using the joined query as a subquery
    joined_query = joined_query.alias('joined_query')
    
    metric_query = (
        select(
            # Sum of absolute difference of the quantity sold and predicted quantity
            func.sum(func.abs(joined_query.c.qty_sold - joined_query.c.max_qty)).label("model_absolute_error"),
            func.sum(func.abs(joined_query.c.qty_sold - joined_query.c.baseline_forecast_qty)).label(
                "baseline_absolute_error"),
            (case(
                (func.sum(joined_query.c.qty_sold) == 0, 0),
                else_=func.sum(func.abs(joined_query.c.qty_sold - joined_query.c.max_qty)) * 100 / func.sum(
                    joined_query.c.qty_sold)
            )).label("model_percentage_error"),
            (case(
                (func.sum(joined_query.c.qty_sold) == 0, 0),
                else_=func.sum(
                    func.abs(joined_query.c.qty_sold - joined_query.c.baseline_forecast_qty)) * 100 / func.sum(
                    joined_query.c.qty_sold)
            )).label("baseline_percentage_error"),
            func.sqrt(func.avg(func.pow((joined_query.c.qty_sold - joined_query.c.max_qty), 2))).label('model_rmse'),
            func.sqrt(func.avg(func.pow((joined_query.c.qty_sold - joined_query.c.baseline_forecast_qty), 2))).label(
                'baseline_rmse'),
            func.sum(joined_query.c.qty_sold).label('total_qty_sold'),  # Total quantity sold
            func.sum(joined_query.c.max_qty).label('total_qty_predicted'), # Total quantity predicted
            func.sum(joined_query.c.baseline_forecast_qty).label('total_qty_baseline') # Total baseline predicted quantity
        )
    )

    # Execute the query
    metrics_result = await postgres_db.fetch_all(metric_query)
    
    if not metrics_result or len(metrics_result) == 0:
        raise HTTPException(status_code=404, detail="No data found for the specified filters")
    
    # Convert to dictionary and handle None values
    metrics = dict(metrics_result[0])
    for key, value in metrics.items():
        if value is None:
            metrics[key] = 0.0
    
    return metrics
