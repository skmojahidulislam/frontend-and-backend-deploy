const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000;

app.use(cors());

app.get('/api/product', (req, res) => {
  res.json({
    products: [
      { name: 'Kurtas' },
      { name: 'T-shirts' },
      { name: 'Shoes' },
      { name: 'Sandals' },
      { name: 'Sarees' },
      { name: 'Hijabs' },
      { name: 'Kurtis' },
      { name: 'Jeans' },
    ]
  });
});

app.listen(9000, '0.0.0.0', () => {
    console.log('Server running on port 9000');
});
