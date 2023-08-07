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

    Parameters
    ----------
    password: str
        User's password in plain text (str).
    db_password: bytes 
        The hashed password in bytes form, stored in the database.

    Returns
    ---------
    is_matched: bool
        A bool indicates whether or not 2 given passwords are the same.
    '''

    # Converts user's password to bytes.
    user_password = password.encode( "utf-8" )

    is_matched = bcrypt.checkpw( user_password, db_password )
    return is_matched

def hash_password( password: str ) -> bytes:
    '''
    Hash the given password.

    Parameters
    ----------
    password: str
        User's password in plain text.

    Returns
    ----------
    hashed_pw: bytes
        Hashed password ( user's password in bytes ).
    '''

    # Generate a random salt before adding it to the hashed password. 
    salt = bcrypt.gensalt()

    # Convert user's password into bytes form.
    password_in_bytes = password.encode( "utf-8" )

    # Hash the password with the generated salt.
    hashed_pw = bcrypt.hashpw( password_in_bytes, salt )

    return hashed_pw

def create_db():
    '''
    Create a .db file using the structures defined in models.py.

    Notes
    ----------
        Must delete the old .db file to avoid structure conflicts.
        
    Example
    ----------
    To use this function, navigate to the folder that contains services.py, and do the following::

        $ python  # To enter python terminal.
        >>> import services
        >>> services.create_db() # This will create a .db file.

    '''

    return database.Base.metadata.create_all( bind=database.engine )

def get_db():
    '''
    Retrieves a db session and close the db after each session.

    Notes
    ---------
        Always use as dependency injection to open a db session before modify/update data inside a .db file.
    '''
    try: 
        db = database.SessionLocal()
        yield db
    finally:
        db.close()

async def get_user_by_email( email: str, db: Session ):
    '''
    Does a SQL query to find a user with the given email and return the first result since 
    email is a unique column, meaning users can't create accounts using the same email.

    Parameters
    ----------
    email: str
        User's email.
    db: Session
        A database session.
    
    Returns
    ----------
    user_obj: Schemas.Employee
        An Employee object.

    '''

    return db.query( models.Employee ).filter( models.Employee.email == email ).first()

async def get_user_by_id( id: int, db: Session ):
    '''
    Does a SQL query using the given employee_id. If no user found, raise a 404 HTTP exception,
    otherwise, returns an Employee object found in the db using the given employee_id.

    Parameters
    ----------
    employee_id: int
        An employee's id.
    db: Session
        A db session.
    
    Returns
    ----------
    employee_obj: Schemas.Employee
        An employee object found in the db with the given id.
    '''
    employee_db =  db.query( models.Employee ).filter( models.Employee.id == id ).first()
    if employee_db is None:
        raise HTTPException( status_code=404,
                            detail="Employee does not exist!" )
    return employee_db

async def get_all_users( db: Session ):
    '''
    Shows all users w/in the database.
    Same as SELECT * FROM EMPLOYEE.

    Parameters
    ----------
    db: Session
        A db session.

    Returns
    ----------
    employees: list
        A list of employee objects.

    '''
    employees = db.query( models.Employee ).all()
    return list( map( Schemas.Employee.from_orm, employees ) )

async def get_all_supervisors( db: Session ):
    '''
    Show all supervisors w/in the db.

    Parameters
    ----------
    db: Session
        A db session.

    Returns
    ----------
    supervisors: list
        A list of supervisor objects.
    '''
    supervisors = db.query( models.Supervisor ).all()
    return list( map( Schemas.Supervisor.from_orm, supervisors ) )

async def create_user( user: Schemas.EmployeeCreate, db: Session ):
    '''
    Create a user using the info sent by the front-end.

    Parameters
    ----------
    user: Schemas.EmployeeCreate 
        A response template representing the info inputted by the user.
    db: Session
        A database session.

    Returns
    ----------
    temp_user: Models.Employee
        A successfully created user using the given info for testing purposes,
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
    '''
    Verify if a user exists within the DB and if their password matches with what's stored 
    in the DB.

    Parameters
    ----------
    email: str
        An email in plain text sent by the front-end.
    password: str
        A password in plain text sent by the front-end.
    db: Session
        A DB session.
    
    Returns
    ----------
    user: Schemas.Employee | False
        Returns an employee object if found in the DB, otherwise returns false.
    '''
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
        A template that represents user's inputs and is used to create a supervisor.
    employee : schemas.Employee
        An employee object that's retrieved from the database.
    db : Session
        A database session.

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
    '''
    Don't remember why I created this function.
    '''

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
    '''
    Delete an employee in the DB if found.

    Parameters
    ----------
    employee_id: int
        Employee's id.
    db: Session
        A DB session.

    Returns
    ----------
    None
    '''

    # Find an employee with the given employee_id.
    temp_employee = await _employee_selector( employee_id, db )

    db.delete( temp_employee )
    db.commit()

async def delete_supervisor( supervisor_id: int, db: Session ):
    '''
    Find a supervisor in the DB with the given supervisor_id. If found, delete that
    specific supervisor and change the 'role' of the associated employee to 0 (demote).
    OW, throw a 404 HTTP exception.

    Parameters
    ----------
    supervisor_id: int
        An id of a supervisor.
    db: Session
        A DB session.
    
    Returns
    ----------
    None
    '''

    # Find a supervisor w/in the DB.
    temp_supervisor = await _supervisor_selector( supervisor_id, db )

    # Delete that specific supervisor if found.
    db.delete( temp_supervisor )
    db.commit()

    # Find the associated employee.
    employee_db = await _employee_selector( temp_supervisor.employee_id, db )
    # Change 'role' to 0.
    await _update_employee_role( employee_db, db, role=0 )

async def create_task( sprint_id: int, task: Schemas.TaskCreate, current_employee: Schemas.Employee, db: Session ):
    '''
    Create a task with the given sprint_id.

    Notes
    ----------
        Must be an authorized user to use this function on FASTAPI Docs.

    Parameters
    ----------
    sprint_id: int
        A sprint's id.
    task: Schemas.TaskCreate
        Data sent by the front-end whenever a user creates a task.
    current_employee: Schemas.Employee
        The current employee who's signed in.
    db: Session
        A DB session.
    
    Returns
    ----------
    task_obj: Schemas.Task
        A successfully created task.
    '''

    # Search DB using the provided sprint_id.
    # Throw an 404 HTTP exception if not found.
    # Otherwise, add a task to the provided sprint id.
    sprint_db = await get_sprint_by_id( sprint_id=sprint_id,
                                        current_employee=current_employee,
                                        db=db )

    # Add a task to the provided sprint_id.
    task_obj = models.Task( **task.dict(), 
                             sprint_id=sprint_db.sprint_id )
    
    db.add( task_obj )
    db.commit()
    db.refresh( task_obj )

    return Schemas.Task.from_orm( task_obj )

async def get_sprint_by_id( sprint_id: int, current_employee: Schemas.Employee, db: Session ) -> Schemas.Sprint | None:
    '''
    Find a sprint in the DB using the given sprint_id. If not found, raise a 404 HTTP exception.
    OW, return a Sprint Object.

    Parameters
    ----------
    sprint_id: int
        A sprint's id.
    current_employee: Schemas.Employee
        The current employee who's signed in.
    db: Session
        A DB session.
        
    Returns
    ---------- 
    sprint_db: Schemas.Sprint
        A Sprint object.
    '''
    sprint_db = db.query( models.Sprint ) \
                    .filter(
                            models.Sprint.employee_id == current_employee.id,
                            models.Sprint.sprint_id == sprint_id
                            ) \
                    .first()
    
    if sprint_db is None:
        raise HTTPException( status_code= 404, 
                             detail="Sprint not found!" )
    
    return sprint_db

async def get_sprint_tasks( sprint_id: int, current_employee: Schemas.Employee, db: Session ):
    '''
    Get all tasks associated to a sprint.

    Parameters
    ----------
    sprint_id: int
        A sprint's id.
    current_employee: Schemas.Employee
        The current employee.
    db: Session
        A DB session.
    
    Returns
    ----------
    tasks_db: list
        A list of tasks associated to a sprint.
    '''

    # Find a sprint in the DB using the given sprint_id.
    # Throw a 404 HTTP exception if not found.
    sprint_db = await get_sprint_by_id( sprint_id, current_employee, db )
    
    # If a sprint exists in the DB, get all tasks associated with the given sprint_id
    tasks_db = db.query( models.Task ) \
                .filter( models.Task.sprint_id == sprint_db.sprint_id ) \
    
    return list( map( Schemas.Task.from_orm, tasks_db ) )
    # return tasks_db

async def create_sprint( sprint: Schemas.SprintCreate, current_employee: Schemas.Employee, db: Session ):
    '''
    Create a sprint obj and insert it into the DB using the data sent by the front-end.

    Parameters
    ----------
    sprint: Schemas.SprintCreate
        An object representing the data sent by the front-end whenever a user creates a sprint.
    current_employee: Schemas.Employee
        The current employee.
    db: Session
        A DB session.
    
    Returns
    ----------
    sprint_obj: Schemas.Sprint
        A successfully created sprint object.
    '''

    sprint_obj = models.Sprint( **sprint.dict(), 
                                employee_id = current_employee.id )
    
    db.add( sprint_obj )
    db.commit()
    db.refresh( sprint_obj )

    return Schemas.Sprint.from_orm( sprint_obj )

async def show_sprints_current_user( current_employee: Schemas.Employee, db: Session ):
    '''
    Get all sprints associated to the current employee.

    Parameters
    ----------
    current_employee: Schemas.Employee
        The current employee.
    db: Session
        A DB session.
    
    Returns
    ----------
    sprints_db: list
        A list of sprint objects associated to the current employee.
    '''
    sprints_db = db.query( models.Sprint ) \
                    .filter( models.Sprint.employee_id == current_employee.id ) \
                    .all()
    
    return list( map( Schemas.Sprint.from_orm, sprints_db ) )

async def delete_task( task_id: int, db: Session ):
    '''
    Delete a task in the DB using the given taks_id.

    Parameters
    ----------
    task_id: int
        A task's id.
    db: Session
        A DB Session.
    
    Returns
    ----------
    None
    '''

    task_db = await get_task_by_id( task_id, db )

    db.delete( task_db )
    db.commit()

async def get_task_by_id( task_id: int, db: Session ) -> Schemas.Task | None:
    '''
    Get a task within a DB using the given task_id. If a task is not found, raise a 404 
    HTTP exception, OW return a task object.

    Parameters
    ----------
    task_id: int
        A task's id.
    db: Session
        A DB session.

    Returns
    ----------
    task_db: Schemas.Task | None
        A task object found in the DB.
    '''
    task_db = db.query( models.Task ) \
                .filter( models.Task.task_id == task_id ) \
                .first()
    
    if task_db is None:
        raise HTTPException( status_code=404, 
                             detail="Task not found!" )
    
    return task_db

async def delete_sprint( sprint_id: int, current_employee: Schemas.Employee, db: Session ):
    '''
    Delete a sprint in the DB as well as all tasks associated to the given sprint_id.

    Parameters
    ----------
    sprint_id: int
        A sprint's id.
    current_employee: Schemas.Employee
        The current employee.
    db: Session
        A DB session.

    Returns
    ----------
    None
    '''
    sprint_db = await Services.get_sprint_by_id( sprint_id, current_employee, db )

    # Find all tasks associated with the given sprint_id.
    tasks_db = await Services.get_sprint_tasks( sprint_id=sprint_db.sprint_id,
                                                current_employee=current_employee,
                                                db=db )

    if len( tasks_db ) > 0:
        # If there are tasks inside a sprint, delete all tasks.
        for task in tasks_db:
            await delete_task( task.task_id, db )

    # Delete the sprint itself
    db.delete( sprint_db )
    db.commit()

async def get_all_tasks( current_employee: Schemas.Employee, db: Session ):
    '''
    Get all tasks associated to the current employee.

    Parameters
    ----------
    current_employee: Schemas.Employee 
        The current employee.
    db: Session
        A DB session.
    
    Returns
    ----------
    tasks: list
        A list of tasks associated to the current employee.
    '''

    # Get all sprints asso. to the current employee.
    current_user_sprints = await show_sprints_current_user( current_employee, db )

    # Total tasks.
    all_tasks_db = []

    # Get all tasks in each sprint, if a sprint has no tasks, move on to the next sprint.
    # OW, push tasks to all_tasks_db.
    for sprint in current_user_sprints:
        sprint_tasks_db = await get_sprint_tasks(sprint_id=sprint.sprint_id, 
                                           current_employee=current_employee,
                                           db=db )
        
        if len( sprint_tasks_db ) == 0:
            continue 

        all_tasks_db.extend( sprint_tasks_db )

    return list( map( Schemas.Task.from_orm, all_tasks_db ) )

async def complete_task( task_id: int, db: Session ):
    '''
    Change the complete status of a task to 1 if found in the DB, 
    OW, raise a 404 HTTP exception.

    Parameters
    ----------
    task_id: int
        A task's id.
    db: Session
        A db session.

    Returns
    ----------
    task: Schemas.Task
        A task object found in the DB.
    '''
    task_db = await get_task_by_id( task_id=task_id, db=db )

    task_db.is_complete = 1

    db.commit()
    db.refresh( task_db )

    return Schemas.Task.from_orm( task_db )

async def update_sprint( sprint_id: int, sprint: Schemas.SprintCreate, current_employee: Schemas.Employee, db: Session ):
    '''
    Find a sprint using the given sprint_id, and update its data (sprint_name)

    Parameters
    ----------
    sprint_id: int
        A sprint's id.
    sprint: Schemas.SprintCreate
        An object representing data sent by the front-end whenever a user edits a sprint.
    current_employee: Schemas.Employee
        The current employee.
    db: Session
        A db session.
    
    Returns
    ----------
    sprint: Schemas.Sprint
        A successfully updated sprint.
    '''
    sprint_db = await get_sprint_by_id( sprint_id, current_employee, db )

    sprint_db.sprint_name = sprint.sprint_name

    db.commit()
    db.refresh( sprint_db )

    return Schemas.Sprint.from_orm( sprint_db ) 

async def update_task( task_id: int, task: Schemas.TaskCreate, current_employee: Schemas.Employee, db: Session ):
    '''
    Find a task using the given task_id, and update its data (task_name & task_info).

    Parameters
    ----------
    task_id: int
        A task's id.
    task: Schemas.TaskCreate
        An object representing data sent by the front-end whenever a user edits a task.
    current_employee: Schemas.Employee
        The current employee.
    db: Session
        A db session.
    
    Returns
    ----------
    task: Schemas.Task
        A successfully updated task.
    '''

    task_db = await get_task_by_id( task_id, db )

    task_db.task_name = task.task_name
    task_db.task_info = task.task_info

    db.commit()
    db.refresh( task_db )
    
    return Schemas.Task.from_orm( task_db )