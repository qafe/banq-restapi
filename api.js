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


server.use(router);
server.listen(3000, function () {
  console.log('JSON Server is running on port 3000')
})
