import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import WaitingRoom from './pages/WaitingRoom'
import RankingRoom from './pages/RankingScreen'
import QuizzRoom from './pages/QuizzRoom'
import socketIO from 'socket.io-client';
import QuizzProvider from './context/QuizzContext'
// const socket = socketIO.connect('http://localhost:3000');
const socket = socketIO.connect('https://quizzappserver.onrender.com');

function App() {

  return (
    <QuizzProvider>

   <Router>
   <Routes>
    <Route path='/' element={<HomeScreen socket={socket} />}  />
    <Route path='/waiting' element={<WaitingRoom socket={socket} />}  />
    <Route path='/ranking' element={<RankingRoom socket={socket} />}  />
    <Route path='/quizz' element={<QuizzRoom socket={socket} />}  />
   </Routes>
   </Router>
   </QuizzProvider>

  )
}

export default App
