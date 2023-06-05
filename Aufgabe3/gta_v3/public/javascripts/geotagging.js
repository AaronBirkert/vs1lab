// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...


console.log("The geoTagging script is going to start...");



/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation() {
    //get lat and long from the document (to check if its already set...)
    var lat = document.getElementById("input__latitude").value;
    var lon = document.getElementById("input__longitude").value;

    var mapSrc;

    //map and tag data and init
    var imgMap = document.getElementById("mapView");
    var mapManager = new MapManager('GSIfAv4ZScE9no37RR4WIb9577jV8VNg');
    var tags = null;
    if (imgMap.dataset.tags != "") {
        tags = JSON.parse(imgMap.dataset.tags);
    }

    //if lat and long are not set, use API
    if (lat < 0 || lon < 0) {
        console.log("requires API...");
        LocationHelper.findLocation(helper => {
            const lat = helper.latitude;
            const lon = helper.longitude;
            document.getElementById("input__longitude").value = lon;
            document.getElementById("input__latitude").value = lat;
            document.getElementById("search__longitude").value = lon;
            document.getElementById("search__latitude").value = lat;

            mapSrc = mapManager.getMapUrl(lat, lon, tags ?? [], 14);
            imgMap.src = mapSrc;
        });
    }
    //else we can just use the lat and long from the document.
    else {
        mapSrc = mapManager.getMapUrl(lat, lon, tags ?? [], 12);
        imgMap.src = mapSrc;
    }


}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
