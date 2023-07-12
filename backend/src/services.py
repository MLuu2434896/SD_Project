import bcrypt, database, models
import schemas as Schemas
import jwt as JWT
import services as Services
from fastapi import Depends, HTTPException
from constants import JWT_KEY, OAUTH_2_SCHEMA, JWT_ALGORITHM
from sqlalchemy.orm import Session


def verify_password( password: str, db_password: bytes ) -> bool:
    '''
    Check whether hashed password and inputted password are the same.
    Passwords must be converted into bytes before hashing.

    @PARA
    password: str -> a string of password\n
    db_password: str -> the hashed password in bytes form, stored in the database

    @RETURN
    is_matched: bool
    '''
    user_password = password.encode( "utf-8" )

    is_matched = bcrypt.checkpw( user_password, db_password )
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

async def get_user_by_id( id: int, db: Session ):
    employee_db =  db.query( models.Employee ).filter( models.Employee.id == id ).first()
    if not employee_db:
        raise HTTPException( status_code=404,
                            detail="Employee does not exist!" )
    return employee_db

async def get_all_users( db: Session ):
    '''
    Shows all users w/in the database.\n
    same as SELECT * FROM EMPLOYEE\n
    '''
    employees = db.query( models.Employee ).all()
    return list( map( Schemas.Employee.from_orm, employees ) )

async def get_all_supervisors( db: Session ):
    # Getting all the supervisors from the database as a list
    supervisors = db.query( models.Supervisor ).all()
    return list( map( Schemas.Supervisor.from_orm, supervisors ) )

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
                                 last_name=user.last_name )

    # Add to database
    db.add( temp_user )
    db.commit()
    db.refresh( temp_user )

    return temp_user

async def authenticate_user( email: str, password: str, db: Session ):
    user = await get_user_by_email( email, db )

    if not user: 
        return False
    
    if not verify_password( password, user.hashed_password ):
        return False
    
    return user

async def create_token( user: models.Employee ):
    temp_user = Schemas.Employee.from_orm( user )

    token = JWT.encode( temp_user.dict(), JWT_KEY )

    return dict( access_token=token, token_type="bearer" )
    
async def get_current_user( db: Session = Depends( Services.get_db ), 
                            token: str = Depends( OAUTH_2_SCHEMA ) ):
    try:
        payload = JWT.decode( token, key=JWT_KEY, algorithms=[JWT_ALGORITHM] )
        user = db.query( models.Employee ).get( payload["id"] )
    except:
        raise HTTPException( status_code=401, 
                             detail="Invalid email or password!"
                               )
    return Schemas.Employee.from_orm( user )

async def create_supervisor( supervisor: Schemas.SupervisorCreate,
                             employee: Schemas.Employee, 
                             db: Session ):
    '''
    Create a supervisor whose id, LN, FN are taken from employee table since 
    a supervisor is one of the employees.

    Parameters
    ----------
    supervisor : schemas.SupervisorCreate
        A template that represents user's inputs and is used to create a supervisor.\n
    employee : schemas.Employee
        An employee object that's retrieved from the database.\n
    db : Session
        A database session.\n

    Returns
    -----------
    Supervisor : schemas.Supervisor
        The newly created supervisor.
    
    '''
    temp_supervisor = models.Supervisor( **supervisor.dict(),
                                         first_name=employee.first_name, 
                                         last_name=employee.last_name,
                                         email=employee.email )
    
    db.add( temp_supervisor )
    db.commit()
    db.refresh( temp_supervisor )

    # Update the role of a particular employee after making him/her a supervisor
    await _update_employee_role( employee, db, role=1 )

    return Schemas.Supervisor.from_orm( temp_supervisor )

async def _update_employee_role( employee: Schemas.Employee, db: Session, *, role: int ):
    '''
    Updates the role of a specific employee once he/she gets promoted/demoted.
    NOTE: This is a private function (indicates by _function_name) and must not be used outside of this file.

    Parameters
    ----------
    employee : Schemas.Employee
        An employee retrieved from the db.
    db : Session
        A database session.
    role : int - must be specified whenever this function is called

    Returns
    ----------
    None
    '''
    employee_db = await _employee_selector( employee_id=employee.id, db=db )
    employee_db.role = role
    
    # Update the role of that employee in the db
    db.commit()
    db.refresh( employee_db )

async def get_supervisors( user: Schemas.Employee, db: Session ):
    temp_supervisors = db.query( models.Supervisor ).filter_by( employee_id=user.id )

    return list( map( Schemas.Supervior.from_orm, temp_supervisors ) )

async def _supervisor_selector( supervisor_id: int, db: Session ):
    '''
    Use to query a particular supervisor using the provided supervisor id.
    NOTE: This is a private function (indicates by _function_name) and must not be used outside of this file.

    Parameters
    ----------
    supervisor_id : int
        The assigned ID of a supervisor when first created.
    db : Session
        A database session.
    
    Returns
    ----------
    temp_supervisor : Schemas.Supervisor
        A supervisor object retrieved from the database.
    '''

    # Find a supervisor with a the given id.
    # If not exist, throw a 404 HTTP exception, otherwise return an supervisor object.
    temp_supervisor = db.query( models.Supervisor ).filter( models.Supervisor.id == supervisor_id ).first()

    if temp_supervisor is None: 
        raise HTTPException( status_code=404, 
                             detail="Supervisor does not exist!" ) 
    
    return temp_supervisor

async def _employee_selector( employee_id: int, db: Session ):
    '''
    Use to query a particular employee using the provided employee id.
    NOTE: This is a private function (indicates by _function_name) and must not be used outside of this file. 

    Parameters
    ----------
    employee_id : int
        The assigned ID of an employee when first created.
    db : Session
        A database session.
    
    Returns
    ----------
    temp_employee : Schemas.Employees
        An employee object retrieved from the database.
    '''

    # Find an employee with a the given id.
    # If not exist, throw a 404 HTTP exception, otherwise return an employee object.
    temp_employee = db.query( models.Employee ).filter( models.Employee.id==employee_id ).first()

    if temp_employee is None:
        raise HTTPException( status_code=404, 
                             detail="Employee does not exist!" )
    
    return temp_employee

async def delete_employee( employee_id: int, db: Session ):
    temp_employee = await _employee_selector( employee_id, db )

    db.delete( temp_employee )
    db.commit()

async def delete_supervisor( supervisor_id: int, db: Session ):
    temp_supervisor = await _supervisor_selector( supervisor_id, db )

    db.delete( temp_supervisor )
    db.commit()

    employee_db = await _employee_selector( temp_supervisor.employee_id, db )
    await _update_employee_role( employee_db, db, role=0 )