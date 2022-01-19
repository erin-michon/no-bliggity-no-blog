const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');

const exphbs = require('express-handlebars');

const session = require('express-session');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

//Review session secret - store in dotenv
const sess = {
  secret: 'Super duper secret',
  cookie: {
    // Session will automatically expire in 10 minutes
    expires: 10 * 60 * 1000
},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

// turn on connection to database and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});