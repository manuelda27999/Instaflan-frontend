import { validateId, validateText } from "./helpers/validators";

export default function createComment(userId, postId, text) {
  validateId(userId)
  validateId(postId)
  validateText(text)

 return fetch(`http://localhost:8000/posts/${postId}/comments`,{
  method: 'POST',
  headers: {
    Authorization: `Bearer ${userId}`,
    "Content-Type": "application/json"},
  body: JSON.stringify({text})
})
  .then((res)=> {
    if(res.status === 201) {
      return
    } else if (res.status === 400) {
      return res.json()
        .then((body) => {
          throw new Error(body.error)
        })
    }
  })
};