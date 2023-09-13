import { useEffect, useState, useContext } from "react";
import { Routes, Route, useParams } from "react-router-dom";

import EditUserModal from "../modals/EditUserModal";
import ProfilePosts from "./ProfilePosts";
import ProfileFavPosts from "./ProfileFavPosts";

import context from "../../context";
import createChat from "../../logic/createChat";
import retrieveUserById from "../../logic/retrieveUserById";
import toggleFollowUser from "../../logic/toggleFollowUser";
import { AppContext } from "../../AppContext";
import extractUserIdFromToken from "../helpers/extractUserIdFromToken";
import FollowingModal from "../modals/FollowingModal";
import FollowedModal from "../modals/FollowedModal";

export default function Profile() {
    const navigate = context.navigate

    const params = useParams()
    const { userIdProfile } = params
    const userId = extractUserIdFromToken(context.token)

    const [modal, setModal] = useState(null)

    const { user, setUser } = useContext(AppContext)
    const [userProfile, setUserProfile] = useState(null)

    useEffect(() => {
        if (userIdProfile === userId) {
            setUserProfile(user)
            return
        }
        try {
            retrieveUserById(context.token, userIdProfile)
                .then(userProfile => {
                    setUser(user)
                    setUserProfile(userProfile)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }, [userIdProfile])

    const handleEditUserModal = () => setModal('edit-user-modal')
    const handleCancelModal = () => {
        try {
            retrieveUserById(context.token, userIdProfile)
                .then(user => {
                    setModal(null)
                    setUserProfile(user)
                })
                .catch((error) => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }
    const handleEditUser = () => {
        try {
            retrieveUserById(context.token, userIdProfile)
                .then(user => {
                    setModal(null)
                    setUser(user)
                    setUserProfile(user)
                })
                .catch((error) => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    function handleProfilePosts() {
        navigate(`/profile/${userIdProfile}/posts`)
    }

    function handleProfileFavPosts() {
        navigate(`/profile/${userIdProfile}/fav-posts`)
    }

    function handleFollowUser() {
        try {
            toggleFollowUser(context.token, userIdProfile)
                .then(() => {
                    return retrieveUserById(context.token, userIdProfile)
                })
                .then(userProfile => setUserProfile(userProfile))
                .catch((error) => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }

    const handleSendMessageModal = () => {
        try {
            createChat(context.token, userIdProfile)
                .then(chatId => {
                    console.log(chatId)
                    return navigate(`/messages/${chatId}`)
                })
                .catch((error) => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }

    const handleFollowingModal = (event) => {
        event.preventDefault()
        setModal("following-modal")
    }

    const handleFollowedModal = (event) => {
        event.preventDefault()
        setModal("followed-modal")
    }

    return <section className="flex flex-col items-center pb-16">
        <div className="flex w-full justify-between items-center py-2 px-3">
            <div className="flex items-center">
                {!userProfile?.image ?
                    <img className="w-12 h-12 rounded-full object-cover mr-2" src={'https://imgs.search.brave.com/jLOzY9Dtq7uH7I2DkMqETsipUhW25GINawy7rLyCLNY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1pY29uL3Vz/ZXJfMzE4LTE1OTcx/MS5qcGc_c2l6ZT02/MjYmZXh0PWpwZw'} />
                    :
                    <img className="w-12 h-12 rounded-full object-cover mr-2" src={userProfile?.image} />
                }
                <h3 className="font-semibold text-color1 text-xl">{userProfile?.name}</h3>
            </div>
            <div className="flex gap-3">
                <div className="flex flex-col items-center">
                    <p className="text-color2 font-bold">{userProfile?.followed ? userProfile?.followed.length : 0}</p>
                    <a onClick={handleFollowedModal} className="text-color2 font-bold">Followed</a>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-color2 font-bold">{userProfile?.following ? userProfile?.following.length : 0}</p>
                    <a onClick={handleFollowingModal} className="text-color2 font-bold">Following</a>
                </div>
            </div>
        </div>
        <p className="text-color1 w-full font-semibold border-b-2 border-b-gray-400 px-3 py-2 pt-0">{userProfile?.description}</p>
        {user?.name === userProfile?.name ?
            <button onClick={handleEditUserModal} className="button w-32 bg-color4 text-white border-none rounded-xl m-1 px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Edit profile</button>
            :
            <div className="flex justify-around items-center gap-2 m-2">
                <button onClick={handleFollowUser} className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button">{userProfile?.follow ? 'Unfollow' : 'Follow'}</button>
                <button onClick={handleSendMessageModal} className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button">Direct</button>
            </div>
        }
        <div className="flex w-full justify-evenly p-2 border-t-2 border-t-gray-400">
            <button onClick={() => handleProfilePosts()} className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">{user?.name === userProfile?.name ? 'My posts' : 'Profile posts'}</button>
            <button onClick={() => handleProfileFavPosts()} className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">{user?.name === userProfile?.name ? 'My favorite posts' : 'Favorite profile posts'}</button>
        </div>

        <Routes>
            <Route path='/posts' element={<ProfilePosts />} />
            <Route path='/fav-posts' element={<ProfileFavPosts />} />
        </Routes>

        {modal === "edit-user-modal" && <EditUserModal onEditUser={handleEditUser} onHideEditUser={handleCancelModal} />}
        {modal === "send-message-modal" && <SendMessageModal onHideSendMessage={handleCancelModal} />}
        {modal === "following-modal" && <FollowingModal onHideFollowingModal={handleCancelModal} />}
        {modal === "followed-modal" && <FollowedModal onHideFollowedModal={handleCancelModal} />}
    </section >
}