import { validateId } from './helpers/validators'

export default function retrievePost(userId, postId) {
  validateId(userId)
  validateId(postId)

  return fetch(`https://instaflan-backend.onrender.com/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${userId}`
    }
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else if (res.status === 400) {
        return res.json()
          .then((body) => {
            throw new Error(body.error)
          })
      }
    })
}