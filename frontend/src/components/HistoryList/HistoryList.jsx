import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions } from '../../store/slices/interactionSlice';

const sentimentStyles = {
  Positive: 'bg-green-100 text-green-700',
  Neutral: 'bg-gray-100 text-gray-700',
  Negative: 'bg-red-100 text-red-700',
};

function HistoryList() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.interactions);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center text-gray-500 py-12">Loading interactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">Failed to load: {error}</div>;
  }

  if (list.length === 0) {
    return <div className="text-center text-gray-500 py-12">No interactions logged yet.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
      {list.map((item) => (
        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          <div>
            <p className="font-medium text-gray-900">{item.hcp_name}</p>
            <p className="text-sm text-gray-500">
              {item.interaction_type} · {item.interaction_date}
            </p>
            {item.outcomes && (
              <p className="text-sm text-gray-600 mt-1">{item.outcomes}</p>
            )}
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${sentimentStyles[item.sentiment] || 'bg-gray-100 text-gray-700'}`}
          >
            {item.sentiment}
          </span>
        </div>
      ))}
    </div>
  );
}

export default HistoryList;