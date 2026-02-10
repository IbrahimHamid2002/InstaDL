const https = require('https');

const apiKey = 'ddf94386edmshd30658a6d32ce16p168378jsn8693b6b4eefa';
const host = 'instagram-downloader-download-instagram-videos-stories5.p.rapidapi.com';
const testUrl = 'https://www.instagram.com/p/Clwj9YLtIOE/'; // Example public post (not reel)

const endpoint = '/getPost';

function checkEndpoint() {
    const path = `${endpoint}?url=${encodeURIComponent(testUrl)}`;
    const options = {
        hostname: host,
        path: path,
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': host
        }
    };

    const req = https.request(options, (res) => {
        console.log(`Endpoint: ${endpoint} | Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`Body:`, data);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem: ${e.message}`);
    });

    req.end();
}

console.log('Probing /getPost...');
checkEndpoint();
