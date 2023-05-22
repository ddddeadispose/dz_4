const express = require('express')
const router = express.Router()
const upload = require('./middleware/upload')
//const {v4: uuid} = require('uuid')

class Book {
    constructor(
        id = '',
        title = '',
        description = '',
        authors = '',
        favorite = true,
        fileCover = '',
        fileName = '',
        fileBook = ''
        ) {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

//Массив с тестовыми книгами
let store = [
        new Book('1'),
        new Book('2')
]

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(router);


// Авторизация
router.post('/api/user/login', (req,res) => {
    console.log('Авторизация')
    res.json({
        id: 1,
        mail: "test@mail.ru"
    })
})

//Запрос на все книги
router.get('/api/books', (req,res) =>{
    console.log('Запрос на все книги')
    res.json(store)
})

//Запрос по id
router.get('/api/books/:id', (req,res) =>{
    console.log('Запрос на книгу по id')
    const idb = req.params.id

    console.log(idb)

    const found = store.find(found => found.id === idb)
    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        res.json(found)
    }
})

//Создание новой книги
router.post('/api/books',
    upload.single('book'),
    (req, res) => {
    const params = req.body

    if (req.file){

        const newBook = new Book(
            id = (store.length + 1).toString(), // Приводим к строке, чтобы можно было искать нормально
            title = params.title,
            description = params.description,
            authors = params.authors,
            favorite = params.favorite,
            fileCover = params.fileCover,
            fileName = params.fileName,
            fileBook = req.file.path
        )

        store.push(newBook)

        res.status(202).json(newBook)

    } else {

        // Без файла книги теперь создать её нельзя
        res.status(400).json({err:'Не прикреплен файл книги'})

    }


})

//Запрос на скачивание файла книги
router.get('/api/books/:id/download', (req, res) => {
    console.log('Запрос на скачивание файла книги по id')
    const idb = req.params.id

    const found = store.find(found => found.id === idb)
    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        res.download(found.fileBook)
    }
})

//Редактирование книги по id
router.put('/api/books/:id',
    upload.single('book'),
    (req, res) => {
    console.log('Редактирование книги по id')
    const params = req.body
    const idb = req.params.id

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

        //Если есть файл книги, то меняем его на тот, который прислали
        if (req.file){
            found.fileBook = req.file.path
        }

        console.log(req.body)

        res.json(found)
    }

})

//Удаление книги по id
router.delete('/api/books/:id', (req, res) => {
    console.log('Удаление книги по id')

    const idb = req.params.id

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