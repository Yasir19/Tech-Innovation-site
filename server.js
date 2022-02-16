const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const session = require('express-session');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3001;

const sequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: process.env.secret,
    cookie:{},
    resave:false,
    saveUninitialized: true,
    store: new sequelizeStore({
        db:sequelize
    })
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(sess));
app.use(routes);

//need the routes file 
app.use(require('./controllers'))

sequelize.sync({force:false}).then(() => {
    app.listen(PORT, () => console.log (`App listening at http://localhost:${PORT} 🚀`));
});