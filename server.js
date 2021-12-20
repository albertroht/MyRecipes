const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

const PORT = process.env.PORT || 6000;

// recognize the incoming Request Object as a JSON Object
app.use(express.json({ extended: false, limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb' }));

// app.use(function (req, res, next) {
//   console.log(req.originalUrl);
//   next();
// });

app.get('/', (req, res) => res.json({ msg: 'Welcome to vegan-recipes API' }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
