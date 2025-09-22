import os
import json
import glob
from pathlib import Path
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
import pandas as pd
from fastapi import Request
from utils.commons import get_postgres_db

router = APIRouter(prefix="/utils", tags=["utils"])

@router.post("/transform")
async def transform_catalog_data() -> Dict[str, Any]:
    """
    Transform all parquet files from catalog_data folder into a single catalog.json file.
    
    Returns:
        Dict containing status and file information
    """
    try:
        # Get the path to the catalog_data folder
        current_dir = Path(__file__).parent
        catalog_data_path = current_dir / "catalog_data"
        
        if not catalog_data_path.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Catalog data folder not found at {catalog_data_path}"
            )
        
        # Find all parquet files in the catalog_data folder
        parquet_files = []
        for pattern in ["*.parquet", "*.snappy.parquet"]:
            parquet_files.extend(glob.glob(str(catalog_data_path / "**" / pattern), recursive=True))
        
        if not parquet_files:
            raise HTTPException(
                status_code=404, 
                detail="No parquet files found in catalog_data folder"
            )
        
        # Read and combine all parquet files
        combined_data = []
        total_rows = 0
        
        for file_path in parquet_files:
            try:
                # Read parquet file
                df = pd.read_parquet(file_path)
                file_rows = len(df)
                total_rows += file_rows
                
                # Process each row to ensure proper data types
                for _, row in df.iterrows():
                    processed_row = {}
                    
                    # Get column names
                    columns = list(row.index)
                    
                    for i, col in enumerate(columns):
                        value = row[col]
                        
                        # Helper function to safely check if value is null/NaN
                        def is_null_safe(val):
                            try:
                                if val is None:
                                    return True
                                if hasattr(val, 'isna'):
                                    return val.isna()
                                if hasattr(val, 'any'):
                                    return val.any()
                                return False
                            except:
                                return False
                        
                        # Helper function to safely convert value to string
                        def safe_str(val):
                            try:
                                if hasattr(val, 'tolist'):
                                    return str(val.tolist())
                                return str(val)
                            except:
                                return str(val)
                        
                        # Handle attributes column specifically (convert to flat dictionary)
                        if col == "attributes":
                            if is_null_safe(value):
                                processed_row[col] = {}
                            elif isinstance(value, dict):
                                processed_row[col] = value
                            elif isinstance(value, str):
                                try:
                                    # Try to parse as JSON if it's a string
                                    import json
                                    parsed = json.loads(value)
                                    if isinstance(parsed, dict):
                                        processed_row[col] = parsed
                                    else:
                                        processed_row[col] = {"value": parsed}
                                except:
                                    # Try to parse as Python literal (tuples, lists, etc.)
                                    try:
                                        import ast
                                        parsed = ast.literal_eval(value)
                                        if isinstance(parsed, (list, tuple)):
                                            # Convert tuple of tuples to flat dictionary
                                            if parsed and all(isinstance(item, (list, tuple)) and len(item) == 2 for item in parsed):
                                                # This is a list of key-value pairs like [('key1', 'value1'), ('key2', 'value2')]
                                                flat_dict = {}
                                                for item in parsed:
                                                    if len(item) == 2:
                                                        flat_dict[str(item[0])] = str(item[1])
                                                processed_row[col] = flat_dict
                                            else:
                                                processed_row[col] = {"value": list(parsed) if isinstance(parsed, tuple) else parsed}
                                        else:
                                            processed_row[col] = {"value": parsed}
                                    except:
                                        processed_row[col] = {"value": value}
                            elif isinstance(value, list):
                                # Handle list of key-value pairs directly
                                if value and all(isinstance(item, (list, tuple)) and len(item) == 2 for item in value):
                                    # Convert to flat dictionary
                                    flat_dict = {}
                                    for item in value:
                                        if len(item) == 2:
                                            flat_dict[str(item[0])] = str(item[1])
                                    processed_row[col] = flat_dict
                                else:
                                    processed_row[col] = {"value": value}
                            elif hasattr(value, 'tolist'):  # Handle numpy arrays/pandas Series
                                # Check if it's a list of key-value pairs
                                list_value = value.tolist()
                                if list_value and all(isinstance(item, (list, tuple)) and len(item) == 2 for item in list_value):
                                    # Convert to flat dictionary
                                    flat_dict = {}
                                    for item in list_value:
                                        if len(item) == 2:
                                            flat_dict[str(item[0])] = str(item[1])
                                    processed_row[col] = flat_dict
                                else:
                                    processed_row[col] = {"value": list_value}
                            else:
                                processed_row[col] = {"value": value}
                        
                        # Handle other columns based on position
                        elif i == 1 or i == 2:
                            if is_null_safe(value):
                                processed_row[col] = []
                            elif isinstance(value, list):
                                processed_row[col] = value
                            elif isinstance(value, str):
                                # Try to parse as JSON array, otherwise try Python literal
                                try:
                                    import json
                                    parsed = json.loads(value)
                                    if isinstance(parsed, list):
                                        processed_row[col] = parsed
                                    else:
                                        processed_row[col] = [parsed]
                                except:
                                    try:
                                        import ast
                                        parsed = ast.literal_eval(value)
                                        if isinstance(parsed, (list, tuple)):
                                            processed_row[col] = list(parsed) if isinstance(parsed, tuple) else parsed
                                        else:
                                            processed_row[col] = [parsed]
                                    except:
                                        # Split by comma and clean up
                                        processed_row[col] = [item.strip() for item in str(value).split(',') if item.strip()]
                            elif hasattr(value, 'tolist'):  # Handle numpy arrays/pandas Series
                                processed_row[col] = value.tolist()
                            else:
                                processed_row[col] = [value]
                        
                        # Rest of the columns: ensure they're strings
                        else:
                            if is_null_safe(value):
                                processed_row[col] = ""
                            elif hasattr(value, 'tolist'):  # Handle numpy arrays/pandas Series
                                processed_row[col] = value.tolist()
                            else:
                                processed_row[col] = value
                    
                    combined_data.append(processed_row)
                
                print(f"Processed {file_path}: {file_rows} rows")
                
            except Exception as e:
                print(f"Error processing {file_path}: {str(e)}")
                continue
        
        if not combined_data:
            raise HTTPException(
                status_code=500, 
                detail="No data could be extracted from parquet files"
            )
        
        # Create the output catalog.json file
        output_path = current_dir / "catalog.json"
        
        # Custom JSON encoder to handle numpy types and other special types
        class NumpyEncoder(json.JSONEncoder):
            def default(self, obj):
                if hasattr(obj, 'tolist'):
                    return obj.tolist()
                if hasattr(obj, 'item'):
                    return obj.item()
                return str(obj)
        
        # Write combined data to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(combined_data, f, indent=2, ensure_ascii=False, cls=NumpyEncoder)
        
        # Get file size
        file_size = output_path.stat().st_size
        
        return {
            "status": "success",
            "message": f"Successfully transformed {len(parquet_files)} parquet files into catalog.json",
            "details": {
                "input_files": len(parquet_files),
                "total_rows": total_rows,
                "output_file": str(output_path),
                "output_size_bytes": file_size,
                "output_size_mb": round(file_size / (1024 * 1024), 2)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/transform/status")
async def get_transform_status() -> Dict[str, Any]:
    """
    Get the status of the catalog.json file if it exists.
    
    Returns:
        Dict containing file status information
    """
    try:
        current_dir = Path(__file__).parent
        catalog_json_path = current_dir / "catalog.json"
        
        if not catalog_json_path.exists():
            return {
                "status": "not_found",
                "message": "catalog.json file does not exist",
                "details": None
            }
        
        # Get file stats
        stats = catalog_json_path.stat()
        
        return {
            "status": "exists",
            "message": "catalog.json file found",
            "details": {
                "file_path": str(catalog_json_path),
                "size_bytes": stats.st_size,
                "size_mb": round(stats.st_size / (1024 * 1024), 2),
                "created": stats.st_ctime,
                "modified": stats.st_mtime
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error checking file status: {str(e)}"
        )

@router.get("/columns")
async def get_catalog_columns() -> Dict[str, Any]:
    """
    Get the columns/schema information from the parquet files in catalog_data folder.
    
    Returns:
        Dict containing column information from all parquet files
    """
    try:
        # Get the path to the catalog_data folder
        current_dir = Path(__file__).parent
        catalog_data_path = current_dir / "catalog_data"
        
        if not catalog_data_path.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Catalog data folder not found at {catalog_data_path}"
            )
        
        # Find all parquet files in the catalog_data folder
        parquet_files = []
        for pattern in ["*.parquet", "*.snappy.parquet"]:
            parquet_files.extend(glob.glob(str(catalog_data_path / "**" / pattern), recursive=True))
        
        if not parquet_files:
            raise HTTPException(
                status_code=404, 
                detail="No parquet files found in catalog_data folder"
            )
        
        # Analyze columns from all parquet files
        columns_info = {}
        file_columns = {}
        
        for file_path in parquet_files:
            try:
                # Read parquet file schema without loading all data
                df = pd.read_parquet(file_path, nrows=0)  # Only read schema, no data
                
                # Get column information
                file_columns[file_path] = {
                    "columns": list(df.columns),
                    "dtypes": df.dtypes.to_dict(),
                    "shape": df.shape,
                    "memory_usage": df.memory_usage(deep=True).to_dict()
                }
                
                # Aggregate column information across all files
                for col in df.columns:
                    if col not in columns_info:
                        columns_info[col] = {
                            "data_type": str(df.dtypes[col]),
                            "files_found_in": [],
                            "total_files": 0
                        }
                    
                    if file_path not in columns_info[col]["files_found_in"]:
                        columns_info[col]["files_found_in"].append(file_path)
                        columns_info[col]["total_files"] += 1
                
            except Exception as e:
                print(f"Error analyzing {file_path}: {str(e)}")
                continue
        
        # Sort columns by frequency (most common first)
        sorted_columns = dict(sorted(
            columns_info.items(), 
            key=lambda x: x[1]["total_files"], 
            reverse=True
        ))
        
        return {
            "status": "success",
            "message": f"Successfully analyzed columns from {len(parquet_files)} parquet files",
            "summary": {
                "total_files": len(parquet_files),
                "total_unique_columns": len(columns_info),
                "files_analyzed": len(file_columns)
            },
            "columns": sorted_columns,
            "file_details": file_columns
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/substitute")
async def substitute_catalog_data(request: Request, db=Depends(get_postgres_db)) -> Dict[str, Any]:
    """
    Substitute catalog data from parquet files into PostgreSQL ForecastFNL table.
    
    Returns:
        Dict containing substitution status and details
    """
    try:
        from sqlalchemy import update, func, select
        from schema import ForecastFnl
        
        # Helper function to safely check if value is empty/null
        def is_empty_safe(val):
            try:
                if val is None:
                    return True
                if hasattr(val, 'tolist'):
                    # Handle numpy arrays
                    return len(val.tolist()) == 0
                if hasattr(val, '__len__'):
                    return len(val) == 0
                return False
            except:
                return False
        
        # Get database connection
        
        # Get the path to the catalog_data folder
        current_dir = Path(__file__).parent
        catalog_data_path = current_dir / "catalog_data"
        
        if not catalog_data_path.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Catalog data folder not found at {catalog_data_path}"
            )
        
        # Find all parquet files in the catalog_data folder
        parquet_files = []
        for pattern in ["*.parquet", "*.snappy.parquet"]:
            parquet_files.extend(glob.glob(str(catalog_data_path / "**" / pattern), recursive=True))
        
        if not parquet_files:
            raise HTTPException(
                status_code=404, 
                detail="No parquet files found in catalog_data folder"
            )
        
        print(f"Found {len(parquet_files)} parquet files to process")
        
        # Calculate total rows across all files first
        total_rows_across_files = 0
        file_info = []
        
        print("Calculating total rows across all files...")
        for file_path in parquet_files:
            try:
                # Read the file to get row count
                df = pd.read_parquet(file_path)
                file_rows = len(df)
                total_rows_across_files += file_rows
                file_info.append((file_path, file_rows))
                print(f"File {Path(file_path).name}: {file_rows} rows")
            except Exception as e:
                print(f"Error reading file {file_path}: {str(e)}")
                raise Exception(f"Failed to read file {file_path}: {str(e)}")
        
        print(f"Total rows across all files: {total_rows_across_files}")
        
        total_processed = 0
        total_updated = 0
        
        # Process each parquet file
        for file_idx, (file_path, file_rows) in enumerate(file_info):
            try:
                print(f"\nProcessing file {file_idx + 1}/{len(parquet_files)}: {Path(file_path).name}")
                
                # Read parquet file
                df = pd.read_parquet(file_path)
                
                print(f"File contains {file_rows} rows")
                
                # Process each row
                for row_idx, (_, row) in enumerate(df.iterrows()):
                    try:
                        # Debug: Show first few rows to understand the data structure
                        if row_idx < 3:
                            print(f"\nDEBUG: Row {row_idx} data:")
                            print(f"  product_sku_id: {row.get('product_sku_id')}")
                            print(f"  category_hierarchy: {row.get('category_hierarchy')}")
                            print(f"  attributes: {row.get('attributes')}")
                        
                        # Extract required fields
                        product_sku_id = row.get('product_sku_id')
                        if not product_sku_id:
                            total_processed += 1
                            continue
                        
                        # Extract category hierarchy
                        category_hierarchy = row.get('category_hierarchy', {})
                        if is_empty_safe(category_hierarchy) or not isinstance(category_hierarchy, dict):
                            total_processed += 1
                            continue
                        
                        # Extract names from category hierarchy (it's a dict with numpy arrays)
                        category_names = category_hierarchy.get('names', [])
                        if is_empty_safe(category_names):
                            total_processed += 1
                            continue
                        
                        # Convert numpy array to list if needed
                        if hasattr(category_names, 'tolist'):
                            category_names = category_names.tolist()
                        
                        # Extract attributes
                        attributes = row.get('attributes', [])
                        if is_empty_safe(attributes) or not isinstance(attributes, list):
                            total_processed += 1
                            continue
                        
                        # Extract final_title from attributes (it's a list of tuples)
                        final_title = ""
                        for item in attributes:
                            if isinstance(item, (list, tuple)) and len(item) == 2 and item[0] == 'final_title':
                                final_title = item[1]
                                break
                        
                        if is_empty_safe(final_title):
                            total_processed += 1
                            continue
                        
                        # Prepare update values with safe string conversion
                        update_values = {
                            "vertical": "FNL",
                            "super_category": str(category_names[0]) if len(category_names) > 0 else "",
                            "segment": str(category_names[1]) if len(category_names) > 1 else "",
                            "class": str(category_names[2]) if len(category_names) > 2 else "",
                            "article_description": str(final_title),
                            "article_id": str(product_sku_id)
                        }
                        
                        # Update PostgreSQL table using SQLAlchemy ORM
                        update_query = (
                            update(ForecastFnl)
                            .where(ForecastFnl.article_id == str(product_sku_id))
                            .values(
                                vertical="FNL",
                                super_category=update_values["super_category"],
                                segment=update_values["segment"],
                                class_description=update_values["class"],
                                article_description=update_values["article_description"],
                                article_id=str(product_sku_id),
                                updated_at=func.now()
                            )
                        )
                        
                        # Debug: Print the update query and values
                        print(f"\nDEBUG: Updating product_sku_id: {product_sku_id}")
                        print(f"DEBUG: Update values: {update_values}")
                        
                        result = await db.execute(update_query)
                        
                        # Debug: Print the result
                        print(f"DEBUG: Update result - rowcount: {result.rowcount}")
                        
                        if result.rowcount > 0:
                            total_updated += result.rowcount
                            print(f"DEBUG: Successfully updated {result.rowcount} rows for product_sku_id: {product_sku_id}")
                        else:
                            print(f"DEBUG: No rows found to update for product_sku_id: {product_sku_id}")
                            # Try to find if the row exists
                            select_query = select(ForecastFnl).where(ForecastFnl.article_id == str(product_sku_id))
                            check_result = await db.execute(select_query)
                            existing_rows = check_result.fetchall()
                            print(f"DEBUG: Found {len(existing_rows)} existing rows with article_id: {product_sku_id}")
                        
                        # Commit the transaction after each update
                        await db.commit()
                        
                        total_processed += 1
                        
                        # Progress indicator with cumulative row count
                        if total_processed % 100 == 0 or total_processed == total_rows_across_files:
                            print(f"\rProgress: {total_processed}/{total_rows_across_files} rows processed | Total updated: {total_updated} | Current file: {Path(file_path).name}", end="", flush=True)
                        
                    except Exception as e:
                        print(f"\nError processing row {row_idx + 1} in file {file_path}: {str(e)}")
                        raise Exception(f"Failed to process row {row_idx + 1} in file {file_path}: {str(e)}")
                
                print(f"\nCompleted file {file_idx + 1}/{len(parquet_files)}: {Path(file_path).name}")
                
            except Exception as e:
                print(f"\nError processing file {file_path}: {str(e)}")
                raise Exception(f"Failed to process file {file_path}: {str(e)}")
        
        print(f"\n\nSubstitution completed successfully!")
        print(f"Total entries processed: {total_processed}")
        print(f"Total rows updated in database: {total_updated}")
        
        return {
            "status": "success",
            "message": f"Successfully substituted catalog data into ForecastFNL table",
            "details": {
                "files_processed": len(parquet_files),
                "total_entries_processed": total_processed,
                "total_rows_updated": total_updated
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Substitution failed: {str(e)}"
        ) 