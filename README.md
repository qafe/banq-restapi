# Banking REST API for BANQ (mocked)
Mocked banking REST API for BanQ. It sends and receives dummy data described in `db.json`.

The API uses:
- [json-server](https://github.com/typicode/json-server) as a server.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) for JWT token generation and verification.
- [cors](https://github.com/expressjs/cors) for CORS.

# Install

    npm install

# Run
To start the Banking REST API for BANQ run:

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
        "id": 1,
        "userId": 2,
        "name": "John's account",
        "number": "NL22BANQ0102232697",
        "balance": 1000
        },
        {
          "id": 2,
          "userId": 1,
          "name": "Alice's account",
          "number": "NL22BANQ0102232698",
          "balance": 700
        },
        {
          "id": 3,
          "userId": 1,
          "name": "Alice's second account",
          "number": "NL22BANQ010223269",
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
        "fromAccount": 1,
        "toAccount": 2
      },
      {
        "id": 2,
        "amount": 42,
        "fromAccount": 3,
        "toAccount": 2
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
       "fromAccount": 3,
       "toAccount": 2
    }

#### Response
`201 Created`

    {
      "id": 2,
      "amount": 42,
      "fromAccount": 3,
      "toAccount": 2
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
