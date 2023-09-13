import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import retrieveChat from "../../logic/retrieveChat"
import sendMessage from "../../logic/sendMessage"
import context from "../../context"
import extractUserIdFromToken from "../helpers/extractUserIdFromToken"
import EditDeleteMessageModal from "../modals/EditDeleteMessageModal"

export default function Chat() {
    const [chat, setChat] = useState(null)
    const [message, setMessage] = useState(null)
    const [modal, setModal] = useState(null)

    const params = useParams()
    const { chatId } = params

    const navigate = context.navigate

    const userId = extractUserIdFromToken(context.token)

    useEffect(() => {
        try {
            retrieveChat(context.token, chatId)
                .then(newChat => {
                    setChat(newChat)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }

        const intervalId = setInterval(() => {
            try {
                retrieveChat(context.token, chatId)
                    .then(newChat => {
                        if (newChat !== chat) setChat(newChat)
                    })
                    .catch(error => alert(error.message))
            } catch (error) {
                alert(error.message)
            }
        }, 2000);

        return () => clearInterval(intervalId)
    }, [])

    const handleSendMessage = (event) => {
        event.preventDefault()
        const text = event.target.message.value

        try {
            sendMessage(context.token, chatId, text)
                .then(() => retrieveChat(context.token, chatId)
                    .then(chat => {
                        event.target.message.value = ''
                        setChat(chat)
                    }))
                .catch(error => {
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

    const handleBack = () => {
        navigate('/messages')
    }

    const handleEditDeleteModal = (message) => {
        setMessage(message)
        setModal('edit-delete-modal')
    }

    const handleHideEditDeleteModal = () => {
        setMessage(null)
        setModal(null)
    }


    useEffect(() => {
        const pageHeight = document.body.scrollHeight

        window.scroll({
            top: pageHeight,
            behavior: 'smooth',
        });

    }, [chat?.messages.length])

    return <section className="flex flex-col">
        <div className="fixed w-full bg-white flex justify-between items-center border-b-2 border-gray-400 py-1 px-2">
            <div className="flex items-center">
                <img className="w-12 h-12 rounded-full object-cover" src={chat?.users[0].image} alt="user profile image" />
                <a onClick={(event) => handleProfile(event, chat?.users[0].id)} className="m-2 text-color1 font-semibold ml-3" href="">{chat?.users[0].name}</a>
            </div>
            <button onClick={handleBack} className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Back</button>
        </div>
        <div className="flex flex-col mx-2 my-1 pb-28 pt-14">
            {chat?.messages.map(message => <article key={message.id} className={message.author === userId ? "ml-12 flex justify-end" : "mr-12 flex"}>
                {message.delete ? <p className="italic text-gray-600 m-1 py-1 px-2 w-auto rounded-xl bg-color5">Message deleted</p> :
                    message.edit ? <div className="flex flex-col items-end bg-color5 w-auto m-1 px-2 py-1 rounded-xl">
                        <div className="flex ">
                            <p className="">{message?.text}</p>
                            {message.author === userId && <button onClick={() => handleEditDeleteModal(message)} className="ml-2 rounded-lg hover:bg-color4 hover:scale-110 ">✏️</button>}
                        </div>
                        <p className="italic text-gray-600 text-xs">Edited</p>
                    </div> :
                        <div className="flex flex-start items-end bg-color5 w-auto m-1 px-2 py-1 rounded-xl">
                            <p className="">{message?.text}</p>
                            {message.author === userId && <button onClick={() => handleEditDeleteModal(message)} className="ml-2 rounded-lg hover:bg-color4 hover:scale-110 ">✏️</button>}
                        </div>
                }
            </article>)}
        </div>
        <form onSubmit={handleSendMessage} className="fixed bottom-14 flex justify-around p-3 w-full">
            <input id="message" placeholder=" ..." className="w-full rounded-full border-4 mr-3 pl-3 border-black" type="text" />
            <button className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Send</button>
        </form>

        {modal === 'edit-delete-modal' && <EditDeleteMessageModal message={message} onHideEditDeletePost={handleHideEditDeleteModal} />}
    </section>
}