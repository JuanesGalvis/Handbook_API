// Crear el servidor
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const App = express();

// Socket.io
const { Server } = require('socket.io');
const HTTP = require('http');

// CORS
const CORS = require('cors');

let optionsRoutesCORS = {
    origin: function (origin, callback) {
if (origin === "http://localhost:3000" || origin === "http://localhost:3001") {
        callback(null, true)
    } else {
        callback("ERROR DE CORS - NO VIENES DEL ORIGEN PERMITIDO")
    }}
};

// Variables de entorno
require('dotenv').config();

// Passport config
App.use(passport.initialize());
require('./middleware');

// Utilizar JSON en la API
App.use(express.json());

// Ruta inicial o de bienvenida
App.get('/', (req, res) => {
    res.send("📚 BIENVENIDO A HANDBOOK 📚");
})

// Routes
App.use(CORS(), require('./Routes/Users.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/BibliographicMaterial.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/Communities.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/Events.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/Exchange.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/Members.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/Message.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/Posts.controller'));
App.use(CORS(optionsRoutesCORS), require('./Routes/SelectedBook.controller'));
App.use(CORS(optionsRoutesCORS), require('./Middleware/Response'));

// Crear servidor http de node basado en el de express
const httpServer = HTTP.createServer(App);
// Conexión desde el servidor
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.use((socket, next) => {

    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.JWTPASSWORD, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = {
                ...decoded,
                exchange: socket.handshake.query.exchange
            };
            next();
        })
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {

    console.log("NUEVA CONEXIÓN");
    socket.join(socket.decoded.exchange);

    const Client = require('./Database/Message');
    const MessageClient = new Client();

    const ClientExchange = require('./Database/Exchange');
    const ExchangeClient = new ClientExchange();

    socket.on('getMessage', async () => {

        let Messages = await MessageClient.readMessages(socket.decoded.exchange)
        socket.emit('messages', Messages)

    })

    socket.on('sendMessage', async (message, exchange) => {

        const Exchange = await ExchangeClient.getExchange(exchange);

        let Destiny = '';

        if (Exchange[0].Id_User_One[0]._id.toString() === socket.decoded.sub) {
            Destiny = Exchange[0].Id_User_Two[0]._id.toString()
        } else {
            Destiny = Exchange[0].Id_User_One[0]._id.toString()
        }

        let newMessage = await MessageClient.createMessage(exchange, message, socket.decoded.sub, Destiny);
        let Messages = await MessageClient.readMessages(socket.decoded.exchange);

        io.to(socket.decoded.exchange).emit('messages', Messages)
    })

    socket.on("disconnect", () => {
        console.log("CONEXIÓN DESCONECTADA");
    });
});

// Puerto a escuchar
httpServer.listen(process.env.PORT || 3000, () => {
    console.log("Servidor corriendo en el puerto: " + process.env.PORT || 3000);
})