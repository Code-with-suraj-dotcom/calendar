import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, eachDayOfInterval } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { generateCalendarGrid, getISTToday } from './calendarUtils'
import CalendarGrid from './components/CalendarGrid'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const MONTHLY_IMAGES = [
  // Jan: Misty morning in Northern India (Winter Chill)
  "https://images.unsplash.com/photo-1544085311-11a028465b03?auto=format&fit=crop&q=80&w=1200", 
  
  // Feb: Mustard fields of Punjab (Spring beginning)
  "https://t3.ftcdn.net/jpg/17/36/91/06/360_F_1736910619_ODXs6gEo8DOVfIstmpDG8QsLYM89Mq0a.jpg", 
  
  // Mar: Holi Colors / Gulal (Festival of Spring)
  "https://blog-img-dev.s3.ap-south-1.amazonaws.com/blog/wp-content/uploads/2025/03/Festivals-In-March-840x427.jpg", 
  
  // Apr: Bright Orange Palash / Flame of the Forest
  "https://images.unsplash.com/photo-1588615419957-bf66d53c6b49?auto=format&fit=crop&q=80&w=1200", 
  
  // May: Tropical Summer / Coconut Groves (Heat of May)
  "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=1200", 
  
  // Jun: Golden Sunset over Indian Plains (Pre-monsoon heat)
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200", 
  
  // Jul: Lush Green Tea Gardens, Munnar (Monsoon Arrival)
  "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&q=80&w=1200", 
  
  // Aug: Rain on glass / Monsoon Backwaters
  "https://media.istockphoto.com/id/1257951336/photo/transparent-umbrella-under-rain-against-water-drops-splash-background-rainy-weather-concept.jpg?s=612x612&w=0&k=20&c=lNvbIw1wReb-owe7_rMgW8lZz1zElqs5BOY1AZhyRXs=", 
  
  // Sep: Clear blue skies after rain (Autumn onset)
  "https://miro.medium.com/1*ziRhCIe9mM13RWePFni1XQ.jpeg", 
  
  // Oct: Marigold (Genda Phool) for Festive Season
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLyhCgegrhn6rDPlgArjC-bulA9It1QJ8F1w&s", 
  
  // Nov: Foggy Morning Dew / Varanasi Ghats aesthetic
  "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80&w=1200", 
  
  // Dec: Cozy Warmth / Snow-capped Peaks
  "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=80&w=1200"
];

function App() {
  const istToday = getISTToday()
  const [viewDate, setViewDate] = useState(new Date(istToday.getFullYear(), istToday.getMonth(), 1))
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [notes, setNotes] = useState({})
  const [toastMsg, setToastMsg] = useState('')

  const days = generateCalendarGrid(viewDate)

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else {
      if (date < startDate) {
        setEndDate(startDate)
        setStartDate(date)
      } else {
        setEndDate(date)
      }
    }
  }

  const handleSaveNote = (dateKey, newNote) => {
    if (startDate && endDate) {
      const start = startDate < endDate ? startDate : endDate
      const end = startDate < endDate ? endDate : startDate
      const intervalDays = eachDayOfInterval({ start, end })

      setNotes(prev => {
        const updated = { ...prev }
        intervalDays.forEach(d => {
          const key = formatInTimeZone(d, 'Asia/Kolkata', 'yyyy-MM-dd')
          updated[key] = [...(updated[key] || []), newNote]
        })
        return updated
      })

      setToastMsg('Notes added to range!')
    } else {
      setNotes(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newNote]
      }))
      setToastMsg('Note added to day!')
    }
  }

  // Clear toast automatically
  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(''), 2500)
      return () => clearTimeout(t)
    }
  }, [toastMsg])

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const currentMonthIndex = viewDate.getMonth()

  return (
    <div 
      className="min-h-[100dvh] md:h-[100dvh] w-full overflow-x-hidden md:overflow-hidden bg-slate-50 flex items-center justify-center p-0 md:p-8 font-sans text-slate-800 relative"
    >
      
      {/* Desktop Wallpaper */}
      <div 
        className="hidden md:block absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://lifencolors.in/cdn/shop/products/2eeb6d_1e9031fc8003480ebe06f752abd2bed6_mv2.jpg?v=1753624655')" }}
      ></div>

      {/* Background Overlay for readable contrast */}
      <div className="hidden md:block absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 z-50 bg-amber-800 text-white px-6 py-3 rounded-full shadow-lg font-medium tracking-wide flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Calendar Container */}
      <div className="relative z-10 w-full max-w-2xl md:h-[90vh] md:max-h-[850px] bg-[#fdfdfd] md:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-none md:rounded-sm border-0 md:border border-slate-200 flex flex-col shrink-0 min-h-screen md:min-h-0">
        
        {/* Hanging Hole (Skeuomorphic Detail) */}
        <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10 ring-1 ring-slate-300"></div>

        {/* Top Section (Hero / Photo) - approx 35% */}
        <div className="h-40 md:h-[35%] shrink-0 w-full pt-4 md:pt-10 px-2 md:px-6 pb-2">
          <div className="w-full h-full relative rounded-md overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-slate-200/60 ring-1 ring-black/5 bg-slate-200">
            <AnimatePresence mode="popLayout">
              <motion.img 
                key={currentMonthIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={MONTHLY_IMAGES[currentMonthIndex]} 
                alt={`${monthName} Indian Theme Cover`} 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Overlay to give it a printed photo look */}
            <div className="absolute inset-0 mix-blend-multiply bg-amber-900/5 pointer-events-none"></div>
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none"></div>
          </div>
        </div>

        {/* Bottom Section (Content Area) - flex-1 space fill */}
        <div className="flex-1 md:overflow-hidden bg-white mx-2 md:mx-6 mb-4 md:mb-6 mt-2 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded p-2 md:p-4 flex flex-col">
           
           {/* Month Header and Navigation */}
           <div className="flex items-center justify-between px-2 mb-6 mt-2">
             <button 
               onClick={handlePrevMonth}
               className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all duration-200"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             <h2 className="text-xl font-bold font-serif text-slate-800 tracking-wide uppercase">
               {monthName}
             </h2>
             <button 
               onClick={handleNextMonth}
               className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all duration-200"
             >
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>

           {/* Weekday Labels */}
           <div className="grid grid-cols-7 gap-2 mb-3 px-2">
             {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
               <div key={day} className="text-center text-[10px] font-semibold text-slate-400 tracking-wider">
                 {day}
               </div>
             ))}
           </div>

           {/* Date Grid Area */}
           <div className="flex-1 mt-1 relative perspective-[1000px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={viewDate.toISOString()}
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                exit={{ opacity: 0, rotateX: -90 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className="absolute inset-0"
                style={{ transformOrigin: 'top', backfaceVisibility: 'hidden' }}
              >
                <CalendarGrid 
                  days={days} 
                  startDate={startDate} 
                  endDate={endDate} 
                  onDateClick={handleDateClick} 
                  notes={notes}
                  onSaveNote={handleSaveNote}
                />
              </motion.div>
            </AnimatePresence>
           </div>
        </div>
        
      </div>
    </div>
  )
}

export default App
