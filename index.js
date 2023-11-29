const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/party-planner', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Party model
const Party = mongoose.model('Party', {
  name: String,
  date: Date,
  time: String,
  location: String,
  description: String,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up the HTML view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  // Fetch all parties from the database
  const parties = await Party.find({});
  res.render('index', { parties });
});

app.post('/add', async (req, res) => {
  // Extract party information from the form
  const { name, date, time, location, description } = req.body;

  // Create a new party and save it to the database
  await Party.create({ name, date, time, location, description });

  // Redirect to the home page
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  // Extract the party ID from the URL parameter
  const partyId = req.params.id;

  // Remove the party from the database
  await Party.findByIdAndRemove(partyId);

  // Redirect to the home page
  res.redirect('/');
});
