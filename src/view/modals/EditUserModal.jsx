import { useContext } from 'react'
import editUser from '../../logic/editUser'
import context from '../../context'
import { AppContext } from '../../AppContext'

export default function EditUserModal(props) {
    const { user, setUser } = useContext(AppContext)

    const handleSubmitUser = (event) => {
        event.preventDefault()

        const name = event.target.name.value
        const image = event.target.image.value
        const description = event.target.description.value

        try {
            editUser(context.token, name, image, description)
                .then(() => {
                    props.onEditUser()
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleCancelEditUser = () => props.onHideEditUser()

    return <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full z-2 flex flex-col items-center justify-center">
        {user && <form onSubmit={handleSubmitUser} className="flex flex-col justify-center items-center p-6 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-64" action="">
            <h3 className="font-bold text-xl text-color1 mb-4">Edit profile</h3>
            <p className="m-1 text-color1 font-semibold">Name</p>
            <input className='p-2 rounded-xl border-color2 border-2' id="name" type="text" defaultValue={user.name ? user.name : undefined} />
            <p className="m-1 text-color1 font-semibold">Image</p>
            <input placeholder='Insert URL of image' className='p-2 rounded-xl border-color2 border-2' id="image" type="url" defaultValue={user.image ? user.image : undefined} />
            <p className="m-1 text-color1 font-semibold">Description</p>
            <textarea
                className='p-1 rounded-xl border-color2 border-2'
                id="description"
                name=""
                cols="25"
                rows="5"
                defaultValue={user.description ? user.description : undefined}
            ></textarea>
            <div className="flex justify-around mt-5 w-full">
                <button type="submit" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Edit
                </button>
                <button onClick={handleCancelEditUser} type="button" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Cancel
                </button>
            </div>
        </form>}
    </div>
}