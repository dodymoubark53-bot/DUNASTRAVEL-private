import https from 'https';

function fetchUnsplashIds(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for "id":"..." inside the state JSON or figure tags
        const matches = [...data.matchAll(/"id":"([a-zA-Z0-9_-]{11})"/g)];
        const ids = [...new Set(matches.map(m => m[1]))];
        resolve(ids.slice(0, 5));
      });
    }).on('error', reject);
  });
}

async function run() {
  const ids = await fetchUnsplashIds('nile river');
  console.log('Nile IDs:', ids);
}
run();
