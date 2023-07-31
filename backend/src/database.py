import sqlalchemy as SQL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Path to store the database
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"

# Create the database 
engine = create_engine( SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread" : False} )
SessionLocal = sessionmaker( autocommit=False, autoflush=False, bind=engine )

Base = declarative_base()
