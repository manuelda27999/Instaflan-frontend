import {validateId} from './helpers/validators'

export default function retrieveChat(userId, chatId) {
  validateId(userId)
  validateId(chatId)

  return fetch(`http://localhost:8000/chats/${chatId}`,{
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