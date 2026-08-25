const baseTours = [];

import { tunisiaTours } from './tunisiaTours.js';
import { egyptTours } from './egyptTours.js';

export const tours = [...baseTours, ...tunisiaTours, ...egyptTours];
export const allTours = tours;
export default tours;