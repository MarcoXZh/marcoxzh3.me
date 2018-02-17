const fs = require('fs');
const gulp = require('gulp');
const log = require('fancy-log');
const mongoose = require('mongoose');

const concatJson = require('./lib/concat_json');
const encryption = require('./lib/libencryption');
const Toc = require('./models/model_toc');


// Task to Initialize database
gulp.task('init:db', function(callback) {
  // Load settings
  let password = fs.readFileSync('pw.log').toString().trim();
  let keys = JSON.parse(encryption.importFileSync('keys/keys', password));
  let options = JSON.parse(fs.readFileSync('options.json').toString());
  options = concatJson(options, keys);

  // Connection database
  mongoose.connect('mongodb://' + options.database.user + ':' +
                   options.database.password + '@localhost:27017/' +
                   options.database.db);
  const db = mongoose.connection;
  db.on('error', function(err) {
    log.error('connection error: ' + err);
  }); // db.on('error', function(err) {
  db.once('open', function() {
    // Reset collection
    Toc.remove({}, function(err) {
      if (err) {
        log.error(err);
      } else {
        log('Raw collection reset');
      } // else - if (err)
    }); // Toc.remove({}, function(err) { ... });

    // Load data
    let text = fs.readFileSync('logs/db/tocs.log').toString()
                 .split('\n').map(function(line) {
                    let l = line.trim();
                    if (l.startsWith('/*') || l.startsWith('"_id"')) {
                      return null;
                    } else if (l.includes('ISODate(')) {
                      return l.split('ISODate(').join('').split(')').join('');
                    } else {
                      return line;
                    }
               }).filter( (e)=>e ).join('');
    let cnt = 0;
    JSON.parse(text).forEach(function(doc, i, arr) {
      doc.created = new Date(doc.created);
      new Toc(doc).save(function(err) {
        if (err) {
          log.error('Error saving: ' + (i+1) + '/' + arr.length +
                        '\n' + err.stack);
        } else {
          log('Saved: ' + (++cnt) + '/' + arr.length);
        } // else - if (err)
      }); // new Toc(doc).save(function(err) { ... });
    }); // JSON.parse(text).forEach(function(doc, i, arr) { ... });
    callback();
  }); // db.once('open', function() { ... });
}); // gulp.task('init:db', function(callback) { ... });


// Default task
gulp.task('default', ['init:db']);
