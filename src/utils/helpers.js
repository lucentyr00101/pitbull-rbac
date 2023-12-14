export const generateCode = (length) => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
}
