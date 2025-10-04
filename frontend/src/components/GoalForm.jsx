import React, { useState } from 'react';
import { SparklesIcon, ClockIcon, PaperClipIcon } from '@heroicons/react/24/solid';

// --- DEFINITIVE API BASE URL ---
// This explicitly points to the running Flask backend server
const API_BASE_URL = 'http://localhost:5000/api/learn';
// -------------------------------

function GoalForm({ onRoadmapGenerated }) {
  const [skills, setSkills] = useState('');
  const [goal, setGoal] = useState('');
  const [dailyTime, setDailyTime] = useState(1); // Default to 1 hour
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // For the initial MVP, we combine 'skills' and 'goal' to form the 'skill' input 
    // and use a placeholder for the 'level' based on the daily time input.
    const skillInput = `${goal} (Starting with current skills: ${skills}).`;
    const levelInput = dailyTime >= 4 ? 'Advanced' : (dailyTime >= 2 ? 'Intermediate' : 'Beginner');

    try {
      // 1. Construct the API payload
      const payload = {
        skill: skillInput, // Comprehensive prompt for the AI
        level: levelInput, // Used by the AI for content complexity
      };

      // 2. Call the Flask endpoint for roadmap generation
      const response = await fetch(`${API_BASE_URL}/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        // Handle API errors (e.g., 400 Bad Request, 500 Internal Error)
        const errorMessage = result.error || 'Unknown error occurred during roadmap generation.';
        setError(errorMessage);
        console.error("Backend Error:", errorMessage);
        // Using a custom alert since window.alert() is forbidden
        alert(`Error: ${errorMessage}`); 
        return;
      }

      // 3. Handle success
      console.log('Roadmap Generated Successfully:', result);

      // In a real application, this would trigger navigation or a state update 
      // in the parent App.jsx to display the RoadmapView.
      if (onRoadmapGenerated) {
          onRoadmapGenerated(result);
      } else {
          alert('Success! Roadmap data received. Check console.');
      }

    } catch (networkError) {
      setError("Network Error: Could not connect to the backend server at http://localhost:5000.");
      console.error("Network Error:", networkError);
      alert('Network Error: Could not connect to the backend server at http://localhost:5000. Ensure the Flask server is running.'); 
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // Note: File upload logic is skipped for now as it requires a separate, multipart API call.

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
      
      {/* Error Display */}
      {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
              {error}
          </div>
      )}

      {/* 1. Current Skills Input */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-800 mb-2">
          Current Skills (Comma-separated, e.g., Python, SQL, Flask)
        </label>
        <div className="relative">
          <SparklesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-600" />
          <input
            id="skills"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            placeholder="What do you know already?"
            className="w-full pl-10 pr-4 py-2 bg-white border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-800 transition duration-150 shadow-sm"
          />
        </div>
      </div>

      {/* 2. Learning Goal Input */}
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-800 mb-2">
          Your Ultimate Learning Goal
        </label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows="3"
          required
          placeholder="I want to build a fully functional e-commerce backend."
          className="w-full px-4 py-2 bg-white border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-800 transition duration-150 resize-none shadow-sm"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* 3. Daily Time Slider */}
        <div className="flex-1">
          <label htmlFor="dailyTime" className="block text-sm font-medium text-gray-800 mb-4 flex justify-between items-center">
            <span>Available Daily Learning Time (Hours)</span>
            <span className="text-xl font-bold text-indigo-600">{dailyTime}h</span>
          </label>
          <div className="relative">
            <ClockIcon className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="dailyTime"
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={dailyTime}
              onChange={(e) => setDailyTime(e.target.value)}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 accent-indigo-600 transition duration-150"
            />
          </div>
        </div>

        {/* 4. Optional Paper Upload (Placeholder - not functional yet) */}
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Optional: Upload Research Paper (PDF)
            </label>
            <div className="flex items-center space-x-2">
                <label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center border border-indigo-300 shadow-sm">
                    <PaperClipIcon className="h-5 w-5 mr-2" />
                    {file ? 'Change File' : 'Select File'}
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept=".pdf"
                        className="hidden"
                    />
                </label>
                <span className="text-sm text-gray-500 truncate flex-1">
                    {file ? file.name : 'Not integrated in MVP'}
                </span>
            </div>
        </div>
      </div>
      
      {/* 5. Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 mt-8 rounded-lg font-semibold text-white transition duration-300 transform hover:scale-[1.01] shadow-md ${
          isSubmitting 
            ? 'bg-indigo-700 cursor-not-allowed opacity-70' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/50'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Roadmap...
          </span>
        ) : (
          'Generate My Custom Roadmap'
        )}
      </button>

    </form>
  );
}

export default GoalForm;
