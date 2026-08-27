import { tours } from './src/data/tours.js';
import { services } from './src/data/services.js';
import fs from 'fs';

const strings = new Set();

tours.forEach(tour => {
  if (tour.title) strings.add(tour.title);
  if (tour.overview) strings.add(tour.overview);
  if (tour.duration) strings.add(tour.duration);
  if (tour.type) strings.add(tour.type);
  if (tour.departures) strings.add(tour.departures);
  
  if (tour.highlights) {
    tour.highlights.forEach(h => strings.add(h));
  }
  if (tour.included) {
    tour.included.forEach(i => strings.add(i));
  }
  if (tour.excluded) {
    tour.excluded.forEach(e => strings.add(e));
  }
  if (tour.itinerary) {
    tour.itinerary.forEach(day => {
      if (day.title) strings.add(day.title);
      if (day.morning) strings.add(day.morning);
      if (day.afternoon) strings.add(day.afternoon);
      if (day.evening) strings.add(day.evening);
    });
  }
});

services.forEach(service => {
  if (service.title) strings.add(service.title);
  if (service.shortDesc) strings.add(service.shortDesc);
  if (service.location) strings.add(service.location);
  
  if (service.overview) {
    service.overview.forEach(o => strings.add(o));
  }
  if (service.highlights) {
    service.highlights.forEach(h => strings.add(h));
  }
  if (service.included) {
    service.included.forEach(i => strings.add(i));
  }
  if (service.excluded) {
    service.excluded.forEach(e => strings.add(e));
  }
  if (service.accommodations) {
    service.accommodations.forEach(acc => {
      if (acc.destination) strings.add(acc.destination);
      if (acc.regime) strings.add(acc.regime);
    });
  }
  if (service.itinerary) {
    service.itinerary.forEach(day => {
      if (day.title) strings.add(day.title);
      if (day.morning) strings.add(day.morning);
      if (day.afternoon) strings.add(day.afternoon);
      if (day.evening) strings.add(day.evening);
    });
  }
});

fs.writeFileSync('extracted_strings.json', JSON.stringify(Array.from(strings), null, 2));
console.log(`Extracted ${strings.size} unique strings.`);

