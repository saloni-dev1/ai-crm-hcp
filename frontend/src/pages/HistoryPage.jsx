import HistoryList from '../components/HistoryList/HistoryList';

function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Interaction History</h1>
      <HistoryList />
    </div>
  );
}

export default HistoryPage;