// Crear el servidor
const express = require('express');
const App = express();

// CORS
const CORS = require('cors');
App.use(CORS());

// Variables de entorno
require('dotenv').config();

// Utilizar JSON en la API
App.use(express.json());

// Ruta inicial o de bienvenida
App.get('/', (req, res) => {
    res.send("HOLA MUNDO");
})

// Routes
App.use(require('./Routes/Users.controller'));
App.use(require('./Routes/BibliographicMaterial.controller'));
App.use(require('./Routes/Communities.controller'));
App.use(require('./Routes/Events.controller'));
App.use(require('./Routes/Exchange.controller'));
App.use(require('./Routes/Members.controller'));
App.use(require('./Routes/Message.controller'));
App.use(require('./Routes/Posts.controller'));
App.use(require('./Routes/SelectedBook.controller'));

// Puerto a escuchar
App.listen( process.env.PORT || 3000 ,() => {
    console.log("Servidor corriendo en el puerto: " + process.env.PORT || 3000);
})