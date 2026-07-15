import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI-First CRM — HCP Module</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <Link
          to="/log"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-800">Log Interaction</h2>
          <p className="text-sm text-gray-500 mt-1">
            Record a new HCP interaction via form or AI chat.
          </p>
        </Link>

        <Link
          to="/history"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-semibold text-gray-800">View History</h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse and edit past interactions.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;