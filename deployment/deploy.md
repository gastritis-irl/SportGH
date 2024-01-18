` ./helm install ca-sportgh-msql --set mysql.password=UwMnRZ8ds8aioT,mysql.database=sportgh,mysql.username=mysql,persistence.storageClass=nfs-client bitnami/mysql-ha -n training `

` kubectl apply -f backend/sportgh-backend-deployment.yaml & kubectl apply -f db/sportgh-mysql-configmap.yaml & kubectl apply -f db/sportgh-mysql-secrets.yaml & kubectl apply -f db/sportgh-mysql-service.yaml & kubectl apply -f db/sportgh-mysql-statefulset.yaml & kubectl apply -f frontend/sportgh-frontend-deployment.yaml `

` kubectl delete -f backend/sportgh-backend-deployment.yaml & kubectl delete -f db/sportgh-mysql-configmap.yaml & kubectl delete -f db/sportgh-mysql-secrets.yaml & kubectl delete -f db/sportgh-mysql-service.yaml & kubectl delete -f db/sportgh-mysql-statefulset.yaml & kubectl delete -f frontend/sportgh-frontend-deployment.yaml `
