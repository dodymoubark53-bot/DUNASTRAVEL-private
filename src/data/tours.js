const baseTours = [];

import { tunisiaTours } from './tunisiaTours.js';
export const tours = [...baseTours, ...tunisiaTours];
export const allTours = tours;
export default tours;