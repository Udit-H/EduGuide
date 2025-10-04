import React, { useState } from 'react';
import { LightBulbIcon, AcademicCapIcon, CheckCircleIcon, CodeBracketIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';

// --- Helper Component for Milestone Cards ---
const MilestoneCard = ({ milestone, isActive }) => (
    <div className={`p-5 rounded-lg shadow-md transition duration-300 ${isActive ? 'bg-indigo-50 border-2 border-indigo-600' : 'bg-white border border-gray-200'} cursor-pointer hover:shadow-lg`}>
        <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                {milestone.milestone_number}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
        </div>
        <p className="mt-3 text-sm text-gray-600">{milestone.description}</p>
        <div className="mt-4">
            <h4 className="text-sm font-medium text-indigo-600">Key Concepts:</h4>
            <ul className="list-disc list-inside mt-1 text-xs text-gray-700 space-y-1">
                {milestone.concepts && milestone.concepts.map((concept, index) => (
                    <li key={index}>{concept}</li>
                ))}
                {milestone.concepts && milestone.concepts.length === 0 && <li>Concepts loading...</li>}
            </ul>
        </div>
    </div>
);

// --- Main Roadmap Viewer Component ---
const RoadmapView = ({ data, onReset }) => {
    // Destructure the core data from the API response structure
    const { 
        data: roadmap, 
        skill_name, 
        level,
        roadmap_id
    } = data;

    // Use state to manage which milestone content (Quiz/Flashcards/Project) is currently being viewed
    const [activeMilestoneNumber, setActiveMilestoneNumber] = useState(roadmap.roadmap[0].milestone_number);
    const [showQuiz, setShowQuiz] = useState(true); // Show Quiz first for Milestone 1
    const [showFlashcards, setShowFlashcards] = useState(false);

    // Retrieve the assets for Milestone 1 (as only M1 assets are returned initially)
    const activeQuiz = roadmap.quiz_milestone_1 || [];
    const activeProject = roadmap.mini_project_milestone_1 || {};
    const activeFlashcards = roadmap.flashcards_milestone_1 || [];

    return (
        <div className="p-6 sm:p-8 space-y-8 bg-white rounded-xl">
            {/* Header and Reset Button */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-indigo-600 flex items-center">
                        <AcademicCapIcon className="h-7 w-7 mr-3 text-yellow-500" />
                        Custom Learning Path: {skill_name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Level: <span className="font-semibold text-gray-700">{level}</span> | ID: <span className="text-xs">{roadmap_id}</span></p>
                </div>
                <button 
                    onClick={onReset}
                    className="flex items-center text-sm font-semibold text-red-500 hover:text-red-700 transition duration-150 p-2 border border-red-500 rounded-lg"
                >
                    <XMarkIcon className="h-5 w-5 mr-1" /> Start New Goal
                </button>
            </div>

            {/* Roadmap Overview */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <LightBulbIcon className="h-6 w-6 text-orange-500" />
                    Milestone Breakdown
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roadmap.roadmap.map((milestone, index) => (
                        <div 
                            key={index} 
                            onClick={() => setActiveMilestoneNumber(milestone.milestone_number)} 
                            // Only allow M1 content to be viewed, others are placeholders for now
                            className={milestone.milestone_number === 1 ? 'cursor-pointer' : 'opacity-60 cursor-default'}
                        >
                            <MilestoneCard 
                                milestone={milestone} 
                                isActive={milestone.milestone_number === activeMilestoneNumber}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Assessment and Project Section (Active Milestone 1 Content) */}
            {activeMilestoneNumber === 1 && (
                <div className="space-y-6 pt-4 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        Milestone 1: Action Items & Assessment
                    </h2>

                    {/* Mini-Project Card */}
                    <div className="bg-blue-50 p-6 rounded-xl shadow-lg border-l-4 border-blue-600 space-y-3">
                        <h3 className="text-lg font-bold text-blue-800 flex items-center">
                            <CodeBracketIcon className="h-5 w-5 mr-2" /> Project: {activeProject.title}
                        </h3>
                        <p className="text-sm text-gray-600">Difficulty: {activeProject.difficulty}</p>
                        <details className="mt-2 text-gray-800">
                            <summary className="font-medium cursor-pointer text-sm text-blue-600 hover:text-blue-800 transition duration-150">View Detailed Instructions</summary>
                            <pre className="mt-2 p-4 bg-white/70 border border-gray-100 rounded-md text-xs whitespace-pre-wrap leading-relaxed">{activeProject.instructions}</pre>
                        </details>
                    </div>

                    {/* Assessment Tabs */}
                    <div className="flex space-x-4 border-b border-gray-200">
                        <button
                            onClick={() => { setShowQuiz(true); setShowFlashcards(false); }}
                            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition duration-150 ${showQuiz ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Quiz ({activeQuiz.length} Questions)
                        </button>
                        <button
                            onClick={() => { setShowQuiz(false); setShowFlashcards(true); }}
                            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition duration-150 ${showFlashcards ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Flashcards ({activeFlashcards.length} Cards)
                        </button>
                    </div>

                    {/* Quiz Content */}
                    {showQuiz && (
                        <div className="p-4 bg-green-50 border border-green-300 rounded-lg space-y-6">
                            <h3 className="text-lg font-semibold text-green-700">Test Your Knowledge</h3>
                            {activeQuiz.map((q) => (
                                <details key={q.id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <summary className="font-bold cursor-pointer text-gray-900 flex items-center">
                                        <SparklesIcon className="h-4 w-4 mr-2 text-yellow-500" />
                                        {q.id}. {q.question}
                                    </summary>
                                    <div className="mt-3 space-y-2">
                                        {q.options.map((opt, i) => (
                                            <p key={i} className={`text-sm ${opt[0] === q.answer ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                                                {opt}
                                                {opt[0] === q.answer && ' (Correct)'}
                                            </p>
                                        ))}
                                        <p className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                                            **Explanation:** {q.explanation}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                    
                    {/* Flashcards Content */}
                    {showFlashcards && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-indigo-50 border border-indigo-300 rounded-lg">
                             <h3 className="md:col-span-2 text-lg font-semibold text-indigo-700">Key Concepts for Spaced Repetition</h3>
                            {activeFlashcards.map((card, index) => (
                                <div key={index} className="p-4 bg-white rounded-xl border border-indigo-100 shadow-md transition duration-300 hover:shadow-lg">
                                    <p className="font-bold text-indigo-600">Front (Term):</p>
                                    <p className="text-gray-900 mb-2">{card.front}</p>
                                    <p className="font-semibold text-gray-500 border-t border-gray-100 pt-2">Back (Definition):</p>
                                    <p className="text-sm text-gray-700">{card.back}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoadmapView;
