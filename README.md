# 🗓️ High-Fidelity Interactive Wall Calendar

A premium, interactive React wall calendar built as a Frontend Engineering challenge. This project focuses on modern skeuomorphism, smooth micro-interactions, and a tactile "paper-on-wall" user experience.

**✨ Live Demo:** [https://calendar-eosin-pi.vercel.app/](https://calendar-eosin-pi.vercel.app/)

## 🌟 The Vision & Design Choices

Unlike standard admin dashboard calendars, this project was built with a **"Physical-First"** philosophy:

* **Modern Skeuomorphism:** Instead of a flat UI, the calendar is placed in a "scene" against a designer wallpaper background with heavy custom shadows to mimic a physical object hanging on a wall.
* **Indian Contextualization:** * **Dynamic Weather Hero:** The top section features 12 unique, high-quality images that change based on the month, reflecting Indian seasons (e.g., Mustard fields in Feb, Monsoon in Aug, Marigolds in Oct).
    * **IST Precision:** The "Today" logic is hardcoded to Indian Standard Time (IST) to ensure accuracy regardless of the user's system timezone.
* **Tactile Interactions:** * **3D Page Flip:** Navigation between months uses a 3D rotation anchored at the top, mimicking the swing of a physical calendar page.
    * **Liquid Range Selection:** Selecting a date range uses a "highlighter" style liquid animation rather than simple block highlights.
    * **Pen-on-Paper Notes:** Notes aren't hidden in sidebars; they are indicated by "ink marks" directly on the calendar dates, with "Sticky Note" pop-ups for editing.

## 🚀 Technical Stack

* **React (Vite)** - For a fast, modern development environment.
* **Tailwind CSS** - For precision styling and responsive layouts.
* **Framer Motion** - To handle the 3D physics-based transitions and staggered animations.
* **Date-fns** - For robust date manipulation and range calculations.
* **Lucide React** - For clean, consistent iconography.

## 🛠️ Performance & Scalability

* **Zero-Scroll Architecture:** The UI uses a fixed-viewport approach on desktop to maintain layout integrity.
* **Adaptive Design:** Implemented a custom responsive strategy that "zooms" into the wall texture on mobile to prioritize grid legibility while maintaining the designer aesthetic.
* **State Management:** Optimized using `useMemo` for calendar grid generation to prevent unnecessary re-renders during animations.

## 📦 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [Your-Repo-Link]
   cd wall-calendar-challenge

2. Install dependencies:
    ```bash
    npm install

3. Start the development server:
    ```bash
    npm run dev


Developed with ❤️ by [Suraj Lakhyani]