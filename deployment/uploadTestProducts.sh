#!/bin/bash

# arg1 ($1): number of products to upload
# arg2 ($2): firebase auth token

for i in $(seq 1 "$1")
do
  curl --location 'http://sportgh.k8s.edu.codespring.ro/api/products' \
  --header "Authorization: $2" \
  --header 'Content-Type: application/json' \
  --data "{
      \"publicContact\": false,
      \"name\": \"Product\"$i,
      \"description\": \"This product was generated for test purposes. Description: search-test\",
      \"locationLat\": null,
      \"locationLng\": null,
      \"rentPrice\": 100.0,
      \"subCategoryId\": 36,
      \"userUid\": \"2oONJKqW6ZeNwVDD1zQ2CCM42dx2\"
  }"
done
