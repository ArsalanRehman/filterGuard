const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const userRouter = require('./routers/userRouter')
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')
const app = express()
app.use(express.json({ limit: '52428800' }))
const cors = require('cors')
// const imageRoute = require('./routers/imageRouter')
var ip = require('ip')
const ipAddress = ip.address()
const blackListRouter = require('./routers/blackListRouter')
const logRouter = require('./routers/logRouter')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')


//////////////////

app.get(helmet())


const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5050',
    'http://localhost',
    'http://127.0.0.1',
    'chrome-extension://kopnfnndkjhagkaaihjbbgkignahpbeh',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  let ip = req.ip || req.connection.remoteAddress
  ip = ip.replace(/^::ffff:/, '')
  let username = 'Anonymous' // Default username

  // Extract the JWT token from the Authorization header
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1] // Remove the "Bearer " part and get the token
    try {
      // Decode the token using the secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verifies and decodes the token
      username = decoded.userName || 'Anonymous' // Get the username from the token payload
    } catch (err) {
      console.error('JWT verification failed:', err)
    }
  }

  // Format timestamp into a more readable format
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // Log data to write to the file
  const logData = {
    method: req.method,
    url: req.url,
    ip: ip,
    username: username,
    body: req.body,
    timestamp: timestamp, // Use the formatted timestamp
  }

  // console.log(`Request URL: ${req.url}`)
  // console.log('Client IP address:', ip)
  // console.log('Username:', username)

  const logDir = path.join(__dirname, 'logs') // Define the logs directory path
  const filePath = path.join(logDir, 'logs.txt') // Define the log file path

  // Check if the 'logs' directory exists, and create it if it doesn't
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true }) // Creates the directory and any missing parent directories
      console.log('Log directory created successfully!')
    } catch (err) {
      console.error('An error occurred while creating the log directory:', err)
    }
  }

  // Convert the data to a string (JSON format) and add a comma and newline at the end
  const data = JSON.stringify(logData, null, 2) + ',\n' // Add a comma followed by a newline to separate entries

  // Writing to the file using appendFileSync to keep the previous logs
  try {
    fs.appendFileSync(filePath, data) // Append to the file instead of overwriting
    // console.log('Log entry appended successfully!')
  } catch (err) {
    console.error('An error occurred while writing to the file:', err)
  }

  next()
})
// const limiter = rateLimit({
//   max: 100000,
//   windowsMS: 60* 60 * 1000,
//   message: 'request kotaniz acmistir'
// });
// app.use('/api', limiter);

app.use('/api/v1/users', userRouter)
app.use('/api/v1/blacklist', blackListRouter) 
app.use('/api/v1/log', logRouter) 




app.use(express.static('images'))

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} bulunmamaktadir`, 404))
})
app.use(globalErrorHandler)

module.exports = app