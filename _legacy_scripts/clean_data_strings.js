import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

const processDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Replace t(`data.${var}`) with t(`data.${var}`, String(var))
      // Handle the case where there is already a second argument or not
      content = content.replace(/t\(`data\.\$\{([^}]+)\}`\)/g, "t(`data.${$1}`, $1)");
      
      // Also handle cases like {t(`data.${hotel.title}`) || hotel.title}
      // Actually, if we just do t(`data.${hotel.title}`, hotel.title), we don't need the || hotel.title
      // But the regex above handles t(`data.${hotel.title}`) and converts it to t(`data.${hotel.title}`, hotel.title)
      
      // Handle review.id: t(`data.review${review.id}`, review.comment) -> this is already correct, wait, it has "data." in the key but it has a default!
      // But if the default isn't showing because the key has a variable and is missing, it shows the key? No, if defaultValue is provided, it shows the default value!
      // So t(`data.review${review.id}`, review.comment) should display the comment, not "data.review1".
      // Let's verify if there are any other t('data.something') without default value.
      content = content.replace(/t\('data\.([^']+)'\)/g, "t('data.$1', '$1')");

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    } else if (fullPath.endsWith('.json')) {
      // Clean up JSON translation files
      // If there are keys like "data.Something": "Something", wait, the keys in JSON are currently nested under "data" object!
      // In gen_locales.js, I created:
      // "data": { "Egypt": "Egypt" }
      // This means the translation key is 'data.Egypt'. If it's missing, it displays 'data.Egypt'.
      // The user wants no "data." as visible text. If the JSON has values that start with "data.", we remove them.
      let content = fs.readFileSync(fullPath, 'utf8');
      const data = JSON.parse(content);
      
      let modified = false;
      const cleanData = (obj) => {
        for (let key in obj) {
          if (typeof obj[key] === 'string' && obj[key].includes('data.')) {
            obj[key] = obj[key].replace(/data\./g, '');
            modified = true;
          } else if (typeof obj[key] === 'object') {
            cleanData(obj[key]);
          }
        }
      };
      cleanData(data);
      
      if (modified) {
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
        console.log('Cleaned JSON:', fullPath);
      }
    }
  }
};

processDirectory(srcDir);
console.log('Done cleaning data. strings');
