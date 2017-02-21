# mock-uv

## Installation

`npm install`

And run

`node app.js`

## Exemple

Request POST

```
curl -X POST -H "Content-Type: text/xml" -d '<soapenv:Envelope
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsd="http://www.w3.org/2001/XMLSchema"
	xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
>
	<soapenv:Header/>
	<soapenv:Body>
		<GetLinkVoucher>
			<flight>
				<carrierCode xsi:type="xsd:string">wdorl</carrierCode>
				<flightNumber xsi:type="xsd:string">006</flightNumber>
				<arrivalStation>JFK</arrivalStation>
				<departureDate>18022013</departureDate>
				<departureStation>CDG</departureStation>
			</flight>
			<voucher>
				<amount xsi:type="xsd:string">8</amount>
        <id xsi:type="xsd:string">8</id>
			</voucher>
		</GetLinkVoucher>
	</soapenv:Body>
</soapenv:Envelope>' "http://localhost:3000/voucher?wsdl="
```

Response

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:examples:helloservice">
    <soapenv:Header/>
    <soapenv:Body>
        <urn:getLinkVoucherResponse soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <url xsi:type="xsd:string">http://uv.gold/</url>
        </urn:getLinkVoucherResponse>
    </soapenv:Body>
</soapenv:Envelope>
```
