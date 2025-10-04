import React from 'react';
import Navbar from './Navbar';
import GoalForm from './components/GoalForm'; // 👈 1. Import the new component

function App() {
  return (
    // Set the overall background and minimum height, applying the 'background' color from tailwind.config.js
    <div className="min-h-screen bg-background text-text-base">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl md:text-5xl mb-6">
          Personalized Learning Platform 🚀
        </h1>
        <p className="text-text-muted mb-10 max-w-2xl">
          Enter your goals and available time to generate your custom, AI-powered learning roadmap and conquer new skills.
        </p>

        {/* // Start Your Journey Section: Replaced placeholder with GoalForm
        */}
        <div className="bg-surface p-6 sm:p-8 rounded-xl shadow-lg border border-surface/50">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Start Your Journey</h2>
          
          {/* 2. Replace the placeholder div with the component */}
          <GoalForm /> 
        </div>

        {/* // Placeholder for Roadmap View 
        */}
        <section className="mt-12">
           <h2 className="text-2xl font-bold text-text-base mb-6">Your Learning Roadmap</h2>
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-text-muted/50 rounded-lg text-text-muted">
             [RoadmapView.jsx Placeholder: Milestones will appear here after generation]
           </div>
        </section>
      </main>
    </div>
  );
}

export default App;