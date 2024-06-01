#!/bin/bash

# Frontend deployment
kubectl apply -f frontend/sportgh-frontend-deployment.yaml

# MySQL Database deployment
./db/helm.exe install sportgh-mysql --set auth.rootPassword="sportghPass",auth.database="sportgh" oci://registry-1.docker.io/bitnamicharts/mysql

# Prepare storage for backend pods
kubectl apply -f ./backend/images-storage-pvc.yaml

# Backend deployment
kubectl apply -f ./backend/sportgh-backend-deployment.yaml

# Apply ingresses
kubectl apply -f sportgh-ingress.yaml
