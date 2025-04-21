import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { useState } from 'react';
import { Button, Form, Container, Row, Col, Card, Alert, Spinner  } from 'react-bootstrap';

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Handle manual login
  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_MANUAL_LOGIN}`, {
        email,
        password,
      });

      signIn(response.data);
    } catch (error) {
      setError('Check your email or password');
    }
    finally{
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (user) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_LOGIN_API}`, {
        email: user.email,
        name: user.name,
        picture: user.photo,
        token: user.id,
      });

      signIn(response.data);
    } catch (error) {
      setError('Check your email or password');
    }finally{
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
      }}
    >
      <Row className="w-100 justify-content-center">
        {/* Left Section: Login Form */}
        <Col md={6} lg={4}>
          <Card
            className="p-4 shadow"
            style={{
              borderRadius: '15px',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <Card.Body>
              <h2 className="text-center mb-4" style={{ fontWeight: '600' }}>
                Login
              </h2>

              {/* Google Login */}
              <GoogleLogin
                onSuccess={(credentialsResponse) => {
                  if (credentialsResponse.credential) {
                    const decodedToken = jwtDecode(credentialsResponse.credential);
                    const user = {
                      id: decodedToken.sub,
                      name: decodedToken.name,
                      email: decodedToken.email,
                      photo: decodedToken.picture,
                    };
                    handleGoogleLogin(user);
                  } else {
                    console.log('Credential is undefined');
                  }
                }}
                onError={() => console.log('Error during login')}
                theme="filled_blue"
                shape="rectangular"
                text="signin_with"
                width="100%"
                style={{ marginBottom: '1rem' }}
              />

              {/* OR Manual Login */}
              <div className="my-3 text-center">
                <span>or</span>
              </div>

              <Form onSubmit={handleManualLogin}>
                <Form.Group controlId="email">
                   {/* Error message for email */}
                   {error && (
                    <Form.Text className="text-danger">
                      {error}
                    </Form.Text>
                  )}
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mb-3"
                    style={{ borderRadius: '10px', padding: '10px' }}
                  />
                 
                </Form.Group>

                <Form.Group controlId="password">
                   {/* Error message for password */}
                   {error && (
                    <Form.Text className="text-danger">
                      {error}
                    </Form.Text>
                  )}
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mb-3"
                    style={{ borderRadius: '10px', padding: '10px' }}
                  />
                 
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-2"
                  style={{
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: '500',
                    backgroundColor: '#007bff',
                    borderColor: '#007bff',
                  }}
                  disabled={loading}
                >
                    {loading ? (
                    <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </Form>

              {/* Error Message */}
              {error && (
                <Alert variant="danger" style={{ borderRadius: '10px' }}>
                  {error}
                </Alert>
              )}

              <div className="text-center mt-3">
                <small>
                  Don't have an account? <a href="/">Go Back</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
