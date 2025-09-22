from sqlalchemy import (
    Column,
    String,
    Float,
    DateTime,
    JSON,
    Integer,
    func,
    ForeignKey,
    Boolean,
    ARRAY,
    Date,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


# # Example Models
# class Curate(Base):
#     __tablename__ = "curate"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=False)
#     meta_data = Column(JSON)
#     last_modified = Column(DateTime(timezone=True), onupdate=func.now())
#     curate_synonyms = relationship("CurateSynonyms", back_populates="curate_object")


# class CurateSynonyms(Base):
#     __tablename__ = "curate_synonyms"

#     name = Column(String, primary_key=True)
#     curate_id = Column(Integer, ForeignKey("curate.id"))
#     curate_object = relationship("Curate", back_populates="curate_synonyms")

# # Widgets Model
# class Brand(Base):
#     __tablename__ = "brands"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     ex_brand = Column(String, nullable=False)
#     ajio_brand = Column(String, nullable=True)
#     score = Column(Float, nullable=False)

# class FashionDictionary(Base):
#     __tablename__ = "fashion_dictionary"

#     rightword = Column(String, primary_key=True)
#     ispurebrand = Column(Boolean)
#     isbrand = Column(Boolean)
#     iscategory = Column(Boolean)
#     gender = Column(ARRAY(String))
#     category = Column(ARRAY(String))
#     synonyms = Column(ARRAY(String))
#     spell_variants = Column(ARRAY(String))
#     entity_type = Column(ARRAY(String))
#     hypernyms = Column(ARRAY(String))
#     word_embedding_synonyms = Column(ARRAY(String))

# # Rulebook Model
# class Rulebook(Base):
#     __tablename__ = "rulebook"

#     mapped_to = Column(ARRAY(String))
#     mapped_from = Column(String, primary_key=True)
#     valid_till_date = Column(DateTime(timezone=True))
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())
#     arguments = Column(ARRAY(String))  # ['zsr','zcr']

# class Feedback(Base):
#     __tablename__ = "search_feedback"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     query = Column(String)
#     alpha = Column(Float)
#     product_id = Column(String)
#     feedback = Column(String)
#     timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Forecast(Base):
    __tablename__ = "forecast"

    id = Column(Integer, primary_key=True, autoincrement=True)
    p1_dc = Column(String)
    format = Column(String)
    city = Column(String)
    state = Column(String)
    segment_code = Column(String)
    consensus_qty = Column(Float)
    brick_description = Column(String)
    forecast_qty = Column(Float)
    brand = Column(String)
    segment = Column(String)
    division = Column(String)
    brick_code = Column(String)
    class_code = Column(String)
    division_code = Column(String)
    vertical = Column(String)
    store_no = Column(String)
    batchno = Column(String)
    status = Column(String)
    article_id = Column(String)
    month_year = Column(String)
    pin_code = Column(String)
    region = Column(String)
    wom = Column(Integer)
    family_code = Column(String)
    class_description = Column(String, name="class")
    sd = Column(String)
    article_description = Column(String)
    kvi = Column(String)
    npi = Column(String)
    sold_qty = Column(Float)
    
    # Additional columns
    week_start_date = Column(Date)
    super_category = Column(String)
    store_type = Column(String)  # online/offline
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# analytics page configuration table
class AnalyticsPageConfiguration(Base):
    __tablename__ = "analytics_page_configuration"

    id = Column(Integer, primary_key=True, autoincrement=True)
    page_name = Column(String)
    attributes = Column(JSON)
    page_config = Column(JSON)


class ForecastFnl(Base):
    __tablename__ = "forecast_fnl"

    id = Column(Integer, primary_key=True, autoincrement=True)
    p1_dc = Column(String)
    format = Column(String)
    city = Column(String)
    state = Column(String)
    segment_code = Column(String)
    consensus_qty = Column(Float)
    brick_description = Column(String)
    forecast_qty = Column(Float)
    brand = Column(String)
    segment = Column(String)
    division = Column(String)
    brick_code = Column(String)
    class_code = Column(String)
    division_code = Column(String)
    vertical = Column(String)
    store_no = Column(String)
    batchno = Column(String)
    status = Column(String)
    article_id = Column(String)
    month_year = Column(String)
    pin_code = Column(String)
    region = Column(String)
    wom = Column(Integer)
    family_code = Column(String)
    class_description = Column(String, name="class")
    sd = Column(String)
    article_description = Column(String)
    kvi = Column(String)
    npi = Column(String)
    sold_qty = Column(Float)
    
    # Additional columns
    week_start_date = Column(Date)
    super_category = Column(String)
    store_type = Column(String)  # online/offline
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    attributes = Column(JSON)

class ForecastVariants(Base):
    __tablename__ = "forecast_new"

    id = Column(Integer, primary_key=True, autoincrement=True)
    p1_dc = Column(String)
    format = Column(String)
    city = Column(String)
    state = Column(String)
    segment_code = Column(String)
    consensus_qty = Column(Float)
    brick_description = Column(String)
    forecast_qty = Column(JSON)
    brand = Column(String)
    segment = Column(String)
    division = Column(String)
    brick_code = Column(String)
    class_code = Column(String)
    division_code = Column(String)
    vertical = Column(String)
    store_no = Column(String)
    batchno = Column(String)
    status = Column(String)
    article_id = Column(String)
    month_year = Column(String)
    pin_code = Column(String)
    region = Column(String)
    wom = Column(Integer)
    family_code = Column(String)
    class_description = Column(String, name="class")
    sd = Column(String)
    article_description = Column(String)
    kvi = Column(String)
    npi = Column(String)
    sold_qty = Column(Float)
    
    # Additional columns
    week_start_date = Column(Date)
    super_category = Column(String)
    store_type = Column(String)  # online/offline
    # channel is Character varying 255
    channel = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

