# ELASTIC ARCHITECTURE V1

![architecture](architecture.png)

[manage-compute-resources-container](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)
[resource-usage-monitoring](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
https://hub.docker.com/r/erdow/

```sh
# build app container
docker build ./app -t gabrielvv/elasticarchitecture_app:<tag>
docker push gabrielvv/elasticarchitecture_app:<tag>
```

```sh
#using same docker host as minikube
eval $(minikube docker-env)
#undo
eval $(minikube docker-env -u)
```

```sh
# start minikube cluster and deploy
cd ./k8s; bash start.sh;
start "$(minikube service --url app)/result"
start "$(minikube service --url app)/vote"
minikube addons enable heapster
minikube addons open heapster
```

## Docker images
* [gabrielvv/elastic_app:v1](https://hub.docker.com/r/gabrielvv/elastic_app)
* [postgres:9.4](https://hub.docker.com/_/postgres/)

## HEAPSTER

https://dzone.com/articles/how-to-utilize-the-heapster-influxdb-grafana-stack
https://github.com/kubernetes/heapster/issues/1179
https://docs.influxdata.com/influxdb/v1.4/tools/api/#query

```sh
curl -sl -I 10.110.149.165:8086/ping

kubectl get services -n kube-system
# note the monitoring-influxdb service ip
minikube ssh
export INFLUX_IP=10.110.149.165
export CREATE_RP='CREATE RETENTION POLICY "2hours" ON "k8s" DURATION 2h REPLICATION 1'
export CREATE_CQ='CREATE CONTINUOUS QUERY current_pods_query ON k8s BEGIN SELECT max(value) AS value INTO k8s."2hours".current_pods FROM k8s."default".uptime WHERE type = "pod" GROUP BY time(5m), namespace_name, nodename, pod_name END'

curl -i -XPOST $INFLUX_IP:8086/query --data-urlencode "q=$CREATE_RP"
curl -i -XPOST $INFLUX_IP:8086/query --data-urlencode "q=$CREATE_CQ"
```

## TODO

* Delay middleware
* graceful shutdown (**app** pour fermeture connexions puis **db** et **redis**)
* auto-scaling+load balancing et déploiement sur kubernetes
* locust files
* hpa file instead of commands

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

### load balancing & socket.io

https://socket.io/docs/using-multiple-nodes/
https://github.com/socketio/socket.io/tree/master/examples

```sh
docker run -d -p 8000:80 --name nginx-proxy -v /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy
docker run -d -p 8000:8000 --name whoami -e VIRTUAL_HOST="whoami.local" -t jwilder/whoami
docker run -d -p 8080:8080 --name whoami2 -e VIRTUAL_HOST="whoami2.local" -t jwilder/whoami
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

## [locust](https://docs.locust.io/en/latest/index.html)

```sh
locust --host=http://example.com
```
