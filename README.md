
# API Caching reference-implementation

By Peter Banka | August 1 2017 | Performance

There was a [great series of articles](https://www.fastly.com/blog/api-caching-part-iii) by
[Ryan Richards](https://www.fastly.com/blog/ryan-richards) on how to set up API caching on your
RESTful web service. In this article, we hope to take you through the process of actually implementing
this.

## Overview

If you're like me, before I started working at Fastly, you're a web developer
that is used to thinking about a web application as existing in two discrete
pieces: the web server and the web browser. The job of the server is to provide
access to static content such as JavaScript files and CSS and some HTML. If you're
writing single-page applications, then the server also provides a programming interface
such as REST or GraphQL. The job of the client is to put graphic elements on the screen,
accept user input and to interact with the server over the network to get and send data.

If you're a more advanced web developer, you may have heard of and used a CDN (Content
Delivery Network) such as Fastly to cache some of your content. For example, you may realize
that using your server to cache all your static content such as JavaScript and CSS and static
HTML is typically quite inefficient and slow, especially if your application has a global
reach. Far better to leverage a CDN to cache that content out toward the edge of the Internet
closer to their users so that your site can come online as fast as possible and the user
is not kept waiting.

CDNs are great and necessary for static content, but what about the programming interface itself?
Did you know that you can leverage Fastly's network to greatly increase the speed and responsiveness
of your API? This requires your server to actively participate in the cacheing process and it
requires you as a developer to start thinking about the cache as a new tier in your application.
No longer is it client and server, but client, cache, and server. This might add a small amount
of complexity to your application, but taking this approach will vastly increase the speed and
global reach of any application that you're writing.

This project seeks to show you how to use the Fastly network to greatly accelerate your server API
by showing you how to have your server programatically interact with the Fastly cache to make a
highly performant and secure API.

We are starting with a simple web app (this one)[URL for tag], which we will be putting behind a Fastly
cache. The nature of this app is quite simple: we have a bunch of users in a database and we want to display
that list of user and allow editing. Each user has basic textual information as well as an avatar stored in
the database. Part of the goal here is to push enough data into the database so that the REST API call being
made has some substance which the cache can take advantage of.

### Prerequisites

If you're going to follow along at home, you're going to need the following:

1. A server that can be accessed via the Internet that you can run
   (node.js)[https://nodejs.org/en/] and mysql on.

1. Ownership of a domain name that you can manipulate the IP address of.

1. A free Fastly account

1. You should also have a working understanding how how to use a linux server,
   edit files, install software, and run commands on a terminal.

### Server setup

Your sever will need to be set up with MySQL and Node. This tutorial will
assume that you're running on a GNU/Linux server of some kind, but should work
for a Mac or Windows machine as well (but I haven't tested it on Windows). 

1. Clone down this project onto your server

`git clone https://github.com/psbanka/fastly-node-rest-demo.git`

2. Install MySQL using whatever package manager comes on your system and start it up.
You'll need to create a database user and a database in mysql for this project, such
as:

```
mysql> CREATE USER 'beaker'@'localhost' IDENTIFIED BY 'beakerpass';
Query OK, 0 rows affected (0.00 sec)

mysql> GRANT ALL PRIVILEGES ON * . * TO 'beaker'@'localhost';
Query OK, 0 rows affected (0.00 sec)

mysql> create database beaker;
Query OK, 1 row affected (0.00 sec)
```

3. Put the credentials for that user in a `.env` file in the root directory. An empty `.env` file
is part of this project, and a filled out one will look something like this:

```
DB_HOST='localhost'
DB_USER='beaker'
DB_PASSWORD='beakerpass'
DB_NAME='beaker'
```

4. Install Node on your system. I recommend using a version manager such as
(nvm)[https://github.com/creationix/nvm].

5. Install the server dependencies by running `npm run setup`.


## Setting up the basic server without a proxy

Let's first set up the applicationb and take a look at how the application
looks when it's simply running by itself without the use of Fastly to
accellerate the content in front of it.

### Initialize the data

First, we want to seed the database. We use the wonderful (Faker)[https://github.com/Marak/Faker.js] 
library to help us generate a bunch of random data, and we use the (avatar-generator)[https://github.com/arusanov/avatar-generator]
module to create initial avatar images for our users (which will provide something of substance to download
from our API. You'll need to run the `makedb.js` command first to initialize the database. To do this, you'll need to
set up your pre-requisites, and then run the following command:

```
node makedb.sh
```
you should see some output like the following:

```
Connected to mysql
done Lowe
done D'Amore
done Batz
done Keebler
done Gerhold
done Larkin
done Kovacek
done Kovacek
done Gleason
done Lemke
done Friesen
done Runolfsson
done Predovic
done Dooley
done Quigley
done Kuphal
done D'Amore
done Kohler
done Bergstrom
done Windler
done
```

### Set up nginx

You'll want to run node on an unprivileged port (such as 3333) so that it can
be run as a non-root user (which limits the amount of damage that can be done
to your server if the process is compromised). You'll then need a hardened process
such as (nginx)[https://nginx.org/en/] to run on port 80 to pass traffic to it. Your
nginx config file might look something like this:

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

### Run the node server process
 
Next, we're going to set up our node server to deliver both front-end and backend
content. We will also be setting up the node server to deliver an API and to serve the
built javascript content of our website. In our project, we have put the
frontend code in the `beaker-frontend` directory and the backend is served by
node using the express platform. To get the basic system installed and running
on your system, run the following:

`npm run setup`

`npm start`

TALK ABOUT HOW THE APP WORKS< TAKE SOME SCREEN-CAPS

## Putting things behind Fastly

TALK ABOUT SETUP PROCESS

SHOW HOW THE CACHE GETS ALL SCREWED UP

## Add active server-side cache control
