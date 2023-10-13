const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

const infoMain = (people) => {
    return(
        `<div>
        Phonebook has info for ${people} people
    </div>
    <br>
    <div>
        ${new Date()}
    </div>`
    )}


app.get('/info', (request, response) => {
    response.send(infoMain(persons.length))
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})



app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => 
  Math.floor(Math.random()*9999999999999)

app.post('/api/persons', (request, response) => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id)) 
    : 0

  const body = request.body

  const person = {
    id: generateId (),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id',(request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(persons => persons.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
