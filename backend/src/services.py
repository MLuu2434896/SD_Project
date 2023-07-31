import bcrypt

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
