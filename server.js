const express = require('express');
const app = express();
app.use(express.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Bookshelf';
app.locals.books = [
  {
    title: 'Moloka\'i',
    author: 'Alan Brennert',
    fiction: true,
    genre: 'historical fiction',
    id: 'a1'
  },
  {
    title: 'How to Talk About Race',
    author: 'Ijeoma Oluo',
    fiction: false,
    genre: 'racism',
    id: 'b2'
  },
  {
    title: 'The Fifth Season',
    author: 'NK Jemison',
    fiction: true,
    genre: 'fantasy',
    id: 'c3'
  }
]

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
})

app.get('/api/v1/books', (request, response) => {
  response.status(200).json(app.locals.books)
})

app.get('/api/v1/books/:id', (request, response) => {
  const result = app.locals.books.find(book => book.id === request.params.id);

  if (!result) {
    response.status(404).send('error')
  } else {
    response.status(200).json(result)
  }
})

app.post('/api/v1/books', (request, response) => {
  const requiredProperties = ['title', 'author', 'fiction', 'genre']

  for(let property of requiredProperties) {
    if (!request.body[property]) {
      return response.status(422).json({errorMessage: `Cannot Post: no property of ${property} in request`})
    }
  }

  const { title, author, fiction, genre } = request.body;

  const id = Date.now();

  app.locals.books.push({title, author, fiction, genre, id})
  response.status(201).json({id, title, author, fiction, genre})
})

app.patch('/api/v1/books/:id', (request, response) => {
  const { title } = request.body;

  const result = app.locals.books.find(book => book.id === request.params.id);

  result.title = title;
  if (!result) {
    response.status(404).send('error')
  } else {
    response.status(201).json({ title })
  }
})

app.delete('/api/v1/books/:id', (request, response) => {
  const { id } = request.params;

  const foundBook = app.locals.books.find(book => book.id === id);
  if (!foundBook) {
    return response.status(404).json({errorMessage: `Cannot find book with id of ${id}`})
  }

  app.locals.books = app.locals.books.filter(book => book.id !== id);
  response.sendStatus(204)
})
