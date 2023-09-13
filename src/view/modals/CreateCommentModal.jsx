import context from "../../context"
import createComment from "../../logic/createComment";

export default function CreateCommentModal(props) {
    const handleSubmitComment = (event) => {
        event.preventDefault()

        const text = event.target.text.value

        try {
            createComment(context.token, props.postId, text)
                .then(() => {
                    props.onCreateComment()
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleCancelCreateComment = () => props.onHideCreateComment()

    return <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full z-2 flex flex-col items-center justify-center">
        <form onSubmit={handleSubmitComment} className="flex flex-col justify-center items-center p-6 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-64" action="">
            <h3 className="font-bold text-xl text-color1 mb-4">Comment post</h3>
            <p className="m-1 text-color1 font-semibold">Text</p>
            <textarea
                className="p-1 rounded-xl border-color2 border-2"
                id="text"
                name=""
                cols="25"
                rows="3"
            ></textarea>
            <div className="flex justify-around mt-5 w-full">
                <button type="submit" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Create
                </button>
                <button onClick={handleCancelCreateComment} type="button" className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
                    Cancel
                </button>
            </div>
        </form>
    </div>
}