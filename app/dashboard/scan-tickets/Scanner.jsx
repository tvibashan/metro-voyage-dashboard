import Image from 'next/image'
import React from 'react'

function Scanner() {
  return (
    <div className='flex flex-col justify-center items-center py-32 bg-white border-[1px] border-gray-300 rounded-3xl'>
        <Image src="/scan.png" width={150} height={150}/>
        <p className='text-[18px] text-[#010A15B2] font-medium mt-4' >Tap and scan tickets</p>
    </div>
  )
}

export default Scanner