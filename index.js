const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000


const WordCrawler = require('./src/wordCrawler')

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.send('WordCrawler Api')
})

app.post('/navigate', async (req, res) => {
    const { url } = req.body
    const crawler = new WordCrawler(url)

    const occ = await crawler.getOccurrences()
    res.json(occ)
})



app.listen(PORT, () => {
    console.log('listening...')
})