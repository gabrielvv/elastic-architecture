kubectl apply -f ./persistence/db-data-pv.yaml
kubectl apply -f ./persistence/db-data-pvc.yaml
kubectl apply -f ./deployments/db-deployment.yaml
kubectl apply -f ./deployments/app-deployment.yaml
# kubectl apply -f ./services/redis-deployment.yaml
kubectl apply -f ./services/db-service.yaml
kubectl apply -f ./services/app-service.yaml
minikube addons enable heapster
kubectl autoscale deployment app --cpu-percent=50 --min=1 --max=10
kubectl autoscale deployment db --cpu-percent=50 --min=1 --max=10
