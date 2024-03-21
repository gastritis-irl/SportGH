# Frontend deployment

kubectl create secret docker-registry sportgh-cred --docker-server=r.edu.codespring.ro --docker-username=USERNAME_FROM_GITLAB_TOKEN --docker-password=PASSWORD_FROM_GITLAB_TOKEN
kubectl apply -f frontend/sportgh-frontend-deployment.yaml
kubectl apply -f sportgh-ingress.yaml

# Backend deployment

(sportgh-backend-secret.yaml)
- create a secret for your firebase service account key (only for the 'private_key' field)
- make an env variable from it, within a pipeline file (or similar), so that you can access it from your code

(sportgh-backend-configmap.yaml)
- you can use this instead of secrets (it is similar, but not the same)
