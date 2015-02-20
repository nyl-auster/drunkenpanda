# The drunken panda framework

## Requirements

* java >= 1.7.x (tested with open-jre)
* [nodejs](//nodejs.org) / [io.js](//iojs.org)
* [neo4j](//neo4j.com)
* [redis](//redis.io)
* [elasticsearch](//elasticsearch.org)

## Install

### Get Drunken Panda
```sh
git clone git@github.com:nyl-auster/drunkenpanda.git
cd drunkenpanda
npm i
```

### Install neo4j 

#### Debian
```sh
wget -O - http://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add -
sudo sh -c 'echo "deb http://debian.neo4j.org/repo stable/" > /etc/apt/sources.list.d/neo4j.list'
sudo aptitude update -y
sudo aptitude install neo4j -y
```

#### Mac osx
```sh
brew install neo4j
```

### Install redis

#### Debian

```sh
aptitude install redis-server
```

#### Mac osx

```sh
brew install redis
```

### Install elasticsearch 

#### Debian
```sh
wget -O - https://packages.elasticsearch.org/GPG-KEY-elasticsearch | sudo apt-key add -
sudo sh -c 'echo "deb http://packages.elasticsearch.org/elasticsearch/1.4/debian stable main" > /etc/apt/sources.list.d/elasticsearch.list'
sudo aptitude update -y
sudo aptitude install elasticsearch -y
sudo update-rc.d elasticsearch defaults 95 10
```

#### Mac osx
```sh
TODO
```

## Start drunken panda server

### Launch redis-server, neo4j and elasticsearch

#### Debian

Redis and neo4j services are launched by default, but you still can :
```sh
sudo service redis-server [start|stop|restart]
sudo service neo4j-service [start|stop|restart]
sudo service elasticsearch [start|stop|restart]
```

#### Mac
```sh
neo4j start
redis-server
TODO elasticsearch
```

### Launch nodejs http server

```sh
cd drunkenpanda
# launch server using development config
NODE_ENV=development npm start
# launch server using prod config
npm start
```

### Servers default urls

* drukenpanda http server : http://localhost:3333
* neo4j : http://localhost:7474
* redis : localhost:6379

## Troubleshooting 

If something seems to go wrong :
* Have you run npm install ?
* Do you need to run `NODE_ENV=development npm start` instead of `npm run` ? 
* Check nodejs server is running and listening on an open port
* Check neo4js is running and listening on an open port
* Check redis server is running and listening on an open port

