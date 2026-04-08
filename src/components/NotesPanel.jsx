import { useState } from 'react';
import { format } from 'date-fns';

export default function NotesPanel({ selectedDate, notes, onSaveNote }) {
  const [currentInput, setCurrentInput] = useState('');

  // Extract the specific notes array for the selected date (if any), or default 'general'
  const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'general';
  const currentNotes = notes[dateKey] || [];

  const handleSave = () => {
    if (currentInput.trim()) {
      onSaveNote(dateKey, currentInput.trim());
      setCurrentInput('');
    }
  };

  return (
    <div className="w-full md:w-80 bg-amber-50 h-full min-h-[400px] shadow-xl rounded-sm border border-amber-200/60 p-6 flex flex-col relative rotate-1 md:mt-12">
      {/* Sticky Note top fold effect */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-transparent"></div>

      <h3 className="text-xl font-serif font-bold text-amber-950 mb-6 border-b border-amber-900/10 pb-2">
        {selectedDate ? `Notes for ${format(selectedDate, 'MMM do')}` : 'Monthly Memos & Notes'}
      </h3>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto mb-4 font-serif text-slate-700 italic">
        {currentNotes.length === 0 ? (
          <p className="text-amber-900/40 text-sm">No notes yet... jot something down!</p>
        ) : (
          currentNotes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2 border-b border-amber-900/5 pb-2">
              <span className="text-amber-600 mt-1 text-xs">●</span>
              <p className="leading-snug">{note}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="New note..."
          className="w-full bg-amber-100/50 border border-amber-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif italic placeholder:text-amber-900/30 resize-none h-20 shadow-inner"
        />
        <button
          onClick={handleSave}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded shadow transition-colors text-sm"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
