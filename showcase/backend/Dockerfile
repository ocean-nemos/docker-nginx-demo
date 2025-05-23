FROM python:3.12.10-slim

# set working dir
WORKDIR /api

# add the project, which on this case is the current folder
COPY . /api/

# install requirements
RUN pip install --no-cache-dir -r requirements.txt

# expose port to allow access to other containers on the network
EXPOSE 8000

# start the api by simply running api.py
CMD ["python", "api.py"]