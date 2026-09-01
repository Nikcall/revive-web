const res = await fetch('http://localhost:3001/api/catalog')
const data = await res.json()
console.log('Keys:', Object.keys(data))
console.log('Sample:', JSON.stringify(data).slice(0, 500))
