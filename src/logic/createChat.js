import { validateId } from "./helpers/validators";

export default function createChat(userId, otherUser) {
  validateId(userId)
  validateId(otherUser)

 return fetch(`http://localhost:8000/chats`,{
  method: 'POST',
  headers: {
    Authorization: `Bearer ${userId}`,
    "Content-Type": "application/json"},
  body: JSON.stringify({otherUser})
})
  .then((res)=> {
    if(res.status === 200) {
      return res.json()
    } else if (res.status === 400) {
      return res.json()
        .then((body) => {
          throw new Error(body.error)
        })
    }
  })
};