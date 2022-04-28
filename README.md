# p5-place
This is inspired by the reddit game called place.
This repo is for the client side of the solution. You will need a backend in order to make it work.
##

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### env file
```
VUE_APP_WEBSOCKET_KEY='websocket-unique-key'
VUE_APP_WEBSOCKET_SERVER='ip.of.websocket.server'
```


#### notes for pi server:

```
cp -r ./dist/* /var/www/html
```
or 
```
npm run move
```

when running build on pi run this first
```
export NODE_OPTIONS=--openssl-legacy-provider
```