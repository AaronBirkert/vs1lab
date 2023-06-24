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
        mapSrc = mapManager.getMapUrl(lat, lon, tags ?? [], 14);
        imgMap.src = mapSrc;
    }
}

function updateMap(geotags) {
    let mapManager = new MapManager("GSIfAv4ZScE9no37RR4WIb9577jV8VNg");
    let lat = document.getElementById("input__latitude").value;
    let long = document.getElementById("input__longitude").value;
    console.log(lat + " ; " + long);
    let mapUrl = mapManager.getMapUrl(lat, long, geotags, 14);
    document.getElementById("mapView").setAttribute("src", mapUrl);

    return geotags;
}

function updateTags(geotags) {
    let list = document.getElementById("discoveryResults");
    list.innerHTML = "";

    geotags.forEach(function (tag) {
        let li = document.createElement("li");
        li.innerHTML = tag.name + " (" + tag.latitude + "," + tag.longitude + ") " + tag.hashtag;
        list.appendChild(li);
    });
}

async function getTags(searchTerm) {
    let geotags = await fetch("http://localhost:3000/api/geotags/?searchterm=" + searchTerm);

    geotags = await geotags.json();
    geotags = JSON.parse(geotags);

    console.log(geotags);

    return geotags;
}

async function addTag(geotagBody) {
    let response = await fetch("http://localhost:3000/api/geotags", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(geotagBody),
    });
    return JSON.parse(await response.json());
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});

document.getElementById("discoveryFilterForm").addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("loading");

    let search = document.getElementById("input__search").value;
    getTags(search).then(updateMap).then(updateTags).catch((err) => {
        console.log(err);
        alert("No entries found");
    });
});

document.getElementById("tag-form").addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("Adding");

    let long = document.getElementById("input__longitude").value;
    let lati = document.getElementById("input__latitude").value;
    let name = document.getElementById("input__name").value;
    let hash = document.getElementById("input__hashtag").value;

    let body = {
        longitude: long,
        latitude: lati,
        name: name,
        hashtag: hash
    };

    addTag(body).then(updateMap).then(updateTags).catch((e) => {
        console.log(e);
        alert("could not createe");
    });
});