'use client'
import Link from 'next/link'
import Button from '../ui/Button'

function Navbar() {
    return (
        <nav className='w-full px-4 py-1 flex items-center justify-between'>
            <div className='logo px-2 py-1'>
                <Link href={'/login'}>
                    <h1 className='text-2xl md:text-3xl font-bold text-accent'>Dashly</h1>
                </Link>
            </div>
            <div className='getStart-btn flex gap-2'>
                <Link href="/login">
                    <Button variant="primary">
                        Sign Up
                    </Button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar