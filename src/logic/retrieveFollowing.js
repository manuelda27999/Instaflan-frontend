import { validateId } from './helpers/validators'

export default function retrieveFollowing(userId, userIdProfile) {
  validateId(userId)
  validateId(userIdProfile)

  return fetch(`https://instaflan-backend.onrender.com/users/${userIdProfile}/following`, {
    headers: { Authorization: `Bearer ${userId}` }

  })
    .then(res => {
      if (res.status === 200) return res.json()
        .then(posts => posts)
      else if (res.status === 400) return res.json()
        .then(err => {
          throw new Error(err.error)
        })
    })
};