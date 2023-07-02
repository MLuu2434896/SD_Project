import fastapi.security as FASTAPI_SECURITY

# Path to store the database
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"

# Secret key and Encryption algorithm for JWT 
JWT_KEY = "Senior_Design_2_Secret"
JWT_ALGORITHM = "HS256"

OAUTH_2_SCHEMA = FASTAPI_SECURITY.OAuth2PasswordBearer( tokenUrl="/api/token" ) 