// app.js

const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./userAPIs'); // Updated file reference
const sequelize = require('./db'); // Updated file reference

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Use the userController routes
app.use('/api', userController);

// // Root route handler
// app.get('/', (req, res) => {
//   res.send('Welcome to the User Management API!');
// });

// Start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
