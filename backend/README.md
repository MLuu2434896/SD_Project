I'd recommend installing python packages in a venv to avoid packages conflict on your local machine.  

To create a venv:  
- Navigate to the same dir as backend and frontend using cmd or bash.  
- Insert the following command:  
    - ```bash
    python3 -m venv venv || python -m venv venv  
    ```
    - ***NOTE: you might have to add 'sudo' before the command if you're using MAC.  
    - Now the dir would have 3 folders: backend, frontend, and venv.  

NOTE: you need to ACTIVATE your venv before installing any packages to avoid python from installing them to your global system.  
- To activate venv:  
    - source venv/Scripts/activate (If you're using bash or zsh)  
    - venv\Scripts\activate.bat (If you're using CMD)  
    - ***NOTE: you'll see (venv) appears before or above your command line if venv has been activated.  
    
- Update pip:  
    - pip list (and follow the command it gives you)  
- Navigate to the backend folder: cd backend/  
    - ***NOTE: here you'll see a requirements.txt file.  
- Install packages:  
    - pip install -r requirements.txt  

NOTES:  
- Must activate venv before running any .py files in backend folder to allow python to detect packages installed in venv.  
- To deactivate a venv, just type 'deactivate' into your cmd/bash/zsh.  
- If you want to delete the venv, just remove the venv folder and all packages installed in venv would be deleted as well.  
- If you want to install more packages, just install using pip (must activate venv), but before commit to git, do:  
    - pip freeze > requirements.txt  
    - This will allow other people to install the same packages & version as you did.  

