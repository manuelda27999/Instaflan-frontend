import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import context from "../../context"
import extractUserIdFromToken from "../helpers/extractUserIdFromToken"

import retrievePosts from "../../logic/retrievePosts"
import toggleFavPost from "../../logic/toggleFavPost"

import DeletePostModal from "../modals/DeletePostModal"
import EditPostModal from "../modals/EditPostModal"
import CreateCommentModal from "../modals/CreateCommentModal"

export default function AllPosts(props) {
    const userId = extractUserIdFromToken(context.token)
    const navigate = useNavigate()

    const [modal, setModal] = useState(null)

    const [posts, setPosts] = useState([])

    const [postId, setPostId] = useState([])

    useEffect(() => {
        try {
            retrievePosts(context.token)
                .then((posts) => {
                    setPosts(posts)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }, [props.posts])

    const handleEditPostModal = postId => {
        setPostId(postId)
        setModal("edit-post-modal")
    }

    const handleCancelEditPostModal = () => setModal(null)

    const handleEditPost = () => {
        try {
            retrievePosts(context.token)
                .then(posts => {
                    setPosts(posts)
                    setModal(null)
                    setPostId(null)
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleCommentModal = postId => {
        setPostId(postId)
        setModal("comment-modal")
    }

    const handleCancelCommentModal = () => setModal(null)

    const handleCreateComment = () => {
        try {
            retrievePosts(context.token)
                .then(posts => {
                    setPosts(posts)
                    setModal(null)
                    setPostId(null)
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleDeletePostModal = postId => {
        setPostId(postId)
        setModal("delete-post-modal")
    }

    const handleCancelDeletePostModal = () => setModal(null)

    const handleDeletePost = () => {
        try {
            retrievePosts(context.token)
                .then(posts => {
                    setPosts(posts)
                    setModal(null)
                    setPostId(null)
                })
                .catch(error => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    function handletoggleFavPost(postId) {
        try {
            toggleFavPost(context.token, postId)
                .then(() => {
                    setPosts(posts => {

                        const posts2 = [...posts]

                        const index = posts2.findIndex(post => post.id === postId)
                        const post = posts2[index]

                        const post2 = { ...post }

                        if (post2.fav) {
                            post2.likes--
                        } else {
                            post2.likes++
                        }

                        post2.fav = !post2.fav

                        posts2[index] = post2

                        return posts2
                    })
                })
                .catch((error) => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    const handleProfile = (event, userIdProfile) => {
        event.preventDefault()
        navigate(`/profile/${userIdProfile}/posts`)
    }

    return <section className="pt-2 pb-16 w-full sm:flex sm:flex-col sm:items-center">
        {posts.length === 0 && <h2 className="text-gray-500 mt-6 text-center text-xl font-bold">You do not follow anyone, <Link className="text-color3 mt-6 text-center text-xl font-bold" to='/explorer'>start exploring!!</Link></h2>}
        {posts.length > 0 && posts.map(post => <article key={post.id} className="bg-color5 mb-3 sm:w-96">
            <div className="flex justify-between items-center">
                <div className="flex justify-start items-center pl-3 py-1">
                    <img className="w-12 h-12 rounded-full object-cover mr-2" src={post.author.image} alt={post.author.name} />
                    <a onClick={(event) => handleProfile(event, post.author.id)} className="font-semibold text-color1 text-xl">{post.author.name}</a>
                </div>
                <button onClick={() => handletoggleFavPost(post.id)} className="bg-color4 w-10 h-9 text-white border-none rounded-xl px-2 py-1 mr-3 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">{post.fav ? '🤍' : '♡'}</button>
            </div>
            <img className="w-full" src={post.image} alt={post.text} />
            <p className="m-2 text-color1 font-semibold ml-3">🤍{post.likes}</p>
            <p className="m-2 mb-0 text-color1 font-semibold ml-3">{post.text}</p>
            {post.comments.length > 0 && <div className="border-x-color5 border-x-8 bg-white p-1">
                {post?.comments.map(comment => <article className="flex items-start m-1" key={comment.id}>
                    <img className="w-4 h-4 rounded-full object-cover mr-1" src={comment.author.image} alt="" />
                    <a onClick={(event) => handleProfile(event, comment.author.id)} className="text-xs text-color1 font-bold whitespace-nowrap" href="">{comment.author.name + ':'}</a>
                    <p className="text-xs ml-1">{comment.text}</p>
                </article>)}
            </div>}
            <div className="flex justify-between w-full px-4 pb-2">
                <button onClick={() => handleCommentModal(post.id)} className="button bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Comment</button>
                <div className="flex justify-between gap-2">
                    {userId === post.author.id && <button onClick={() => handleEditPostModal(post.id)} className="bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Edit</button>}
                    {userId === post.author.id && <button onClick={() => handleDeletePostModal(post.id)} className="button bg-color4 text-white border-none rounded-xl px-3 mt-2 py-0.5 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Delete</button>}
                </div>
            </div>
        </article>)
        }

        {modal === "delete-post-modal" && <DeletePostModal postId={postId} onDeletePost={handleDeletePost} onHideDeletePost={handleCancelDeletePostModal} />}
        {modal === "edit-post-modal" && <EditPostModal postId={postId} onEditPost={handleEditPost} onHideEditPost={handleCancelEditPostModal} />}
        {modal === "comment-modal" && <CreateCommentModal postId={postId} onCreateComment={handleCreateComment} onHideCreateComment={handleCancelCommentModal} />}
    </section >
}