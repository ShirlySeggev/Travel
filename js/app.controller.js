import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const appController = {
    openModal
}

window.onload = onInit;
window.onDeleteLocation = onDeleteLocation;
window.onPanLocation = onPanLocation;
document.execCommand = execCommand;
// window.copyToClipboard = copyToClipboard;

function onInit() {
    addEventListenrs();
    renderLocations();
    renderMarkedLocations();
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

function addEventListenrs() {
    document.querySelector('.btn-pan').addEventListener('click', (ev) => {
        console.log('Panning the Map');
        mapService.panTo(35.6895, 139.6917);
    });
    document.querySelector('.btn-add-marker').addEventListener('click', (ev) => {
        console.log('Adding a marker');
        mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 }, test);
    });
    document.querySelector('.btn-get-locs').addEventListener('click', (ev) => {
        locService.getLocs()
            .then(locs => {
                console.log('Locations:', locs)
                document.querySelector('.locs').innerText = JSON.stringify(locs)
            })

    });
    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                updateMyLocation(pos)
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    });
    document.querySelector('.search-btn').addEventListener('click', (ev) => {
        let elSearchInput = document.querySelector('#search').value;
        locService.searchLocation(elSearchInput)
            .then(location => {
                console.log(location);
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    });
    document.querySelector('.btn-copy-location').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                copyToClipboard(pos);
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    });

}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function updateMyLocation(pos) {
    console.log('User position is:', pos.coords);
    document.querySelector('.user-pos').innerText = `My Location`;
    mapService.panTo(pos.coords.latitude, pos.coords.longitude);
    mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'myLocation');
    //locService.setLocation('My Location', pos.coords.latitude, pos.coords.longitude);
}

function openModal(pos) {
    const lat = pos.toJSON().lat;
    const lng = pos.toJSON().lng;

    const { value: text } = Swal.fire({
        input: 'text',
        inputLabel: 'Enter location name',
        inputPlaceholder: 'Type your name here...',
        inputAttributes: {
            'aria-label': 'Type your message here'
        },
        confirmButtonText: `Save`,
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            locService.setLocation(result.value, lat, lng);
            mapService.addMarker({ lat: lat, lng: lng }, result.value);
            Swal.fire('Saving!', '', 'success');
            renderLocations();
        } else if (result.isDismissed) {
            Swal.fire('OK, next time', '', 'info')
        }
    })

}

function renderLocations() {
    const locations = locService.getLocs();
    var listHtml = locations.map(location => {
        return `
        <tr>
        <td>${location.id}</td>
        <td>${location.name}</td>
        <td>${location.lat}</td>
        <td>${location.lng}</td>
        <td><button onclick="onDeleteLocation('${location.name}')">Delete</button></td>
        <td><button onclick="onPanLocation('${location.lat}','${location.lng}')">Go</button></td>
        </tr>`;
    });
    document.querySelector('.locations-container').innerHTML = listHtml.join('');
}

function onDeleteLocation(locationName) {
    locService.deleteLocation(locationName);
    mapService.deleteMarker(locationName);
    console.log('removing', locationName);
    renderLocations();
}


function onPanLocation(lat, lng) {
    mapService.panTo(lat, lng);
}

function renderMarkedLocations() {
    const markers = mapService.getMarkers();
    console.log(markers);
}


function copyToClipboard(pos) {
    console.log('onCopyLocation', pos);

    const copyUrl = `https://shirlyseggev.github.io/Travel/?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`;

    // copyUrl.select();
    // copyUrl.setSelectionRange(0, 99999);
    copyUrl.execCommand('createLink');
    console.log("Copied the text: " + copyUrl);
}