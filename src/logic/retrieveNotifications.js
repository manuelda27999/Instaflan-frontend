import { validateId } from './helpers/validators'

export default function retrieveNotifications(userId) {
  validateId(userId)

  return fetch('https://instaflan-backend.onrender.com/notifications', {
    headers: { Authorization: `Bearer ${userId}` }
  })
    .then(res => {
      if (res.status === 200) return res.json()
        .then(notifications => notifications)
      else if (res.status === 400) return res.json()
        .then(err => {
          throw new Error(err.error)
        })
    })
};