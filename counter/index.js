const express = require('express')
const app = express()
const fs = require('fs')

let counters = {}

// Решил для такого простого файла не делать базу данных, а просто сохранять в JSON объект со счетчиками
try {
    counters = JSON.parse(fs.readFileSync('counters.json'))
} catch (e) {
    console.log(e)
}

const PORT = process.env.PORT || 3001

app.post('/api/counter/:id/incr', (req, res) => {

    const idb = req.params.id

    if(!counters[idb]){
        counters[idb] = 1
    } else {
        counters[idb]++
    }

    res.status(200).json({status:'OK'})

    fs.writeFileSync('counters.json', JSON.stringify(counters))

})

app.get('/api/counter/:id', (req, res) =>{
    const idb = req.params.id

    res.json({value: counters[idb]})
})

console.log(PORT)

app.listen(PORT)