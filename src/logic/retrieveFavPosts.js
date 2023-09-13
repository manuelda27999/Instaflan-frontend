import {validateId} from './helpers/validators'

export default function retrieveFavPosts(userId, userIdProfile) {
  validateId(userId)
  validateId(userIdProfile)

  return fetch(`http://localhost:8000/users/${userIdProfile}/fav-posts`,{
    headers: {Authorization: `Bearer ${userId}`}

  })
  .then(res => {
    if(res.status === 200) return res.json()
      .then(posts => posts) 
    else if (res.status === 400) return res.json()
      .then(err => {
        throw new Error (err.error)
      })
  }) 
};