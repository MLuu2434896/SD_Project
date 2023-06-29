import bcrypt, database, models
import schemas as Schemas
from sqlalchemy.orm import Session


def verify_password( password: bytes, hashed_password: bytes ) -> bool:
    '''
    Check whether hashed password and inputted password are the same.
    Passwords must be converted into bytes before hashing.

    @PARA
    password: bytes -> a string of password in byte form\n
    hashed_password: bytes -> the hashed password

    @RETURN
    is_matched: bool
    '''
    is_matched = bcrypt.checkpw( password, hashed_password )
    return is_matched

def hash_password( password: str ) -> bytes:
    salt = bcrypt.gensalt()
    password_in_bytes = password.encode( "utf-8" )

    hashed_pw = bcrypt.hashpw( password_in_bytes, salt )
    return hashed_pw


def create_db():
    return database.Base.metadata.create_all( bind=database.engine )

def get_db():
    '''
    Retrieves a db session and close the db after each session
    '''
    try: 
        db = database.SessionLocal()
        yield db
    finally:
        db.close()

async def get_user_by_email( email: str, db: Session ):
    '''
    Does a SQL query to find a user with the given email and return the first result since 
    email is a unique column, meaning users can't create accounts using the same email
    '''

    return db.query( models.Employee ).filter( models.Employee.email == email ).first()

async def get_all_users( db: Session ):
    '''
    Shows all users w/in the database.\n
    same as SELECT * FROM EMPLOYEE\n
    '''
    return db.query( models.Employee ).all()

async def create_user( user: Schemas.EmployeeCreate, db: Session ):
    '''
    Hash the password given by the user and add the user to the database

    @PARA:
    user: a response template representing the info inputted by the user
    db: a database session

    @RETURN:
    temp_user: a successfully created user using the given info for testing purposes,
                can also be tested on FASTAPI Docs 'http://localhost:8000/docs'
    '''
    
    # Hash the given password before assigning it to a user
    temp_hashed_password = hash_password( user.hashed_password )

    # Initialize a user and assign the corresponding vars using the given inputs
    temp_user = models.Employee( email=user.email,
                                 hashed_password=temp_hashed_password,
                                 first_name=user.first_name,
                                 last_name=user.last_name,
                                 role=user.role )

    # Add to database
    db.add( temp_user )
    db.commit()
    db.refresh( temp_user )

    return temp_user
