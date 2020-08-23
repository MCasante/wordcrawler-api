const express = require('express')
const app = express()
const PORT = 3000

const WordCrawler = require('./src/wordCrawler')


app.use(express.json())
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