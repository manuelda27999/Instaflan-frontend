import { useEffect, useState } from "react"
import context from "../../context"

export default function UsersSearchModal(props) {
    const [users, setUsers] = useState(null)
    const navigate = context.navigate

    useEffect(() => {
        setUsers(props.users)
    }, [props.users])

    const handleProfile = (event, userIdProfile) => {
        event.preventDefault()
        navigate(`/profile/${userIdProfile}/posts`)
    }

    return <div ref={props.modalRef} className="fixed w-60 top-14 right-5 flex flex-col items-center mr-2">
        <div className="modal-peak"></div>
        {users?.length > 0 ?
            <div className="bg-white flex flex-col items-center justify-center rounded-xl">
                {users?.map(user => <article className="px-2 py-1" key={user.id}>
                    <div className="flex items-center">
                        <img className="rounded-full mr-1 w-12 h-12 object-cover" src={user.image ? user.image : 'https://imgs.search.brave.com/jLOzY9Dtq7uH7I2DkMqETsipUhW25GINawy7rLyCLNY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1pY29uL3Vz/ZXJfMzE4LTE1OTcx/MS5qcGc_c2l6ZT02/MjYmZXh0PWpwZw'} alt={user.name} />
                        <a onClick={(event) => handleProfile(event, user.id)} className="font-semibold text-color1 text-lg">{user.name}</a>
                    </div>
                </article>)}
            </div> :
            <div className="bg-white flex flex-col items-center justify-center rounded-xl">
                <article className="px-2 py-1">
                    <h2 className="font-semibold text-color1 text-lg">Not found</h2>
                </article>
            </div>}
    </div>
}
