const express = require('express');
const dotenv = require('dotenv');
const session =  require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

//route imports
const authRouter = require('./routes/authRoutes');

const csrfProtection = csrf({ cookie: {
    maxAge: 24 * 60 * 60,
} });

dotenv.config();
const app = express();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(res => {
        console.log('mongodb connected!');
    })
    .catch(err => {
        console.log(err);
    })

const store = new MongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});

//app configs
app.use(session({
    secret: 'xoxogoat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    store: store,
}));

app.use(cors({
    methods: 'GET,POST,HEAD,PUT,PATCH,DELETE',
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true,
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//csrf protection
app.use(csrfProtection);

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ msg: 'Invalid CSRF token' });
    } else {
        next(err);
    }
});

app.get('/api/csrf-token', (req, res) => {
    console.log(req);
    res.json({ csrfToken: req.csrfToken() });
});

app.get('/check-auth', (req, res) => {
    if(!req.session.userId) {
        return res.status(401).json({ auth: false });
    }
    
    res.status(200).json({ auth: true, userId: req.session.userId });
})

app.use('/auth', authRouter);

app.listen(4000, () => {
    console.log('Server listening on port 4000...');
})