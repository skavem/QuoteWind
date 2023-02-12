@echo off
docker compose rm -f
docker compose pull
docker compose up --build -d
docker compose stop -t 1