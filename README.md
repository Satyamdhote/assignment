# assignment
Steps to run this API
 - Clone this project in your local environment using  - git clone https://github.com/Satyamdhote/assignment.git
 - Run "npm install" to download all the dependencies to run your project
 - create a .env file and store your postgres connections. Its format should be -
      DB_NAME= 'Yoyr DB Name'
      DB_USER= 'Your username'
      DB_PASSWORD= 'Your password'
      DB_HOST=localhost
      DB_DIALECT=postgres
- Run your project using command - "npm start"
- Routes:-
   1. GET - http://localhost:3000/tasks
   2. POST - http://localhost:3000/tasks
   3. PUT - http://localhost:3000/tasks/id
   4. DELETE - http://localhost:3000/tasks/id
   5. For Generating Metrics
       GET - http://localhost:3000/task_metrics
      
