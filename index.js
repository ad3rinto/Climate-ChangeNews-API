const PORT = process.env.PORT || 8000 // This is for deploying in heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const app = express()


const newspapers = [
    {
        name:'thetimes',
        address:'https://www.thetimes.co.uk/environment',
        base: ''
    },
    {
        name:'guardian',
        address:'https://www.theguardian.com/uk/environment/',
        base: ''
    },
    {
        name:'telegraph',
        address:'https://www.telegraph.co.uk/environment',
        base: 'https://www.telegraph.co.uk'
    }
]
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                    
                })
            
            }) 


        })

})


app.get('/', (req  , res ) => {
    res.json("Welcome to my climate change news API")
})


app.get('/news', (req  , res ) => {
    res.json(articles)
})

app.get('/news/:newspaperId',async(req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper =>newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificarticles = []

            $('a:contains("climate")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificarticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificarticles)
        }).catch(err => console.log(err))
})
//     axios.get('https://www.theguardian.com/uk/environment/')
//     .then((response) => {
//         const html = response.data
//         const $ = cheerio.load(html)


//         $('a:contains("climate")', html).each(function (){
//            const title = $(this).text() 
//            const url = $(this).attr('href')
//            articles.push({
//                title,
//                url
//            })
//         })
//         res.json(articles)
//     }).catch((err) => console.log(err))
// })

app.listen(PORT, () => console.log('server running on PORT ${PORT}'))
