export default function extractUserIdFromToken(token) {
    if(!token) throw new Error ('token not found')
    const dataB64 = token.slice(token.indexOf('.') + 1, token.lastIndexOf('.'))

    const dataJSON = atob(dataB64)

    const data = JSON.parse(dataJSON)

    const userId = data.sub

    return userId
}