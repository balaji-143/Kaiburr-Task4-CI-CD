# Build frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Package application
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
COPY --from=frontend /app/frontend/dist /app/src/main/resources/static
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
