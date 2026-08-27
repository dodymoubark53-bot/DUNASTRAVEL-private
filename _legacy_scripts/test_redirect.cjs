const http = require('http');
const https = require('https');

const req = https.request('https://source.unsplash.com/800x600/?pyramids', { method: 'HEAD' }, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Location:', res.headers.location);
});
req.end();
