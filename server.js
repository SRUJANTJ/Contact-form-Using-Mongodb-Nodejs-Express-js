const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Set up Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contact-form', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a schema and model for the submitted data
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile:Number
  
});
const FormData = mongoose.model('contacts', formDataSchema);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route handler for the root URL ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, email,mobile } = req.body;

  try {
    // Create a new FormData document
    const formData = new FormData({
      name: name,
      email: email,
      mobile:mobile
    });

    // Save the document to the database
    await formData.save();
    res.send('Form submitted successfully!');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
