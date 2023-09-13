import deletePost from './../../logic/deletePost'
import context from '../../context'

export default function DeletePostModal(props) {
    const handleSubmitPost = (event) => {
        event.preventDefault()

        try {
            deletePost(context.token, props.postId)
                .then(() => {
                    props.onDeletePost()
                })
                .catch(error => {
                    alert(error.message)
                    props.onHideDeletePost()
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleCancelDeletePost = () => props.onHideDeletePost()

    return <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full z-2 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmitPost} className="flex flex-col justify-center items-center p-6 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-64" action="">
            <h3 className="font-bold text-xl text-color1 mb-4">Delete post</h3>
            <p className='m-1 text-color1 font-semibold'>Are you sure to delete this post?</p>
            <div className="flex justify-around mt-5 w-full">
                <button type="submit" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Delete
                </button>
                <button onClick={handleCancelDeletePost} type="button" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Cancel
                </button>
            </div>
        </form>
    </div>
}