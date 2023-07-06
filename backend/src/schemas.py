'''
    This file generates response templates for different requests made by the frontend
'''
import pydantic as Pydantic
from pydantic import EmailStr, Field
from datetime import datetime


class _EmployeeBase( Pydantic.BaseModel ):
    email: EmailStr
    first_name: str = Field( min_length=1, max_length=128 )
    last_name: str = Field( min_length=1, max_length=128 )
    role: str = Field( min_length=1, max_length=128 )
    
class EmployeeCreate( _EmployeeBase ):
    hashed_password: str = Field( min_length=1, max_length=512 )

    class Config:
        orm_mode = True

class Employee( _EmployeeBase ):
    id: int = Field( ge=0 )

    class Config:
        orm_mode = True

class _SupervisorBase( Pydantic.BaseModel ):
    # TODO: move email to Supervisor instead
    email: EmailStr

class SupervisorCreate( _SupervisorBase ):
    pass

class Supervior( _SupervisorBase ):
    id: int = Field( ge=0 )
    employee_id: int = Field( ge=0 )
    date_created: datetime
    first_name: str = Field( min_length=1, max_length=128 )
    last_name: str = Field( min_length=1, max_length=128 )

    class Config:
        orm_mode = True
