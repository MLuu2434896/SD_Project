from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

settings = [ "127.0.0.1:8000", "localhost:8000" ]

app.add_middleware(
    CORSMiddleware,
    allow_origins       = settings,
    allow_credentials   = True,
    allow_methods       = ("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS" ),
    allow_headers       = [ "*" ]
)

@app.get( "/", tags=["root"] )
async def read_root() -> dict[ str, str ]:
    return {"Hello" : "World" }

@app.get( "/items/{items_id}" ) 
async def read_item( items_id: int ):
    return { "items_id" : items_id }


if __name__ == '__main__':
    uvicorn.run( "main:app", host="127.0.0.1", port=8000, reload=True )