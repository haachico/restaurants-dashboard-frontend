import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import { ThemeProvider } from './context/ThemeContext.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="min-h-screen w-full">
      <ThemeProvider>
        <Header />
        <Dashboard />
      </ThemeProvider>
    </div>
    </>
  )
}

export default App
