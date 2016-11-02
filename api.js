var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()
var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var secret = 'banq';

server.use(middlewares)

/* check all routes except for login for a token */
server.use(expressjwt({ secret: secret}).unless({path: ['/login']}));

server.post('/login', function(req, res, next) {
    if(!req.body.emailaddress || !req.body.password) {
        return res.send(400);
    }

    var user = router.db
        .get('users')
        .find({"emailaddress": req.body.emailaddress, "password": req.body.password})
        .value();

    if(!user) {
        return res.sendStatus(401, "Could not find a user with the given emailaddress and password.");
    }

    delete user.password;

    var token = jwt.sign(user, secret, { expiresIn: 60 * 60 });

    return res.send({token: token});
});

/* do extra check to not access other user's details */
server.get('/users/:id', function(req, res, next) {
    if(!req.user || req.user.id != req.params.id) {
        return res.sendStatus(401);
    }
    return next();
});

/* fix account data when a new transaction is added */
server.post('/transactions', function(req, res, next) {
    if(!req.body.fromAccount && !req.body.toAccount) {
        return res.sendStatus(400);
    }

    if(req.body.fromAccount != req.user.id && req.body.toAccount != req.user.id) {
        return res.sendStatus(401);
    }
    var amountToTransfer = req.body.amount;

    var from = router.db
        .get('accounts')
        .find({"id": req.body.fromAccount})
        .value();
    var fromBalance = from.balance;

    var to = router.db
        .get('accounts')
        .find({"id": req.body.toAccount})
        .value();

    var toBalance = to.balance;

    if(!toBalance && !fromBalance) {
        return res.sendStatus(400);
    }

    var fromAccount = router.db
        .get('accounts')
        .find({"id": req.body.fromAccount})
        .assign({ "balance": toBalance + amountToTransfer}).value();

    var toAccount = router.db
        .get('accounts')
        .find({"id": req.body.toAccount})
        .assign({ "balance": fromBalance - amountToTransfer}).value();

    console.log(fromAccount, toAccount);

    return next();
});

server.use(router);
server.listen(3000, function () {
  console.log('JSON Server is running on port 3000')
})
