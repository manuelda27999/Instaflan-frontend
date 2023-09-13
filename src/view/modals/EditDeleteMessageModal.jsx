import editMessage from '../../logic/editMessage'
import deleteMessage from '../../logic/deleteMessage'
import context from '../../context'

export default function EditDeleteMessageModal(props) {
    const message = props.message

    const handleEditMessage = (event) => {
        event.preventDefault()

        const text = event.target.text.value

        try {
            editMessage(context.token, message.id, text)
                .then(() => {
                    props.onHideEditDeletePost()
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleDeleteMessage = () => {
        try {
            deleteMessage(context.token, message.id)
                .then(() => {
                    props.onHideEditDeletePost()
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleCancelEditDeleteMessage = () => props.onHideEditDeletePost()

    return <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full z-2 flex flex-col items-center justify-center">
        {message && <form onSubmit={handleEditMessage} className="flex flex-col justify-center items-center p-6 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-64" action="">
            <h3 className="font-bold text-xl text-color1 mb-4 text-center">Edit and delete message</h3>
            <p className="m-1 text-color1 font-semibold">Text</p>
            <textarea
                className='p-1 rounded-xl border-color2 border-2'
                id="text"
                name=""
                cols="25"
                rows="3"
                defaultValue={message.text ? message.text : undefined}
            ></textarea>
            <div className="flex flex-col mt-5 w-full">
                <div className='flex justify-around mb-5'>
                    <button type="submit" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                        Edit
                    </button>
                    <button onClick={handleDeleteMessage} type='button' className='bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3'>
                        Delete
                    </button>
                </div>
                <button onClick={handleCancelEditDeleteMessage} type="button" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Cancel
                </button>
            </div>
        </form>}
    </div>
}