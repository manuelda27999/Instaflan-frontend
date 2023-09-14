import { validateId, validateImage, validateText } from "./helpers/validators";

export default function createNewPost(author, image, text) {
  validateId(author)
  validateImage(image)
  validateText(text)

  return fetch('https://instaflan-backend.onrender.com/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${author}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image, text })
  })
    .then((res) => {
      if (res.status === 201) {
        return
      } else if (res.status === 400) {
        return res.json()
          .then((body) => {
            throw new Error(body.error)
          })
      }
    })
};