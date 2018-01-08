# ELASTIC ARCHITECTURE

![architecture](architecture.png)

> /login  
> /vote  
> /result  
> /secure/vote  
> /secure/result

```
curl -X POST \
  http://localhost:5001/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{"username": "user", "password":"password"}'

curl -X GET http://localhost:5001/vote
curl -X GET http://localhost:5001/result

curl -X GET \
    http://localhost:5001/secure/vote \
    -H 'cache-control: no-cache' \
    -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZvb2JhciIsImlhdCI6MTUxNTQzNzgyMCwiZXhwIjoxNTE1NTI0MjIwfQ.BBp7kphEb-Ji8UnhjfDjjfRD1bmLd7_be8xA_u5a9eA'

curl -X GET \
  http://localhost:5001/secure/result \
  -H 'cache-control: no-cache' \
  -H 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZvb2JhciIsImlhdCI6MTUxNTQzNzgyMCwiZXhwIjoxNTE1NTI0MjIwfQ.BBp7kphEb-Ji8UnhjfDjjfRD1bmLd7_be8xA_u5a9eA'
```

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
  username: "user",
  // bcrypt hash for "password"
  password: "$2a$10$KgFhp4HAaBCRAYbFp5XYUOKrbO90yrpUQte4eyafk4Tu6mnZcNWiK",
}
```

## TODO

* graceful shutdown (**app** pour fermeture connexions puis **db** et **redis**)
