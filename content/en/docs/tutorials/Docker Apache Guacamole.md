---
title: "Docker - Apache Guacamole"
description: "Installing Apache Guacamole in Docker"
lead: "Installing Apache Guacamole in Docker"
date: 2022-04-06T09:19:42+01:00
lastmod: 2022-04-06T09:19:42+01:00
draft: false
images: []
menu:
  docs:
    parent: "kb"
weight: 630
toc: true
---

## Pulling the images

```
docker pull guacamole/guacamole
docker pull guacamole/guacd
docker pull mysql/mysql-server
```

## Setting up the Database

1. Create db initialization script
```
docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --mysql > initdb.sql
```
2. Get the one-time password for MySQL (Look for ```[Entrypoint] GENERATED ROOT PASSWORD: <password>``` in the log)
```
docker run --name guac-db -e MYSQL_RANDOM_ROOT_PASSWORD=yes -e MYSQL_ONETIME_PASSWORD=yes -d mysql/mysql-server
docker logs guac-db
```
3. Copy the initialization script into the MySQL container
```
docker cp initdb.sql guac-db:/guac_db.sql
```
4. Bash into the MySQL container 
```
docker exec -it example-mysql bash
```
5. Log into MySQL using the one-time password you copied in step 2
```
mysql -u root -p
```
6. Change MySQL root password, create guacamole database, create database user and grant privileges. Change *password* to something you'd like to use
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE guacamole_db;
CREATE USER 'guacamole_user'@'%' IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE ON guacamole_db.* TO 'guacamole_user'@'%';
FLUSH PRIVILEGES;
quit
```
7. Create guacamole tables via the initialization script
```
cat guac_db.sql | mysql -u root -p guacamole_db
```
8. Leave the container bash
```
exit
```

## Start Guacamole containers

1. Start up guacd
```
docker run --name guacd -d guacamole/guacd
```
2. Start up Guacamole, link it do guacd and guac-db
```
docker run --name guacamole --link guacd:guacd --link guac-db:mysql -e MYSQL_DATABASE=guacamole_db -e MYSQL_USER=guacamole_user -e MYSQL_PASSWORD=guacamole_user_password -d -p 0.0.0.0:8080:8080 guacamole/guacamole
```
3. Verify all three containers are running
```
docker ps -a
```

## Access Guacamole

Access the Guacamole server at [http://[YOUR_DOCKER_HOST]:8080/guacamole/](http://[YOUR_DOCKER_HOST]:8080/guacamole/) the default username/password is ```guacadmin``` for both fields.

