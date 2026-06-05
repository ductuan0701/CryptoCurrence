#!/bin/bash

whoami

hostname

cd ~/btvn14_Tuan/CryptoCurrence

docker compose up -d --build

docker compose ps

docker compose logs --tail=50 nginx
