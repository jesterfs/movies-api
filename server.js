require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const app = express()
const movies = require('./moviedata.json')

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan('morganSetting'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    // const bearerToken = req.get('Authorization').split(' ')[1]
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
   
    // move to the next middleware
    next()
  })


app.get('/movie' , function handleGetMovies(req, res) {
    let response = movies;
  
    if (req.query.genre) {
        response = response.filter(movies =>
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      )
    }

    if (req.query.country) {
        response = response.filter(movies =>
            movies.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }

    if (req.query.avg_vote) {
        response = response.filter(movie =>
                Number(movie.avg_vote) >= Number(req.query.avg_vote)
                )
            
        
    }
  
  
  res.json(response)
  })

  app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  
})