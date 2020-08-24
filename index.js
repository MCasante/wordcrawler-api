require('dotenv').config()

const express = require('express')
const cors = require('cors')
const WordCrawler = require('./src/wordCrawler')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('WordCrawler Api')
})

app.get('/get-occurrences', async (req, res) => {
    const { url } = req.body
    const crawler = new WordCrawler(url)

    const occ = await crawler.getOccurrences()
    res.json(occ)
})

app.get('/get-keys', async (req, res) => {
    const { url } = req.body
    const crawler = new WordCrawler(url)

    const keys = await crawler.getKeys()
    res.json(keys)
})

app.get('/get-content', async (req, res) => {
    const { url } = req.body

    const crawler = new WordCrawler(url)
    const content = await crawler.getContent()
    res.json(content)
})


app.listen(process.env.PORT || 5000)