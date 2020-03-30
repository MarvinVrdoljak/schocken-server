var express = require('express');
var router = express.Router();

/* GET home page. */
// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = router;
