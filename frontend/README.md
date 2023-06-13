NOTE: must have npm and nodejs installed.  

- Open a new CMD/zsh window.  
- Navigate to this folder: 
```bash
cd frontend/
```  
- Install all frontend packages: 
```bash
# This will install all the packages listed in the package.json file
npm install
```
- Start the frontend server:
```bash
npm start
```

NOTE:
- If you want to install a specific package, just use: 
```bash
npm install <package_name>
```
- All packages will be saved in package.json under 'dependencies', so be sure to commit that file to git if you have installed more packages

***NOTE
- To update changes you've made to a file in frontend, just save that file and refresh the web browser.