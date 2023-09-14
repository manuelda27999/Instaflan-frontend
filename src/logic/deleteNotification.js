import { validateId } from './helpers/validators'

export default function deleteNotification(userId, notificationId) {
  validateId(userId)
  validateId(notificationId)

  return fetch(`https://instaflan-backend.onrender.com/notifications/${notificationId}`, {
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