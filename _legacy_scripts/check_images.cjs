const fs = require('fs');
const path = require('path');

const checkPath = (p) => {
  if (p.startsWith('http')) return true;
  const fullPath = path.join('d:/eslam m h/programming/my projects/9/public', p);
  const decodedPath = decodeURIComponent(fullPath);
  return fs.existsSync(decodedPath);
};

['tours.js', 'services.js', 'transportation.js', 'blogs.js'].forEach(file => {
  const content = fs.readFileSync(path.join('d:/eslam m h/programming/my projects/9/src/data', file), 'utf8');
  const regex = /['"](\/imgs\/[^'"]+)['"]/g;
  let match;
  let missing = 0;
  while ((match = regex.exec(content)) !== null) {
    const p = match[1];
    if (!checkPath(p)) {
      console.log('Missing in ' + file + ':', p);
      missing++;
    }
  }
  if (missing === 0) console.log(file + ' OK');
});
