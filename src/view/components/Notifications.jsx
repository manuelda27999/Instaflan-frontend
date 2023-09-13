import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import retrieveNotifications from "../../logic/retrieveNotifications"
import deleteNotification from "../../logic/deleteNotification"
import deleteAllNotifications from "../../logic/deleteAllNotifications"

import context from "../../context"



export default function Notifications() {
    const [notifications, setNotifications] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        try {
            retrieveNotifications(context.token)
                .then(notifications =>
                    setNotifications(notifications))
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }, [])

    const handleProfile = (event, userIdProfile) => {
        event.preventDefault()
        navigate(`/profile/${userIdProfile}/posts`)
    }

    const handleDeleteNotification = (notificationId) => {
        try {
            deleteNotification(context.token, notificationId)
                .then(() => {
                    return retrieveNotifications(context.token)
                        .then(notifications => setNotifications(notifications))
                        .catch(error => alert(error.messsage))
                })
                .catch(error => alert(error.messsage))
        } catch (error) {
            alert(error.message)
        }
    }

    const handleDeleteAllNotifications = () => {
        try {
            deleteAllNotifications(context.token)
                .then(() => {
                    return retrieveNotifications(context.token)
                        .then(notifications => setNotifications(notifications))
                        .catch(error => alert(error.messsage))
                })
                .catch(error => alert(error.messsage))
        } catch (error) {
            alert(error.message)
        }
    }

    return <section className="flex flex-col items-center pb-20 w-full">
        {notifications?.length === 0 && <h2 className="text-gray-500 mt-6 text-xl font-bold">Notifications empty</h2>}
        {notifications?.map(notification => <article key={notification.id} className="w-full">
            {notification.text === 'Follow' && <div className="flex items-center p-1 border-b-gray-400 border-b-2">
                <img className="w-12 h-12 rounded-full object-cover" src={notification.user.image} alt="" />
                <a onClick={(event) => handleProfile(event, notification.user.id)} className="text-center m-2 text-color2 font-semibold ml-3" href="">{notification.user.name}</a>
                <p>follow you </p>
                <button onClick={() => handleDeleteNotification(notification.id)} className="ml-auto rounded-lg hover:bg-color4 hover:scale-110 ">🗑️</button>
            </div>}
            {notification.text === 'Like' && <div className="flex items-center p-1 border-b-gray-400 border-b-2">
                <img className="w-12 h-12 rounded-full object-cover" src={notification.user.image} alt="" />
                <a onClick={(event) => handleProfile(event, notification.user.id)} className="text-center m-2 text-color2 font-semibold ml-3" href="">{notification.user.name}</a>
                <p>like your post</p>
                <div className="flex flex-col ml-4 items-center border-3">
                    <img className="w-14 object-contain" src={notification.post.image} alt="" />
                </div>
                <button onClick={() => handleDeleteNotification(notification.id)} className="ml-auto rounded-lg hover:bg-color4 hover:scale-110 ">🗑️</button>
            </div>}
            {notification.text === 'Comment' && <div className="flex items-center p-1 border-b-gray-400 border-b-2">
                <img className="w-12 h-12 rounded-full object-cover" src={notification.user.image} alt="" />
                <a onClick={(event) => handleProfile(event, notification.user.id)} className="text-center m-2 text-color2 font-semibold ml-3" href="">{notification.user.name}</a>
                <p>comment your post</p>
                <div className="flex flex-col ml-4 items-center border-3">
                    <img className="w-14 object-contain" src={notification.post.image} alt="" />
                </div>
                <button onClick={() => handleDeleteNotification(notification.id)} className="ml-auto rounded-lg hover:bg-color4 hover:scale-110 ">🗑️</button>
            </div>}

        </article>)}
        {notifications?.length > 0 && <button onClick={handleDeleteAllNotifications} className="mt-4 button w-32 bg-color4 text-white border-none rounded-xl m-1 px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">
            Clean all</button>}
    </section>
}