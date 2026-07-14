import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');
const localesDir = path.join(srcDir, 'i18n', 'locales');

// Load JSON locales
const locales = {
  en: JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8')),
  ar: JSON.parse(fs.readFileSync(path.join(localesDir, 'ar.json'), 'utf8')),
  es: JSON.parse(fs.readFileSync(path.join(localesDir, 'es.json'), 'utf8')),
  pt: JSON.parse(fs.readFileSync(path.join(localesDir, 'pt.json'), 'utf8')),
  it: JSON.parse(fs.readFileSync(path.join(localesDir, 'it.json'), 'utf8'))
};

// Helper to check if a nested key path exists in an object
function hasKeyPath(obj, pathStr) {
  const parts = pathStr.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return false;
    }
    if (!(part in current)) {
      return false;
    }
    current = current[part];
  }
  return true;
}

const keysInCode = new Set();
const keyDefaults = {};

// Recursively find JSX files and extract t() keys
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Matches: t('key', 'default') or t("key", "default")
      // Matches simple t('key') or t("key")
      // Matches template literals: t(`key`, `default`)
      const regex = /\bt\(\s*(['"`])(.*?)\1\s*(?:,\s*(['"`])(.*?)\3)?\s*\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const key = match[2];
        const defaultValue = match[4] || '';
        
        // Skip keys that are dynamically evaluated like t(`data.${var}`)
        if (key.includes('${') || key.startsWith('data.')) {
          continue;
        }
        
        keysInCode.add(key);
        if (defaultValue) {
          keyDefaults[key] = defaultValue;
        }
      }
    }
  }
}

scanDirectory(srcDir);

console.log(`Found ${keysInCode.size} static translation keys in the codebase.\n`);

const missingMap = {};
for (const key of Array.from(keysInCode).sort()) {
  const isMissing = Object.keys(locales).some(lang => !hasKeyPath(locales[lang], key));
  if (isMissing) {
    missingMap[key] = keyDefaults[key] || '';
  }
}
fs.writeFileSync('missing_keys.json', JSON.stringify(missingMap, null, 2));
console.log(`Saved ${Object.keys(missingMap).length} missing keys to missing_keys.json`);
