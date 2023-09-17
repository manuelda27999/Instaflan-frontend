import { useState, useEffect, useRef, useContext } from "react"
import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom"

import context from "../../context"
import { AppContext } from "../../AppContext"

import extractUserIdFromToken from "../helpers/extractUserIdFromToken"
import numberChatsNotReading from "../../logic/numberChatsNotReading"
import retrievePosts from "../../logic/retrievePosts"
import retrieveUser from "../../logic/retrieveUser"
import searchUser from "../../logic/searchUser"

import AllPosts from '../components/AllPosts'
import Explorer from "../components/Explorer"
import Notifications from "../components/Notifications"
import Messages from "../components/Messages"
import Chat from "../components/Chat"
import Profile from "../components/Profile"

import CreatePostModal from "../modals/CreatePostModal"
import UsersSearchModal from "../modals/UsersSearchModal"


export default function Home() {
    const userId = extractUserIdFromToken(context.token)
    const navigate = useNavigate()
    const firstRouteElement = window.location.pathname.split('/')[1];

    const inputRef = useRef(null)
    const modalRef = useRef(null)

    const { pathname } = useLocation()

    const [userIdProfile, setUserIdProfile] = useState(userId)

    const [searchModal, setSearchModal] = useState(null)
    const [modal, setModal] = useState(null)
    const [page, setPage] = useState('Instaflan')

    const { user, setUser } = useContext(AppContext)
    const [users, setUsers] = useState(null)
    const [posts, setPosts] = useState(null)

    const [messagesNotReading, setMessagesNotReading] = useState(0)

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        try {
            Promise.all([numberChatsNotReading(context.token), retrieveUser(context.token)])
                .then(([count, user]) => {
                    setMessagesNotReading(count)
                    setUser(user)

                    let header = null
                    switch (firstRouteElement) {
                        case 'home':
                            header = 'Instaflan'
                            break
                        case 'explorer':
                            header = 'Explorer'
                            break
                        case 'messages':
                            header = 'Messages'
                            break
                        case 'notifications':
                            header = 'Notifications'
                            break
                        case 'profile':
                            header = 'Profile'
                            break
                    }
                    setPage(header)
                })
                .catch(error => alert(error.message))
        } catch (error) {
            alert(error.message)
        }
    }, [firstRouteElement])

    useEffect(() => {
        setSearchModal(null)
        if (inputRef.current) inputRef.current.value = ''
        setUsers(null)
    }, [pathname])

    const handleProfilePage = () => {
        setUserIdProfile(userId)
    }

    const handleLogout = () => {
        context.token = null

        navigate('/login')
    }

    const handleCreatePostModal = () => setModal("create-post-modal")
    const handleCancelCreatePostModal = () => setModal(null)
    const handleCreatePost = () => {
        try {
            retrievePosts(context.token)
                .then((posts) => {
                    setModal(null)
                    setPosts(posts)
                })
                .catch(() => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    let searchUserTimeOutId

    const handleSearchUsers = (event) => {
        if (searchUserTimeOutId) clearTimeout(searchUserTimeOutId)

        searchUserTimeOutId = setTimeout(() => {

            const text = event.target.value
            if (!text) {
                setUsers(null)
                return
            }

            try {
                searchUser(context.token, text)
                    .then(users => setUsers(users))
                    .catch(() => alert(error.message))
            } catch (error) {
                alert(error.message)
            }
        }, 500);
    }

    const handleClickOutside = (event) => {
        if (!modalRef.current?.contains(event.target) && !inputRef.current?.contains(event.target)) {
            setSearchModal(null);
        }
    }

    return <div className="w-full h-full">
        <header className="w-full h-16 bg-color5 fixed top-0 left-0 flex justify-between items-center pl-5">
            <div className="flex items-center">
                <h2 className="text-xl text-color1 font-semibold">{page}</h2>
                {/* {page === 'Instaflan' && <img className="w-16" src="./public/images/flan.png" alt="Icon flan" />} */}
            </div>
            {page === 'Profile' ?
                <nav>
                    <button onClick={handleLogout} className="bg-color4 text-white border-none rounded-xl px-3 py-1 mr-3 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3">Logout</button>
                </nav>
                :
                <div className="flex items-center justify-center mr-3">
                    <input ref={inputRef} onChange={handleSearchUsers} onFocus={() => setSearchModal('search-modal')} className="h-8 w-40 rounded-3xl pl-2" type="text" placeholder="search..." />
                </div>
            }
        </header>
        <main className="pt-16">

            <Routes>
                <Route path='/home' element={<AllPosts posts={posts} />} />
                <Route path='/explorer' element={<Explorer />} />
                <Route path='/messages' element={<Messages />} />
                <Route path='/messages/:chatId' element={<Chat />} />
                <Route path='/notifications' element={<Notifications />} />
                <Route path='/profile/:userIdProfile/*' element={<Profile />} />
            </Routes>

        </main>
        <footer className="w-full h-16 bg-color5 fixed bottom-0 left-0 flex justify-around items-center">
            <Link className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125" to='/home'>🏠</Link>
            <Link className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125" to='/explorer'>🌍</Link>
            <a onClick={handleCreatePostModal} className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125" href="#">➕</a>
            <div className="flex justify-end">
                {messagesNotReading > 0 && <div className="fixed z-10 rounded-full text-sm font-bold text-white bg-red-600 w-4 h-4 text-center flex justify-center items-center mr-1">{messagesNotReading}</div>}
                <Link className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125" to='/messages'>✉️</Link>
            </div>
            <Link className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125" to='/notifications'>❤️</Link>
            <Link onClick={handleProfilePage} className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125" to={`/profile/${userIdProfile}/posts`}>
                {user && (
                    <img
                        className="w-10 h-10 rounded-full mr-2 object-cover mb-px hover:scale-110"
                        src={user.image ? user.image : 'https://imgs.search.brave.com/jLOzY9Dtq7uH7I2DkMqETsipUhW25GINawy7rLyCLNY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1pY29uL3Vz/ZXJfMzE4LTE1OTcx/MS5qcGc_c2l6ZT02/MjYmZXh0PWpwZw'}
                        alt={user.name}
                    />
                )}
            </Link>
        </footer>

        {modal === "create-post-modal" && <CreatePostModal onCreatePost={handleCreatePost} onHideCreatePost={handleCancelCreatePostModal} />}
        {searchModal === "search-modal" && <UsersSearchModal users={users} modalRef={modalRef} />}
    </div>
}