import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'
import { Server } from 'socket.io'

import socketInit from './sockets/socket.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';
import usuarioRoute from './routes/usuarioRoute.js';
import salaRoute from './routes/salaRouter.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

const io = new Server(server);


socketInit(io);

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/usuarios', usuarioRoute);
app.use('/salas', salaRoute);

app.get('/', (req, res) => {
    res.send('<h1>Socket funcionando</h1>')
})

server.listen('5000', function () {
    console.log('backend em execução');
})