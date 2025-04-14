import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../AuthContext';
import axios from 'axios';


const LoginScreen = () => {
  const { signIn } = useAuth();

  const handleLogin = async (user) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_LOGIN_API}`, {
        email: user.email,
        name: user.name,
        picture: user.photo,
        token: user.id,
      });

      signIn(response.data);
    } catch (error) {
      console.error(
        'Login failed:',
        error.response?.data?.error || error.message
      );
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
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
            handleLogin(user);
          } else {
            console.log('Credential is undefined');
          }
        }}
        onError={() => console.log('Error during login')}
      />
    </div>
  );
};
export default LoginScreen;
