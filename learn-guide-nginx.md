# Learn Guide to Nginx Basics

> Understanding what Nginx is, why it's used, and how to get started with this powerful web server

---

## 1. Introduction

Nginx (pronounced "engine-x") is a high-performance web server, reverse proxy, and load balancer designed to deliver web content efficiently. Created to address the C10K problem (handling 10,000+ concurrent connections), Nginx has become one of the most popular web servers worldwide due to its speed, reliability, and efficient resource usage.

---

## 2. Why Use Nginx?

Nginx offers several key advantages over other web servers:

| Advantage | Description |
|-----------|-------------|
| Performance | Handles high loads with minimal resources |
| Concurrency | Event-driven, asynchronous architecture handles thousands of connections simultaneously |
| Stability | Reliable operation even under heavy load |
| Flexibility | Works as web server, reverse proxy, load balancer, and more |
| Scalability | Can be easily scaled horizontally or vertically |
| Security | Many built-in security features and hardening options |

---

## 3. Core Concepts

### 3.1 Web Server

As a web server, Nginx serves static content (HTML, CSS, JavaScript, images) extremely efficiently. Unlike traditional web servers that create a new process for each request, Nginx uses an event-driven, asynchronous architecture to handle many connections within a single worker process.

### 3.2 Reverse Proxy

Nginx excels as a reverse proxy, sitting in front of application servers (like Node.js, Python, PHP) and forwarding client requests to these backend servers, then returning the servers' responses to the clients. This adds a security layer and improves performance through features like caching.

### 3.3 Load Balancer

Nginx can distribute incoming traffic across multiple application servers, improving reliability and performance. It supports various load balancing algorithms including round-robin, least connections, and IP hash.

---

## 4. Basic Architecture

Nginx uses a master process and worker processes architecture:

- **Master Process**: Reads configuration, binds to ports, and manages worker processes
- **Worker Processes**: Handle network connections and serve content to clients
- **Event-driven Model**: Instead of creating threads/processes per request, Nginx handles connections through asynchronous, non-blocking operations

This architecture enables Nginx to handle thousands of concurrent connections with minimal resources.

---

## 5. Installation

### 5.1 Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install nginx
```

### 5.2 Linux (CentOS/RHEL)

```bash
sudo yum install epel-release
sudo yum install nginx
```

### 5.3 macOS (using Homebrew)

```bash
brew install nginx
```

### 5.4 Windows

Download the Windows version from the [official Nginx website](https://nginx.org/en/download.html) and extract the files to a directory of your choice.

### 5.5 Docker

```bash
docker run --name my-nginx -p 80:80 -d nginx
```

---

## 6. Basic Commands

### 6.1 Starting Nginx

```bash
sudo systemctl start nginx  # On systems with systemd
sudo service nginx start    # On systems with System V
nginx                       # When installed manually
```

### 6.2 Stopping Nginx

```bash
sudo systemctl stop nginx   # On systems with systemd
sudo service nginx stop     # On systems with System V
nginx -s stop              # When installed manually
```

### 6.3 Reloading Configuration

```bash
sudo systemctl reload nginx # On systems with systemd
sudo service nginx reload   # On systems with System V
nginx -s reload            # When installed manually
```

### 6.4 Testing Configuration

```bash
sudo nginx -t
```

### 6.5 Checking Status

```bash
sudo systemctl status nginx # On systems with systemd
sudo service nginx status   # On systems with System V
```

---

## 7. Configuration Basics

### 7.1 Configuration File Structure

The main Nginx configuration file is typically located at:
- `/etc/nginx/nginx.conf` (Linux)
- `/usr/local/etc/nginx/nginx.conf` (macOS with Homebrew)
- `[nginx-directory]/conf/nginx.conf` (Windows)

Nginx configurations follow a hierarchical structure with contexts (blocks):

```nginx
# Main context
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;

# Events context
events {
    worker_connections 1024;
}

# HTTP context
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Server context
    server {
        listen 80;
        server_name example.com;
        
        # Location context
        location / {
            root /var/www/html;
            index index.html;
        }
    }
}
```

### 7.2 Important Directives

| Directive | Context | Description |
|-----------|---------|-------------|
| `server_name` | server | Defines which domain names this server block responds to |
| `listen` | server | Specifies the IP address and port to listen on |
| `root` | http, server, location | Sets the document root directory |
| `location` | server | Configures how to respond to requests for specific URI patterns |
| `proxy_pass` | location | Specifies the address of a proxied server |
| `fastcgi_pass` | location | Directs requests to a FastCGI server (e.g., PHP-FPM) |

---

## 8. Common Use Cases

### 8.1 Serving Static Content

```nginx
server {
    listen 80;
    server_name example.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 8.2 Basic Reverse Proxy

```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8.3 Load Balancing

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://backend;
    }
}
```

### 8.4 SSL Configuration

```nginx
server {
    listen 443 ssl;
    server_name example.com;
    
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
        root /var/www/html;
        index index.html;
    }
}
```

---

## 9. Getting Started Tutorial

Let's create a simple website using Nginx:

### 9.1 Create a Basic HTML Page

Create a directory for your website and add an index.html file:

```bash
mkdir -p ~/my-website
echo '<html><body><h1>Hello from Nginx!</h1><p>My first Nginx page</p></body></html>' > ~/my-website/index.html
```

### 9.2 Configure Nginx

Create a new server block configuration:

```bash
# For Ubuntu/Debian systems
sudo nano /etc/nginx/sites-available/my-website
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /home/yourusername/my-website;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable the configuration by creating a symbolic link:

```bash
# For Ubuntu/Debian systems
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/
```

### 9.3 Test and Reload

Test your configuration:

```bash
sudo nginx -t
```

If the test is successful, reload Nginx:

```bash
sudo systemctl reload nginx
```

### 9.4 Access Your Website

Open a web browser and navigate to http://localhost to see your website.

---

## 10. Security Best Practices

### 10.1 Hide Nginx Version

```nginx
http {
    server_tokens off;
}
```

### 10.2 Enable HTTPS and Configure SSL Properly

```nginx
server {
    listen 443 ssl;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
}
```

### 10.3 Add Security Headers

```nginx
location / {
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

---

## 11. Troubleshooting

### 11.1 Checking Error Logs

```bash
sudo tail -f /var/log/nginx/error.log
```

### 11.2 Checking Access Logs

```bash
sudo tail -f /var/log/nginx/access.log
```

### 11.3 Common Issues

| Issue | Possible Solution |
|-------|-------------------|
| 403 Forbidden | Check file permissions; Nginx worker must have read access |
| 502 Bad Gateway | Upstream server is unreachable or returning errors |
| Connection refused | Check if Nginx is running and listening on the correct port |
| Configuration errors | Run `nginx -t` to test configuration for syntax errors |

---

## 12. Advanced Topics to Explore

- HTTP/2 and HTTP/3 configuration
- WebSockets support
- Rate limiting and request throttling
- Content caching
- GeoIP module
- Dynamic modules
- Nginx Plus (commercial version) features

By mastering these Nginx basics, you'll be well-equipped to host websites, set up reverse proxies, and implement load balancing for your applications.