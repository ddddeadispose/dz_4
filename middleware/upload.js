const multer = require('multer')
const download = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'books/img')
    },
    filename(req, file, cb){
        cb(null, `${file.originalname}`)
    }
})

module.exports = multer({upload: download})