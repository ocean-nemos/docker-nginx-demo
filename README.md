# Docker showcase using nginx

Demo of simple nginx image to learn about docker usage in deep.

This demo was created by help on this [tutorial video](https://www.youtube.com/watch?v=b0HMimUb4f0).

Please check the [learn guide](./learn-guide-docker.md) file to know about Docker and this other [guide](./learn-guide-nginx.md) for nginx.

## Showcase

Run the following commands to check the demo:

1. frontend

Open a new terminal:

```bash
cd showcase/frontend
docker build -t demo-front-img .
docker run -d --rm -p 8000:80 --name demo-front demo-front-img
```

1. database

Open a new terminal:

```bash
cd showcase/database
docker build -t demo-db-img .
docker run -d --rm --name demo-db demo-db-img
```

2. backend

Open a new terminal:

```bash
cd showcase/backend
docker build -t demo-back-img .
docker run -d --rm -p 8000:8000 --name demo-back demo-back-img
```

3. frontend

Open a new terminal:

```bash
cd showcase/frontend
docker build -t demo-front-img .
docker run -d --rm -p 8080:80 --name demo-front demo-front-img
```

Then, open your browser and go to `http://localhost:8080` to see the website made using FastApi, Docker, Nginx & MongoDB.