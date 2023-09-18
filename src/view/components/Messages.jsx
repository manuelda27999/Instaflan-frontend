import { useEffect, useState } from "react"
import retrieveChats from "../../logic/retrieveChats"
import context from "../../context"
import extractUserIdFromToken from "../helpers/extractUserIdFromToken"

export default function Messages() {
    const [chats, setChats] = useState(null)
    const navigate = context.navigate
    const userId = extractUserIdFromToken(context.token)

    useEffect(() => {
        try {
            retrieveChats(context.token)
                .then(chats => {
                    setChats(chats)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }, [])

    const handleNavigateChat = (event, chatId) => {
        event.preventDefault()
        navigate(`/messages/${chatId}`)
    }

    return <section className="flex flex-col items-center pb-20 w-full">
        {chats?.length === 0 && <h2 className="text-gray-500 mt-6 text-xl font-bold">Messages empty</h2>}
        {chats?.length > 0 && chats?.map(chat => <article onClick={(event) => handleNavigateChat(event, chat.id)} key={chat.id} className={chat.unreadFor?.includes(userId) ? "w-full flex flex-col border-b-2 bg-slate-200  border-b-gray-400 p-1 hover:bg-gray-300 cursor-pointer" : "w-full flex flex-col border-b-2  border-b-gray-400 p-1 hover:bg-gray-300 cursor-pointer"}  >
            <div className="flex flex-col gap-1">
                {chat.users.map(user => <article key={user.id} className="flex justify-start items-center pl-3">
                    <img className="w-12 h-12 rounded-full object-cover mr-2" src={user.image ? user.image : 'https://imgs.search.brave.com/jLOzY9Dtq7uH7I2DkMqETsipUhW25GINawy7rLyCLNY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1pY29uL3Vz/ZXJfMzE4LTE1OTcx/MS5qcGc_c2l6ZT02/MjYmZXh0PWpwZw'} alt="user profile image" />
                    <p className="m-2 text-color1 font-semibold ml-3">{user.name}</p>
                </article>)}
            </div>
            <p className={chat.unreadFor?.includes(userId) ? "m-2 ml-3 mb-0 font-bold" : "m-2 ml-3 mb-0"} >{chat.messages[chat.messages.length - 1]?.text}</p>
        </article>)
        }
    </section >
}