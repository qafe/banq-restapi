var jsonServer = require('json-server')
var server = jsonServer.create()
var router = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()
var jwt = require('jsonwebtoken');

var secret = 'banq';

server.use(middlewares)

/* check all routes except for login for a token */
// server.use(expressjwt({ "secret": secret}).unless({path: ['/login']}));
server.use('*', function(req, res, next) {
   if ( req.originalUrl == '/login') return next();

   var tokenHeader = req.headers.authorization

   if(!tokenHeader) {
     res.send(400, 'Please specify authorization header.');
   }
   var token = tokenHeader.substring(7, tokenHeader.length);

   if(!token) {
     return res.send(401);
   }

   jwt.verify(token, secret, function(err, decoded) {
     if(err) {
       return res.send(400, err);
     }
      req.userId = decoded.sub;
      next();
   });
});

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

    // delete user.password;

    var payload = {};
    payload.sub = user.id;

    var token = jwt.sign(payload , secret, { expiresIn: 60 * 60 });

    return res.send({"token": token});
});

server.post('*', function(req, res, next) {
    var path = req.originalUrl;

    if ( path == '/login') return next();

    var resource = path.substring(1, path.length);

    var address = router.db
        .get(resource)
        .maxBy('id')
        .value();

        console.log(address.id);

    req.body.id = address.id + 1;

    next();
});

server.post(/^\/(accounts|addressess)/, function(req, res, next) {
    req.body.userId = req.userId;
    next();
});

/* do extra check to not access other user's details */
server.get('/users/:id', function(req, res, next) {
    if(!req.userId != req.params.id) {
        return res.sendStatus(401);
    }
    return next();
});

router.render = function (req, res) {
  var userSpecificPaths = ['/accounts', '/addressess'];
  if( userSpecificPaths.indexOf(req.originalUrl) > -1) {
      var data = res.locals.data;

      if (Array.isArray(data)) {
        var accounts = data.filter(function(account) {
          return account.userId == req.userId;
        });
        res.jsonp(accounts);
      } else if (data.userId == req.userId) {
        res.jsonp(data);
      }

      res.jsonp();
  }

  res.jsonp(res.locals.data);
}

/* fix account data when a new transaction is added */
server.post('/transactions', function(req, res, next) {
    if(!req.body.fromAccount && !req.body.toAccount) {
        return res.sendStatus(400);
    }

    var accounts = router.db
      .get('accounts')
      .filter({"userId": req.userId})
      .value();

    accounts = Array.isArray(accounts) ? accounts : [accounts];

    var allowed = accounts.some(function(acc) {
       console.log(acc.id, req.body.fromAccount);
        return acc.id == req.body.fromAccount;
    });

    if(!allowed) {
        console.log('allowed');
        return res.sendStatus(403);
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
        .assign({ "balance": fromBalance - amountToTransfer}).value();

    var toAccount = router.db
        .get('accounts')
        .find({"id": req.body.toAccount})
        .assign({ "balance": toBalance + amountToTransfer}).value();

    console.log(fromAccount, toAccount);

    return next();
});

server.use(router);
server.listen(3000, function () {
  console.log('JSON Server is running on port 3000')
})
