import { useState, useContext, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Modal } from "react-bootstrap";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../AuthContext';
import axios from 'axios';

function ReportPage() {
    const { user, signIn } = useAuth();
    const [formData, setFormData] = useState({
        user_id: user?.id || '',
        location: '',
        description: '',
        image: null,
    });

    const resetForm = () => {
        setFormData({
            user_id: user?.id || '',
            location: '',
            description: '',
            image: null,
        });
    };

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showGoogleLogin, setShowGoogleLogin] = useState(false);


    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            user_id: user?.id || ''
        }));
    }, [user]);

    // Handle Google login success
    const handleGoogleLogin = async (credentialsResponse) => {
        setLoading(true);
        try {
            const decodedToken = jwtDecode(credentialsResponse.credential);
            const user = {
                id: decodedToken.sub,
                name: decodedToken.name,
                email: decodedToken.email,
                photo: decodedToken.picture,
            };
            const response = await axios.post(`${import.meta.env.VITE_LOGIN_API}`, {
                email: user.email,
                name: user.name,
                picture: user.photo,
                token: user.id,
            });
            signIn(response.data);
            setShowGoogleLogin(false);
            handleFormSubmission();
        } catch (error) {
            setError('Error logging in with Google');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setShowGoogleLogin(true);
            return;
        }
        handleFormSubmission();

    };
    const handleFormSubmission = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_CREATE_REPORT}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            resetForm();
        } catch (error) {
            setError('Failed to submit the report');
        } finally {
            setLoading(false);
        }
    }
    return (
        <Container className="mt-5 mb-5">
            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={7}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                        </Form.Group>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Google Login Modal */}
            <Modal show={showGoogleLogin} onHide={() => setShowGoogleLogin(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In with Google</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please sign in with your Google account to submit the report.</p>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => setError('Error during Google login')}
                        theme="filled_blue"
                        shape="rectangular"
                        text="signin_with"
                        width="100%"
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}
export default ReportPage;
