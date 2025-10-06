import React, { useState } from 'react';
import { SparklesIcon, ClockIcon, PaperClipIcon } from '@heroicons/react/24/solid';

function GoalForm({ onRoadmapGenerated, setLoading }) { 
  const [skills, setSkills] = useState('');
  const [goal, setGoal] = useState('');
  const [dailyTime, setDailyTime] = useState(1); // Default to 1 hour
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Prepare data for the backend payload
    const payload = {
        skill: goal, // Use the user's goal as the skill input for the AI
        level: skills ? (skills.includes('advanced') ? 'Advanced' : 'Intermediate') : 'Beginner', 
        // Simple logic to infer level based on input
        daily_time: dailyTime,
        // Current skills array can be sent if needed, but not critical for roadmap generation
    };

    setLoading(true); // Start loading state in parent component

    try {
        const response = await fetch('http://localhost:5000/api/learn/roadmap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            // Handle HTTP error status codes (e.g., 400, 500)
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        if (result.status === 'success') {
             // Pass the full data object up to App.jsx
             onRoadmapGenerated(result);
        } else {
             throw new Error(result.error || 'Roadmap generation failed with unknown error.');
        }

    } catch (error) {
        console.error("API Error:", error);
        setErrorMessage(error.message);
        setLoading(false); // Stop loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        <h2 className="text-xl font-bold text-text-base">Define Your Learning Goal</h2>
        
        {/* Error Message Display */}
        {errorMessage && (
            <div className="bg-error/10 border border-error text-error p-3 rounded-lg text-sm font-medium">
                Error: {errorMessage}. Please check the server logs and API key.
            </div>
        )}

        {/* 1. Current Skills Input (Used for Level) */}
        <div>
            <label htmlFor="skills" className="block text-sm font-medium text-text-base mb-2">
                Current Skills (e.g., 'Python, Basic React, Intermediate MongoDB')
            </label>
            <div className="relative">
                <SparklesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                <input
                    id="skills"
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="What do you know already?"
                    className="w-full pl-10 pr-4 py-2 bg-surface border border-primary/30 rounded-lg focus:ring-primary focus:border-primary placeholder-text-muted/70 text-text-base transition duration-150"
                />
            </div>
        </div>

        {/* 2. Learning Goal Input (Used as Skill for AI) */}
        <div>
            <label htmlFor="goal" className="block text-sm font-medium text-text-base mb-2">
                Your Ultimate Learning Goal (e.g., 'Mastering the MERN stack')
            </label>
            <textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows="3"
                required
                placeholder="I want to build a fully functional e-commerce backend."
                className="w-full px-4 py-2 bg-surface border border-primary/30 rounded-lg focus:ring-primary focus:border-primary placeholder-text-muted/70 text-text-base transition duration-150 resize-none"
            />
        </div>

        {/* 3. Daily Time Slider (Simplified for display) */}
        <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
                <label htmlFor="dailyTime" className="block text-sm font-medium text-text-base mb-4 flex justify-between items-center">
                    <span>Available Daily Learning Time (Hours)</span>
                    <span className="text-xl font-bold text-primary">{dailyTime}h</span>
                </label>
                <div className="relative">
                    <ClockIcon className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                    <input
                        id="dailyTime"
                        type="range"
                        min="0.5"
                        max="6"
                        step="0.5"
                        value={dailyTime}
                        onChange={(e) => setDailyTime(e.target.value)}
                        className="w-full h-2 bg-text-muted/30 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-primary accent-primary"
                    />
                </div>
            </div>

            {/* 4. Optional Paper Upload Placeholder */}
            <div className="flex-1 opacity-50 cursor-not-allowed">
                <label className="block text-sm font-medium text-text-base mb-2">
                    Optional: Upload Research Paper (PDF) - *Coming Soon*
                </label>
                <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-gray-200 text-gray-500 px-4 py-2 rounded-lg flex items-center justify-center border border-gray-300">
                        <PaperClipIcon className="h-5 w-5 mr-2" />
                        Select File
                        <input
                            type="file"
                            disabled
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
        </div>
        
        {/* 5. Submit Button */}
        <button
            type="submit"
            disabled={setLoading}
            className={`w-full py-3 mt-8 rounded-lg font-semibold text-background transition duration-300 transform hover:scale-[1.01] ${
                setLoading // Accessing the loading prop from the parent
                ? 'bg-primary-dark cursor-not-allowed opacity-70' 
                : 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30'
            }`}
        >
            {setLoading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Designing Curriculum...
                </span>
            ) : (
                'Generate My Custom Roadmap'
            )}
        </button>
    </form>
  );
}

export default GoalForm;
