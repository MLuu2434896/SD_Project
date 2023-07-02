import services as Services
import bcrypt
import sqlalchemy as SQL


pw_1 = "testpassword"
pw_2 = "testpassword"
 
hashed_pw1 = Services.hash_password( pw_1 )
db_pw: SQL.BINARY = hashed_pw1
print( type( db_pw ) )

temp_pw = pw_2.encode( "utf-8" ) 
print( type( temp_pw ) )

verify_pw = Services.verify_password( pw_2, db_pw )
print( verify_pw )



