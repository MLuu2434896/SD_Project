import sqlalchemy as SQL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from constants import SQLALCHEMY_DATABASE_URL

# Create the database 
engine = create_engine( SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread" : False} )

SessionLocal = sessionmaker( autocommit=False, autoflush=False, bind=engine )

Base = declarative_base()
