require('./config/config');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const hbs = require("hbs");
var indexRouter = require('./routes/index');
var mongoose = require("./db/mongoose");
const port = process.env.PORT;
var app = express();


app.set('view engine', 'hbs');
hbs.registerPartials(__dirname+"/views/partials");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});
module.exports = app;
