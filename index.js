let $map = document.querySelector('#map')

class LeafletMap {

    constructor () {
        this.map = null,
        this.bounds = []
    }

    async load(elt) {
        return new Promise((resolve,reject) => {
            $script('https://unpkg.com/leaflet@1.8.0/dist/leaflet.js', () => {
                this.map = L.map(elt)
                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    maxZoom: 18,
                    attribution: '© OpenStreetMap'
                }).addTo(this.map);
                resolve()
            })
        })
    }

    addMaker(lat, lng, text) {
        let point = [lat, lng]
        this.bounds.push(point)
        L.popup({
            autoClose: false,
            closeOnEscapeKey: false,
            closeOnClick: false,
            closeButton: false,
            className: 'marker',
            maxWidth: 400
        })
            .setLatLng(point)
            .setContent(text)
            .openOn(this.map)
    }
    center () {
        // creer une zone par rapportau différents points
        this.map.fitBounds(this.bounds)
    }
}

const initMap = async function() {
    let map = new LeafletMap()
    await map.load($map)

    Array.from(document.querySelectorAll('.js-marker')).forEach( item => {
        map.addMaker( item.dataset.lat, item.dataset.lng, item.dataset.price + ' €')
    })
    // centré automatiquement
    map.center()
}

if ($map !== null) {
    initMap()
}
