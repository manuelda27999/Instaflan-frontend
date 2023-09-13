import {validateId} from './helpers/validators'

export default function deleteAllNotifications(userId) {
  validateId(userId)

  return fetch(`http://localhost:8000/notifications`,{
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userId}`},
  })
  .then((res)=>{
    if(res.status === 200) {
      return
    } else if (res.status === 400) {
      res.json()
        .then(body => {
          throw new Error(body.error)
        })
    }
  })
}