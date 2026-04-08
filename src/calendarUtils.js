import {
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay
} from 'date-fns';

// Helper to get today's date adjusted to IST accurately using native Intl APIs
export function getISTToday() {
  const now = new Date();
  const istString = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);

  const [month, day, year] = istString.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

/**
 * Generates a grid of exactly 42 date objects (6 rows x 7 columns) for a specific month.
 * Starts on a Sunday and includes padding days from the previous and next months.
 *
 * @param {Date} viewDate - The month currently being viewed.
 * @returns {Array} An array of date objects.
 */
export function generateCalendarGrid(viewDate) {
  const monthStart = startOfMonth(viewDate);
  const todayIST = getISTToday();
  
  // Find the start of the week for the first day of the month (default Sunday)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });

  const days = [];
  
  // Generate exactly 42 days to fill a 6x7 grid
  for (let i = 0; i < 42; i++) {
    const currentDay = addDays(startDate, i);
    
    days.push({
      date: currentDay,
      isCurrentMonth: isSameMonth(currentDay, monthStart),
      isToday: isSameDay(currentDay, todayIST)
    });
  }

  return days;
}
