import {validateId, validateText} from './helpers/validators'

export default function editMessage(userId, messageId, text) {
  validateId(userId)
  validateId(messageId)
  validateText(text)

 return fetch(`http://localhost:8000/chats/${messageId}`,{
  method: 'PATCH',
  headers: {
    Authorization: `Bearer ${userId}`,
    "Content-Type": "application/json"},
  body: JSON.stringify({text})
})
  .then((res)=> {
    if(res.status === 200) {
      return
    } else if (res.status === 400) {
      return res.json()
        .then((body) => {
          throw new Error(body.error)
        })
    }
  })
}