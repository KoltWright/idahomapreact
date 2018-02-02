const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const massive = require('massive');
const path = require('path');
require('dotenv').config();

const Auth0Strategy = require('passport-auth0');
const config = require('./config.js');
const { domain, clientID, clientSecret } = config;

// const auth_controllers = require('./controllers/auth_controllers.js');

const app = express();
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '..', 'build')));

massive(process.env.CONNECTION_STRING)
  .then(dbInstance => {
    app.set('db', dbInstance);
  })

app.use(
  session({
    secret: "Authorized",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Auth0Strategy({
   domain:       domain,
   clientID:     clientID,
   clientSecret: clientSecret,
   callbackURL:  '/api/auth/login',
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    const dbInstance = app.get('db');
    const auth_id = profile.identities[0].user_id;

    dbInstance.auth_select_user({auth_id})
      .then(user => {
        if(user.length > 0) {
          return done(null, {id: user[0].id});
        } else {
          dbInstance.auth_create_user({auth_id})
            .then(newUser => {
              return done(null, {id: newUser[0].id});
            })
        }
      })
  }
));

passport.serializeUser(function(user, done) {
  done(null, {id: user.id})
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/api/auth/login', passport.authenticate('auth0',
    {successRedirect: 'http://localhost:3000', failureRedirect: 'http://localhost:3000/auth/', failureFlash: true})
);

// app.get('/api/auth/setUser', auth_controllers.setUser);

const port = 3001;
app.listen(port, () => {
  console.log(`I am listening on port ${port}`);
});
