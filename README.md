# SFDX  App
This is a LWC implementation of a TODO Application - revolutionary! Todos are stored in a custom oject and the Todos component gives a user an interface to enter and manipulate the todo items. 

## Dev, Build and Test
To build this for yourself, first clone (or fork) the repo: 
````
git clone https://github.com/adamSellers/lwc-todo.git && cd lwc-todo.git
````
Spin up a new, shiny scratch org. 
````
sfdx force:org:create -s -a todo -f config/project-scratch-def.json
````
Push that source!
````
sfdx force:source:push
````
Assign the permset for your user
````
sfdx force:user:permset:assign -n Todo_App_Permissions
````
Enjoy what you've created. 
````
sfdx force:org:open
````

## Description of Files and Directories
Contains some stuff, custom objects and permission sets etc. Ignore the profiles in this directory, this gets populated from a source pull command that brings weird stuff. 

## Issues
The App needs to be created and included, there is a bug with the version of DX that this was built in that means you couldn't source:pull the App stuff... (google it if interested, should be fixed soon - if not already!)



