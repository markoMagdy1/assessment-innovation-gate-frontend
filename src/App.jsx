import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/routes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div className="min-vh-100">
        <AppRoutes />
      </div>
     <Footer />
    </>
  )
}

export default App
