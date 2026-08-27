const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let trips = [
  { id: 1, title: 'Nile Cruise Luxury', price: 1200, country: 'Egypt' },
  { id: 2, title: 'Dubai Desert Safari', price: 899, country: 'UAE' },
  { id: 3, title: 'Istanbul Classics', price: 750, country: 'Turkey' },
];

app.get('/trips', (req, res) => {
  res.json(trips);
});

app.get('/api/trips', (req, res) => {
  res.json(trips);
});

app.post('/api/trips', (req, res) => {
  const newTrip = { id: Date.now(), ...req.body };
  trips.push(newTrip);
  res.status(201).json({ message: 'Trip added successfully', trip: newTrip });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
