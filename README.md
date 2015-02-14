### The drunken panda framework

#### Install

```sh
# get drunken panda
git clone git@github.com:nyl-auster/drunkenpanda.git
cd drunkenpanda
npm i

# install neo4j (as root)
wget -O - http://debian.neo4j.org/neotechnology.gpg.key| apt-key add -
echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list
aptitude update -y
aptitude install neo4j -y
```
