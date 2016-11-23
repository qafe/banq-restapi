var secret = 'banq';

var jsonServer = require('json-server'),
cors = require('cors'),
jwt = require('jsonwebtoken'),
server = jsonServer.create(),
router = jsonServer.router('db.json'),
middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(cors());

/* check all routes except for login for a token */
// server.use(expressjwt({ "secret": secret}).unless({path: ['/login']}));
server.use('*', function(req, res, next) {
  if (req.originalUrl == '/login' || req.originalUrl == '/login/') return next();

  var tokenHeader = req.headers.authorization

  if(!tokenHeader) {
    var error = {};
    error.message = 'Provide an Authorization header.';

    return res.status(401).header('WWW-Authenticate', 'Bearer').send(error);
  }

  var authenticationScheme = tokenHeader.substring(0, 7);
  var token = tokenHeader.substring(7, tokenHeader.length);

  if('Bearer ' != authenticationScheme || !token) {
    return sendErrorMessage(res, 'Invalid authentication scheme or token.', 403);
  }

  jwt.verify(token, secret, function(error, decoded) {
    if(error) {
      return sendErrorMessage(res, error.message, 403);
    }
    req.userId = decoded.sub;
    next();
  });
});

server.post('/login', function(req, res, next) {
  if(!req.body.emailaddress || !req.body.password) {
    return sendErrorMessage(res, 'The emailaddress or password is missing.');
  }

  var user = router.db
    .get('users')
    .find({"emailaddress": req.body.emailaddress, "password": req.body.password})
    .value();

  if(!user) {
    return sendErrorMessage(res, 'Could not find a user with the given emailaddress and password.', 403);
  }

  var payload = {};
  payload.sub = user.id;

  var token = jwt.sign(payload , secret, { expiresIn: 60 * 60 });

  return res.send({"token": token});
});

server.post('*', function(req, res, next) {
  var path = req.originalUrl;

  if ( path == '/login' || path == '/login/') return next();

  var endIndex = path.endsWith('/') ? path.length - 1 : path.length;
  var resource = path.substring(1, endIndex);

  var address = router.db
  .get(resource)
  .maxBy('id')
  .value();

  req.body.id = address.id + 1;

  next();
});

server.post(/^\/(accounts|addresses)/, function(req, res, next) {
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
  var data = res.locals.data;

  var userSpecificPaths = ['/accounts', '/accounts/', '/addresses', '/addresses/'];
  if(userSpecificPaths.indexOf(req.originalUrl) > -1) {
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

  var accountSpecificPaths = ['/transactions', '/transactions/'];
  if(accountSpecificPaths.indexOf(req.originalUrl) > -1 && Array.isArray(data)) {
    var accounts = router.db
    .get('accounts')
    .filter({"userId": req.userId})
    .value();

    accounts = Array.isArray(accounts) ? accounts : [accounts];

    accountNumbers = accounts.map(function (account) {
      return account.id;
    });

    var transactions = data.filter(function(transaction) {
      return accountNumbers.indexOf(transaction.fromAccount) > -1
      || accountNumbers.indexOf(transaction.toAccount) > -1;
    });

    res.jsonp(transactions);
  }

  res.jsonp(data);
}

/* fix account data when a new transaction is added */
server.post('/transactions', function(req, res, next) {
  if(!req.body.fromAccount) {
    return sendErrorMessage(res, 'The fromAccount is not specified.');
  }

  if(!req.body.toAccount) {
    return sendErrorMessage(res, 'The toAccount is not specified.');
  }

  if(req.body.toAccount == req.body.fromAccount) {
    return sendErrorMessage(res, 'The toAccount must not be equal to the fromAccount.');
  }

  var accounts = router.db
  .get('accounts')
  .filter({"userId": req.userId})
  .value();

  accounts = Array.isArray(accounts) ? accounts : [accounts];

  var allowed = accounts.some(function(account) {
    return account.id == req.body.fromAccount;
  });

  if(!allowed) {
    return res.sendStatus(403);
  }

  var hasToAccount = router.db
  .get('accounts')
  .find({"id": req.body.toAccount})
  .value() != null;

  if(!hasToAccount) {
    return sendErrorMessage(res, 'The toAccount does not exist.');
  }

  var amountToTransfer = req.body.amount;

  if (typeof(amountToTransfer) != 'number' || Number.isNaN(amountToTransfer) || amountToTransfer <= 0) {
    return sendErrorMessage(res, 'The amount has to be a number and greater then 0.');
  }

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
    return sendErrorMessage(res, 'Account has no balance.');
  }

  var fromAccount = router.db
  .get('accounts')
  .find({"id": req.body.fromAccount})
  .assign({ "balance": fromBalance - amountToTransfer}).value();

  var toAccount = router.db
  .get('accounts')
  .find({"id": req.body.toAccount})
  .assign({ "balance": toBalance + amountToTransfer}).value();

  return next();
});

server.use(router);
server.listen(3000, function () {
  console.log('Banking REST API for BanQ (mocked) is running on port 3000')
});

function sendErrorMessage(response, message, status) {
  status = status ? status : 400;

  var error = {};
  error.message = message;

  return response.status(status).send(error);
}
