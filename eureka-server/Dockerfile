FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/*.jar eureka-server.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "eureka-server.jar"]
