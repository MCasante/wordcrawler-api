const puppeteer = require('puppeteer')

class WordCrawler {
    constructor(url) {
        this.url = url || 'http://books.toscrape.com/'
        this.ignore = ['...', '..', '', ' ', '.', ':', ';', ',', '-']
        this.content = ''
        this.keys = []
        this.occurrences = []
    }

    async populateContent() {
        try {
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            })
            const page = await browser.newPage()
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                    request.abort();
                } else {
                    request.continue();
                }
            });

            await page.goto(this.url)

            const keys = await page.$eval('body', (elem, ignore) => (
                [].concat.apply([], elem.innerText.split('\n')
                    .map(text => text.trim())
                    .map(text => text.toLowerCase().split(' '))
                ).map(key => key.replace(/\(|\)|\.|\,|\?|\:|\;|\"|\'|\!/g, ''))
                    .filter(text => !ignore.includes(text))

            ), this.ignore)

            const content = keys.join(' ')

            this.keys = keys
            this.content = content

            await browser.close()
        } catch (err) {
            console.log(err)
        }
    }

    async setOccurrences() {
        if (this.keys.length < 1) await this.getContent()

        const incidencesArray = []
        this.keys.forEach(key => {
            try {
                const regex = new RegExp(key, "g");
                if (!incidencesArray.some(item => item.name === key))
                    incidencesArray.push({
                        name: key,
                        incidences: (this.content.match(regex) || []).length
                    })
            } catch (err) {
                console.log(err)
            }
        })

        this.occurrences = incidencesArray.sort((a, b) => a.incidences > b.incidences ? -1 : 1)
    }


    async getContent() {
        await this.populateContent()
        return this.content
    }

    async getOccurrences() {
        await this.setOccurrences()
        return this.occurrences
    }

    async getKeys() {
        await this.populateContent()
        return this.keys
    }

    async filterThese(keys) {
        const occ = await this.getOccurrences()
        return occ.filter(item => !keys.includes(item))
    }

}

module.exports = WordCrawler