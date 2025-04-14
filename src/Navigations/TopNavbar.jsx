import { Navbar, Container, Button, Dropdown, Badge, Image } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
function TopNavbar({ toggleSidebar }) {
  const { user, signOut, role } = useAuth();
  return (
    <Navbar bg="light" variant="dark" className="sticky-navbar px-3 d-flex justify-content-between">
      <div className="d-flex align-items-center">
        {/* <Button variant="outline-light" onClick={toggleSidebar} className="me-3">☰</Button> */}
        <Button variant="outline-secondary" onClick={toggleSidebar} className="me-3">☰</Button>

        <Navbar.Brand className='text-dark'>Dashboard</Navbar.Brand>
      </div>

      <div className="d-flex align-items-center">
        <Dropdown align="end" className="me-3">
          <Dropdown.Toggle variant="light" className="position-relative">
            <i className="bi bi-bell fs-5"></i>
            <Badge bg="danger" pill className="position-absolute  start-99 translate-middle" style={{ top: '20%' }}>
              3
            </Badge>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemText>You have 3 new notifications</Dropdown.ItemText>
            <Dropdown.Divider />
            <Dropdown.Item href="#">New borrowing request</Dropdown.Item>
            <Dropdown.Item href="#">Stock alert: Low items</Dropdown.Item>
            <Dropdown.Item href="#">System update scheduled</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end">
          <Dropdown.Toggle variant="ligth" className="d-flex align-items-center">
            <Image
              src={`${import.meta.env.VITE_IMAGES}/${user.image_url}`}
              roundedCircle
              className="me-2"
              width={30}
              height={30}
              alt="User"
            />
            <span>{user.name}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Profile</Dropdown.Item>
            <Dropdown.Item href="#">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={signOut}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
}

export default TopNavbar;
