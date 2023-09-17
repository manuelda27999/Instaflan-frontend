import createNewPost from "../../logic/createNewPost";
import context from "../../context"

export default function CreatePostModal(props) {
    const handleSubmitPost = (event) => {
        event.preventDefault()

        const image = event.target.image.value
        const text = event.target.text.value

        try {
            createNewPost(context.token, image, text)
                .then(() => {
                    props.onCreatePost()
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleCancelCreatePost = () => props.onHideCreatePost()

    return <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full z-2 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmitPost} className="flex flex-col justify-center items-center p-6 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-64" action="">
            <h3 className="font-bold text-xl text-color1 mb-4">New post</h3>
            <p className="m-1 text-color1 font-semibold">Text</p>
            <textarea
                className="p-1 rounded-xl border-color2 border-2"
                id="text"
                name=""
                cols="25"
                rows="5"
            ></textarea>
            <p className="m-1 text-color1 font-semibold">Image</p>
            <input placeholder="Insert URL of image" className="p-2 rounded-xl border-color2 border-2" id="image" type="url" />
            <div className="flex justify-around mt-5 w-full">
                <button type="submit" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Create
                </button>
                <button onClick={handleCancelCreatePost} type="button" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Cancel
                </button>
            </div>
        </form>
    </div>
}