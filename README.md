# API Caching reference-implementation

By Peter Banka | August 1 2017 | Performance

## Overview

There was a [great series of
articles](https://www.fastly.com/blog/api-caching-part-iii) by [Ryan
Richards](https://www.fastly.com/blog/ryan-richards) on how to set up API
caching on your RESTful web service. In this article, we hope to take you
through the process of actually implementing this step by step on an example
single-page web application.

Click the image below to see the overview video:
[![Video introduction](https://img.youtube.com/vi/qB-avDWUc5g/0.jpg)](https://www.youtube.com/watch?v=qB-avDWUc5g)

### Background

If you're like me, you're a web developer that is used to thinking about a web
application as existing in two discrete pieces: the web server and the web
browser. The job of the server is two-fold: to provide access to static content such as
JavaScript files and CSS and some HTML, and, if you're writing single-page
applications, the server also provides a programming interface such as REST
or GraphQL. The job of the client is to put graphic elements on the screen,
accept user input and to interact with the server over the network to get and
modify.

If you're a more advanced web developer, you may know that using your server
alone to deliver all your static content such as JavaScript and CSS and static
HTML is much less efficient than delivering that content through a CDN. CDNs
such as Fastly allow you to deliver that content from the edge of the Internet
closer to your users so that your site can come online as fast as possible and
keep your users from waiting.   

CDNs are great and necessary for static content, but what about the dynamic
content - those RESTful APIs that the modern web is built on? Did you know that
you can leverage Fastly's network to greatly increase the speed and
responsiveness of your API? This requires your server to actively participate in
the cacheing process and it requires you as a developer to start thinking about
the cache as a new tier in your application: your platform now as three pieces
instead of two: client, cache, and server. This might add a small amount of
complexity to your application, but taking this approach will vastly increase
the speed and global reach of any application that you're writing.   

### This project

This project seeks to show you how to use the Fastly network to greatly
accelerate your server API by showing you how to have your server
programatically interact with the Fastly cache to make a highly performant and
secure API.

We are starting with a simple web app (this one)[URL for tag], which we will be
putting behind a Fastly cache. The nature of this app is quite simple: we have a
bunch of users in a database and we want to display that list of user and allow
editing. Each user has basic textual information as well as an avatar stored in
the database. Part of the goal here is to push enough data into the database so
that the REST API call being made has some substance which the cache can take
advantage of.

### Prerequisites

If you're following along at home, you'll need the following:

1. A server that can be accessed via the Internet that you can run
   [node.js](https://nodejs.org/en/) and mysql on. I recommend getting an account on [Digital Ocean](https://www.digitalocean.com/), as these are extremely predictable and usable machines. If you're going to perform a build of the client-side code on a Digital Ocean droplet, then you'll need at least 1GB RAM. Otherwise, if you build and ship the code up to the server, you can get away with 512MB.

1. Ownership of a domain name that you can manipulate the IP address of.

1. A free Fastly account.

1. You should also have a working understanding how how to use a linux server,
   edit files, install software, and run commands on a terminal.

## Server setup

Your sever will need to be set up with MySQL and Node. You will also need the
imagemagick libraries installed. This tutorial will assume that you're running
on a GNU/Linux server of some kind, but should work for a Mac or Windows machine
as well (but I haven't tested it on Windows).

On an Ubuntu Trusty machine, you'll do the following to set up:

```
apt-get update
apt-get install -y mysql-server nginx imagemagick
```

1. Clone down this project onto your server

`git clone https://github.com/psbanka/fastly-node-rest-demo.git`

2. Create a database user and a database in mysql for this project, such
as:

```
mysql> CREATE USER 'beaker'@'localhost' IDENTIFIED BY 'beakerpass';
Query OK, 0 rows affected (0.00 sec)

mysql> create database beaker;
Query OK, 1 row affected (0.00 sec)

mysql> GRANT ALL PRIVILEGES ON beaker . * TO 'beaker'@'localhost';
Query OK, 0 rows affected (0.00 sec)
```

3. Put the credentials for that user in a `.env` file in the root directory. An
   empty `.env` file is part of this project, and a filled out one will look
   something like this:

```
DB_HOST='localhost'
DB_USER='beaker'
DB_PASSWORD='beakerpass'
DB_NAME='beaker'
```

4. Install Node on your system. I recommend using a version manager such as
[nvm](https://github.com/creationix/nvm). This tutorial has been tested on the latest version of Node LTS, which at the time of this writing was `6.11.1`.

5. Install the `yarn` package dependency installation system using `npm install -g yarn`

6. Install the server dependencies by running `yarn run setup`.


## Setting up the basic server without a proxy

This application shows a simple set of users with avatars and allows them to be edited.

Let's first set up the application and take a look at how it works when it's
simply running by itself without the use of Fastly to accelerate the content in
front of it.

### Initialize the data

First, we want to seed the database. We use the wonderful
[Faker](https://github.com/Marak/Faker.js) library to help us generate a bunch
of random data, and we use the
[avatar-generator](https://github.com/arusanov/avatar-generator) module to
create initial avatar images for our users (which will provide something of
substance to download from our API. You'll need to run the `makedb.js` script
first to initialize the database as follows:

```
node makedb.sh 100
```
you should see some output like the following:

```
Connected to mysql
Creating 100 records...
done Lowe
done D'Amore
done Batz
done Keebler
done Gerhold
done Larkin
done Kovacek
done Kovacek
done Gleason
...
done
```

### Set up nginx

You'll want to run node on an unprivileged port (such as 3333) so that it can
be run as a non-root user (which limits the amount of damage that can be done
to your server if the process is compromised). You'll then need a hardened process
such as [nginx](https://nginx.org/en/) to run on port 80 to pass traffic to it. Your
nginx config file (i.e. `/etc/nginx/nginx.conf`) might look something like this:

```
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    server {
        listen       80;
        server_name  localhost;

        location / {
            proxy_pass http://localhost:3333;
        }

    }
}
```

Once nginx is configured, restart it with `service nginx restart`

### Run the node server process

Finally, we're going to set up our node server to deliver both front-end and
backend content. In our project, we have put the frontend code (a simple React
app) in the `beaker-frontend` directory and the backend is served by node using
the express platform by running the `index.js` file. To get the basic system
installed and running on your system, run the following:

`yarn run setup`

`yarn start`

### Test it with your browser

You're ready to test! Point your browser at the IP address of your server. You should see something like the following:

![Running system](https://s3.amazonaws.com/f.cl.ly/items/3g2c0X0W0x35403r0i2w/Screen%20Recording%202017-08-01%20at%2007.16%20AM.gif?AWSAccessKeyId=AKIAJEFUZRCWSLB2QA5Q&Expires=1501636303&Signature=B7%2F9OtrntK%2BDtZJSVHoPjlRu5iI%3D)

# Putting your service behind Fastly

Congratulations. You have set up the three parts of single-page web application: database, server, and client. Now it's time to see what happens when we accelerate the application using Fastly. To do this, you'll need a domain-name registered that you can point to Fastly's servers.

## Create a fastly account and put your service behind it

Go to [Fastly](https://manage.fastly.com/authentication/sign-in) and sign up for a free account. Create a new service, and use the IP address of your new server that you set up with this test application. For this exercise, it is not necessary to use TLS.

Finally, you'll need to to go to your DNS provider and create a CNAME record for your www service and point it to Fastly's non-ssl service, as shown here:

![Setting up CNAME](https://s3.amazonaws.com/f.cl.ly/items/3F1v312C1l0m0F072P1w/Image%202017-08-01%20at%203.54.01%20PM.public.2v1o0p0U0z2W.png)

## Test it with and without Fastly
Once all this is set up and the DNS records have converged, you can compare and contrast your new web application with and without the Fastly service. If you go directly to the IP address of your server as you did in the previous step, you'll see how the application performs without the CDN cache in front of it (in my case, http://138.68.63.121). If you point your browser to the www name for your domain, you can see how it performs with Fastly in front of it (e.g. http://www.cheezygoodness.com).

The most important piece of this testing is to try editing content and then refresh the page. If you look at the headers associated with the page, you'll see that there is an `X-Cache:HIT` or `X-Cache:MISS` header associated with each request when it is being delivered by Fastly.

Furthermore, you're going to see that if you edit content on the page, you'll notice that when you refresh the page that you will see OLD data and not the newest data. So we can see that we are getting the benefits of Fastly caching the content of our REST API, but we need a way for the server to tell Fastly that cache is invalid once the data has been changed.

# Add active server-side cache control

The final step of this article will be to make the server a more active participant of the cacheing process. To make this happen, the server has got to be able to communicate with the fastly API directly when its data changes. Specifically, it will need two different pieces of information: the service-id that your service is associated with and a secure API token that your server uses.

## Service ID

The service-id of your service can be found under the tile of your service in the Fastly dashboard:

![Show Service ID](https://s3.amazonaws.com/f.cl.ly/items/0Z1m2K0e1K2b1l1G1R2S/Image%202017-08-01%20at%204.19.20%20PM.public.3u0o1X3M2339.png?AWSAccessKeyId=AKIAJEFUZRCWSLB2QA5Q&Expires=1501636152&Signature=Cx3eT5thYDiGiO3%2Fl%2FeR%2F17TB28%3D)

## Fastly API token

Generate a Fastly API token by going to the accounts page
![Accounts Page](https://s3.amazonaws.com/f.cl.ly/items/2l1w0L2p0E3g1u263k1e/Image%202017-08-01%20at%204.30.04%20PM.public.0L2L0c2p2o1y.png?AWSAccessKeyId=AKIAJEFUZRCWSLB2QA5Q&Expires=1501636212&Signature=aEJ7Kp20foxiid1priT8WRM%2BOio%3D)

And then click on Create token:
![Create Token](https://s3.amazonaws.com/f.cl.ly/items/1A3G0l172y0s3D1j0v3Q/Image%202017-08-01%20at%204.33.09%20PM.public.1m1G1Y0K1I3E.png?AWSAccessKeyId=AKIAJEFUZRCWSLB2QA5Q&Expires=1501636245&Signature=jjr2j7eLDWECWkeQzPvtYCyXPqU%3D)

Choose a specific service and select "Purge full cache" and "Purge select content" for properties of the token. When you finish creating the token, copy the token key and put it into the `.env` file (in addition to your service ID), as follows:

```
DB_HOST='localhost'
DB_USER='beaker'
DB_PASSWORD='beakerpass'
DB_NAME='beaker'
NODE_PORT=3333
FASTLY_KEY="10778ea9b00182dde388a1c2f8269f08"
SERVICE_ID="4IExUZplpxpu2olu1ag982"
```

Now, when you restart your server process (using `yarn stop` and `yarn start`), you will see that your server-side process now performs proper cache purging so that when you change a value on the page and then refresh the page, you can see that the data on the page does refresh (with a corresponding `X-CACHE: MISS`). However subsequent refreshes will register `X-CACHE: HIT`.
