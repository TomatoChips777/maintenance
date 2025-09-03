import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Sidebar({ sidebarOpen, activeLink, handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (key) => {
    handleLinkClick(key);
    // Dagdagan kung kailangan
    const routeMap = {
      Dashboard: '/',
      Reports: '/reports',
      Inventory: '/inventory',
      Borrowing: '/borrowing',
      Events: '/events',
      Notifications: '/notifications',
      Users: '/users',
    };
    navigate(routeMap[key]);
  };

  return (
    <div className={`sidebar bg-success text-white ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header text-center py-4">
        <i className="bi bi-box-fill fs-1 text-light"></i>
        {sidebarOpen && <h5 className="mt-2 mb-0">Maintenance System</h5>}
      </div>
      <hr />
      <Nav className="flex-column">
        {[
          { key: 'Dashboard', icon: 'speedometer2' },
          {key: 'Reports', icon: 'clipboard-data'},
          {key: 'Users', icon: 'people-fill'},
          { key: 'Inventory', icon: 'box-seam' },
          { key: 'Borrowing', icon: 'arrow-left-right' },
          { key: 'Events', icon: 'calendar' },
          { key: 'Notifications', icon: 'bell' },
        ].map(({ key, icon }) => (
          <Nav.Link
            key={key}
            className={`d-flex align-items-center px-3 py-2 rounded-0 ${
              activeLink === key ? 'bg-dark text-white' : 'text-white'
            }`}
            href="#"
            onClick={() => handleClick(key)}
          >
            <i className={`bi bi-${icon} me-2`}></i>
            {sidebarOpen && <span>{key}</span>}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}
export default Sidebar;
