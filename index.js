const express = require('express')
const app = express()
app.use(require('body-parser').json())

app.get('/startup', (req, res) => {
  res.send({ answer: 'yes' })
})

app.post('/endpoint', (req, res) => {
  console.log(req.body)  // all your JSON gets spit out
  res.send({ answer: 'acknowledged' })
})

const port = process.env.NODE_PORT || 3000
app.listen(port, () => console.log(`gaydar listening on port ${port}`))
