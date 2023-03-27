import { Avatar, Badge, Button } from '@mantine/core'
import React from 'react'
import Timer from '../assets/chronometer.png'
function QuizzRoom() {
  return (
    <div  className='h-screen bg-white grid grid-cols-3' >
      {/* Group a gacuhe */}
      <div className=' grid grid-rows-2' >
      <div className='relative bg-white border-b-2 gap-y-4 flex justify-center items-center flex-col  ' >
        <div className='absolute top-4 right-4' >
          <Badge color="green"  >repondu</Badge>
        </div>
      <Avatar size={150}  />
      <p className=' font-medium text-lg' >David ouattara Abrham</p>

      </div>
      <div className='relative bg-white border-b-2 gap-y-4 flex justify-center items-center flex-col  ' >
        <div className='absolute top-4 right-4' >
          <Badge color="yellow"  >en cours</Badge>
        </div>
      <Avatar size={150}  />
      <p className=' font-medium text-lg' >Yao Yan Evrad</p>

      </div>

      </div>
      {/* Block for question */}
      <div className='bg-slate-50 p-2 pt-5 flex flex-col' >
      <div className='flex items-center self-center' >
      <Avatar size={60}  src={Timer} />
      <h1 className='font-semibold ml-4 tracking-wider italic' >00:15 </h1>

      </div>
      {/* Card pour la question */}
      <div className='h-[20rem] bg-white w-full mt-[10rem] drop-shadow-lg  flex flex-col rounded-lg p-10' >
        <h2 className='font-semibold ml-4 text-center text-3xl tracking-wider italic'>Quel est la capitale de la france ?</h2>
        
        {/* Possible Answers */}
        <div className='flex flex-row flex-1 items-end gap-x-4' >
          <p className='text-gray-500 font-medium text-lg' >1)Paris</p>
          <p className='text-gray-500 font-medium text-lg' >2)Abidjan</p>
          <p className='text-gray-500 font-medium text-lg' >3)New York</p>
          <p className='text-gray-500 font-medium text-lg' >4)Dublin</p>
        </div>
      </div>
      <div className='h-[8rem] bg-white  mt-20 drop-shadow-lg flex p-3 flex-col' >
        <p className='text-center'>votre reponse</p>
      <div className=' flex flex-1  flex-row items-center   gap-x-4 rounded-xl' >
        <Button className='bg-blue-500 w-[8rem]' > A</Button>
        <Button className='bg-blue-500 w-[8rem]' > B</Button>
        <Button className='bg-blue-500 w-[8rem]' > C</Button>
        <Button className='bg-blue-500 w-[8rem]' > D</Button>
      </div>
      </div>
      </div>
      {/* group a droite */}
      <div className=' grid grid-rows-2' >
      <div className='relative bg-white border-b-2 gap-y-4 flex justify-center items-center flex-col  ' >
        <div className='absolute top-4 right-4' >
          <Badge color="green"  >repondu</Badge>
        </div>
      <Avatar size={150}  />
      <p className=' font-medium text-lg' >Yves Lionel Diomande</p>

      </div>
      <div className='relative bg-white border-b-2 gap-y-4 flex justify-center items-center flex-col  ' >
        <div className='absolute top-4 right-4' >
          <Badge color="yellow"  >en cours</Badge>
        </div>
      <Avatar size={150}  />
      <p className=' font-medium text-lg' >Cherif ben Ali</p>

      </div>

      </div>
    </div>
  )
}

export default QuizzRoom