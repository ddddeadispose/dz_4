const express = require('express')
const router = express.Router()
const ejs = require('ejs')

const login = require('./routes/login')
const books = require('./routes/books')
const add = require('./routes/add')
const update = require('./routes/update')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.set('view engine', 'ejs')

//Логин
app.use('/api/user/login', login)

//Роут с книгами
app.use('/api/books', books)

// Маршрут для отображения формы создания новой книги
app.use('/api/add', add)

// Маршрут для отображения формы редактирования новой книги
app.use('/api/update/', update)


console.log(PORT)

app.listen(PORT)