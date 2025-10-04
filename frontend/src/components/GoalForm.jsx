import React, { useState } from 'react';
import { SparklesIcon, ClockIcon, PaperClipIcon } from '@heroicons/react/24/solid';

function GoalForm() {
  const [skills, setSkills] = useState('');
  const [goal, setGoal] = useState('');
  const [dailyTime, setDailyTime] = useState(1); // Default to 1 hour
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 💡 TO DO: Implement API call here (Task 2.3)
    // 1. Create FormData object
    // 2. Call your Flask endpoint (e.g., /api/roadmap)
    // 3. Handle success/error and reset state or navigate to RoadmapView

    console.log('Form Submitted:', { skills, goal, dailyTime, file });

    // Simulate API delay
    setTimeout(() => {
        setIsSubmitting(false);
        alert('Roadmap generation request sent! Check the console.');
    }, 2000); 
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
      
      {/* 1. Current Skills Input */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-text-base mb-2">
          Current Skills (Comma-separated, e.g., Python, SQL, Flask)
        </label>
        <div className="relative">
          <SparklesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
          <input
            id="skills"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            placeholder="What do you know already?"
            className="w-full pl-10 pr-4 py-2 bg-surface border border-primary/30 rounded-lg focus:ring-primary focus:border-primary placeholder-text-muted/70 text-text-base transition duration-150"
          />
        </div>
      </div>

      {/* 2. Learning Goal Input */}
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-text-base mb-2">
          Your Ultimate Learning Goal
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

      <div className="flex flex-col sm:flex-row gap-6">
        {/* 3. Daily Time Slider */}
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

        {/* 4. Optional Paper Upload (Task 2.2) */}
        <div className="flex-1">
            <label className="block text-sm font-medium text-text-base mb-2">
              Optional: Upload Research Paper (PDF)
            </label>
            <div className="flex items-center space-x-2">
                <label className="cursor-pointer bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center border border-primary">
                    <PaperClipIcon className="h-5 w-5 mr-2" />
                    {file ? 'Change File' : 'Select File'}
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept=".pdf"
                        className="hidden"
                    />
                </label>
                <span className="text-sm text-text-muted truncate flex-1">
                    {file ? file.name : 'No file selected'}
                </span>
            </div>
        </div>
      </div>
      
      {/* 5. Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 mt-8 rounded-lg font-semibold text-background transition duration-300 transform hover:scale-[1.01] ${
          isSubmitting 
            ? 'bg-primary-dark cursor-not-allowed opacity-70' 
            : 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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