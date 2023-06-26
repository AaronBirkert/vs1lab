// File origin: VS1LAB A3, A4

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

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const GeoTagExamples = require('../models/geotag-examples');

var memStore = new GeoTagStore();
GeoTagExamples.tagList.forEach(tag => {
  memStore.addGeoTag(new GeoTag(-1, tag[0], tag[1], tag[2], tag[3]));
})

// App routes (A3)
/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  var tags = memStore.alltags();
  res.render('index', { taglist: tags, ejs_lat: -1, ejs_long: -1, ejs_tags: JSON.stringify(tags) });
});

router.get('/api/geotags', (req, res) => {
  var searchTerm = req.query.searchterm;
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;
  var location;
  var rad;  //radius for search

  //if location passed, use that and radius 0.5
  //if not, just search all geotags (radius 1000000)
  if (latitude != undefined && longitude != undefined) {
    location = {
      latitude: latitude,
      longitude: longitude
    };
    rad = 0.5;
  }
  else {
    location = {
      latitude: 0,
      longitude: 0
    };
    rad = 10000;
  }
  //if no searchterm passed, use '' as whitecard
  if (searchTerm == undefined) searchTerm = '';

  var tags = memStore.searchNearbyGeoTags(location, rad, searchTerm);
  res.status(200).json(JSON.stringify(tags));
});

  /**
   * Route '/api/geotags' for HTTP 'POST' requests.
   * (http://expressjs.com/de/4x/api.html#app.post.method)
   *
   * Requests contain a GeoTag as JSON in the body.
   * (http://expressjs.com/de/4x/api.html#req.query)
   *
   * The URL of the new resource is returned in the header as a response.
   * The new resource is rendered as JSON in the response.
   */

router.post('/api/geotags', (req, res) => {
  var newTag = new GeoTag(-1, req.body["name"], req.body["latitude"], req.body["longitude"], req.body["hashtag"]);
  var id = memStore.addGeoTag(newTag);
  res.append('URL', `/api/geotags/${id}`);
  res.status(200).json(JSON.stringify([newTag]));
});


  /**
   * Route '/api/geotags/:id' for HTTP 'GET' requests.
   * (http://expressjs.com/de/4x/api.html#app.get.method)
   *
   * Requests contain the ID of a tag in the path.
   * (http://expressjs.com/de/4x/api.html#req.params)
   *
   * The requested tag is rendered as JSON in the response.
   */

router.get('/api/geotags/:id', (req, res) => {
  var tag = memStore.geotagById(req.params.id);
  res.status(200).json(JSON.stringify(tag));
});


  /**
   * Route '/api/geotags/:id' for HTTP 'PUT' requests.
   * (http://expressjs.com/de/4x/api.html#app.put.method)
   *
   * Requests contain the ID of a tag in the path.
   * (http://expressjs.com/de/4x/api.html#req.params)
   * 
   * Requests contain a GeoTag as JSON in the body.
   * (http://expressjs.com/de/4x/api.html#req.query)
   *
   * Changes the tag with the corresponding ID to the sent value.
   * The updated resource is rendered as JSON in the response. 
   */

router.put('/api/geotags/:id', (req, res) => {
  var id = req.params.id;
  var tag = req.body;

  memStore.updateTag(id, tag);
  res.status(200).json(JSON.stringify(memStore.geotagById(id)));
});


  /**
   * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
   * (http://expressjs.com/de/4x/api.html#app.delete.method)
   *
   * Requests contain the ID of a tag in the path.
   * (http://expressjs.com/de/4x/api.html#req.params)
   *
   * Deletes the tag with the corresponding ID.
   * The deleted resource is rendered as JSON in the response.
   */

router.delete('/api/geotags/:id', (req, res) => {
  var id = req.params.id;
  var tag = memStore.geotagById(id);
  memStore.removeById(id);
  res.status(200).json(JSON.stringify(tag));
});

  module.exports = router;
