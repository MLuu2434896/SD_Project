from fastapi import FastAPI, Depends, HTTPException, security
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn
import schemas as Schemas
import services as Services



app = FastAPI()


origins = [ "http://127.0.0.1:3000", "http://localhost:3000" ]

# Configure FastAPI to allow requests from web
app.add_middleware(
    CORSMiddleware,
    allow_origins       = origins,
    allow_credentials   = True,
    allow_methods       = ("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ),
    allow_headers       = [ "*" ]
)

########## STATUS_CHECK ##########
@app.get( "/", tags=["status_check"] )
async def read_root() -> list:
    return [
        {"f_name" : "hello", "l_name" : "world" },
        {"f_name" : "test", "l_name" : "world" },
        {"f_name" : "sat", "l_name" : "sun" }
    ]

@app.get( "/items/{items_id}", tags=["status_check"] ) 
async def read_item( items_id: int ):
    return { "items_id" : items_id }

########## EMPLOYEE ##########
@app.get("/api/show_users", tags=["employee"] )
async def show_users( db: Session = Depends( Services.get_db ) ):
    '''
    Show all the users w/in the database
    '''
    return await Services.get_all_users( db )

@app.get( "/api/show_user/me", tags=["employee"], response_model=Schemas.Employee )
async def show_current_user( user: Schemas.Employee = Depends( Services.get_current_user ) ):
    return user

@app.post( "/api/create_user", tags=["employee"] )
async def create_user( user: Schemas.EmployeeCreate, 
                       db: Session = Depends( Services.get_db )
                    ):
    '''
    Create a new user with the given email, if the email exists w/in the database
    , then raise a 404 HTTP error
    If the given email is not in a correct type, a 422 error code is raised\n

    @PARA:
    user: represents the info inputted by the user when creating a new account on
            frontend\n
    db: a database session
    '''
    
    # Check whether a user with the same email exists in our database or not, if a
    # a user exists, raise a 404 error.
    # Wait til we're done getting the user in the db since get_user_by_email is an 
    # async function (refer to services.py).
    db_user = await Services.get_user_by_email( user.email, db )

    if db_user:
        raise HTTPException( status_code=400, detail="This email is already in use! Try a different email" )
    
    # If no user is found in the database, register a new user
    temp_user = await Services.create_user( user, db )
    
    # Once a user is created, automatically authorize that user
    return await Services.create_token( temp_user )

@app.post( "/api/token", tags=["employee"] )
async def generate_token( form_data: security.OAuth2PasswordRequestForm = Depends(),
                          db: Session = Depends( Services.get_db ) ):
    user = await Services.authenticate_user( form_data.username, form_data.password, db )
    if not user: 
        raise HTTPException( 
            status_code=401, detail="Invalid Credentials!"
        )
    
    return await Services.create_token( user )

@app.delete( "/api/delete_user/{user_id}", tags=["employee"] )
async def delete_user( user_id: int, db: Session=Depends( Services.get_db ) ):
    await Services.delete_employee( employee_id=user_id, db=db )
    return { "message": "Successfully deleted" }

########## LEAD ##########
@app.post( "/api/create_supervisor", tags=["supervisor"], response_model=Schemas.Supervior )
async def create_supervisor( supervisor: Schemas.SupervisorCreate, 
                             employee: Schemas.Employee = Depends( Services.get_current_user ),
                             db: Session = Depends( Services.get_db ) ):
    # Create a lead iff a user is authorized

    temp_supervisor = await Services.create_supervisor( supervisor=supervisor, 
                                                        employee=employee,
                                                        db=db )
    return temp_supervisor

@app.get( "/api/show_supervisors", tags=["supervisor"], response_model=List[ Schemas.Supervior ] )
async def show_leads( employee: Schemas.Employee = Depends( Services.get_current_user ),
                      db: Session = Depends( Services.get_db ) ):
    return await Services.get_supervisors( user=employee, db=db )


if __name__ == '__main__':
    uvicorn.run( "main:app", host="localhost", port=8000, reload=True )