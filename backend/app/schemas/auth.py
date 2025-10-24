from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role_id: int

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    role_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True