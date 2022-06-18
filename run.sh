#!/bin/bash

#add parameter "container" to run application in containers

set -x
set -e

cd server/api
composer install
cd -


if [[ "$1" == "container" ]]; then
    echo 'Building image'
    docker build -t php-rewrite .

    echo 'Starting services'
    docker compose up -d

    echo 'Waiting for services to start'
    sleep 10

    echo 'Configuring database'
    docker exec -it mysql_ending_credits mysql -uroot -proot -e "create database if not exists ending_credits"
    docker exec -it mysql_ending_credits mysql -uroot -proot \
        -e "alter user 'root' identified with mysql_native_password by 'root';"
    docker exec -it mysql_ending_credits mysql -uroot -proot ending_credits < dbseed.sql

elif [[ "$1" == "local" ]]; then
    #initialize the database

    mysql -uroot -proot ending_credits < dbseed.sql
    mysql -uroot -proot -e "create database if not exists ending_credits"

    sudo cp -r server/ /var/www/html/
    sudo systemctl start apache2
fi



