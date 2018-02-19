const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const fs = require('fs');

const index = require('./routes/index');
const encryption = require('./lib/libencryption');
const concatJson = require('./lib/concat_json');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Setup options
let options = {};
try {
  // Load password
  const password = fs.readFileSync('keys/.raw-pw').toString().trim();
  options.password = password;

  // Load settings
  let obj = JSON.parse(fs.readFileSync('options.json').toString());
  for (let k in obj) {
    if ({}.hasOwnProperty.call(obj, k)) {
      options[k] = obj[k];
    } // if ({}.hasOwnProperty.call(obj, k))
  } // for (let k in obj)

  app.set('options', options);
} catch (err) {
  console.error(err.stack);
  process.exit(1);
} // try - catch (err)

// Load keys
try {
  if (!options.password) {
    throw new Error('No password provided to decrypt SSL certificates');
  } // if (!options.password)

  // Generate keys if not exist
  const keysPath0 = 'keys/.raw-keys';
  const keysPath1 = 'keys/keys';
  if (!fs.existsSync(keysPath1)) {
    let txt = fs.readFileSync(keysPath0).toString().trim();
    encryption.exportFileSync(txt, keysPath1, options.password);
  } // if (!fs.existsSync(keysPath1))

  // Load
  let keys = JSON.parse(encryption.importFileSync(keysPath1, options.password));
  options = concatJson(options, keys);
  app.set('options', options);
} catch (err) {
  console.error(err.stack);
  process.exit(1);
} // try - catch (err)

// Load SSL certificates if possible
const hostname = 'marcoxzh3.me';
try {
  if (!options.password) {
    throw new Error('No password provided to decrypt SSL certificates');
  } // if (!options.password)

  // Generate SSL certificates if not exist
  const sslKeyPath0 = 'keys/.raw-' + hostname + '-ssl.key';
  const sslKeyPath1 = 'keys/' + hostname + '-ssl.key';
  const sslCertPath0 = 'keys/.raw-' + hostname + '-ssl.crt';
  const sslCertPath1 = 'keys/' + hostname + '-ssl.crt';
  if (!fs.existsSync(sslKeyPath1) || !fs.existsSync(sslCertPath1)) {
    let txt = fs.readFileSync(sslKeyPath0).toString().trim();
    encryption.exportFileSync(txt, sslKeyPath1, options.password);
    txt = fs.readFileSync(sslCertPath0).toString().trim();
    encryption.exportFileSync(txt, sslCertPath1, options.password);
  } // if (!fs.existsSync(sslKeyPath1) || !fs.existsSync(sslCertPath1))

  // Load
  app.set('ssl', {
    key: encryption.importFileSync(sslKeyPath1, options.password),
    cert: encryption.importFileSync(sslCertPath1, options.password),
  }); // app.set('ssl', { ...});

  console.info('Info: SSL of "' + hostname + '" loaded');
} catch (err) {
  console.error(err.stack);
  console.warn('Warning: SSL of "' + hostname + '" not loaded');
  // Do nothing, because SSL certification is not required
} // try - catch (err)

app.use('/', index(options));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
