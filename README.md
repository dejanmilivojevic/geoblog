Geoblog
=======

### Install instructions:

First install node, couchdb.

Install kanso. Kanso requires node 0.10

```shell
npm install -g kanso
```

```shell
kanso push http://localhost:5984/location
```

then go to main page:
[http://localhost:5984/location/_design/location-app/index.html](http://localhost:5984/location/_design/location-app/index.html)

or this page to post:
[http://localhost:5984/location/_design/location-app/post.html](http://localhost:5984/location/_design/location-app/post.html)
