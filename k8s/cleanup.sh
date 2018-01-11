kubectl delete pods --all
kubectl delete services app db #frontend
kubectl delete deployments app db #frontend
kubectl delete pvc db-data
kubectl delete pv db-data
#kubectl delete secrets tls-certs
#kubectl delete configmaps nginx-frontend-conf nginx-proxy-conf
kubectl delete hpa --all
