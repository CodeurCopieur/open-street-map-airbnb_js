let $map = document.querySelector('#map')

class LeafletMap {

    constructor () {
        this.map = null
    }

    async load(elt) {
        return new Promise((resolve,reject) => {
            $script('https://unpkg.com/leaflet@1.8.0/dist/leaflet.js', () => {
                this.map = L.map(elt).setView([51.505, -0.09], 13)
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '© OpenStreetMap'
                }).addTo(this.map);
                resolve()
            })
        })
    }

    addMaker(lat, lng, text) {
        L.popup({
            autoClose: false,
            closeOnEscapeKey: false,
            closeOnClick: false,
            closeButton: false,
            className: 'marker',
            maxWidth: 400
        })
            .setLatLng([lat, lng])
            .setContent(text)
            .openOn(this.map)
    }
}

const initMap = async function() {
    let map = new LeafletMap()
    await map.load($map)

    Array.from(document.querySelectorAll('.js-marker')).forEach( item => {
        map.addMaker( item.dataset.lat, item.dataset.lng, item.dataset.price + ' €')
    })
}

if ($map !== null) {
    initMap()
}
