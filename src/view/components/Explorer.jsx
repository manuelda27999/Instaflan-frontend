import { useEffect, useState } from "react"

import retrievePostsNotFollowed from "../../logic/retrievePostsNotFollowed"
import retrieveUsersNotFollowed from "../../logic/retrieveUsersNotFollowed"
import toggleFavPost from "../../logic/toggleFavPost"
import toggleFollowUser from "../../logic/toggleFollowUser"

import context from "../../context"

import CreateCommentModal from "../modals/CreateCommentModal"

export default function Explorer() {
    const [users, setUsers] = useState()
    const [posts, setPosts] = useState()
    const [postId, setPostId] = useState()
    const [modal, setModal] = useState(null)

    const navigate = context.navigate

    useEffect(() => {
        try {
            Promise.all([retrieveUsersNotFollowed(context.token),
            retrievePostsNotFollowed(context.token)])
                .then(([users, posts]) => {
                    setUsers(users)
                    setPosts(posts)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }, [])

    const handleProfile = (event, userIdProfile) => {
        event.preventDefault()
        navigate(`/profile/${userIdProfile}/posts`)
    }

    function handleFollowUser(userIdProfile) {
        try {
            toggleFollowUser(context.token, userIdProfile)
                .then(() => {
                    setUsers(users => {
                        const users2 = [...users]

                        const index = users2.findIndex(user => user.id === userIdProfile)

                        users2.splice(index, 1)

                        return users2
                    })
                })
                .catch((error) => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }

    function handleUpdateUsers() {
        try {
            retrieveUsersNotFollowed(context.token)
                .then(users => {
                    setUsers(users)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }

    function handleUpdatePosts() {
        try {
            retrievePostsNotFollowed(context.token)
                .then(posts => {
                    setPosts(posts)
                })
                .catch(error => alert(error.message))
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

    const handleCommentModal = postId => {
        setPostId(postId)
        setModal("comment-modal")
    }

    const handleCancelCommentModal = () => setModal(null)

    const handleCreateComment = () => {
        try {
            retrievePostsNotFollowed(context.token)
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

    return <section className="pt-2 pb-20 w-full sm:flex sm:flex-col sm:items-center">
        <article className="w-full flex flex-col items-center">
            <h2 className="text-color1 font-semibold mb-2">Maybe you know</h2>
            {users?.map(user => <article key={user.id} className="flex mb-4 w-80 bg-color5 rounded-full justify-between items-center pr-5 pl-2 pt-1 pb-1">
                <div className="flex items-center">
                    <img className="w-12 h-12 rounded-full object-cover mr-2" src={user.image} alt={user.name} />
                    <a onClick={() => handleProfile(event, user.id)} className="font-semibold text-color1 text-xl">{user.name}</a>
                </div>
                <button onClick={() => handleFollowUser(user.id)} className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button">Follow</button>
            </article>)}
            <button onClick={handleUpdateUsers} className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Update users</button>
        </article>
        <article className="w-full flex flex-col items-center mt-6">
            <h2 className="text-color1 font-semibold mb-2">You might be interested</h2>
            {posts?.map(post => <article key={post.id} className="bg-color5 mb-3 sm:w-96">
                <div className="flex justify-between items-center">
                    <div className="flex justify-start items-center pl-3 py-1">
                        <img className="w-12 h-12 rounded-full object-cover mr-2" src={post.author.image} alt={post.author.name} />
                        <a onClick={(event) => handleProfile(event, post.author.id)} className="font-semibold text-color1 text-xl">{post.author.name}</a>
                    </div>
                    <button onClick={() => handletoggleFavPost(post.id)} className="bg-color4 w-10 h-9 text-white border-none rounded-xl px-2 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">{post.fav ? '🤍' : '♡'}</button>
                </div>
                <img className="w-full" src={post.image} alt={post.text} />
                <p className="m-2 text-color1 font-semibold ml-3">🤍{post.likes}</p>
                <p className="m-2 text-color1 font-semibold ml-3">{post.text}</p>
                {post.comments.length > 0 && <div className="border-x-color5 border-x-8 bg-white p-1">
                    {post?.comments.map(comment => <article className="flex items-start m-1" key={comment.id}>
                        <img className="w-4 h-4 rounded-full object-cover mr-1" src={comment.author.image} alt="" />
                        <a onClick={(event) => handleProfile(event, comment.author.id)} className="text-xs text-color1 font-bold whitespace-nowrap" href="">{comment.author.name + ':'}</a>
                        <p className="text-xs ml-1">{comment.text}</p>
                    </article>)}
                </div>}
                <div className="flex justify-start w-full px-4 pb-2">
                    <button onClick={() => handleCommentModal(post.id)} className="button bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Comment</button>
                </div>
            </article>)}
            <button onClick={handleUpdatePosts} className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Update posts</button>
        </article>

        {modal === "comment-modal" && <CreateCommentModal postId={postId} onCreateComment={handleCreateComment} onHideCreateComment={handleCancelCommentModal} />}
    </section >
}