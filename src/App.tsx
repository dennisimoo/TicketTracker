import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface ActivityLog {
  timestamp: string;
  message: string;
}

function App() {
  const [tickets, setTickets] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [comment, setComment] = useState('');
  const [activityHistory, setActivityHistory] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets');
    if (storedTickets) setTickets(parseInt(storedTickets, 10));

    const storedActivityHistory = localStorage.getItem('activityHistory');
    if (storedActivityHistory) setActivityHistory(JSON.parse(storedActivityHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('tickets', tickets.toString());
    localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
  }, [tickets, activityHistory]);

  const logActivity = (message: string) => {
    const timestamp = new Date().toLocaleString();
    setActivityHistory(prev => [{timestamp, message}, ...prev]);
  };

  const handleSetTickets = (newTickets: number) => {
    const change = newTickets - tickets;
    setTickets(newTickets);
    logActivity(`Ticket count set to ${newTickets}. Change: ${change > 0 ? '+' : ''}${change}`);
  };

  const handleLogVisit = () => {
    if (selectedDate) {
      logActivity(`Visit logged for ${selectedDate}: ${comment || 'No comment'}`);
      setSelectedDate('');
      setComment('');
    }
  };

  const clearActivityHistory = () => {
    setActivityHistory([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Tickets and Visits Tracker!</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Current Tickets: {tickets}</h2>
        <div className="flex items-center mb-4">
          <input
            type="number"
            value={tickets}
            onChange={(e) => handleSetTickets(parseInt(e.target.value, 10))}
            className="border rounded p-2 w-20 mr-2"
          />
          <button
            onClick={() => handleSetTickets(tickets)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Set number of tickets
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl mb-4">Select Date</h2>
        <div className="flex items-center mb-4">
          <Calendar className="mr-2" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl mb-4">Comment (optional)</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment about your visit"
          className="w-full border rounded p-2 mb-4"
          rows={3}
        />
        <button
          onClick={handleLogVisit}
          disabled={!selectedDate}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          Log Visit
        </button>
      </div>

      <div>
        <h2 className="text-2xl mb-4">Activity History:</h2>
        <div className="mb-4">
          {activityHistory.map((activity, index) => (
            <div key={index} className="mb-2">
              {activity.timestamp}: {activity.message}
            </div>
          ))}
        </div>
        <button
          onClick={clearActivityHistory}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Activity History
        </button>
      </div>
    </div>
  );
}

export default App;