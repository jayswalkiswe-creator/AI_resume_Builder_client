import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'
import { toggleTheme } from '../app/features/themeSlice'
import { Moon, Sun } from 'lucide-react'

const Navbar = () => {

    const {user} = useSelector(state=>state.auth)
    const { dark } = useSelector(state => state.theme)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const logoutUser = () => {
        navigate('/')
        dispatch(logout())
    }

  return (
    <div className='shadow bg-white dark:bg-slate-900 dark:border-b dark:border-slate-700'>
        <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 dark:text-slate-100 transition-all'>
            <Link to='/'>
                <img src="/logo.svg" alt="logo" className='h-11 w-auto dark:invert' />
            </Link>
            <div className='flex items-center gap-4 text-sm'>
                <p className='max-sm:hidden'>Hi, {user?.name}</p>
                <button onClick={() => dispatch(toggleTheme())} className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'>
                    {dark ? <Sun className='size-5 text-yellow-400' /> : <Moon className='size-5 text-slate-600' />}
                </button>
                <button onClick={logoutUser} className='bg-white dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar