FROM maven:3.8.5-openjdk-11 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src /app/src
RUN mvn clean package

FROM quay.io/wildfly/wildfly:latest-jdk17

ENV JBOSS_HOME=/opt/wildfly
ENV PATH="${JBOSS_HOME}/bin:${PATH}"

COPY ./target/web2.war ${JBOSS_HOME}/standalone/deployments/

RUN ${JBOSS_HOME}/bin/add-user.sh admin Admin@123 --silent

EXPOSE 8080 9990

CMD ["standalone.sh", "-b", "0.0.0.0"]
