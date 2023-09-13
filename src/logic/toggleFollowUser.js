import {validateId} from './helpers/validators'

export default function toggleFollowUser(userId, userIdProfile) {
    validateId(userId)
    validateId(userIdProfile)

    return fetch(`http://localhost:8000/users/${userIdProfile}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${userId}`
        }
    })
    .then((res)=> {
        if(res.status === 200) {
            return
          } else if (res.status === 400) {
            res.json()
              .then(body => {
                throw new Error(body.error)
              })
          }
    })
}