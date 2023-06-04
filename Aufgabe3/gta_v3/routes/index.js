// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

const LocationHelper = require('../public/javascripts/location-helper');

const rad = 50;

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const InMemoryGeotagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

var memStore = new InMemoryGeotagStore();
GeoTagExamples.tagList.forEach(tag => {
  memStore.addGeoTag(new GeoTag(0, tag[0], tag[1], tag[2], tag[3]));
})

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  var tags = memStore.alltags();
  res.render('index', { taglist: tags, ejs_lat: -1, ejs_long: -1, ejs_tags: JSON.stringify(tags)});
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

router.post('/tagging', (req, res) => {
  var newTag = new GeoTag(0, req.body["name"], req.body["latitude"], req.body["longitude"], req.body["hashtag"]);
  memStore.addGeoTag(newTag);
  var tags = memStore.getNearbyGeoTags({ latitude: newTag.latitude, longitude: newTag.longitude }, rad);
  res.render('index', { taglist: tags, ejs_lat: newTag.latitude, ejs_long: newTag.longitude, ejs_tags: JSON.stringify(tags)});
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
  var lat = req.body["latitude"];
  var lon = req.body["longitude"];
  var keyword = req.body["keyword"];
  var tags = memStore.searchNearbyGeoTags({latitude: lat, longitude: lon}, rad, keyword);
  res.render('index', {taglist: tags, ejs_lat: lat, ejs_long: lon, ejs_tags: JSON.stringify(tags)});
});

module.exports = router;
