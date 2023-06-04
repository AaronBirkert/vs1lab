// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {
  constructor() {
    this.geotags = [];
  }

  addGeoTag(geotag) {
    this.geotags.push(geotag);
  }

  removeGeoTag(name) {
    this.geotags = this.geotags.filter((geotag) => geotag.name !== name);
  }

  alltags() {
    return this.geotags;
  }


  getNearbyGeoTags(location, radius) {
    const nearbyGeoTags = [];
    for (const geotag of this.geotags) {
      let distance = calculateDistance(location, geotag);
      if (distance <= radius) {
        nearbyGeoTags.push(geotag);
      }
    }
    return nearbyGeoTags;
  }

  searchNearbyGeoTags(location, radius, keyword) {
    const nearbyGeoTags = [];
    for (const geotag of this.geotags) {
      let distance = calculateDistance(location, geotag);
      if (distance <= radius && ( keyword == '' || (geotag.name.includes(keyword) || geotag.hashtag.includes(keyword)))) {
        nearbyGeoTags.push(geotag);
      }
    }
    return nearbyGeoTags;

  }
}

function calculateDistance(location, geotag) {
  const latDiff = location.latitude - geotag.latitude;
  const longDiff = location.longitude - geotag.longitude;
  return Math.sqrt(latDiff * latDiff + longDiff * longDiff);
}

module.exports = InMemoryGeoTagStore;
