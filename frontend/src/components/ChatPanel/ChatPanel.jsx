import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUserMessage, sendMessage } from '../../store/slices/chatSlice';

function ChatPanel() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    dispatch(addUserMessage(input));
    dispatch(sendMessage(input));
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-full">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-800">AI Assistant</h2>
        <p className="text-xs text-gray-500">Log interaction via chat</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm rounded-lg px-3 py-2 max-w-[90%] ${
              msg.role === 'assistant'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-blue-600 text-white ml-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400 italic px-3 py-2">Thinking...</div>
        )}
      </div>

      <div className="border-t border-gray-200 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Describe interaction..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white text-sm font-medium px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Log
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;