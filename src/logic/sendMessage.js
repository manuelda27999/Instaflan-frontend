import { validateId, validateText } from "./helpers/validators";

export default function sendMessage(userId, chatId, text) {
  validateId(userId)
  validateId(chatId)
  validateText(text)

  return fetch(`https://instaflan-backend.onrender.com/chats/${chatId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userId}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
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