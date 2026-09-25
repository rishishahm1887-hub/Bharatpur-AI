import { Link } from "react-router-dom"
import { useClerk, UserButton, useUser } from "@clerk/react"

const Navbar = () => {

    const { openSignIn } = useClerk()
    const { user } = useUser()

    return (
        <div className='w-full lg:px-20 flex items-center'>
            <div className='w-full py-4 flex justify-between items-center px-10'>
                <div>
                    <h1 className="text-3xl font-bold">Bharatpur AI</h1>
                </div>
                <div className="bg-green-100 px-10 py-3 rounded-2xl">
                    <ul className='flex lg:gap-10 md:gap-5 text-green'>
                        <Link to='/home'> Home</Link>
                        <Link to='/explore'> Explore</Link>
                        <Link to='/plan-my-trip'> Plan My Trip</Link>

                        <Link to='/ai-guides'> AI Guide</Link>

                        <Link to='/my-trip'> My Trips</Link>
                        <Link to='/place-map'> Map</Link>
                        <Link to='/review'> Review</Link>
                    </ul>
                </div>

                {
                    user ?
                        <UserButton />
                        :
                        (
                            <div onClick={openSignIn} className="bg-orange-700 font-medium text-white px-7 py-2 rounded-full">
                                signin
                            </div>
                        )
                }
            </div>
        </div>
    )
}

export default Navbar