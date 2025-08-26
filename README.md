# DineDash Frontend

A modern, responsive dashboard for restaurant analytics built with **React**, **Tailwind CSS**, and **Chart.js**.

---

## ✨ Features

- **Restaurant Listing:**  
  View, search, filter, and paginate restaurants by name, location, and cuisine.

- **Restaurant Metrics:**  
  Select a restaurant and date range to view:
  - Daily Revenue (line chart)
  - Daily Orders Count (line chart)
  - Daily Average Order Value (line chart)
  - Peak Order Hour per Day (grouped bar chart)

- **Top Performers:**  
  See the top 3 restaurants by revenue for a selected date range.

- **Advanced Filters:**  
  Filter metrics by amount range and hour range.

- **Dark/Light Theme:**  
  Toggle between dark and light mode. Theme is managed via React context and Tailwind’s `dark:` classes.

- **Responsive Design:**  
  Works well on desktop and mobile screens.

---

## 🛠️ Tech Stack

- **React** (with hooks and context)
- **Tailwind CSS** (utility-first styling, dark mode support)
- **Chart.js** (via `react-chartjs-2`)
- **Material UI** (for theme toggle switch)
- **Vite** (for fast development)

---

## 🚀 Getting Started

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd restaurants-dashboard-frontend/restaurants-dashboard
    ```

2. **Create a `.env` file in the root directory:**
    ```
    VITE_API_BASE_URL=https://your-api-url.com
    ```
    > ⚠️ The `.env` file is not included in the repository. You must create it yourself before running the project.

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
  components/      // Reusable UI components (Header, ThemeToggler, graphs, etc.)
  context/         // Theme context for dark/light mode
  pages/           // Main pages (Dashboard, etc.)
  App.jsx          // App entry point
  main.jsx         // Vite entry point
tailwind.config.js // Tailwind CSS config (darkMode: 'class')
```

---

## 🎨 Theming

- Theme is toggled using the switch in the header.
- The current theme is stored in React context and updates the `dark` class on `<html>`.
- Tailwind’s `dark:` classes are used throughout for seamless dark mode support.

---

## 📝 Customization

- **API Integration:**  
  The dashboard expects backend APIs for restaurants and metrics. Update API endpoints as needed.
- **Styling:**  
  Easily customize colors and layout via Tailwind classes.

---

## 📸 Demo

### Light Mode

![Light Mode Dashboard](./assets/light-dashboard.png)

### Dark Mode

![Dark Mode Dashboard](./assets/dark-dashboard.png)

---

**Made with ❤️ using React and Tailwind