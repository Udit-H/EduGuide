import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import GoalForm from './components/GoalForm.jsx';
import RoadmapView from './components/RoadmapView.jsx'; // Import the new component
import './App.css';

// Define the main App component
const App = () => {
  // State to store the full roadmap data received from the backend
  const [roadmapData, setRoadmapData] = useState(null);
  
  // State to track if we are loading the response
  const [loading, setLoading] = useState(false);

  // Function passed to GoalForm to receive the successful data
  const handleRoadmapGenerated = (data) => {
    setLoading(false);
    // The received data contains the final JSON structure and metadata
    setRoadmapData(data);
    
    console.log("Roadmap Data Received and Stored:", data);
  };

  // Function to reset the view and go back to the goal form
  const resetView = () => {
    setRoadmapData(null);
  };

  // Determine which component to display based on the state
  const renderContent = () => {
    if (loading) {
        // Simple loading spinner using Tailwind classes
        return (
            <div className="flex flex-col items-center justify-center p-12 h-96 bg-white text-gray-900 rounded-xl shadow-2xl space-y-4">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl font-semibold text-indigo-600">Designing your customized curriculum...</p>
                <p className="text-sm text-gray-500">This may take a moment as the AI builds the full roadmap, quizzes, and project suggestions.</p>
            </div>
        );
    }
    
    if (roadmapData) {
      // Show the roadmap if data exists
      return <RoadmapView data={roadmapData} onReset={resetView} />;
    } else {
      // Show the input form otherwise
      // Pass the handler function and the setter function for loading state
      return <GoalForm onRoadmapGenerated={handleRoadmapGenerated} setLoading={setLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Assuming Navbar accepts an onReset prop or handles its own reset logic */}
      <Navbar onReset={resetView} /> 
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-2xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
