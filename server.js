const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/fronttrust', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('MongoDB connection error:', error));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  try {
    const newUser = new User({ firstName, lastName, email, username, password });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    res.status(400).send('Error logging in');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
