// Ez volt egy minimalista szerver Node.js-ben
/*const http = require("http");

http.createServer(function (req, res) {
    res.write('Hello World!');
    res.end();
}).listen(5000);*/

// innen jon az Express

// mongodb://user:<PASSWORD>@prf-example01-shard-00-00-

const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const cors = require('cors');

// docker run -d -p 27017:27017 -v $PWD/mongo:/etc/mongo --name mymongo mongo

const dbUrl = "mongodb+srv://ocean:man@cluster0-zqs1c.mongodb.net/test?retryWrites=true";

app.set('dbUrl', dbUrl);

require('./user.model');
require('./quizes.model');

const userModel = mongoose.model('user');
const quizModel = mongoose.model('quiz');


mongoose.connect(dbUrl, { useNewUrlParser: true });

mongoose.connection.on('connected', function() {
    console.log('db connected');
});

mongoose.connection.on('error', function(err) {
    console.log('db connection error');
    console.log(err);
});

passport.serializeUser(function(user, done) {
    if(!user) return done("serializalasi hiba", user);
    return done(null, user);
});

passport.deserializeUser(function(user, done) {
    if(!user) return done("serializalasi hiba", user);
    return done(null, user);
});

passport.use('local', 
    new localStrategy(function(username, password, done) {
        userModel.findOne({username: username}, function(err, user) {
            if(!user || err) return done("cannot get user", false);
            user.comparePasswords(password, function(err, isMatch) {
                if(err || !isMatch) return done("password incorrect", false);
                return done(null, user);
            });
        });
    }));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(expressSession({
    secret: '12354456462almajjimnhgiknb,',
    cookie: { httpOnly: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));
app.use('/proba', require('./routes'));

// process.env.DEBUG_QUIZ = true;


const xl = require('excel4node');

if (process.env.DEBUG_QUIZ) {
    console.log('exporting excel table...');

    var wb = new xl.Workbook();

    var style = wb.createStyle({
        font: {
          color: '#FFFFFF',
          size: 12,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    });


    quizes = quizModel.findAll();
    
    for (var i = 0; i < quizes.length; i++) {
        var actualQuiz = quizes[i];
        var name = actualQuiz.quiz_nev;
        var ws = wb.addWorksheet(name);

        for (var j = 0; j < actualQuiz.kerdesek.length; j++) {
            var currentQuestion = actualQuiz.kerdesek[i];
            ws.cell(i+1, 1).string(currentQuestion.leiras);
            
            var helyes = 0;
            var k;
            for (k = 0; k < valaszok.length; k++) {
                ws.cell(i+1, 1+k+1).string(currentQuestion.valaszok[k].nev);
                if (currentQuestion.valaszok[k].helyes) {
                    helyes = k;
                }
            }

            ws.cell(i+1, 1+k+1).string(helyes);

        }

    }

    wb.write('quizes.xlsx');

} else {
    app.listen(5000, function() {
        console.log('the server is running');
    });
}

