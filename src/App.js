import React, { useEffect } from 'react'
import { Footer, Navbar, Sidebar, ThemeSettings } from './components'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { FiSettings } from 'react-icons/fi'
import { TooltipComponent } from '@syncfusion/ej2-react-popups'
import { useStateContext } from './contexts/ContextProvider'
import { Ecommerce, TimeTable, Schedule, Students, Login } from './pages'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MainContent = () => {
  const { currentColor, activeMenu, themeSettings, setThemeSettings } = useStateContext()
  const location = useLocation()

  const isLoginPage = location.pathname === '/login'

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {!isLoginPage && (
        <div className="fixed right-4 bottom-4" style={{ zIndex: '10' }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ backgroundColor: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
      )}
      {!isLoginPage && activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-10">
          <Sidebar />
        </div>
      ) : (
        !isLoginPage && (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )
      )}
      <div
        className={
          activeMenu && !isLoginPage
            ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
            : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
        }
      >
        {!isLoginPage && (
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
        )}
        <div>
          {themeSettings && !isLoginPage && <ThemeSettings />}
          <Routes>
            {/* dashboard */}
            <Route path="/" element={<Ecommerce />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Ecommerce />} />
            <Route path="/time_table" element={<TimeTable />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </div>
        {!isLoginPage && <Footer />}
      </div>
      <ToastContainer />
    </div>
  )
}

export const App = () => {
  const { currentColor, setCurrentColor, currentMode, setCurrentMode } = useStateContext()

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode')
    const currentThemeMode = localStorage.getItem('themeMode')
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor)
      setCurrentMode(currentThemeMode)
    }
  }, [])

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <MainContent />
      </BrowserRouter>
    </div>
  )
}
