import React from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import { GoPrimitiveDot } from 'react-icons/go'
import { IoIosMore } from 'react-icons/io'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { Doughnut, LineChart, SparkLine, Stacked, Button } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import product9 from '../data/product9.jpg'
import {
  earningData,
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  econPieChartData,
  ecomPieChartData
} from '../data/dummy'

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id='time'
      fields={{ text: 'Time', value: 'Id' }}
      style={{ border: 'none', color: currentMode === 'Dark' && 'white' }}
      value='1'
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth='120px'
    />
  </div>
)

const Ecommerce = () => {
  const { currentColor, currentMode, setCurrentMode } = useStateContext()

  // Default to white theme if not set
  React.useEffect(() => {
    if (currentMode !== 'Dark') {
      setCurrentMode('Light')  // Ensures the default mode is Light
    }
  }, [currentMode, setCurrentMode])

  return (
    <div className={`mt-24 ${currentMode === 'Dark' ? 'dark' : 'light'}`}>
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        {/* Example of a card */}
        <div className="flex m-3 flex-wrap justify-center items-center gap-6">
          {earningData.map((item) => (
            <div
              key={item.title}
              className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg shadow-2xl md:w-56 p-4 pt-9 rounded-xl'
            >
              <button
                type='button'
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className='text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl'
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Continue with other components like SparkLine, Stacked, etc. */}
    </div>
  )
}

export default Ecommerce
