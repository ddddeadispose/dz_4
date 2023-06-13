Запрос для вставки данных

db.books.insertMany([
  {
    title: "Book 1",
    description: "Description 1",
    authors: "Author 1"
  },
  {
    title: "Book 2",
    description: "Description 2",
    authors: "Author 2"
  }
])

Запрос для поиска полей документов

db.books.find({ title: "Book 1" })

Запрос для редактирования полей description

db.books.updateOne(
  { _id: ObjectId("<идентификатор записи>") },
  { $set: { description: "Новое описание", authors: "Новый автор" } }
)
