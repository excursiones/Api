rancher-compose \
--verbose \
--project-name api-gw \
--url http://18.217.57.163:8080/v1/projects/1a5 \
--access-key $RANCHER_ACCESS_KEY \
--secret-key $RANCHER_SECRET_KEY \
-f docker-compose.yml \
--verbose up \
-d --force-upgrade \
--confirm-upgrade
