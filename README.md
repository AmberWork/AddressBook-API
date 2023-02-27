# AddressBook-API
API for the Address Book Mini project.

### Getting a copy of the project. 
This can be done using the git clone command. **_git clone https://github.com/AmberWork/AddressBook-API_**

### Environment variables.
We use environment variables to protect sensitive data from being shown to users. There is an example file called config.env.example, which shows the variables that must be defined before the application can run and perform successfully. 
You would need to rename this file to **config.env** and populate the variables with values.

### Installing the project.
Run the command `npm install` to install all the dependencies used int he project. After which you can use the command `npm run dev` to run the server in development mode and `npm run start`

### Migrate data to the Database.
Run the `npm run migrations` to migrate dummy data to the database. This npm script uses the package migrate mongo which is in the list of dependencies. However, if there is an issue saying that the command `migrate-mongo` is not recognize. This means that you need to have a global install of the package `npm i -g migrate-mongo`. 


