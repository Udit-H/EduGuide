import React, { useState, useEffect, useRef, useCallback } from 'react';

// Helper: Custom hook for using localStorage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error)
        {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

// --- SVG Icons ---
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const CheckSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
);
const LayersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);
const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9Z"></path><path d="M18 13a6 6 0 0 0-9-9a9 9 0 1 0 9 9Z"></path><path d="M12 3v.01"></path><path d="M21 12h-.01"></path><path d="M12 21v-.01"></path><path d="M3 12h.01"></path><path d="m4.93 4.93-.01.01"></path><path d="m19.07 19.07-.01.01"></path><path d="m4.93 19.07.01-.01"></path><path d="m19.07 4.93.01-.01"></path></svg>
);

// --- MOCK AI API ---
const mockAIApi = (prompt, type) => {
    return new Promise(resolve => {
        setTimeout(() => {
            switch (type) {
                case 'roadmap':
                    resolve([
                        { title: 'Fundamentals', details: `Understand the core concepts of ${prompt}.` },
                        { title: 'Advanced Topics', details: `Dive deeper into complex aspects of ${prompt}.` },
                        { title: 'Practical Application', details: `Build a small project using ${prompt}.` },
                        { title: 'Mastery', details: `Contribute to an open-source project or teach others about ${prompt}.` }
                    ]);
                    break;
                case 'summarize':
                    const sentences = prompt.match(/[^.!?]+[.!?]+/g) || [];
                    resolve(sentences.slice(0, 2).join(' ') || 'Could not summarize. Please provide more text.');
                    break;
                case 'quiz':
                    resolve([
                        { q: `What is the main idea of the provided text?`, a: 'This is a sample answer based on the text.' },
                        { q: `What is a key term mentioned?`, a: 'Another sample answer.' }
                    ]);
                    break;
                case 'projects':
                    resolve([
                        `Build a simple to-do list application using ${prompt}.`,
                        `Create a personal portfolio website showcasing your ${prompt} skills.`,
                        `Replicate the landing page of a popular website with ${prompt}.`
                    ]);
                    break;
                default:
                    resolve('Sorry, I cannot process this request.');
            }
        }, 1500);
    });
};

// --- AI Assistant Tool ---
const AIAssistantTool = () => {
    const [activeTab, setActiveTab] = useState('roadmap');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        if (!input.trim()) return;
        setIsLoading(true);
        setOutput(null);
        const result = await mockAIApi(input, type);
        setOutput(result);
        setIsLoading(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'roadmap':
                return (
                    <div key="roadmap">
                        <h3 className="text-xl font-semibold mb-2 text-gray-200">Learning Roadmap Generator</h3>
                        <p className="text-gray-400 mb-4">Enter a skill or topic you want to learn (e.g., "React Hooks").</p>
                        <form onSubmit={(e) => handleSubmit(e, 'roadmap')} className="flex gap-2 mb-4">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g., Python for Data Science" className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50" disabled={isLoading}>Generate</button>
                        </form>
                        {output && Array.isArray(output) && (
                            <ul className="space-y-4">
                                {output.map((item, i) => (
                                    <li key={i} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                        <h4 className="font-bold text-indigo-400">Milestone {i + 1}: {item.title}</h4>
                                        <p className="text-gray-300">{item.details}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            case 'summarize':
                 return (
                    <div key="summarize">
                        <h3 className="text-xl font-semibold mb-2 text-gray-200">Text Summarizer</h3>
                        <p className="text-gray-400 mb-4">Paste a long research paper or technical article to get a quick summary.</p>
                        <form onSubmit={(e) => handleSubmit(e, 'summarize')} className="flex flex-col gap-2 mb-4">
                            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your text here..." rows="6" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 self-start disabled:opacity-50" disabled={isLoading}>Summarize</button>
                        </form>
                         {typeof output === 'string' && <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"><p className="text-gray-200">{output}</p></div>}
                    </div>
                );
            case 'quiz':
                 return (
                    <div key="quiz">
                        <h3 className="text-xl font-semibold mb-2 text-gray-200">Quiz Generator</h3>
                        <p className="text-gray-400 mb-4">Paste your study material to generate flashcards for reinforcement.</p>
                        <form onSubmit={(e) => handleSubmit(e, 'quiz')} className="flex flex-col gap-2 mb-4">
                             <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your study notes here..." rows="6" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 self-start disabled:opacity-50" disabled={isLoading}>Generate Quiz</button>
                        </form>
                         {output && Array.isArray(output) && (
                            <div className="space-y-2">
                                {output.map((item, i) => (
                                    <div key={i} className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                                        <p className="font-semibold text-gray-200">Q: {item.q}</p>
                                        <p className="text-gray-300">A: {item.a}</p>
                                    </div>
                                ))}
                             </div>
                        )}
                    </div>
                );
            case 'projects':
                return (
                     <div key="projects">
                        <h3 className="text-xl font-semibold mb-2 text-gray-200">Project Suggester</h3>
                        <p className="text-gray-400 mb-4">Enter a skill to get hands-on mini-project ideas.</p>
                        <form onSubmit={(e) => handleSubmit(e, 'projects')} className="flex gap-2 mb-4">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g., CSS, JavaScript" className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50" disabled={isLoading}>Suggest</button>
                        </form>
                        {output && Array.isArray(output) && (
                             <ul className="list-disc list-inside space-y-2 pl-2">
                                {output.map((item, i) => <li key={i} className="text-gray-300">{item}</li>)}
                            </ul>
                        )}
                    </div>
                );
            default: return null;
        }
    };
    
    const tabs = ['roadmap', 'summarize', 'quiz', 'projects'];

    return (
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">AI Learning Assistant</h2>
            <div className="flex border-b border-gray-600 mb-4">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setInput(''); setOutput(null); }} className={`capitalize py-2 px-4 font-semibold transition -mb-px ${activeTab === tab ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-400 hover:text-indigo-400'}`}>{tab}</button>
                ))}
            </div>
            <div className="min-h-[20rem] flex items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
                         <span>Generating...</span>
                    </div>
                ) : renderTabContent() }
            </div>
        </div>
    );
};

// --- Pomodoro Timer Component ---
const PomodoroTool = () => {
    const [minutes, setMinutes] = useLocalStorage('pomodoro-minutes', 25);
    const [seconds, setSeconds] = useLocalStorage('pomodoro-seconds', 0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useLocalStorage('pomodoro-mode', 'work');

    const audioContextRef = useRef(null);

    const playSound = useCallback(() => { /* ... (Content is unchanged) ... */ }, []);

    useEffect(() => { /* ... (Content is unchanged) ... */ }, [isActive, seconds, minutes, mode, playSound, setMinutes, setSeconds, setMode]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => { setIsActive(false); changeMode(mode); };
    const changeMode = (newMode) => { /* ... (Content is unchanged) ... */ };

    const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const totalSeconds = (mode === 'work' ? 25 : mode === 'shortBreak' ? 5 : 15) * 60;
    const secondsPassed = totalSeconds - (minutes * 60 + seconds);
    const progress = (secondsPassed / totalSeconds) * 100;

    const modeStyles = { work: 'bg-red-600 text-white', shortBreak: 'bg-green-600 text-white', longBreak: 'bg-blue-600 text-white' };
    const progressStyles = { work: 'bg-red-500', shortBreak: 'bg-green-500', longBreak: 'bg-blue-500' };

    return (
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col items-center space-y-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100">Pomodoro Timer</h2>
            <div className="flex space-x-2">
                <button onClick={() => changeMode('work')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'work' ? modeStyles.work : 'bg-gray-700 text-gray-300'}`}>Work</button>
                <button onClick={() => changeMode('shortBreak')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'shortBreak' ? modeStyles.shortBreak : 'bg-gray-700 text-gray-300'}`}>Short Break</button>
                <button onClick={() => changeMode('longBreak')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'longBreak' ? modeStyles.longBreak : 'bg-gray-700 text-gray-300'}`}>Long Break</button>
            </div>
            <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute w-full h-full bg-gray-700 rounded-full"></div>
                <div className={`absolute w-full h-full rounded-full ${progressStyles[mode]}`} style={{ clipPath: `inset(0% ${100 - progress}% 0% 0%)` }}></div>
                <div className="relative w-40 h-40 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-5xl font-mono font-bold text-gray-100">{time}</span>
                </div>
            </div>
            <div className="flex space-x-4">
                <button onClick={toggleTimer} className={`px-8 py-3 rounded-lg font-semibold text-white transition ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : `${modeStyles[mode]} hover:opacity-90`}`}>{isActive ? 'Pause' : 'Start'}</button>
                <button onClick={resetTimer} className="px-8 py-3 rounded-lg font-semibold bg-gray-600 text-gray-100 hover:bg-gray-500 transition">Reset</button>
            </div>
        </div>
    );
};

// --- To-Do List Component ---
const TodoTool = () => {
    const [tasks, setTasks] = useLocalStorage('todo-tasks', []);
    const [newTask, setNewTask] = useState('');

    const addTask = (e) => { /* ... (Content is unchanged) ... */ };
    const toggleTask = (id) => { /* ... (Content is unchanged) ... */ };
    const deleteTask = (id) => { /* ... (Content is unchanged) ... */ };

    return (
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">To-Do List</h2>
            <form onSubmit={addTask} className="flex mb-4">
                <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a new task..." className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 font-semibold transition">Add</button>
            </form>
            <ul className="space-y-2 h-64 overflow-y-auto pr-2">
                {tasks.length === 0 && <p className="text-gray-400 text-center mt-8">No tasks yet. Add one!</p>}
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg shadow-sm">
                        <span onClick={() => toggleTask(task.id)} className={`cursor-pointer text-gray-200 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</span>
                        <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-400 font-bold transition">✕</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- Flashcards Component ---
const FlashcardTool = () => {
    const [decks, setDecks] = useLocalStorage('flashcard-decks', [{ id: 1, name: 'React Basics', cards: [{ q: 'What is JSX?', a: 'JavaScript XML' }] }]);
    const [activeDeckId, setActiveDeckId] = useLocalStorage('flashcard-activeDeck', null);
    const [newDeckName, setNewDeckName] = useState('');
    const [newCard, setNewCard] = useState({ q: '', a: '' });
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const activeDeck = decks.find(d => d.id === activeDeckId);

    const addDeck = (e) => { /* ... (Content is unchanged) ... */ };
    const addCard = (e) => { /* ... (Content is unchanged) ... */ };
    const handleDeckSelect = (id) => { /* ... (Content is unchanged) ... */ };
    const navigateCard = (direction) => { /* ... (Content is unchanged) ... */ };

    if (activeDeck) {
        return (
            <div className="p-6 bg-gray-800 rounded-xl shadow-lg w-full max-w-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4"><button onClick={() => setActiveDeckId(null)} className="text-blue-400 hover:underline">&larr; Back to Decks</button><h2 className="text-2xl font-bold text-gray-100">{activeDeck.name}</h2></div>
                <div className="mb-6">
                    {activeDeck.cards.length > 0 ? (
                        <><div className="perspective-1000"><div className={`relative w-full h-48 rounded-lg shadow-md transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setIsFlipped(!isFlipped)}><div className="absolute w-full h-full backface-hidden bg-blue-900/50 flex items-center justify-center p-4 text-center rounded-lg border border-blue-700"><p className="text-xl text-blue-200">{activeDeck.cards[currentCardIndex].q}</p></div><div className="absolute w-full h-full backface-hidden bg-green-900/50 flex items-center justify-center p-4 text-center rounded-lg border border-green-700 rotate-y-180"><p className="text-xl text-green-200">{activeDeck.cards[currentCardIndex].a}</p></div></div></div><div className="flex justify-between items-center mt-4"><button onClick={() => navigateCard(-1)} disabled={currentCardIndex === 0} className="px-4 py-2 bg-gray-700 rounded-lg font-semibold disabled:opacity-50 text-gray-200">Prev</button><span className="text-gray-400">{currentCardIndex + 1} / {activeDeck.cards.length}</span><button onClick={() => navigateCard(1)} disabled={currentCardIndex === activeDeck.cards.length - 1} className="px-4 py-2 bg-gray-700 rounded-lg font-semibold disabled:opacity-50 text-gray-200">Next</button></div></>
                    ) : <p className="text-center text-gray-500 my-12">This deck is empty. Add a card below!</p>}
                </div>
                <form onSubmit={addCard} className="space-y-2 p-4 border-t border-gray-600"><h3 className="font-semibold text-lg text-gray-200">Add a New Card</h3><input type="text" value={newCard.q} onChange={e => setNewCard({ ...newCard, q: e.target.value })} placeholder="Question" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /><input type="text" value={newCard.a} onChange={e => setNewCard({ ...newCard, a: e.target.value })} placeholder="Answer" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" /><button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700">Add Card</button></form>
            </div>
        );
    }
    return (
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Flashcard Decks</h2>
            <ul className="space-y-2 mb-4 h-48 overflow-y-auto pr-2">
                {decks.map(deck => (<li key={deck.id} onClick={() => handleDeckSelect(deck.id)} className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition flex justify-between text-gray-200"><span>{deck.name}</span><span className="text-sm text-gray-400">{deck.cards.length} cards</span></li>))}
                {decks.length === 0 && <p className="text-gray-500 text-center mt-8">No decks yet. Create one!</p>}
            </ul>
            <form onSubmit={addDeck} className="flex border-t border-gray-600 pt-4"><input type="text" value={newDeckName} onChange={e => setNewDeckName(e.target.value)} placeholder="New deck name" className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white" /><button type="submit" className="bg-green-600 text-white p-2 px-4 rounded-r-lg font-semibold hover:bg-green-700">Create</button></form>
        </div>
    );
};

// --- Notes Component ---
const NotesTool = () => {
    const [notes, setNotes] = useLocalStorage('study-notes', '');
    return ( <div className="p-6 bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl border border-gray-700"><h2 className="text-2xl font-bold text-gray-100 mb-4">Quick Notes</h2><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Jot down your thoughts here..." className="w-full h-80 p-3 bg-gray-900 border border-gray-600 rounded-lg resize-none font-mono text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div> );
};

// --- Main App Component ---
export default function App() {
    const [activeTool, setActiveTool] = useState('ai_assistant');

    const tools = [
        { id: 'ai_assistant', label: 'AI Assistant', icon: <SparklesIcon /> },
        { id: 'pomodoro', label: 'Pomodoro', icon: <ClockIcon /> },
        { id: 'todo', label: 'To-Do', icon: <CheckSquareIcon /> },
        { id: 'flashcards', label: 'Flashcards', icon: <LayersIcon /> },
        { id: 'notes', label: 'Notes', icon: <FileTextIcon /> },
    ];
    
    const renderTool = () => {
        switch(activeTool) {
            case 'ai_assistant': return <AIAssistantTool />;
            case 'pomodoro': return <PomodoroTool />;
            case 'todo': return <TodoTool />;
            case 'flashcards': return <FlashcardTool />;
            case 'notes': return <NotesTool />;
            default: return <AIAssistantTool />;
        }
    }

    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-200 flex flex-col items-center p-4 sm:p-6">
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
            
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-100">AI-Powered Study Hub</h1>
                <p className="text-gray-400">Your intelligent toolkit for accelerated learning.</p>
            </header>

            <nav className="mb-8 p-2 bg-gray-800 rounded-xl shadow-lg flex flex-wrap justify-center gap-2 border border-gray-700">
                {tools.map(tool => (
                     <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTool === tool.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-700'}`}
                     >
                         {tool.icon}
                         {tool.label}
                     </button>
                ))}
            </nav>

            <main className="w-full flex justify-center">
                {renderTool()}
            </main>
        </div>
    );
}

