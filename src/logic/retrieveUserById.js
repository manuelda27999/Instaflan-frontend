import {validateId} from './helpers/validators'

export default function retrieveUserById(userId, userIdProfile) {
  validateId(userId)

  return fetch(`http://localhost:8000/users/${userIdProfile}`, {
    headers: {
      Authorization: `Bearer ${userId}`
    }
  })
  .then((res) => {
    if(res.status === 200) {
      return res.json()
      .then((body)=> {
        const user = body
        
        return user
      })
    } else if(res.status === 400) {
      return res.json()
      .then((body)=> {
        throw new Error(body.error)
      })
    }
  })
}
