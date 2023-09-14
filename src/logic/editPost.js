import { validateId, validateImage, validateText } from './helpers/validators'

export default function editPost(userId, postId, image, text) {
  validateId(userId)
  validateId(postId)
  validateImage(image)
  validateText(text)

  return fetch(`https://instaflan-backend.onrender.com/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${userId}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image, text })
  })
    .then((res) => {
      if (res.status === 200) {
        return
      } else if (res.status === 400) {
        return res.json()
          .then((body) => {
            throw new Error(body.error)
          })
      }
    })
}