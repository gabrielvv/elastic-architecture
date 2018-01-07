# ELASTIC ARCHITECTURE

![architecture](architecture.png)


https://github.com/remy/nodemon/issues/760
```sh
# git bash -> delete all containers
docker ps -q -a | xargs docker rm
# delete all untagged images
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
docker volume rm elasticarchitecture_db-data
docker-compose build --no-cache
docker-compose up --force-recreate --build
```

### postgres
https://hub.docker.com/_/postgres/
http://postgresguide.com/utilities/psql.html
```sh
# ne marche qu'avec cmd
docker-compose exec db psql -h localhost -U postgres
> \d
```

## conf

**nodemon** a été retiré de la commande dans docker-compose.yml

```js
user = {
  username: "foobar",
  password: "$2a$10$KgFhp4HAaBCRAYbFp5XYUOKrbO90yrpUQte4eyafk4Tu6mnZcNWiK",
}
```
