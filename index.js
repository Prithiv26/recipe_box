const path = require('path');

require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const errorHandler = require('./middleware/errorHandler');

const app = express();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the index.html file for all routes

app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));