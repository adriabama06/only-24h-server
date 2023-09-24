# only-24h-server
Backend of Only24h

# API Documentation
[in doc/api/README.md](./doc/api/README.md)

# Recomendations:
- Install & Use Docker

# How run it? (Option 1)
Everything actomatic only run, default port 9008, to change edit docker-compose.yml, where "- 9008:80", for example for use port 5000 set "- 5000:80":
```bash
sh run-docker.sh
```
# How run it? (Option 2)
## Setup redis
Easy way, use docker, don't set password and user for easy user:
```bash
sudo docker run -d --name redis -p 6379:6379 redis:7.2.1
```
## Setup mongodb
Same easy way, use docker:
```bash
sudo docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=only24h -e MONGO_INITDB_ROOT_PASSWORD=1234567a mongo:6.0
```
## Run the server
Copy example.env to .env and set your values  
Run `npm i` to install all node modules  
And then run `npm start` to run the server ヾ(≧▽≦*)  
