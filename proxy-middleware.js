const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
var setCookie = require('set-cookie-parser');
const port = process.env.PORT || 5000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const proxyContexts = {
  react: {
    target: 'http://localhost:3000',
    //changeOrigin: true
  },
  prod: {
    target: 'https://my-prod.com',
    changeOrigin: true,
  },
};

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  }),
);
app.use(cookieParser());

// Middleware functions are executed sequentially, therefore the order of middleware inclusion is important.
// API calls
app.post('/mirth/login', async (req, res) => {
  const mirthUrl = req.get('mirth-url');
  console.log('mirth url is ' + mirthUrl);
  let response = {};
  let statusCode = 200;
  try {
    const axiosResponse = await axios.request({
      url: mirthUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: new URLSearchParams(req.body),
    });
    const cookies = setCookie.parse(axiosResponse, {
      map: true,
    });
    if (cookies) {
      const jsessionid = cookies['JSESSIONID'];
      if (jsessionid) {
        res.setHeader('JSESSIONID', jsessionid.value);
      }
    }
    response = axiosResponse.data;
  } catch (err) {
    const errorObj = handleError(err);
    statusCode = errorObj.status;
    response = errorObj.message;
  }
  res.status(statusCode).send(response);
});

app.post('/mirth/api', async (req, res) => {
  const mirthUrl = req.get('mirth-url');
  const method = req.get('mirth-http-method') || 'GET';
  console.log('mirth url is ' + mirthUrl);
  let response = {};
  let statusCode = 200;
  try {
    let requestConfig = {
      url: mirthUrl,
      method: method,
      headers: {
        cookie: 'JSESSIONID=' + req.get('jsessionid'),
        'Content-Type': 'application/xml',
      },
    };
    if (method === 'POST' || method === 'PUT') {
      if (!isEmptyObject(req.body)) {
        requestConfig.data = req.body;
      }
    }
    const axiosResponse = await axios.request(requestConfig);
    response = axiosResponse.data;
  } catch (err) {
    const errorObj = handleError(err);
    statusCode = errorObj.status;
    response = errorObj.message;
  }
  res.status(statusCode).send(response);
});

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'productionssl'
) {
  console.log('running in prod mode ' + process.env.NODE_ENV);
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  console.log('running in development mode');
  app.use(createProxyMiddleware(proxyContexts.react));
}

function handleError(err) {
  const status = err?.response?.status;
  let message =
    'Unauthorized. Invalid credentials or you do not have sufficient permissions.';
  if (status !== 401) {
    message = err?.message;
  }
  const statusCode = status;
  return { status: statusCode, message: message };
}

function isEmptyObject(value) {
  return (
    value && Object.keys(value).length === 0 && value.constructor === Object
  );
}
if (process.env.NODE_ENV === 'productionssl') {
  console.log('starting https mode');
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
    },
    app,
  );

  httpsServer.listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
  });
} else {
  console.log('starting non-https mode');
  http
    .createServer(app)
    .listen(port, () => console.log(`Listening on port ${port}`));
}
