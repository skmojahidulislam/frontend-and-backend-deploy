const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 7000;

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

app.listen(7000, () => {
    console.log('Server running on port 7000');
});
