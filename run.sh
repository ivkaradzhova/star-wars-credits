cd server

echo 'Building image'
docker build -t php-rewrite .

echo 'Starting services'
docker compose up -d

echo 'Waiting for services to start'
sleep 5

echo 'Configuring database'
docker exec -it mysql_ending_credits mysql -uroot -proot -e "create database if not exists ending_credits"
docker exec -it mysql_ending_credits mysql -uroot -proot \
	-e "alter user 'root' identified with mysql_native_password by 'root';"

