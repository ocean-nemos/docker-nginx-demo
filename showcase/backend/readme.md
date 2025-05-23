## Tips for backend python

1. use `pip freeze > requirements.txt` to generate requirements.txt
2. create python env with `python -m venv venv`
3. activate python env with `source venv/bin/activate` (Linux) or `venv\Scripts\activate` (Windows)
4. install requirements with `pip install -r requirements.txt`

## How to test Dockerfile

First build:
```bash
sudo docker build -t api-img .
```

Then see if it built correctly, if not then remove image and build again
```bash
sudo docker image ls
```

Then run a container with that image
```bash
sudo docker run -d -p 8000:8000 --name api api-img
```

See the logs if necesary as it is deattached:
```bash
sudo docker logs api
```

Open the docs at `localhost:8000/docs` on your browser.

Then test the requests of the requests.rest file, consider using REST Client extension on VS code to test them easily or create curls.

To re-run a container:
```bash
sudo docker start api
```