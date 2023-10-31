const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

morgan.token('body', getBody = (req) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(express.json())

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) === 'POST' ? tokens.body(req, res) : ''
  ].join(' ')
}))

app.use(cors())

let persons = [
    /*{
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
    }*/
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
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const generateId = () => 
  Math.floor(Math.random()*9999999999999)

app.post('/api/persons', (request, response) => {
  
  const body = request.body  

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: `'${body.name}' already exists` 
    })
  }

  const person = {
    id: generateId (),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id',(request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
