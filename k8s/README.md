# K8s v2

* [medium article](https://medium.com/lucjuggery/dockers-voting-app-on-swarm-kubernetes-and-nomad-8835a82050cf)
* https://github.com/alexvanboxel/k8s-docker-vote
* [dns](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
* [get-shell-running-container](https://kubernetes.io/docs/tasks/debug-application-cluster/get-shell-running-container/)
* https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/
* [guestbook app](https://kubernetes.io/docs/tutorials/stateless-application/guestbook/)

```sh
kubectl apply -f .\db-data-pv.yaml
kubectl apply -f .\db-data-pvc.yaml
kubectl apply -f .\db-deployment.yaml

kubectl apply -f .\redis-deployment.yaml
# https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/
# test
kubectl port-forward redis-575796f579-8dnr7 6379:6379
# open redis-cli ou redis desktop


kubectl apply -f .\result-deployment.yaml
kubectl apply -f .\vote-deployment.yaml
kubectl describe deployment -l app=vote
kubectl apply -f .\worker-deployment.yaml

# check logs
kubectl logs -f POD-NAME

kubectl apply -f redis-service.yaml
kubectl apply -f db-service.yaml

kubectl apply -f vote-service.yaml
kubectl describe service -l app=vote
kubectl logs -f vote-6c6f77fc8b-rpzvc
# get external ip
minikube service vote --url

kubectl apply -f result-service.yaml
kubectl apply -f worker-service.yaml

# Cleaning up
kubectl delete deployment -l app=redis
kubectl delete service -l app=redis
kubectl delete deployment -l app=db
kubectl delete service -l app=db
kubectl delete deployment -l app=result
kubectl delete service -l app=result
kubectl delete deployment -l app=vote
kubectl delete service -l app=vote
kubectl delete deployment -l app=worker
kubectl delete service -l app=worker
```
# troubleshooting
https://github.com/kubernetes/minikube/issues/2280
```sh
kubectl --namespace kube-system logs kube-addon-manager-minikube

minikube config set bootstrapper kubeadm
```
