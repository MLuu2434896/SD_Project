from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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


if __name__ == '__main__':
    uvicorn.run( "main:app", host="localhost", port=8000, reload=True )