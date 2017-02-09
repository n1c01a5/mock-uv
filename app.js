var express = require('express');

var voucher = require('./voucher');
var app = express();

app.use('/voucher',voucher);
app.listen(3000);

console.log('server running on port 3000');
