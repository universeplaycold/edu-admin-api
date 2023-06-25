# Backend API Assessment Solution 

This is a solution for the Backend API Assessment Version 2.0. 

It provides a set of API endpoints for administrators to perform administrative functions for teachers and students. 

Requirements - Node.js (v14 or higher) - PostgreSQL (v13 or higher) 

#### Installation 

1. Clone the repository: `git clone <repository-url>` 

- [ ] Install the dependencies: `npm install` 

Database Setup 

1. The database is hosted in AWS - AWS RDS PostgreSQL. 
2. Running the Application
   1. 1. Start the application: `npm run start:dev` 
      2. The API will be available at `http://localhost:3000`.
      3. Run the tests: `npm run test`

Testing the API

1. Please find this postman collection file "edu-admin-api.postman.collection.json" inside the project folder.



------------------------------------------------------------------------------------------------------------------------------------
# Backend API Asessment
Version 2.0

## Background
A school needs a system where administrators can perform administrative functions for teachers and students. Teachers and students are identified by their email addresses.

## Your Task
Your task is to:
1. Develop a set of API endpoints, listed under *User Stories* below, for adminstrators to perform administrative functions for their classes.
    * Your code must be hosted on Github, or any other similar service, in a publicly-accessible repository.
    * You may assume that login and access control have already been handled.
2. *(Optional)* Deploy your API to any publicly accessible hosting environment.

When you have completed your assignment, before the given deadline, please submit to us a link to your code repository.

If you have any queries, feel free to contact us.

## Requirements/Expectations
1. Your code repository should contain a `README.md` that includes the following:
    * Link(s) to the hosted API (if applicable)
    * Instructions for running local instance of your API server; we need to minimally be able to launch and test your solution locally
2. Please use Spring Boot (preferred. If you wish to use other backend technology, please check with us) for the backend code.
3. Please use Postgres (MySQL is acceptable but please indicate if so) as the database. You are encouraged to use JPA data access.
4. Please include unit tests. 
    * (Optional) You can provide a Postman collection for the APIs that you've implemented, *but* we can (and likely will) still use our own tools as well to test your API.
5. If you are selected for a face-to-face interview, you should be prepared to:
    * Walk through your code to interviewers
    * Explain any design decisions you’ve made

## Important!
- We will assess your submission holistically (i.e. not just in terms of functionality), including factors such as:
    * Readability and code cleanliness
    * Secure coding practices
    * Code structure/design, e.g. modularity, testability, performance
    * Class and DB design
- **Please adhere closely to the given specs**.
    * Please do not omitted any user stories 
   

## User stories

### 1. As an administrator, I want to add new students to the system.

* To add a student
  * Endpoint: `POST /api/students`
  * Headers: `Content-Type: application/json`
  * Success response status: HTTP 201
  * Request body example:
```
{
  "email" : "studentjane@gmail.com"
  "name" : "Jane"
}
```

### 2. As an administrator, I want to add new teachers to the system.
* To add a teacher
  * Endpoint: `POST /api/teachers`
  * Headers: `Content-Type: application/json`
  * Success response status: HTTP 201
  * Request body example:
```
{
  "email" : "teachermary@gmail.com"
  "name" : "Mary"
}
```


### 3. As an administrator, I want to register one or more students to a specified teacher.
A teacher can register multiple students. A student can also be registered to multiple teachers.

* Endpoint: `POST /api/register`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 204
* Request body example:
```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```

### 4. As an administrator, I want to de-register a student to a specified teacher.

* Endpoint: `POST /api/deregister`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 200
* Request body example:
```
{
  "teacher": "teacherken@gmail.com",
  "student": "studentjon@gmail.com", 
  "reason": "Cancelled enrollment"
}
```

### 5. As an administrator, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).

* Endpoint: `GET /api/commonstudents`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 200
* Request example 1: `GET /api/commonstudents?teacher=teacherken%40gmail.com`
* Success response body 1:
```
{
  "students" :
    [
      "commonstudent1@gmail.com", 
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]
}
```
* Request example 2: `GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com`
* Success response body 2:
```
{
  "students" :
    [
      "commonstudent1@gmail.com", 
      "commonstudent2@gmail.com"
    ]
}
```

### 6. As a adminstrator, I want to list all teachers, together with a list of email addresses of students registered to each teacher

* Endpoint: `GET /api/teachers`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 200
* Request example 1: `GET /api/teachers`
* Success response body:
```
{
  "teachers":
    [
      {
         "email": "teachermary@gmail.com",
         "students" :
             [
               "studentjane@gmail.com", 
               "studentjon@gmail.com"
             ]
      },
      {
         "email": "teacherken@gmail.com",
         "students" : [...]     
      },
      ...
    ]

}
```


## Error Responses
For all the above API endpoints, error responses should:
* have an appropriate HTTP response code
* have a JSON response body containing a meaningful error message:
```
{ "message": "Some meaningful error message" }
```
