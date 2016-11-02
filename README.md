# BANQ mock API
Mock api that returns mock data, described in db.json. The API uses [json web token](https://github.com/auth0/node-jsonwebtoken) for authentication and authorization. This API is based on [json-server](https://github.com/typicode/json-server). 


- routes
transactions
accounts
users

# Install
npm install

# Run
node api.js

You need to login using the username and password as described in db.json to access the routes. Only the login route is publicly available.
