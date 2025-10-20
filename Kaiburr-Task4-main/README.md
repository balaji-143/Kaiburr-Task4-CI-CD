# Task Manager API (Task 1)

This project is a Java Spring Boot application that provides a REST API for creating, searching, deleting, and running "task" objects. Task objects represent shell commands that can be executed, and their data is stored in a MongoDB database.

## File Structure

```
.
├── .gitignore
├── pom.xml
├── README.md
└── src
    └── main
        ├── java
        │   └── com
        │       └── kaiburr
        │           └── taskmanager
        │               ├── TaskManagerApplication.java
        │               ├── controller
        │               │   └── TaskController.java
        │               ├── model
        │               │   ├── Task.java
        │               │   └── TaskExecution.java
        │               ├── repository
        │               │   └── TaskRepository.java
        │               └── service
        │                   └── TaskService.java
        └── resources
            └── application.properties
```

## Prerequisites

- Java 17
- Maven
- Docker

## How to Run

1.  **Start MongoDB using Docker**: If you don't have a local MongoDB instance, you can run one using Docker with the following command:
    ```bash
    docker run -d -p 27017:27017 --name mongodb mongo
    ```
    This will start a MongoDB container and make it available on `mongodb://localhost:27017`.

2.  **Run the application**: Open your terminal in the project root and run the following command:
    ```bash
    mvn spring-boot:run
    ```
The application will start on `http://localhost:8081`.

Frontend
--------
A polished React 19 + TypeScript UX lives in `frontend/`, powered by Vite and Ant Design. Highlights include a searchable task table, drawer-based creation with validation, one-click execution, and a timeline drawer that captures the full command history.

Quick start:

1. cd frontend
2. npm install
3. npm run dev

- Visit http://localhost:3000
- The dev server proxies `/tasks` to `http://localhost:8081`
- See `frontend/README.md` for detailed usage, accessibility notes, and production build instructions.

## API Endpoints and Usage

Here are the available endpoints and examples of how to use them with `curl`.

### Create or Update a Task
- **Endpoint**: `PUT /tasks`
- **Description**: Creates a new task or updates an existing one. The task object is sent in the request body.
- **Example**:
  ```bash
  curl -X PUT http://localhost:8081/tasks -H "Content-Type: application/json" -d '{"id": "101", "name": "My Test Task", "owner": "Balaji", "command": "echo Hello World"}'
  ```

### Get Tasks
- **Endpoint**: `GET /tasks`
- **Description**: Returns a list of all tasks. If an optional `id` request parameter is provided, it returns a single task matching the ID.
- **Example (Get all tasks)**:
  ```bash
  curl http://localhost:8081/tasks
  ```
- **Example (Get a task by ID)**:
  ```bash
  curl http://localhost:8081/tasks?id=101
  ```

### Find Tasks by Name
- **Endpoint**: `GET /tasks/name/{name}`
- **Description**: Finds all tasks where the name contains the given string. Returns 404 if nothing is found.
- **Example**:
  ```bash
  curl http://localhost:8081/tasks/name/Test
  ```

### Execute a Task
- **Endpoint**: `PUT /tasks/execute/{id}`
- **Description**: Executes the shell command of the specified task and records the execution details.

## CI-CD Pipeline (Task 4)

This project includes a CI/CD pipeline using GitHub Actions to automate the build and deployment process. The pipeline is defined in `.github/workflows/main.yml`.

### Pipeline Steps

1.  **Checkout Code**: The workflow checks out the latest code from the repository.
2.  **Set up JDK 17**: It sets up the Java environment to build the Spring Boot backend.
3.  **Set up Node.js**: It sets up the Node.js environment to build the React frontend.
4.  **Build Frontend**: It installs dependencies and builds the frontend application.
5.  **Build with Maven**: It compiles and packages the backend Java application into a JAR file.
6.  **Build and Push Docker Image**:
    -   It builds a Docker image using the `Dockerfile` in the root directory.
    -   The Docker image contains both the compiled frontend and the backend application.
    -   The image is then pushed to Docker Hub.

### How It Works

-   The pipeline is triggered on every `push` or `pull_request` to the `main` branch.
-   The Docker image is tagged with `latest` and pushed to a repository on Docker Hub.

### Prerequisites for the Pipeline

To use this pipeline, you need to configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

-   `DOCKER_HUB_USERNAME`: Your Docker Hub username.
-   `DOCKER_HUB_ACCESS_TOKEN`: An access token for your Docker Hub account with permissions to push images.
- **Example**:
  ```bash
  curl -X PUT http://localhost:8081/tasks/execute/101
  ```
  After executing, you can call `GET /tasks/101` again to see the `taskExecutions` list updated with the result.

### Delete a Task
- **Endpoint**: `DELETE /tasks/{id}`
- **Description**: Deletes a task by its ID.
- **Example**:
  ```bash
  curl -X DELETE http://localhost:8081/tasks/101
  ```



