export default function dashToCamel (str) {
  const arr = str.toLowerCase().split('-')
  let output = arr.shift()
  let chunk

  while (arr.length) {
    chunk = arr.shift()
    output += chunk[0].toUpperCase() + chunk.slice(1)
  }

  return output
}
