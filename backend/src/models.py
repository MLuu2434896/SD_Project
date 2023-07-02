# THIS FILE WILL DEFINE ALL SQL TABLES

import sqlalchemy as SQL
import database as DB
import sqlalchemy.orm as ORM
from datetime import datetime

class Employee( DB.Base ):
    __tablename__ = "employees"
    id = SQL.Column( SQL.Integer, primary_key=True, index=True )
    email = SQL.Column( SQL.String, unique=True, index=True )
    hashed_password = SQL.Column( SQL.BINARY )
    is_active = SQL.Column( SQL.Boolean, default=True )
    first_name = SQL.Column( SQL.String )
    last_name = SQL.Column( SQL.String )
    role = SQL.Column( SQL.String )

    # This will create a bidirectional relationship with other tables
    # specified in the parameters
    supervisor = ORM.relationship( "Supervisor", back_populates="employees" )

class Supervisor( DB.Base ):
    __tablename__ = "supervisors"
    id = SQL.Column( SQL.Integer, primary_key=True, index=True )
    employee_id = SQL.Column( SQL.Integer, SQL.ForeignKey( "employees.id" ) )
    email = SQL.Column( SQL.String, unique=True )
    hashed_password = SQL.Column( SQL.BINARY )
    first_name = SQL.Column( SQL.String )
    last_name = SQL.Column( SQL.String )
    date_created = SQL.Column( SQL.DateTime, default=datetime.now() )
    role = SQL.Column( SQL.String )

    # This will create a bidirectional relationship with 'Employee' table
    employees = ORM.relationship( "Employee", back_populates="supervisor" )

