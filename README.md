### The drunken panda framework

#### requirements

java >= 1.7.x (pour neo4js)

#### Install

```sh
# get Drunken Panda
git clone git@github.com:nyl-auster/drunkenpanda.git
cd drunkenpanda
npm i

# install neo4j (as root)
wget -O - http://debian.neo4j.org/neotechnology.gpg.key| apt-key add -
echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list
aptitude update -y
aptitude install neo4j -y

Mac: brew install neo4js
```
#install redis

```
Mac : brew install redis
```

#### start drunken panda server

Mac
```
redis-server
cd drunkenpanda
npm start

```
drunkenpanda server : localhost:3333
neo4js admin : localhost:7474

