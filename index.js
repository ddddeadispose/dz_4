const express = require('express')
//const {v4: uuid} = require('uuid')

class Book {
    constructor(
        id = '',
        title = '',
        description = '',
        authors = '',
        favorite = '',
        fileCover = '',
        fileName = ''
        ) {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
    }
}

//Массив с тестовыми книгами
let store = [
        new Book('1'),
        new Book('2'),
        new Book('3'),
        new Book('4'),
]

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())

// Авторизация
app.post('/api/user/login', (req,res) => {
    console.log('Авторизация')
    res.json({
        id: 1,
        mail: "test@mail.ru"
    })
})

//Запрос на все книги
app.get('/api/books', (req,res) =>{
    console.log('Запрос на все книги')
    res.json(store)
})

//Запрос по id
app.get('/api/books/:id', (req,res) =>{
    console.log('Запрос на книгу по id')
    const idb = req.params.id.split(':')[1] // Немного криво, т.к. не разобрался как чисто id получать

    const found = store.find(found => found.id === idb)
    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        res.json(found)
    }
})

//Создание новой книги
app.post('/api/books', (req, res) => {
    const params = req.body

    const newBook = new Book(
        id = (store.length + 1),
        title = params.title,
        description = params.description,
        authors = params.authors,
        favorite = params.favorite,
        fileCover = params.fileCover,
        fileName = params.fileName
    )

    store.push(newBook)

    res.status(202).json(newBook)
})

//Редактирование книги по id
app.put('/api/books/:id', (req, res) => {
    console.log('Редактирование книги по id')
    const params = req.body
    const idb = req.params.id.split(':')[1]

    const found = store.find(found => found.id === idb)

    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        found.title = params.title,
        found.description = params.description,
        found.authors = params.authors,
        found.favorite = params.favorite,
        found.fileCover = params.fileCover,
        found.fileName = params.fileName

        console.log(req.body)

        res.json(found)
    }

})

//Удаление книги по id
app.delete('/api/books/:id', (req, res) => {
    console.log('Удаление книги по id')

    const idb = req.params.id.split(':')[1]

    const found = store.find(found => found.id === idb)
    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        //Ищем идекс книги в массиве.
        const index = store.indexOf(found)
        store.splice(index, 1);
        res.json('Ok')
    }
})

console.log(PORT)

app.listen(PORT)