from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey, Text, DECIMAL, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Laboratory(Base):
    __tablename__ = "laboratories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True)
    contact_info = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    products = relationship("Product", back_populates="laboratory")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("categories.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, nullable=False, index=True)
    barcode = Column(String(50), unique=True, index=True)
    commercial_name = Column(String(200), nullable=False)
    generic_name = Column(String(200))
    active_ingredient = Column(Text)
    presentation = Column(String(100))
    concentration = Column(String(50))
    laboratory_id = Column(Integer, ForeignKey("laboratories.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    requires_prescription = Column(Boolean, default=False)
    is_controlled = Column(Boolean, default=False)
    unit_type = Column(String(20), default="unit")
    sale_price = Column(DECIMAL(10, 2), nullable=False)
    cost_price = Column(DECIMAL(10, 2))
    min_stock = Column(Integer, default=0)
    max_stock = Column(Integer)
    description = Column(Text)
    contraindications = Column(Text)
    side_effects = Column(Text)
    storage_conditions = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    laboratory = relationship("Laboratory", back_populates="products")
    category = relationship("Category", back_populates="products")
    batches = relationship("ProductBatch", back_populates="product")
    sale_items = relationship("SaleItem", back_populates="product")

class ProductBatch(Base):
    __tablename__ = "product_batches"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    batch_number = Column(String(50), nullable=False)
    expiry_date = Column(Date, nullable=False)
    manufacture_date = Column(Date)
    quantity = Column(Integer, nullable=False, default=0)
    cost_price = Column(DECIMAL(10, 2))
    supplier_id = Column(UUID(as_uuid=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    product = relationship("Product", back_populates="batches")
    sale_items = relationship("SaleItem", back_populates="batch")