import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Sidebar({ sidebarOpen, activeLink, handleLinkClick }) {
  const navigate = useNavigate();

  const handleClick = (key) => {
    handleLinkClick(key);
    // Dagdagan kung kailangan
    const routeMap = {
      Dashboard: '/',
      Inventory: '/inventory',
      Barrowing: '/borrowing',
      Events: '/events',
    };
    navigate(routeMap[key]);
  };

  return (
    <div className={`sidebar bg-dark text-white ${sidebarOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header text-center py-4">
        <i className="bi bi-box-fill fs-1 text-primary"></i>
        {sidebarOpen && <h5 className="mt-2 mb-0">Inventory System</h5>}
      </div>
      <hr />
      <Nav className="flex-column">
        {[
          { key: 'Dashboard', icon: 'speedometer2' },
          { key: 'Inventory', icon: 'box-seam' },
          { key: 'Barrowing', icon: 'arrow-left-right' },
          { key: 'Events', icon: 'calendar' },
        ].map(({ key, icon }) => (
          <Nav.Link
            key={key}
            className={`d-flex align-items-center px-3 py-2 rounded-0 ${
              activeLink === key ? 'bg-primary text-white' : 'text-white'
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
