import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-2">
      <span className="font-semibold text-gray-900 mr-4">AI-CRM HCP</span>
      <Link to="/" className={linkClass('/')}>Dashboard</Link>
      <Link to="/log" className={linkClass('/log')}>Log Interaction</Link>
      <Link to="/history" className={linkClass('/history')}>History</Link>
    </nav>
  );
}

export default Navbar;