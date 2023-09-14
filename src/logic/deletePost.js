import { validateId } from './helpers/validators'

export default function deletePost(userId, postId) {
  validateId(userId)
  validateId(postId)

  return fetch(`https://instaflan-backend.onrender.com/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userId}`
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return
      } else if (res.status === 400) {
        res.json()
          .then(body => {
            throw new Error(body.error)
          })
      }
    })
}