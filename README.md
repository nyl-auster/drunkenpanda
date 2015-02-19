# The drunken panda framework

## requirements

java >= 1.7.x (pour neo4js)
nodejs
neo4j
redis
gulp

## Install

### get Drunken Panda
```sh
git clone git@github.com:nyl-auster/drunkenpanda.git
cd drunkenpanda
npm i
```

### install neo4j 

#### Debian (as root)
```sh
wget -O - http://debian.neo4j.org/neotechnology.gpg.key| apt-key add -
echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list
aptitude update -y
aptitude install neo4j -y
```

#### Mac osx
```sh
brew install neo4j
```

###install redis

#### Debian

TODO

#### Mac osx

```sh
brew install redis
```
## Start drunken panda server

### launch redis-server, neo4j and nodejs http server

#### Debian

TODO

#### Mac
```sh
neo4j start
redis-server
cd drunkenpanda
# launch server using development config
NODE_ENV=development npm start
# launch server using prod config
npm start
```

### servers default urls

* drukenpanda http server : localhost:3333
* neo4j : localhost:7474
* neo4j admin : localhost:7474/browser

## Troubleshooting 

If something seems to go wrong :
* Have you run npm install ?
* Do you need to run `NODE_ENV=development npm start` instead of `npm run` ? 
* Check nodejs server is running and listening on an open port (default to `3333`)
* Check neo4js is running and listening on an open port (default to `7474`)
* Check redis server is running and listening on an open port (default to `6379`)

