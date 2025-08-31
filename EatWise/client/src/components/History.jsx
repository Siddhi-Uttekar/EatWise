import React, { useState, useEffect } from "react";
import { getAnalysisHistory } from "../modules/api";
import { ResultCard } from "./ResultCard.jsx"; // Use the new ResultCard component

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openItemId, setOpenItemId] = useState(null); // Tracks which item is open

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAnalysisHistory();
        setHistory(data);
      } catch (err) {
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleItem = (id) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  if (loading) {
    return <div className="text-center p-8">Loading history...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Analysis History</h1>
      {history.length === 0 ? (
        <p className="text-center text-gray-500">No history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center space-x-4">
                  {item.image_path && (
                    <img
                      src={`http://localhost:5000${item.image_path}`}
                      alt="Analyzed food label"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold">
                      Analysis from {new Date(item.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Overall Rating: {item.report_data.overallRating}
                    </p>
                  </div>
                </div>
                <span className="text-2xl">{openItemId === item.id ? "▲" : "▼"}</span>
              </div>
              {openItemId === item.id && (
                <div className="p-4 border-t border-gray-200">
                  <ResultCard analysis={item.report_data} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
