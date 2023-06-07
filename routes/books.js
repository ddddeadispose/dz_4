const express = require('express');
const upload = require("../middleware/upload");
const router = express.Router();
const axios = require('axios')

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
    new Book('1', 'Тестовая книга 1'),
    new Book('2', 'Тестовая книга 2')
]

//Запрос на все книги
router.get('/', (req,res) =>{
    console.log('Запрос на все книги')
    console.log(store)
    //res.json(store)
    res.render('index', { books: store });
})


//Запрос по id, сделал асинхронным из-за запроса в другое приложение
router.get('/:id', async (req,res) => {
    console.log('Запрос на книгу по id')
    const idb = req.params.id

    console.log(idb)

    // Запрос через аксиос на увеличение просмотра, и получение количества просмотров, отправляем на адрес внутри докера
    await axios.post(`http://counter:3001/api/counter/${idb}/incr`)
    const counter = await axios.get(`http://counter:3001/api/counter/${idb}`)

    console.log('Каунтер ' + counter.data.value)

    const found = store.find(found => found.id === idb)
    if (found === undefined){
        res.render('error', { error:'Книга не найдена' });
    } else {
        res.render('view', { found: found, counter: counter.data.value });
    }
})

//ПОСТ для создания новой книги
router.post('/',
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

            console.log(newBook)

            res.redirect('/api/books')

        } else {
            // Без файла книги теперь создать её нельзя
            res.render('error', { error:'Не прикреплен файл книги' });
        }

    })

//Запрос на скачивание файла книги
router.get('/:id/download', (req, res) => {
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
router.post('/:id',
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

            res.redirect(`/api/books/${idb}`)
        }

    })

module.exports = router;