const express = require('express')
const router = express.Router()
const ejs = require('ejs')

const login = require('./routes/login')
const books = require('./routes/books')
const add = require('./routes/add')
const update = require('./routes/update')
const mongoose = require("mongoose");

const app = express()
const PORT = process.env.PORT || 3000
const mongoUrl = require('./config.js');

app.use(express.json())

mongoose.connect(`${mongoUrl.mongoUrl}`)
    .then(() => {
        console.log('Подключено к базе данных')
    })
    .catch((error) => {
        console.error('Ошибка подключения к базе данных:', error)
    })

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