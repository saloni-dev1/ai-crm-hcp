import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitInteraction, clearDraftInteraction } from '../../store/slices/interactionSlice';

const initialFormState = {
    hcp_name: '',
    interaction_type: 'Meeting',
    interaction_date: '',
    interaction_time: '',
    attendees: '',
    topics_discussed: '',
    materials_shared: '',
    samples_distributed: '',
    sentiment: 'Neutral',
    outcomes: '',
    follow_up_actions: '',
};

function LogInteractionForm() {
    const dispatch = useDispatch();
    const { loading, draft } = useSelector((state) => state.interactions);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (draft) {
          const normalizeSentiment = (s) => {
            if (!s) return 'Neutral';
            const capitalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
            return ['Positive', 'Neutral', 'Negative'].includes(capitalized) ? capitalized : 'Neutral';
          };
      
          setFormData({
            hcp_name: draft.hcp_name || '',
            interaction_type: draft.interaction_type || 'Meeting',
            interaction_date: draft.interaction_date || '',
            interaction_time: draft.interaction_time ? draft.interaction_time.slice(0, 5) : '',
            attendees: draft.attendees || '',
            topics_discussed: draft.topics_discussed || '',
            materials_shared: draft.materials_shared || '',
            samples_distributed: draft.samples_distributed || '',
            sentiment: normalizeSentiment(draft.sentiment),
            outcomes: draft.outcomes || '',
            follow_up_actions: draft.follow_up_actions || '',
          });
          dispatch(clearDraftInteraction());
        }
      }, [draft, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(submitInteraction(formData));
        setFormData(initialFormState);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Interaction Details</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">HCP Name</label>
                    <input
                        type="text"
                        name="hcp_name"
                        value={formData.hcp_name}
                        onChange={handleChange}
                        placeholder="Search or select HCP..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Interaction Type</label>
                    <select
                        name="interaction_type"
                        value={formData.interaction_type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Meeting">Meeting</option>
                        <option value="Call">Call</option>
                        <option value="Email">Email</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                    <input
                        type="date"
                        name="interaction_date"
                        value={formData.interaction_date}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Time</label>
                    <input
                        type="time"
                        name="interaction_time"
                        value={formData.interaction_time}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Attendees</label>
                <input
                    type="text"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                    placeholder="Enter names or search..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Topics Discussed</label>
                <textarea
                    name="topics_discussed"
                    value={formData.topics_discussed}
                    onChange={handleChange}
                    placeholder="Enter key discussion points..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Materials Shared</label>
                    <input
                        type="text"
                        name="materials_shared"
                        value={formData.materials_shared}
                        onChange={handleChange}
                        placeholder="No materials added"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Samples Distributed</label>
                    <input
                        type="text"
                        name="samples_distributed"
                        value={formData.samples_distributed}
                        onChange={handleChange}
                        placeholder="No samples added"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Observed/Inferred HCP Sentiment</label>
                <div className="flex gap-4">
                    {['Positive', 'Neutral', 'Negative'].map((option) => (
                        <label key={option} className="flex items-center gap-1.5 text-sm text-gray-700">
                            <input
                                type="radio"
                                name="sentiment"
                                value={option}
                                checked={formData.sentiment === option}
                                onChange={handleChange}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Outcomes</label>
                <textarea
                    name="outcomes"
                    value={formData.outcomes}
                    onChange={handleChange}
                    placeholder="Key outcomes or agreements..."
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Follow-up Actions</label>
                <textarea
                    name="follow_up_actions"
                    value={formData.follow_up_actions}
                    onChange={handleChange}
                    placeholder="Enter next steps or tasks..."
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {loading ? 'Logging...' : 'Log Interaction'}
            </button>
        </form>
    );
}

export default LogInteractionForm;