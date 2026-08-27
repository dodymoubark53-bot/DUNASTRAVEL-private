const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/data/tours.js',
  'src/data/blogs.js',
  'src/data/journeys_routes_data.js'
];

const replacements = [
  ['The Great Ramses.png', 'The Great Ramses.webp'],
  ['cairo-with-cruise-sharm-el-sheikh-detail.jpg', 'cairo-with-cruise-sharm-el-sheikh-detail.webp'],
  ['egito-classico-cairo-cruzeiro-no-nilo.jpg', 'egito-classico-cairo-cruzeiro-no-nilo.webp'],
  ['Treasures of Egypt with Alexandria.jpg', 'Treasures of Egypt with Alexandria.webp'],
  ['Cairo Express with Alexandria.jpeg', 'Cairo Express with Alexandria.webp'],
  ['Cairo Express.jpg', 'Cairo Express.webp'],
  ['cairo-cruzeiro-mar-vermelho.jpg', 'cairo-cruzeiro-mar-vermelho.webp'],
  ['cairo-with-cruise-sharm-el-sheikh.jpg', 'cairo-with-cruise-sharm-el-sheikh.webp']
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    replacements.forEach(([oldExt, newExt]) => {
      if (content.includes(oldExt)) {
        content = content.replaceAll(oldExt, newExt);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
