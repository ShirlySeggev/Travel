import { locService } from './loc.service.js'
import { appController } from '../app.controller.js';
import { storageService } from './storage.service.js';

export const mapService = {
    initMap,
    addMarker,
    deleteMarker,
    getMarkers,
    panTo,
}

var gMap;
var gMarkers = [];
const MARK_KEY = 'markers';

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            gMap.addListener('click', (mapsMouseEvent) => {
                    appController.openModal(mapsMouseEvent.latLng);

                })
                // console.log('Map!', gMap);
        })
}

function addMarker(loc, name) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: name
    });
    // marker.setMap(gMap);
    gMarkers.push(marker);
    // storageService.saveToStorage(MARK_KEY, gMarkers);
    return marker;
}

function deleteMarker(markerName) {
    const markerIdx = gMarkers.findIndex(marker => {
        return marker.title === markerName;
    });
    gMarkers[markerIdx].setMap(null);
    gMarkers.splice(markerIdx, 1);
    // storageService.saveToStorage(MARK_KEY, gMarkers);
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyA-0HDmtMWQ-7VE4SYjw0L3UhcxZitK_cs';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function _getMarkers() {
    let savedMarkers = storageService.loadFromStorage(MARK_KEY);
    if (!savedMarkers || !savedMarkers.length) gMarkers = [];
    else gMarkers = savedMarkers;
}

function getMarkers() {
    _getMarkers();
    return gMarkers;
}