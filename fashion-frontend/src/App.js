import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Navbar, Nav } from 'react-bootstrap';
import Auth from './Auth';

const API_BASE = 'https://fashionbbsr.shop';

function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check existing token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingAuth(false);
      setAuthed(false);
      return;
    }
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => setAuthed(true))
      .catch(() => {
        localStorage.removeItem('token');
        setAuthed(false);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  // Fetch categories only after auth
  useEffect(() => {
    if (!authed) return;
    setLoadingProducts(true);
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/product`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoadingProducts(false);
      });
  }, [authed]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthed(false);
    setProducts([]);
  };

  if (checkingAuth) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  if (!authed) {
    return <Auth onAuthed={() => setAuthed(true)} />;
  }

  // === YOUR PRODUCTS UI (unchanged mapping/markup) ===
  return (
    <>
      {/* Simple top bar with Logout (products UI se alag) */}
      <Navbar bg="light" className="mb-3 shadow-sm">
        <Container>
          <Navbar.Brand>Fashion BBSR</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      {loadingProducts ? (
        <div className="text-center mt-5"><Spinner animation="border" /></div>
      ) : (
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
      )}
    </>
  );
}

export default App;
