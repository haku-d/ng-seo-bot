# How to run

## Build docker image

`docker build -t ng-seo-bot .`

## Run docker container

```
docker run -d -e PORT=6969 -p 6969:6969 \
  --name ng-seo-bot \
  --env TARGET_URL="https://example.com" \
  ng-seo-bot
```
