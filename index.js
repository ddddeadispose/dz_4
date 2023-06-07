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

//Удаление книги по id
router.delete('/api/books/:id', (req, res) =>   {
    console.log('Удаление книги по id')

    const idb = req.params.id

    const found = store.find(found => found.id === idb)
    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        //Ищем идекс книги в массиве.
        const index = store.indexOf(found)
        store.splice(index, 1)
        res.json('Ok')
    }
})

console.log(PORT)

app.listen(PORT)