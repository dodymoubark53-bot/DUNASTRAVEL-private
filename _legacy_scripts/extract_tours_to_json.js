import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extract() {
  console.log("Loading tours...");
  const { tours } = await import('./src/data/tours.js');
  const { multiCountryTours } = await import('./src/data/multiCountryTours.js');
  const { journeys_routes_data } = await import('./src/data/journeys_routes_data.js');

  const combined = [];
  
  if (tours) combined.push(...tours);
  if (multiCountryTours) combined.push(...multiCountryTours);
  if (journeys_routes_data) combined.push(...journeys_routes_data);

  console.log(`Total tours combined: ${combined.length}`);

  const outputPath = path.join(__dirname, 'src/data/programs.json');
  fs.writeFileSync(outputPath, JSON.stringify({ programs: combined }, null, 2));
  console.log(`Successfully written to ${outputPath}`);
}

extract().catch(console.error);
