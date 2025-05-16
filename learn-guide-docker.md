# Learn Guide to Docker Basics

> Understanding the basics of Docker, why it is used, what it does and why not use VMs

---

## 1. Introduction

Docker is a containarization tool, similar to VMs. Both can be used for the main purpose: deploy apps in a way that they are isolated from the main OS processes, variables, etc; this way unexpected things can't happen like an update breaking an application or an application behaving different on multiple machines with the same specifications.

---

## 2. Virtual Machines

The way a VM works is that there is an Hypervisor process running that manages the virtual machines, this hyperviser can be VMware or VirtualBox, it is the process that manages, creates, deletes and edits the virtual machines. On virtual machines a whole OS is simulated and each machine has its own OS that is different to the one of the main host. These machines compete for resources too, they share the same physical hardware as the host machine and they are not isolated from each other, so if one machine is using a lot of resources, the others will be affected. 

---

## 3. Containers

Containers on the other hand are not virtual machines, they are processes that run on the host OS. They share the same kernel as the host OS and they are isolated from each other using namespaces and cgroups, say chroot command for debian as an example. This means that they are lightweight and they can be started and stopped very quickly. They also share the same resources as the host machine, so if one container is using a lot of resources, the others will be affected too.

---

## 4. VMs vs Containers (Docker)

The reason why nowadays the usage of containers is more prevalent that the usage of virtual machines to deploy code is that they don't need all the GUI interface of a whole OS, therefore they don't contian bloatware that is not needed and the creator of the container can specify a specific image of a OS that contains just what the app requires.

Docker containers run from a Dockerfile, this docker file specifies a list of steps to create the image with the application. For instance this file would typically specify what image to pull from docker hub, what packages to install, what files to copy from the host machine to the container, what ports to expose, etc. The dockerfile is a script that contains all the commands to assemble an image. The image is a snapshot of the container at a specific point in time. The container is a running instance of the image. The image is read-only and the container is read-write. When you run a container from an image, it creates a new layer on top of the image that is writable. This means that you can make changes to the container without affecting the original image. When you stop and remove the container, the changes are lost unless you commit them to a new image.

---

## 5. Docker

### 5.2 How to Download Docker Desktop

Follow instructions on this [link]().

### 5.3 Test a Basic Image

Run the following command and check the output in detail:

```bash
docker run hello-world
```

### 5.3 Images

Images can be published on docker hub, there you find images that you might require. Though some images like Python:latest contain a version of the OS full, so this image might weight more than 1GB, this is why there are 3 types of tags when it comes to the OS: 

| Type | Description |
|------|-------------|
| Standard | No special keywords, full version |
| Slim | Smaller version of the image |
| Alpine | Smallest version based on Alpine Linux |

The alpine version is a very small image that contains only the bare minimum to run the application. It is based on Alpine Linux, which is a security-oriented, lightweight Linux distribution based on musl libc and busybox. It is designed for security, simplicity and resource efficiency. It is a great choice for running containers because it has a small footprint and it is very fast to start up. The downside is that some packages might not be available in Alpine Linux or they might not work as expected because they are built against musl libc instead of glibc.

Images can change the pointer value too, today they may be associated to a specific version, say for example python 3.12, but this might be a generic tag, so it might be updated to the actual last one which could be called 3.12.5 but then the creator of this image might have more freedom and now point it to a version 3.12.5.2 as the 3.12, so the best practice for production servers is to be very specific with the tag, it is very suggested to always use a digest of an image itself instead of tags, like this: nginx@sha25621j34v12uky4v2kh5vg5v13jg5vg5k13g5h23b. Diggest can also go after a tag to allow for readability, like nginx:latest@sha25621j34v12uky4v2kh5vg5v13jg5vg5k13g5h23b. This way you can be sure that the image you are using is the one you want and it won't change unexpectedly.

### 5.4 Commands

#### 5.4.1 Run

To run an image:

```bash
docker run image_name:tag
```

It will try to build from a local image that matches that name with that tag, by default if no tag specified it will always try to use the latest tag.

##### 5.4.1.1 Parameters

Order of parameters does not matters, these are only the most important ones:

1. **Deattach**: `-d` de-attaches the container exeuction from the console and it will return an ID of the container running. The id of a container can be used instead of its name to interact with it through other commands in the CLI.

2. **Enviroment variables on runtime**: `-e KEY:VALUE -e KEY:VALUE`

3. **Expose container port to host port**: `-p host_port:container_port -p host_port:container_port`

4. **Specify the name of a container**: `--name container_name`

5. **Mount a volume**: `-v /host/path:/container/path -v /host/path:/container/path`, you can also use `--mount`.

   With this flag you're creating a "volume mount" which connects a folder on your computer (host) to a folder inside the container.

   What this means is that the volume mounting creates a two-way connection between these folders:

   - Both locations show the exact same files
   - Changes made in either location are instantly visible in both places
   - It's not a copy, it's the same storage space being accessed from two different viewpoints

   What Happens with Existing Data is that if your host folder already contains files, those files will appear inside the container and if the container path would normally have files from its image, those files get hidden by the host folder's contents

   Now, there is an old way and a new way to mount volumes, previously, and it still works, what was used was bind-mounts and both use the same flags -v and --mount. A bind-mount is a direct mapping of a host folder to a container folder, so if you change something in the host folder, it will be reflected in the container folder and vice versa. The new way is to use named volumes, which are managed by Docker and are stored in a specific location on the host machine. Named volumes are more flexible and easier to manage than bind-mounts, but they are not as portable.

   How to use bing-mount or docker volumes? if you specify with a / or ./ when indicating host volume then you are ponting to a folder, indicating that you will use bing-mount, otherwise if you don't use ./ and / and instead use the name of the docker volume then you will be using the docker volume.

   If you specify :ro at the end like this: `-v ./home/user/data:/app/data:ro my-image`, you will make the container be capable of only reading the contents of that folder.

6. **Automatically delete the image generated by the dockerfile after the container is stopped**: `--rm`

7. **Run a command inside the container**: `docker run .. other_args .. image_name command_to_run` always after the image name.

#### 5.4.2 Logs

To see the logs of a container:

```bash
docker logs container_name_or_id
```

#### 5.4.3 Prune

This command removes all stopped containers, useful when ready for production, testing or developing to free storage.

```bash
docker container prune
```

#### 5.4.4 Stop

To stop a container:

```bash
docker stop container_name_or_id
```

#### 5.4.5 Pull

To pull an image from docker hub:

```bash
docker pull image_name:tag
```

#### 5.4.6 Push

To push an image to docker hub:

```bash
docker push image_name:tag
```

#### 5.4.7 Exec

To run a command inside a running container:

```bash
docker exec -it container_name_or_id command_to_run
```

"`-it`" refers to interactive terminal, this way you can run commands inside the container as if you were inside it. This is very useful for debugging and testing purposes. For example, if you want to run a bash shell inside a running container, you can use the following command:

```bash
docker exec -it container_name_or_id bash
``` 

---

### 5.5 Docker Volumes

As mentioned on the mount volume -v parameter, there are two types of volumes: bind-mounts and named volumes. Bind-mounts are used to mount a host folder to a container folder, while named volumes are used to create a volume that is managed by Docker. Named volumes are stored in a specific location on the host machine and they are more flexible and easier to manage than bind-mounts. Whilst you know exactly where a bind-volume is at, you can't really tell for the docker volume.

#### Which One to Use?

Bind-mounts are more portable and easier to use, but they are not as flexible as named volumes. Named volumes are more flexible and easier to manage, but they are not as portable as bind-mounts. The best practice is to use named volumes for production environments and bind-mounts for development environments.

#### To Create a Volume

```bash
docker volume create volume_name
```

#### To List All Volumes

```bash
docker volume ls
```

#### To Remove a Volume

```bash
docker volume rm volume_name
```

#### To Inspect a Volume

```bash
docker volume inspect volume_name
```

---

### 5.6 Docker Images

To list all Docker images on your system:

```bash
docker image ls -a
```

This command shows all images, including intermediate layers (which is what the `-a` flag enables).

To remove an unused image:

```bash
docker image rm image_name:tag
```

---

### 5.7 Docker Containers

To list all containers (both running and stopped):

```bash
docker container ls -a
```

The `-a` flag shows all containers. Without it, you would only see running containers.

To view only running containers:

```bash
docker container ls
```

---

### 5.8 Building Docker Images

To build a Docker image from a Dockerfile:

```bash
docker build -t image_name:tag .
```

| Parameter | Description |
|-----------|-------------|
| `-t image_name:tag` | Names and tags your image. Without a tag, Docker uses `latest` by default. |
| `.` | Specifies the build context (current directory containing your Dockerfile). |
| `-f path/to/Dockerfile` | Optional: Use when your Dockerfile has a different name or location. |

After building, you can run a container from your image using the `docker run` command as described earlier.

### 5.9 Docker compose

Docker Compose is a tool for defining and running multi-container Docker applications. It allows you to define a multi-container application in a single file (usually `docker-compose.yml`) and then use a single command to start all the services defined in that file.

To run a docker compose file:

```bash
docker-compose up
```

To stop all services defined in a docker-compose file:

```bash
docker-compose down
```

This command stops and removes containers, networks, volumes, and images created by `docker-compose up`.

To stop but not remove containers:

```bash
docker-compose stop
```

### 5.10 Docker Compose File Structure

Docker Compose files are written in YAML format. Here's a basic example of a `docker-compose.yml` file:

```yaml
version: '3'  # Docker Compose version

services:
   web:  # Service name
      image: nginx:alpine  # Image to use
      ports:
         - "80:80"  # Port mapping
      volumes:
         - ./html:/usr/share/nginx/html  # Volume mounting
      depends_on:
         - db  # This service depends on db service
      environment:
         - NODE_ENV=production  # Environment variables
   
   db:  # Another service
      image: postgres:13
      volumes:
         - db-data:/var/lib/postgresql/data
      environment:
         - POSTGRES_PASSWORD=example

volumes:  # Define volumes
   db-data:  # Named volume
```

Now that examples defines the instructions that the docker file should have instead, if each project contains its own dockerfile, which should be ideal for both dev and prod, then this an example of how to refer to them on the yaml file:

```yaml
version: '3'  # Docker Compose version

services:
   web:  # Service name
      build: ./path/to/web  # Build from Dockerfile in this path
      ports:
         - "80:80"  # Port mapping
      volumes:
         - ./html:/usr/share/nginx/html  # Volume mounting
      depends_on:
         - db  # This service depends on db service
      environment:
         - NODE_ENV=production  # Environment variables
   
   db:  # Another service
      build: ./path/to/db  # Build from Dockerfile in this path
      volumes:
         - db-data:/var/lib/postgresql/data
      environment:
         - POSTGRES_PASSWORD=example

volumes:  # Define volumes
   db-data:  # Named volume
```