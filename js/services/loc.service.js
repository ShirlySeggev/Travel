import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    setLocation,
    deleteLocation,
    searchLocation
}
var gId = 1;
const LOC_KEY = 'locations';

var gLocs = [];

function getLocs() {
    _getLocations();
    return gLocs;
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(gLocs);
    //     }, 2000)
    // });
}


function setLocation(name, lat, lng) {
    let currLocation = {
            id: gId++,
            name,
            lat,
            lng,
            createdAt: Date.now()
        }
        // gLocs.some(loc => loc.name === 'My Location')
    gLocs.push(currLocation);
    storageService.saveToStorage(LOC_KEY, gLocs)
}

function _getLocations() {
    let savedLocs = storageService.loadFromStorage(LOC_KEY);
    if (!savedLocs || !savedLocs.length) gLocs = [];
    else gLocs = savedLocs;
}

function deleteLocation(locationName) {
    var locIdx = gLocs.findIndex(position => {
        return position.name === locationName;
    });
    gLocs.splice(locIdx, 1);
    storageService.saveToStorage(LOC_KEY, gLocs)
}



function searchLocation(locName) {
    const API_KEY = 'AIzaSyAJxEq1dGkLrZA5cB3DKdS1-OgI5LDRxRE';
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?${locName}&key=${API_KEY}&region=ISR&language=EN`)
        .then(res => {
            res.data.results;
            console.log(res);

        })
}