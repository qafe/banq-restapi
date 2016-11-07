# Banking REST API for BanQ (mocked)
Mocked banking REST API for BanQ. It sends and receives dummy data described in `db.json`.

The API uses:
- [json-server](https://github.com/typicode/json-server) as a server.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for JWT token generation and verification.
- [cors](https://github.com/expressjs/cors) for CORS.

# Install

    npm install

# Run
To start the Banking REST API for BanQ run:

    node banq-restapi.js

By default the server runs on port `3000`.

# Usage
You need to login using the emailaddress and password as described below to access the routes. Only the login route is publicly available.

_**NOTE:** Below ORIGIN means any combination of protocol (http/https), host, and port._

## Login

#### Request
`POST ORIGIN/login`

     {
       "emailaddress": emailaddress,
       "password": password
     }

#### Response
`201 Created`

    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ"
    }

## Accounts

### List Accounts

#### Request
`GET ORIGIN/accounts`

| Header        | Value |
|---            |---    |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ |

#### Response
`200 OK`

    [
      {
        "id": "NL22BANQ0102232698",
        "userId": 1,
        "name": "Alice's account",
        "balance": 700
      },
      {
        "id": "NL22BANQ010223269",
        "userId": 1,
        "name": "Alice's second account",
        "balance": 300
      },
      ...
    ]

## Transactions

### List Transactions

#### Request
`GET ORIGIN/transactions`

| Header        | Value |
|---            |---    |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ |

#### Response
`200 OK`

    [
      {
        "id": 1,
        "amount": 100,
        "fromAccount": "NL22BANQ0102232697",
        "toAccount": "NL22BANQ0102232698"
      },
      {
        "id": 2,
        "amount": 42,
        "fromAccount": "NL22BANQ0102232698",
        "toAccount": "NL22BANQ010223269"
      },
      {
        "id": 3,
        "amount": 71,
        "fromAccount": "NL22BANQ0102232697",
        "toAccount": "NL22BANQ010223269"
      },
      ...
    ]

### List Transactions involving specific account

#### Request
`GET ORIGIN/transactions?q=NL22BANQ0102232698`

| Header        | Value |
|---            |---    |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ |

#### Response
`200 OK`

    [
      {
        "id": 1,
        "amount": 100,
        "fromAccount": "NL22BANQ0102232697",
        "toAccount": "NL22BANQ0102232698"
      },
      {
        "id": 2,
        "amount": 42,
        "fromAccount": "NL22BANQ0102232698",
        "toAccount": "NL22BANQ010223269"
      },
      ...
    ]

### Create Transaction

#### Request
`POST ORIGIN/transactions`

| Header        | Value |
|---            |---    |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ |
| Content-Type  | application/json |

    {
       "amount": 42,
       "fromAccount": "NL22BANQ010223269",
       "toAccount": "NL22BANQ0102232698"
    }

#### Response
`201 Created`

    {
      "id": 4,
      "amount": 42,
      "fromAccount": "NL22BANQ010223269",
      "toAccount": "NL22BANQ0102232698"
    }

## Adressess

### List Addresses

#### Request
`GET ORIGIN/addressess`

| Header        | Value |
|---            |---    |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ |

#### Response
`200 OK`

    [
      {
        "id": 2,
        "userId": 2,
        "name": "Bob",
        "number": "NL22BANQ0102232621"
      },
      {
        "id": 3,
        "userId": 2,
        "name": "Carol",
        "number": "NL22BANQ0102232622"
      },
        ...
    ]

### Create Addresses

#### Request
`POST ORIGIN/addressess`

| Header        | Value |
|---            |---    |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ |
| Content-Type  | application/json |

    {
      "name": "David from work",
      "number": "NL22BANQ0102232633"
    }

#### Response
`201 Created`

    {
      "id": 4,
      "userId": 2
      "name": "David from work",
      "number": "NL22BANQ0102232633"
    }

### Update Address
`PUT ORIGIN/addressess`

| Header        | Value |
|---            |---    |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTQ3ODI2NTczMCwiZXhwIjoxNDc4MjY5MzMwfQ.p3TnF_OfebvafCSiD6XMNTMr9SF6nvv7APTInGukSrQ |
| Content-Type  | application/json |

    {
      "id": 4,
      "userId": 2
      "name": "David from work",
      "number": "NL22BANQ0102234444"
    }

#### Response
`200 OK`

    {
      "id": 4,
      "userId": 2
      "name": "David from work",
      "number": "NL22BANQ0102234444"
    }
