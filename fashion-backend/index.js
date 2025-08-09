const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { name: 'Kurtas' },
      { name: 'T-shirts' },
      { name: 'Shoes' },
      { name: 'Sandals' },
    ]
  });
});

app.listen(8000, '0.0.0.0', () => {
    console.log('Server running on port 8000');
});
