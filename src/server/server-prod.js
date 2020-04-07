import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import setImagesRoutes from './routes/images';
import setImagesDataRoutes from './routes/imagesData';

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(bodyParser.json())

app.use(express.static(DIST_DIR))

app.get('/', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    return next(err)
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  })
})

const PORT= process.env.PORT || 80;

app.listen(PORT, () => {
    console.log("App listening on port " + PORT)
    setImagesRoutes(app);
    setImagesDataRoutes(app);
});