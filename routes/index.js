const express = require('express');
const router = express.Router();                          // eslint-disable-line
const mongoose = require('mongoose');

const Toc = require('../models/model_toc');
const Contact = require('../models/model_contact');


/**
 * Main function - to handle router routes
 * @param {json} parentOptions  the options from caller app
 * @return {object}             the express router
 */
module.exports = function(parentOptions) {
  // Prepare options for this router
  let options = {};
  for (let k in parentOptions) {
    if ({}.hasOwnProperty.call(parentOptions, k)) {
      options[k] = parentOptions[k];
    } // if ({}.hasOwnProperty.call(parentOptions, k))
  } // for (let k in parentOptions)

  // Connect to database
  options.database.uri = 'mongodb://' + options.database.user + ':' +
                         options.database.password + '@localhost:27017/' +
                         options.database.db;
  mongoose.connect(options.database.uri);
  const db = mongoose.connection;
  db.on('error', function(err) {
    console.error('connection error: ' + err);
  }); // db.on('error', function(err) {
  db.once('open', function() {
    /**
     * GET home page
     */
    router.get('/', function(req, res) {
      Toc.find(function(err, results) {
        if (err) {
          res.status(500);
          res.render('error', {error: err});
        } // if (err)
        res.render('0_index', {
          site:     'MarcoXZh3.me',
          title:    'MarcoXZh3',
          tocs:     results.filter( (e)=>e.cat==='toc')
                           .sort( (a, b)=>a.order-b.order),
          footers:  results.filter( (e)=>e.cat==='footer')
                           .sort( (a, b)=>a.order-b.order),
          techs:    results.filter( (e)=>e.cat==='tech')
                           .sort( (a, b)=>a.order-b.order),
        }); // res.render('0_index', { ... });
      }); // Toc.find(function(err, results) { ... });
    }); // router.get('/', function(req, res) { ... });


    /**
     * GET route Contact
     */
    router.get('/contact', function(req, res) {
      Toc.find(function(err, results) {
        if (err) {
          res.status(500);
          res.render('error', {error: err});
        } // if (err)
        let toc = results.find( (e)=>e.cat==='toc'&&e.url==='/contact');
        res.render(parseInt(toc.order) + '_contact', {
          site:     'MarcoXZh3.me',
          title:    'MarcoXZh3',
          tocs:     results.filter( (e)=>e.cat==='toc')
                           .sort( (a, b)=>a.order-b.order),
          footers:  results.filter( (e)=>e.cat==='footer')
                           .sort( (a, b)=>a.order-b.order),
          techs:    results.filter( (e)=>e.cat==='tech')
                           .sort( (a, b)=>a.order-b.order),
          toc:      toc,
        }); // res.render(parseInt(toc.order) + '_contact', { ... });
      }); // Toc.find(function(err, results) { ... });
    }); // router.get('/contact', function(req, res) { ... });


    /**
     * POST route Contact
     */
    router.post('/contact', function(req, res) {
      try {
        let contact = new Contact(req.body);
        contact.save(function() {});
        res.setHeader('Content-Type', 'application/json');
        res.send({post_status: 'Succeed'});
      } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({post_status: 'Failed'}));
      } // ContactSchema
    }); // router.post('/contact', function(req, res) { ... });
  }); // db.once('open', function() { ... });


  return router;
}; // module.exports = function(parentOptions) { ... };
