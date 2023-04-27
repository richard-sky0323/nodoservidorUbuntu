const Consul = require('consul');
const express = require('express');
const fs = require('fs');

const SERVICE_NAME='mymicroservice';
const SERVICE_ID='m'+process.argv[2];
const SCHEME='http';
const HOST='192.168.100.3';
const PORT=process.argv[2]*1;
const PID = process.pid;

/* Inicializacion del server */
const app = express();
const consul = new Consul();
const html = `<!DOCTYPE html>
            <html>
            <head>
                <title>My Website</title>
            </head>
            <body>
                <h1>Hello from web1</h1>
                <p>Welcome to my website!</p>
            </body>
            </html>`;

app.get('/health', function (req, res) {
    console.log('Health check!');
    res.end( "Ok." );
    });

app.get('/', (req, res) => {
  console.log('GET /', Date.now());
  fs.readFile('index.html', function (err, data) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
  });
});

app.listen(PORT, function () {
    console.log('Servicio iniciado en:'+SCHEME+'://'+HOST+':'+PORT+'!');
    });

/* Registro del servicio */
var check = {
  id: SERVICE_ID,
  name: SERVICE_NAME,
  address: HOST,
  port: PORT,
  check: {
           http: SCHEME+'://'+HOST+':'+PORT+'/health',
           ttl: '5s',
           interval: '5s',
     timeout: '5s',
     deregistercriticalserviceafter: '1m'
           }
  };

consul.agent.service.register(check, function(err) {
        if (err) throw err;
        });
