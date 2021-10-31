const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const cool = require('cool-ascii-faces');
require('./db');

// Import APIs
const users = require('./routes/api/users');
const contacts = require('./routes/api/contacts');
const albums = require('./routes/api/albums');
const likes = require('./routes/api/likes');
const photos = require('./routes/api/photos');
const visits = require('./routes/api/visits');
const comments = require('./routes/api/comments');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'capacitor://192.168.114.12',
    'ionic://192.168.114.12',
    'http://192.168.114.12',
    'capacitor://192.168.114.12',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://192.168.114.12:8100',
    'http://192.168.114.14:8100',
    'http://192.168.114.14:8200',
    'http://192.168.114.14:8101',
    'http://192.168.114.12:8101',
  ];
  
  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  }
  
  // Enable preflight requests for all routes
app.options('*', cors(corsOptions));

// app.use(cors(corsOpts));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  extended: true }));
app.use(morgan('dev'));

// Use APIs (combination)
app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello World'});
});
app.use('/api/users', cors(corsOptions), users);
app.use('/api/contacts', cors(corsOptions), contacts);
app.use('/api/albums', cors(corsOptions), albums);
app.use('/api/likes', cors(corsOptions), likes);
app.use('/api/photos', cors(corsOptions), photos);
app.use('/api/visits', cors(corsOptions), visits);
app.use('/api/comments', cors(corsOptions), comments);

app.get('/cool', (req, res) => res.status(200).json({message: 'Cool'}));
// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});