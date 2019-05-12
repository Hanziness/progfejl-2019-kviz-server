const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const quizModel = mongoose.model('quiz');
var router = express.Router();

router.post('/register', function(req, res) {
    if(!req.body.username || !req.body.password) {
        return res.status(404).send("username or password missing");
    } else {
        var user = new userModel({username: req.body.username, 
            password: req.body.password, admin: false, pontszam: 0});
        user.save(function(error) {
            if(error) return res.status(500).send("db error");
            return res.status(200).send("registration success");
        })
    }
});

router.post('/login', function (req, res) {
    if (req.body.username && req.body.password) {
        passport.authenticate('local', function (error, username) {
            if (error) {
                return res.status(403).send(error);
            } else {
                req.logIn(username, function (error) {
                    if (error) return res.status(500).send(error);
                    return res.status(200).send("login successful");
                })
            }
        })(req, res);
    } else {
        return res.status(403).send("username and password required");
    }
});

router.post('/logout', function(req, res) {
    if(req.isAuthenticated()) {
        req.logout();
        res.status(200).send("You have been logged out");
    } else {
        res.status(403).send("You have to log in first");
    }
});

router.post('/toplist', function(req, res) {
    if(req.isAuthenticated()) {
        res.status(200).send(userModel.rankingUsers());
    } else {
        res.status(403).send("No toplist");
    }
});

router.post('/newquiz', function(req, res) {
    if (req.isAuthenticated() && req.session.passport.user.admin) {
        quizModel.addNewQuiz(req.body.name, req.body.questions);
        res.status(200).send("Quiz added");
    } else {
        res.status(403).send("Couldn't add quiz");
    }
});

router.post('/quiz', function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).send(quizModel.findQuiz(req.body.name, null));
    } else {
        res.status(403).send("Couldn't get quiz");
    }
});

router.post('/deletequiz', function(req, res) {
    if (req.isAuthenticated() && res.session.passport.user.admin) {
        quizModel.deleteQuiz(req.body.name, () => {
            res.status(200).send("deleted succesfully");
        });
    } else {
        res.status(403).send("Couldn't delete quiz");
    }
});










// Ezek nem is kellenek?

router.get('/', function(req, res) {
    console.log("Query parameterek", req.query);
    console.log(req.session.passport.user);
    if(req.isAuthenticated()) {
        return res.status(200).send("Hello World");
    } else {
        return res.status(403).send("You are not welcome here");
    }
});

router.get('/users', function(req, res) {
    if(req.isAuthenticated() && req.session.passport.user.username === "admin") {
        userModel.find({}, function(err, users) {
            return res.status(200).send(users);
        })
    } else {
        return res.status(403).send("Unauthorized access");
    }
})

module.exports = router;