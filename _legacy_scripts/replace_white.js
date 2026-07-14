import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Use word boundaries so we don't accidentally match bg-whitetail
    content = content.replace(/\bbg-white\b/g, 'bg-ivory-50');
    content = content.replace(/\bbg-white\//g, 'bg-ivory-50/');
    content = content.replace(/\btext-white\b/g, 'text-ivory-50');
    content = content.replace(/\btext-white\//g, 'text-ivory-50/');
    content = content.replace(/\bborder-white\//g, 'border-ivory-50/');
    
    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});

console.log('White replacement complete.');
