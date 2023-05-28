const multer = require('multer')
const {v4: uuid} = require('uuid')
const storage  = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'books')
    },
    filename(req, file, cb) {
        let id = uuid.call().slice(32) // Решил генерировать с помощью uuid)
        cb(null, `${id}-${file.originalname}`)
    }
})

module.exports = multer({storage})