// Using native global fetch

async function translateBatch(texts, targetLang, sourceLang = 'auto') {
  const text = texts.join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    
    // Google Translate returns an array of sentence translations in json[0]
    // We can extract them and join them, then split by newline.
    // However, sometimes one input line is split into multiple parts in json[0].
    // Let's print the structure of json[0] first.
    const translatedText = json[0].map(item => item[0]).join('');
    return translatedText.split('\n');
  } catch (err) {
    console.error(`Error translating batch: ${err.message}`);
    return null;
  }
}

console.log('Testing batch translation...');
const inputs = [
  'Cairo Express com Alexandria',
  'Uma imersão rápida e intensa no coração do Egito Antigo.',
  'Voo de retorno ao Brasil com memórias inesquecíveis.'
];
const result = await translateBatch(inputs, 'en', 'pt');
console.log('Inputs:', inputs);
console.log('Outputs:', result);

