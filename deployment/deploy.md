# Frontend deployment

kubectl create secret docker-registry sportgh-cred --docker-server=r.edu.codespring.ro --docker-username=USERNAME_FROM_GITLAB_TOKEN --docker-password=PASSWORD_FROM_GITLAB_TOKEN
kubectl apply -f frontend/sportgh-frontend-deployment.yaml
kubectl apply -f sportgh-ingress.yaml
