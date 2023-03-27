import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen'
import WaitingRoom from './pages/WaitingRoom'
import RankingRoom from './pages/RankingScreen'
import QuizzRoom from './pages/QuizzRoom'
function App() {
  const [count, setCount] = useState(0)

  return (
   <Router>
   <Routes>
    <Route path='/' element={<HomeScreen />}  />
    <Route path='/waiting' element={<WaitingRoom />}  />
    <Route path='/ranking' element={<RankingRoom />}  />
    <Route path='/quizz' element={<QuizzRoom />}  />
   </Routes>
   </Router>
  )
}

export default App
