const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsDirectoryPath = path.join(__dirname, '../templates/views')
const partialsDirectoryPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsDirectoryPath)
hbs.registerPartials(partialsDirectoryPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Paulo Leite'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Paulo Leite'

    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Paulo Leite'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        message: 'Help article not found.'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: address
            })

        })

    })
    
})


app.get('*', (req, res) => {
    res.render('404', {
        message: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log(`Server on port ${port}`)
})