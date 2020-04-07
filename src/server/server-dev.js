import path from 'path'
import express from 'express'
import webpack from 'webpack'
import bodyParser from 'body-parser'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import setTicketApi from './routes/ticketApi.js'
import config from '../../webpack.dev.config'


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)

app.use(bodyParser.json())

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

// app.use(express.static(DIST_DIR))

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
      setTicketApi(app);
});