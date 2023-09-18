import authenticateUser from "../../logic/authenticateUser"
import context from "../../context"
import { Link } from "react-router-dom"
import { useState } from "react"
import LoadingModal from "../modals/LoadingModal"

export default function Login() {
    const [modal, setModal] = useState(false)

    const handleLoginSubmit = event => {
        event.preventDefault()

        const email = event.target.email.value
        const password = event.target.password.value

        try {
            setModal(true)

            authenticateUser(email, password)
                .then((result) => {
                    context.token = result

                    setModal(false)
                    context.navigate('/home')
                })
                .catch((error) => {
                    alert(error.message)
                })

        } catch (error) {
            alert(error.message)
        }
    }

    return <main className="bg-color5 flex flex-col sm:items-center sm:justify-center justify-start h-screen p-5">
        <form onSubmit={handleLoginSubmit} className="sm:w-96 sm:flex sm:flex-col sm:justify-center" >
            <h2 className="text-5xl text-color1 mb-6 font-semibold">Login</h2>
            <div className="flex flex-col justify-start items-start mb-4">
                <label className="block text-xl font-semibold text-color1 mb-1 ml-1" htmlFor="email">Email:</label>
                <input
                    id="email"
                    className="p-2 rounded-xl border-color2 border-2 w-full"
                    placeholder="email"
                    type="email"
                />
            </div>
            <div className="flex flex-col justify-start items-start mb-4">
                <label className="block text-xl font-semibold text-color1 mb-1 ml-1" htmlFor="password">Password:</label>
                <input
                    id="password"
                    className="p-2 rounded-xl border-color2 border-2 w-full"
                    placeholder="password"
                    type="password"
                />
            </div>
            <button className="bg-color4 text-white border-none rounded-xl px-4 py-3 font-bold text-xl cursor-pointer transition duration-300 hover:bg-color3">Enter</button>
        </form>

        <Link className="text-color1 text-xl fixed bottom-3 left-1/2 transform -translate-x-1/2 block hover:underline" to='/register' >Go to register</Link>
        {modal === true && <LoadingModal />}
    </main>
}