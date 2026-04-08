import { useState } from 'react';
import { isSameDay, isAfter, isBefore, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

function DayCell({ dayObj, startDate, endDate, onDateClick, notes, onSaveNote, openNoteDate, setOpenNoteDate }) {
  const { date, isCurrentMonth, isToday } = dayObj;
  
  const dateKey = format(date, 'yyyy-MM-dd');
  const hasNotes = notes && notes[dateKey] && notes[dateKey].length > 0;
  const isNoteOpen = openNoteDate === dateKey;

  const [noteInput, setNoteInput] = useState('');

  const isStart = startDate && isSameDay(date, startDate);
  const isEnd = endDate && isSameDay(date, endDate);
  const isInRange =
    startDate &&
    endDate &&
    isAfter(date, startDate) &&
    isBefore(date, endDate);

  // Default cell and button classes (Using Amber/Charcoal theme per preferences)
  let cellClass = 'relative flex items-center justify-center py-1 z-10';
  let buttonClass = 'text-slate-700 hover:bg-slate-100';

  if (!isCurrentMonth && !isInRange && !isStart && !isEnd) {
    buttonClass = 'text-slate-300 hover:bg-slate-50';
  } else if (isToday && !isStart && !isEnd && !isInRange) {
    buttonClass = 'text-amber-600 font-extrabold hover:bg-amber-50';
  }

  if (isStart && isEnd) {
    buttonClass = 'text-amber-900 font-bold shadow-sm';
  } else if (isStart) {
    buttonClass = 'text-amber-900 font-bold shadow-sm';
  } else if (isEnd) {
    buttonClass = 'text-amber-900 font-bold shadow-sm';
  } else if (isInRange) {
    buttonClass = 'text-amber-900 font-semibold hover:bg-amber-200';
  }

  const handleCellClick = () => {
    // If not dragging range, open note (or we can just do both)
    onDateClick(date);
    if (!isNoteOpen) {
      setOpenNoteDate(dateKey);
      setNoteInput(''); // reset
    } else {
      setOpenNoteDate(null);
    }
  }

  const saveNote = (e) => {
    e.stopPropagation();
    if (noteInput.trim()) {
      onSaveNote(dateKey, noteInput.trim());
      setNoteInput('');
    }
    setOpenNoteDate(null);
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Liquid Range Background (Framer Motion) */}
      <div className="absolute inset-0 flex items-center z-0 overflow-visible pointer-events-none">
        <AnimatePresence>
          {(isStart || isEnd || isInRange) && (
            <motion.div
              layoutId="date-selection-liquid"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`absolute top-1 bottom-1 ${
                isStart && !isEnd && endDate ? 'left-1/2 right-0 bg-amber-100 rounded-l-full' 
                : isEnd && !isStart && startDate ? 'right-1/2 left-0 bg-amber-100 rounded-r-full'
                : isInRange ? 'left-0 right-0 bg-amber-100'
                : 'left-1/2 right-1/2 bg-amber-100 border-[2.5px] border-amber-600 rounded-full w-10 h-10 -translate-x-1/2 -translate-y-1/2 top-1/2' // isolated start or end
              }`}
            />
          )}

          {/* Draw solid Start/End circle explicitly on top of range layout */}
          {(isStart || isEnd) && (
            <motion.div
              layoutId={`range-cap-${dateKey}`}
              className="absolute w-10 h-10 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 border-[2.5px] border-amber-600 bg-amber-100"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Button Content */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleCellClick}
        className={`w-9 h-9 rounded-full z-20 text-[13px] relative flex items-center justify-center transition-colors duration-200 ${buttonClass}`}
      >
        {date.getDate()}
        
        {/* Ink Dot for Notes */}
        {hasNotes && (
          <motion.span 
            className="w-1.5 h-1.5 rounded-full absolute -bottom-0.5 right-[10%] opacity-80"
            style={{ backgroundColor: '#1e1b4b', mixBlendMode: 'multiply' }} // Deep ink color
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
        
        {/* Today Underline */}
        {isToday && !isStart && !isEnd && !isInRange && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full" />
        )}
      </motion.button>

      {/* Inline Sticky Note Popover */}
      <AnimatePresence>
        {isNoteOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 2 }}
            exit={{ opacity: 0, scale: 0.8, y: 10, rotate: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-yellow-50 border border-yellow-200 shadow-xl rounded-sm p-3 z-50 origin-top"
          >
            {/* Tiny "tape" visual */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/40 rotate-[-3deg] shadow-[0_1px_1px_rgba(0,0,0,0.05)]" />
            
            {hasNotes && (
              <div className="mb-2 max-h-24 overflow-y-auto w-full">
                {notes[dateKey].map((n, i) => (
                  <p key={i} className="text-xs font-serif italic text-amber-900/90 leading-tight mb-1 border-b border-amber-900/10 pb-1">
                    {n}
                  </p>
                ))}
              </div>
            )}
            
            <div className="flex flex-col gap-2 relative z-10" onClick={(e) => e.stopPropagation()}>
              <input 
                type="text"
                autoFocus
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveNote(e)}
                placeholder="Jot a note..."
                className="w-full bg-transparent border-b border-yellow-300 focus:border-yellow-500 focus:outline-none text-sm font-serif italic text-slate-800 placeholder:text-yellow-600/50"
              />
              {noteInput.trim() && (
                <button 
                  onClick={saveNote}
                  className="text-[10px] font-bold uppercase tracking-wider text-yellow-800 bg-yellow-200/50 hover:bg-yellow-300/50 py-1 rounded transition-colors"
                >
                  Save Scribble
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CalendarGrid({ days, startDate, endDate, onDateClick, notes, onSaveNote }) {
  const [openNoteDate, setOpenNoteDate] = useState(null);

  return (
    <div className="grid grid-cols-7 grid-rows-6 h-full px-2 relative">
      {days.map((dayObj, index) => (
        <DayCell
          key={index}
          dayObj={dayObj}
          startDate={startDate}
          endDate={endDate}
          onDateClick={onDateClick}
          notes={notes}
          onSaveNote={onSaveNote}
          openNoteDate={openNoteDate}
          setOpenNoteDate={setOpenNoteDate}
        />
      ))}
    </div>
  );
}
