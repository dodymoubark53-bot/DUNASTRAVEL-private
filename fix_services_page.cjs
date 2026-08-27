const fs = require('fs');

const file = 'd:/@@project/LUXURY-PROJECT/frontend/src/pages/Services.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the image in the main grid with safe fallback
content = content.replace(
  '<img src={item.images[0]} alt={resolveLocalizedText(item.title, t, lang)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />',
  '<img src={item.images?.[0] || item.heroImage || item.image || "/imgs/services/transportation-cover.webp"} alt={resolveLocalizedText(item.title || item.name, t, lang)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />'
);

// Replace the duplicate transportation section
const duplicateSectionPattern = /\s*\{\/\* Transportation Section \*\/\}\s*\{\(\!service \|\| service === 'transportation'\) && \([\s\S]*?\n\s*\)\}\s*<\/section>/;

content = content.replace(duplicateSectionPattern, '\n      </section>');

fs.writeFileSync(file, content);
console.log('Fixed Services.jsx duplication and images');
