import { validateId } from './helpers/validators'

export default function searchUser(userId, text) {
  validateId(userId)

  return fetch(`https://instaflan-backend.onrender.com/search/${text}`, {
    headers: {
      Authorization: `Bearer ${userId}`
    }
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
          .then(body => {
            const users = body

            return users
          })
      } else if (res.status === 400) {
        return res.json()
          .then((body) => {
            throw new Error(body.error)
          })
      }
    })
}
