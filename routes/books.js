const express = require('express');
const upload = require("../middleware/upload");
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Определение класса книги
class Book {
    constructor(
        id = '',
        title = '',
        description = '',
        authors = '',
        favorite = '',
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

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/books')
    .then(() => {
        console.log('Подключено к базе данных');
    })
    .catch((error) => {
        console.error('Ошибка подключения к базе данных:', error);
    });

// Определение схемы книги
const bookSchema = new Schema({
    id: String,
    title: String,
    description: String,
    authors: String,
    favorite: String,
    fileCover: String,
    fileName: String,
    fileBook: String,
});

// Определение модели книги
const BookModel = mongoose.model('Book', bookSchema);

//Запрос на все книги
router.get('/', (req,res) =>{

    //Массив с книгами
    let store = [

    ]

    // Загрузка книг из базы данных и добавление их в массив store
    BookModel.find({})
        .then((books) => {
            books.forEach((book) => {
                //Убираем дубликаты
                const existingBook = store.find((storedBook) => storedBook.title === book.title);

                if (!existingBook) {
                    store.push(new Book(
                        book.id,
                        book.title,
                        book.description,
                        book.authors,
                        book.favorite,
                        book.fileCover,
                        book.fileName,
                        book.fileBook
                    ));
                }
            });

            console.log('Книги успешно загружены из базы данных');

            res.render('index', { books: store });

        })
        .catch((err) => {
            console.log('Ошибка при получении книг из базы данных:', err);

        });

    console.log('Запрос на все книги')

})

//Запрос по id, сделал асинхронным из-за запроса в другое приложение
router.get('/:id', async (req,res) => {
    console.log('Запрос на книгу по id')
    const idb = req.params.id

    console.log(idb)

    //Пока убрал счетчик, т.к. он работал через докер, а как в докере организовать доступ к локальной БД я не знаю.
    // Запрос через аксиос на увеличение просмотра, и получение количества просмотров, отправляем на адрес внутри докера
    //await axios.post(`http://counter:3001/api/counter/${idb}/incr`)
    //const counter = await axios.get(`http://counter:3001/api/counter/${idb}`) , Переменная для view - counter: counter.data.value

    try {
        const found = await BookModel.findOne({ id: idb });

        if (!found) {
            res.render('error', { error: 'Книга не найдена' });
        } else {
            res.render('view', { found: found });
        }
    } catch (err) {
        console.error('Ошибка при поиске книги в базе данных:', err);
        res.render('error', { error: 'Ошибка при поиске книги в базе данных' });
    }
})

//ПОСТ для создания новой книги
router.post('/',
    upload.single('book'),
    async (req, res) => {
        const params = req.body

        if (req.file){

            const newBook = new BookModel({
                id: Math.round(Math.random()*100), // Просто рандомное число
                title: params.title,
                description: params.description,
                authors: params.authors,
                favorite: params.favorite,
                fileCover: params.fileCover,
                fileName: params.fileName,
                fileBook: req.file.path,
            });

            const savedBook = await newBook.save();

            console.log(savedBook)

            res.redirect('/api/books')

        } else {
            // Без файла книги теперь создать её нельзя
            res.render('error', { error:'Не прикреплен файл книги' });
        }

    })

//Запрос на скачивание файла книги
router.get('/:id/download', async (req, res) => {
    console.log('Запрос на скачивание файла книги по id')
    const idb = req.params.id

    const found = await BookModel.findOne({ id: idb });

    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        res.download(found.fileBook)
    }
})

//Редактирование книги по id
router.post('/:id', upload.single('book'), (req, res) => {
    const params = req.body;
    const idb = req.params.id;

    // Найти книгу по id в базе данных
    BookModel.findOne({ id: idb })
        .then((found) => {
            if (!found) {
                res.status(404).json({ error: 'Книга не найдена' });
            } else {
                found.title = params.title;
                found.description = params.description;
                found.authors = params.authors;
                found.favorite = params.favorite;
                found.fileCover = params.fileCover;
                found.fileName = params.fileName;

                // Если есть файл книги, то меняем его на тот, который прислали
                if (req.file) {
                    found.fileBook = req.file.path;
                }

                // Сохранить обновленную книгу в базе данных
                found.save()
                    .then(() => {
                        console.log('Книга успешно обновлена в базе данных');
                        res.redirect(`/api/books/${idb}`);
                    })
                    .catch((err) => {
                        console.log('Ошибка при обновлении книги в базе данных:', err);
                        res.status(500).json({ error: 'Ошибка сервера' });
                    });
            }
        })
        .catch((err) => {
            console.log('Ошибка при поиске книги в базе данных:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        });
})

//Удаление книги по id
router.get('/:id/delete', async (req, res) => {
    console.log('Запрос на скачивание файла книги по id')

    const idb = req.params.id

    const found = await BookModel.findOneAndDelete({ id: idb });

    if (found === undefined){
        res.status(404).json({error:'Книга не найдена'})
    } else {
        console.log('Книга успешно удалена');
        res.redirect(`/api/books/`);
    }
})

module.exports = router;