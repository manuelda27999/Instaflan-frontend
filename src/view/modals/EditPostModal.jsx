import { useState, useEffect } from 'react'
import retrievePost from './../../logic/retrievePost'
import editPost from './../../logic/editPost'
import context from '../../context'

export default function EditPostModal(props) {
    const [post, setPost] = useState(null)

    useEffect(() => {
        try {
            retrievePost(context.token, props.postId)
                .then((post) => setPost(post))
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }, [])

    const handleSubmitPost = (event) => {
        event.preventDefault()

        const image = event.target.image.value
        const text = event.target.text.value

        try {
            editPost(context.token, props.postId, image, text)
                .then(() => {
                    props.onEditPost()
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleCancelEditPost = () => props.onHideEditPost()

    return <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full z-2 flex flex-col items-center justify-center">
        {post && <form onSubmit={handleSubmitPost} className="flex flex-col justify-center items-center p-6 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-64" action="">
            <h3 className="font-bold text-xl text-color1 mb-4">Edit post</h3>
            <p className="m-1 text-color1 font-semibold">Image</p>
            <input className='p-1 rounded-xl border-color2 border-2' id="image" type="url" defaultValue={post.image ? post.image : undefined} />
            <p className="m-1 text-color1 font-semibold">Text</p>
            <textarea
                className='p-1 rounded-xl border-color2 border-2'
                id="text"
                name=""
                cols="25"
                rows="5"
                defaultValue={post.text ? post.text : undefined}
            ></textarea>
            <div className="flex justify-around mt-5 w-full">
                <button type="submit" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Edit
                </button>
                <button onClick={handleCancelEditPost} type="button" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Cancel
                </button>
            </div>
        </form>}
    </div>
}