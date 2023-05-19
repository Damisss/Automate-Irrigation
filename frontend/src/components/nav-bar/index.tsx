import {FunctionComponent, useState} from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import {GiFruitTree, GiTomato} from 'react-icons/gi'
//GiFruitTree
//DiRasberryPi
//GiTomato
export const NavBar:FunctionComponent = ()=>{
    const [showMenu, setShowMenu] = useState(false)
    const menuItems = [
        {
            path: '/',
            icon: <GiTomato/>,
            name: 'Agrumes'
        },
        // {
        //     path: '/cr',
        //     icon: <MdToken/>,
        //     name: 'Tokens'  
        // },
        {
            path: '/poivre',
            icon: <GiFruitTree/>,
            name: 'Poivre'
        }
    ]
    const showMenuItems = (item:{name:string, icon: JSX.Element, path:string}, ind:number)=>(
        <div key={ind}>
            <NavLink  
                to={item.path} 
                className={({ isActive, isPending }) =>
                `flex felx-row items-center mr-4 text-bold text-xl hover:text-white hover:bg-[#3700B3] ${isActive ? "text-[#008080]":''
            }`}
            >
                {item.icon}
                <div className='ml-2'>{item.name}</div>
            </NavLink>
        </div>
    )

    return(
        
    <div>
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    
    <div className="flex md:order-2">
        <button
             onClick={()=>setShowMenu(!showMenu)}
            type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
        </button>
    </div>
    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
        <div className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        {
            menuItems.map((item, ind)=>(
                <NavLink to={item.path}
                    key={ind}
                    className={({ isActive, isPending }) =>
                        ` flex felx-row text-2xl items-center font-bold block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-[#3700B3] md:hover:bg-transparent md:hover:text-[#6200EE] md:p-0 md:dark:hover:text-[#3700B3] dark:text-white dark:hover:bg-[#3700B3] dark:hover:text-[#3700B3] md:dark:hover:bg-transparent dark:border-[#3700B3] ${isActive ? "text-[#008080]":''}`
                    }
                >  
                    {item.icon}
                    <div className='ml-2'>{item.name}</div>
                </NavLink>
            ))
        }
        </div>
    </div >
        { showMenu && <div className='md:hidden'>
            <div
            className="fixed bg-[#00000080] top-0 left-0 w-full h-full z-50"
            onClick={()=>setShowMenu(false)}
            ></div>
            <div className="fixed bg-white top-0 left-0 w-4/5 h-full z-50 shadow">
                <div className="font-bold text-2xl mb-4">
                    <span className='text-[#008080]'>Menu</span>
                </div>
                {menuItems.map(showMenuItems)} 
            </div>
            </div>
        }
    </div>
    </nav>
    <Outlet/>
    </div>

    )
}