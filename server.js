const http = require('http')
const fs = require('fs')

// global variables
const port = 2000

const cardData = JSON.parse(fs.readFileSync('data/recipes.json'))

const generateCards = () =>
  cardData
    .map(
      card =>
        `<div class="card">
            <span class="title__card">${card.name}</span>
              <image src="${card.images[0]}" alt="thumbnail">
              <span class="price__card">$${card.price}</span>
            </div>`
    )
    .join('')

/** @function serveImage
 * Serves the specified image as an HTTP response.
 * @param {string} filename - the file to serve
 * @param {http.IncomingMessage} req - the HTTP request object
 * @param {http.ServerResponse} res - the HTTP response object
 */
const serveImage = (filename, req, res) => {
  fs.readFile(`public/images/${filename}`, (err, data) => {
    if (err) {
      res.statusCode = 404
      res.statusMessage = 'Not Found'
      res.end('Not Found')
      return
    }
    res.setHeader('Content-Type', 'image/jpeg')
    res.end(data)
  })
}

const serveStylesheet = (filename, req, res) => {
  fs.readFile(`public/css/${filename}`, (err, data) => {
    if (err) {
      console.error(err) // write our error to the log
      res.statusCode = 500
      res.statusMessage = 'Server Error'
      res.end('Server Error') // serve the error status
      return // stop executing the function
    }
    res.setHeader('Content-Type', 'text/css') // set our content type
    res.end(data) // serve the file
  })
}

/** @function serveIndex
 * Serves an index page
 */
const serveIndex = (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.end(
    `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Gallery</title>
          <link href="reset.css" type="text/css" rel="stylesheet">
          <link href="gallery.css" type="text/css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,400i,600" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
        <div class="hero">
        <img src="50734737_101391220981739_6214877262350254143_n.jpg" alt="Kistner's Flowers Banner" class="image__hero"/>
        <div class="overlay__hero"></div>
        <div class="text__hero">
        <h1 class="title__hero">Kistner's Flowers</h1>
        <h3>For the best and freshest flowers in Manhattan, Kistner's Flowers has exactly what you're looking for!</h3>
        </div>
        <div class="text__contact">
        <p class="text__contact--bold">Have an extra special request?</p>
        <p class="text__contact--big">Call us at (785) 776-7989</p>
        </div>
        </div>
          <main id="thumbnails">
            ${generateCards()} 
          </main>
          <section class="what">
          <h2 class="sub_heading">We Specialize in Weddings and Funerals</h2>
          <p>Please feel free to contact one of our event specialists: <a href="tel:1-785-776-7989">(785) 776-7989</a> </p>
          </section>
          <section class="company_info">
          <h2 class="sub_heading white">About The Company</h2>
          <div class="wrapper__company_info">
          <img src="owner-picture.jpg" alt="the owners of Kristner's Flowers"  class="img__company_info"/>
          <div class="text__company_info">
          <p>
          Kistner's Flowers has been serving Manhattan and surrounding area's for over 70 years. Kistner's Flowers was started in 1946 by Ray and Marie Kistner who had a love for flowers and bedding plants and were looking for a way to provide a quality product to the Manhattan area. In 1974 the business was sold to the Orr-Lee family who slowy changed from cut flowers and bedding plants to fresh flowers and Interior Plantscaping.  In 2006 Matt and Bronwyn Douglas, who are both Kansas State Graduates, purchased the company from the Orr-Lee's after having worked at Kistner's for a number of years.</p>
          </p>
          </div>
          </div>
          </section>
          </body>
      </html>
    `
  )
}

/* Create a new HTTP server */
const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/':
    case '/index.html':
      serveIndex(req, res)
      break
    case '/gallery.css':
      serveStylesheet('gallery.css', req, res)
      break
    case '/reset.css':
      serveStylesheet('reset.css', req, res)
      break
    default:
      serveImage(req.url, req, res)
  }
})

/* Listen for incoming HTTP requests */
server.listen(port, function() {
  console.log(`Listening on port ${port}`)
})
