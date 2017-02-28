var express = require('express');
var http = require('http');
var parseString = require('xml2js').parseString;
var stripPrefix = require('xml2js').processors.stripPrefix;
var Builder = require('xml2js').Builder;
var fs = require("fs");
var util = require("util");
var url = require('url');
var async = require('async');
var bodyParser = require('body-parser');
var myutils = require('./myutils');
var router = express.Router();
var voucherservice = {};

var servicewsdl = 'voucher.wsdl';

router.use(bodyParser.text({ type: '*/*' }));
router.use(function timeLogStart(req, res, next) {
    myutils.logger('Request start');
    res.locals.startTimeHR = process.hrtime();
    next();
});

//for the wsdl: http://localhost:3000/voucherservice?wsdl
router.get('/', function (req, res, next) {
    myutils.logger("GET");
    if (req.query.wsdl === "") {
        res.setHeader('Content-Type', 'application/xml');
        res.statusCode = 200;
        fs.readFile(servicewsdl, "utf8", function (err, data) {
            if (err) {
                endResponse(err);
            } else {
                endResponse(data);
            }
        });
    } else {
        endResponse("Invalid GET request");
    }

    function endResponse(data) {
        res.write(data);
        res.end();
        next();
    }
});

router.post('/', function (req, res, next) { //process
    myutils.logger("POST");
    async.waterfall([
        function (cb) {
            myutils.logger('Convert POST request to usable JSON');
            //myutils.logger('Input: '+JSON.stringify(req.body));
            //removing the prefix to make processing more easy
            parseString(req.body, { tagNameProcessors: [stripPrefix] }, cb);
        },
        function (result, cb) {
            myutils.logger('Processing JSONized XML message');
            //myutils.logger('Input: ' + JSON.stringify(result));
            var body = result["Envelope"]["Body"];
            //finding the correct elements
            var getLinkVoucher = myutils.search("GetLinkVoucher", body);

            //flight
            var flight = myutils.search("flight", getLinkVoucher);
            var carrierCode = myutils.search("carrierCode", flight);
            var flightNumber = myutils.search("flightNumber", flight);
            var arrivalStation = myutils.search("arrivalStation", flight);
            var departureDate = myutils.search("departureDate", flight);
            var departureStation = myutils.search("departureStation", flight);

            //voucher
            var voucher = myutils.search("voucher", getLinkVoucher);
            var amount = myutils.search("amount", voucher);

            //logic uv

            //return the voucher link
            cb(null, 'https://u-v.io/' + Math.random().toString(20).substring(5));
        }
    ],
        function (err, results) {
            if (err) {
                results = "input error";
            }
            //building the response
            var builder = new Builder();

            var jsonresponse = {
                "soapenv:Envelope": {
                    "$": {
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
                        "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/"
                    },
                    "soapenv:Header": [""],
                    "soapenv:Body": [{
                        "GetLinkVoucherResponse": [{
                            "url": [{
                                "_": results,
                                "$": {
                                    "type": "tns:UVString"
                                }
                            }
                            ]
                        }
                        ]
                    }
                    ]
                }
            }

            var xmlresponse = builder.buildObject(jsonresponse);

            myutils.logger('Returning response Result: ' + JSON.stringify(results) + ' Error: ' + JSON.stringify(err));

            res.setHeader('Content-Type', 'application/xml');
            res.statusCode = 200;
            res.end(xmlresponse);
            next(err, results);
        }
    );
});

router.use(function timeLogEnd(req, res, next) {
    var durationHR = process.hrtime(res.locals.startTimeHR);
    myutils.logger("Request end. Duration: %ds %dms", durationHR[0], durationHR[1] / 1000000);
    next();
});

module.exports = router;
