const express = require('express');

const app = express();

app.get('/example-service', function (req, res) {
  res.send(null);
});

app.use('/', express.static(__dirname + '/dist'));

app.listen(8000, function () {
  console.log('Dev server listening on port 8000!');
});
