import React from 'react'
import { Button } from './Button'

const Header = () => {
    return (
        <div className='p-4 md:p-4 lg:pd-8 flex justify-between items-center w-full'>
            <div className='flex gap-4 md:gap-10 items-center justify-center'>

                <div>Asspass</div>

                <nav>
                    <ul className='flex gap-4 text-sm md:text-md lg:text-lg font-lightbold '>
                        <li>MAP</li>
                        <li>Deals</li>
                        <li>About us</li>
                        <li>Contact us</li>
                    </ul>
                </nav>
            </div>
            <div className='md:gap-2 flex' >            
                <Button text="Sign up" color="#2ecc71"/>
                <Button text="Log in" color="#265049cc7z" />
            </div>
        </div>
    )
}

export default Header