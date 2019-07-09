export AWS_ACCESS_KEY_ID=AKIAIZNPWMSZW735YPOQ
export AWS_SECRET_ACCESS_KEY=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

rancher-compose \
--verbose \
--project-name api-gw \
--url http://18.217.57.163:8080/v1/projects/1a5 \
--access-key 8B183E4E77BE4F35B7B6 \
--secret-key 3yzh7TAXLzWHF8BBJWh6x91ekxQe8QoQt7ehQgQy \
-f docker-compose.yml \
--verbose up \
-d --force-upgrade \
--confirm-upgrade
