const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');
const quizModel = mongoose.model('quiz');
var router = express.Router();

var quizfunctions = require('./quizFunctions.js');
var userfunctions = require('./userfunctions.js');


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
                return res.status(403).send("error: " + error);
            } else {
                req.logIn(username, function (error) {
                    if (error) {
                        return res.status(500).send(error);
                    }

                    var u = userfunctions.findOneUser(req.body.username);
                    u.exec(function(err, docs) {
                        if (err) {
                            res.status(403).send("Error");
                        } else {
                            res.status(200).send(docs);
                        }
                    });
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

router.get('/toplist', function(req, res) {
    if(req.isAuthenticated()) {
        var list = userfunctions.rankingUsers();
        list.exec(function(err, docs) {
            if (err) {
                res.status(403).send("List not found");
            } else {
                res.status(200).send(docs);
            }
        });
    } else {
        res.status(403).send("No toplist");
    }
});

router.post('/newquiz', function(req, res) {
    if (req.isAuthenticated() && req.session.passport.user.admin) {
        // TODO van-e id-ja a kvíznek?
        quizfunctions.addNewQuiz(req.body.id,req.body.name, req.body.questions);
        res.status(200).send("Quiz added");
    } else {
        res.status(403).send("Couldn't add quiz, login first");
    }
});

router.get('/quiz', function(req, res) {
    if (req.isAuthenticated()) {
        console.log(req.query.id);
        var q = quizfunctions.findOneQuiz(req.query.id);
        q.exec(function(err, docs){
            if (err) {
                res.status(403).send("Quiz not found");
            } else {
                res.status(200).send(docs);
            }
        });
    } else {
        res.status(403).send("Couldn't get quiz, login first");
    }
});

router.get('/allquiz', function(req, res) {
    if (req.isAuthenticated()) {
        var q = quizfunctions.findAllQuiz();        
        q.exec(function(err, docs){
            if (err) {
                res.status(403).send("Quiz not found");
            } else {
                res.status(200).send(docs);
            }
        });
    } else {
        res.status(403).send("Couldn't get quiz, login first");
    }
});

router.post('/sendscore', function(req, res) {
    if (req.isAuthenticated()) {
        userfunctions.updateScore(req.body.username, req.body.score);
        res.status(200).send("updated!"); 
    } else {
        res.status(403).send("Login first"); 
    }
});

router.post('/deletequiz', function(req, res) {
    if (req.isAuthenticated() && req.session.passport.user.admin) {
        quizfunctions.deleteQuiz(req.body.id).exec((err, res) => {
            console.debug("Deleted " + res.ok + " / " + res.n + " quiz(zes).");
        });
        res.status(200).send("deleted succesfully");
    } else {
        res.status(403).send("Couldn't delete quiz");
    }
});

/*
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
*/

module.exports = router;