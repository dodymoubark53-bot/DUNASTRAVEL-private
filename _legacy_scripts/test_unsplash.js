const https = require('https');

function search(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.results ? parsed.results.map(r => r.id) : []);
        } catch {
          console.log('Error parsing:', data.substring(0, 100));
          resolve([]);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const ids = await search('egypt pyramids');
  console.log('Pyramids IDs:', ids);
}
run();
