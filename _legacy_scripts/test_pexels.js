import https from 'https';

function searchPexels(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://www.pexels.com/search/${encodeURIComponent(query)}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/https:\/\/images\.pexels\.com\/photos\/(\d+)\/pexels-photo-\d+\.jpeg/g)];
        const ids = [...new Set(matches.map(m => m[0]))];
        resolve(ids.slice(0, 5));
      });
    }).on('error', reject);
  });
}

async function run() {
  const urls = await searchPexels('egypt pyramids');
  console.log('Pexels URLs:', urls);
}
run();
