import React, {createContext,useState } from 'react'

export const QuizzContext = createContext()

 function QuizzProvider({children}) {
    const [Room,SetRoom] = useState(false)
    const [Rankings,SetRankings] = useState([])
     
    
    
   
    
  return (
    <QuizzContext.Provider value={{SetRoom,Room,Rankings,SetRankings}}>
        {children}
    </QuizzContext.Provider>
  )
}

export default QuizzProvider