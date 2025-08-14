import React, { useState } from 'react';
import { Card, Form, Button, Alert, ToggleButtonGroup, ToggleButton, Spinner } from 'react-bootstrap';

const API_BASE = 'http://localhost:9000';

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);      // success msg
  const [err, setErr] = useState(null);      // error msg

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null); setMsg(null); setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Signup failed');
        setMsg(data.message || 'Signup successful. Please login now.');
        setMode('login');
      } else {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('token', data.token);
        onAuthed(); // parent ko batado ke login ho gaya
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '100%', maxWidth: 420 }} className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3 text-center">
            {mode === 'login' ? 'Login to Continue' : 'Create Your Account'}
          </Card.Title>

          <div className="d-flex justify-content-center mb-3">
            <ToggleButtonGroup type="radio" name="mode" value={mode} onChange={val => setMode(val)}>
              <ToggleButton id="tbg-login" value={'login'} variant={mode === 'login' ? 'primary' : 'outline-primary'}>
                Login
              </ToggleButton>
              <ToggleButton id="tbg-signup" value={'signup'} variant={mode === 'signup' ? 'primary' : 'outline-primary'}>
                Signup
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {msg && <Alert variant="success" onClose={() => setMsg(null)} dismissible>{msg}</Alert>}
          {err && <Alert variant="danger" onClose={() => setErr(null)} dismissible>{err}</Alert>}

          <Form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
              <Form.Text muted>Minimum 6 characters.</Form.Text>
            </Form.Group>

            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : (mode === 'login' ? 'Login' : 'Signup')}
            </Button>
          </Form>

          <div className="text-center mt-3">
            {mode === 'login'
              ? <>New user? <Button variant="link" onClick={() => setMode('signup')}>Create an account</Button></>
              : <>Already registered? <Button variant="link" onClick={() => setMode('login')}>Login</Button></>
            }
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
