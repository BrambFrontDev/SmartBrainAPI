const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

// Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


// Viene istanziato un'istanza di Knex per interagire con il database PostgreSQL. 
// La configurazione include i dettagli di connessione al database come host, porta, 
// nome utente, password e nome del database.
const db = knex({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB,
    },
});

//Viene creato un'istanza di un'app Express.
//Root
const app = express();


//analizza il corpo della richiesta HTTP, che potrebbe contenere dati in formato JSON,
//e li trasforma in oggetti JavaScript che possono essere manipolati all'interno dell'applicazione Node.js.
app.use(bodyParser.json());

// Il middleware CORS gestisce le intestazioni CORS nelle risposte del server, 
// consentendo al client di accedere alle risorse del server 
// da una diversa origine senza incorrere in problemi di sicurezza del browser.
app.use(cors());


// Definiamo ogni route per ogni richiesta, req: richiesta HTTP in arrivo dal client al server
// res: risposta HTTP che il server invia al client in risposta alla richiesta.
// db: database, bcrypt per la cittografia passwords.
app.get('/', (req, res) => { res.send('it is working') })

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on ${process.env.PORT}`)
})