#!/bin/bash

# Frontend delete
kubectl delete -f frontend/sportgh-frontend-deployment.yaml

# Backend delete
kubectl delete -f backend/sportgh-backend-deployment.yaml

# Delete images storage
kubectl delete -f backend/images-storage-pvc.yaml

# Delete ingresses
kubectl delete -f sportgh-ingress.yaml

# MySQL Database delete
db/helm.exe uninstall sportgh-mysql
