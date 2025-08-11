import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fashionbbsr.shop/api/product") // 🔗 will change to ECS URL later
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-3 text-center">🧥 Fashion BBSR Products Category & 50% Discount</h1>
      <h2 className="mb-4 text-center">Choose Your Category and Explore All Products</h2>
      <Row>
        {products.map((item, i) => (
          <Col key={i} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Some product description here...</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
