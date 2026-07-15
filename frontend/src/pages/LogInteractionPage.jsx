import LogInteractionForm from '../components/LogInteractionForm/LogInteractionForm';
import ChatPanel from '../components/ChatPanel/ChatPanel';

function LogInteractionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Log HCP Interaction</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LogInteractionForm />
        </div>
        <div className="lg:col-span-1">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}

export default LogInteractionPage;