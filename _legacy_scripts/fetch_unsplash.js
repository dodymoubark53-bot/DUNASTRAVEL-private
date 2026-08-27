async function search(query) {
  try {
    const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const text = await res.text();
    try {
      const parsed = JSON.parse(text);
      return parsed.results ? parsed.results.map(r => r.id) : [];
    } catch {
      console.log('Error parsing:', text.substring(0, 100));
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function run() {
  const ids = await search('egypt pyramids');
  console.log('Pyramids IDs:', ids);
}
run();
