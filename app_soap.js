var http = require('http');
var soap = require('soap');

var voucherService = {
    Voucher_Service: {
        Voucher_Port: {
            // This is how to define an asynchronous function.
            sayVoucher: function (args, callback) {
                // do some work
                console.log('sayVoucher: '+JSON.stringify(args));
                callback({'greeting': 'Voucher '+args.firstName.$value});
            }
        }
    }
};

var wsdlxml = require('fs').readFileSync('voucher.wsdl', 'utf8'),
    server = http.createServer(function (request, response) {
        response.end("404: Not Found: " + request.url);
    });

var PORT = 3000;

server.listen(PORT);
console.log('server running on port ' + PORT);

soap.listen(server, '/voucherservice', voucherService, wsdlxml);
