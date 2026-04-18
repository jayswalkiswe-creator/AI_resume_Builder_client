import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center h-screen dark:bg-slate-950'>
      <div className='size-12 border-3 border-gray-400 dark:border-slate-600 border-t-transparent rounded-full animate-spin'></div>
    </div>
  )
}

export default Loader
