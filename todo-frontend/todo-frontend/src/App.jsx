import React, { useEffect, useState } from 'react'
import CalendarComponent from './component/CalendarComponent'
import ToDoList from './component/ToDoList'
import { toast } from 'react-toastify'; // Make sure to install this package
import axios from 'axios';

const App = () => {
  const [dayCount, setDayCount] = useState(1);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch day data from backend
  const fetchDayData = async () => {
    try {
      const response = await fetch('http://localhost:4000/day');
      const data = await response.json();
      setDayCount(data.dayCount);
      setDayCompleted(data.completed);
    } catch (error) {
      console.error('Error fetching day data:', error);
    }
  };

  // Initialize day data and progress
  useEffect(() => {
    fetchDayData();
    
    const getDayProgress = () => {
      const now = new Date();
      const secondsPassed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      const percent = (secondsPassed / 86400) * 100;
      return percent.toFixed(2);
    };

    setProgress(getDayProgress());
    const interval = setInterval(() => {
      setProgress(getDayProgress());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check for new day at midnight
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
        fetchDayData(); // This will get the new day count from backend
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleComplete = async () => {
    if (!dayCompleted) {
      try {
        const response = await fetch('http://localhost:4000/day/complete', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setDayCompleted(true);
        toast.success("Day marked as complete");
      } catch (error) {
        console.error('Error completing day:', error);
        toast.error("Failed to mark day as complete");
      }
    }
  };


const handleReset = async () => {
  try {
    await axios.delete('http://localhost:4000/reset-all');
    toast.success('✅ App reset successfully!');
    setDayCount(1);
    setDayCompleted(false);
    // You might also want to refresh the todo list here
  } catch (error) {
    toast.error('❌ Failed to reset');
    console.error(error);
  }
};


  return (
    <div className='mx-2 md:mx-30 pt-2 md:pt-15 text-white main bg-black md:bg-transparent '>
      <div className=' p-2 text-center text-white font-semibold text-xl md:text-3xl rounded mb-2  bg-white/15 backdrop-blur'>
        Friendy To-Do App
      </div>
      <div className=' flex flex-wrap md:flex-nowrap w-[100%] justify-between gap-2 rounded'>
        <div className=' flex flex-col w-full md:w-[40%] gap-2 '>

          <div className=' rounded p-5 flex justify-center bg-white/15 backdrop-blur'>

            <div className=' h-[250px] w-[250px] flex justify-center items-center'>

              {/* Progress bar */}
              <div
                className="radial-progress text-green-500 shadow"
                style={{
                  "--value": progress,
                  "--size": "15rem",
                  "--thickness": "1rem"
                }}
                aria-valuenow={progress}
                role="progressbar"
              >
                <div className='text-center text-white'>
                  <h1 className='text-7xl font-bold'>{dayCount}</h1>
                  <p className='text-4xl font-bold'>{dayCompleted ? <p className=' text-2xl'>COMPLETE</p> : "DAY"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=' rounded p-5  bg-white/15 backdrop-blur '>
            <h1 className=' text-2xl font-semibold text-center mb-5' >📝Follow the Rules</h1>
            <ul className=' pl-5 text-[18px]'>
              <li>🤜Complete the all To Do </li>
              <li>🤜Better than yesterday</li>
              <li>🤜You satiesfied</li>
            </ul>
            <div className=' flex justify-center mt-5 gap-5'>
              <button onClick={handleComplete}
                disabled={dayCompleted} className=' bg-green-600 px-2 md:px-5 py-2 rounded '>Day Complete</button>
              <button onClick={handleReset} className=' bg-red-600 px-2 md:px-5 py-2 rounded cursor-pointer'> 🔁 Restart</button>

            </div>
            
          </div>
        </div>
        <div className='flex flex-col w-full md:w-[60%] bg-white/15 backdrop-blur rounded py-5 px-4 md:px-10 mb-6 md:mb-0 '>
          <h1 className=' md:text-xl font-semibold text-gray-300 mb-1'>Create Today To-Do List</h1>
          <div className='h-[1px] bg-black'></div>
          <ToDoList />
        </div>
      </div>
      
    </div>
  )
}

export default App