require('dotenv').config()

const express = require('express')
const cors = require('cors')
const WordCrawler = require('./src/wordCrawler')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/get-occurrences', async (req, res) => {
    const { url } = req.body
    const crawler = new WordCrawler(url)

    const occ = await crawler.getOccurrences()
    res.json(occ)
})

app.post('/get-keys', async (req, res) => {
    const { url } = req.body
    const crawler = new WordCrawler(url)

    const keys = await crawler.getKeys()
    res.json(keys)
})

app.post('/get-content', async (req, res) => {
    const { url } = req.body

    const crawler = new WordCrawler(url)
    const content = await crawler.getContent()
    res.json(content)
})


app.listen(process.env.PORT || 5000)