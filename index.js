let $map = document.querySelector('#map')

class LeafletMap {

    constructor () {
        this.map = null,
        this.bounds = []
    }

    async load(elt) {
        return new Promise((resolve,reject) => {
            $script(['https://unpkg.com/leaflet@1.8.0/dist/leaflet.js', 'https://stamen-maps.a.ssl.fastly.net/js/tile.stamen.js?v1.3.0'], () => {
                this.map = L.map(elt, {scrollWheelZoom: false})
                // L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                //     maxZoom: 18,
                //     attribution: '© OpenStreetMap'
                // }).addTo(this.map);

                this.map.addLayer(new L.StamenTileLayer("toner", {
                    detectRetina: true
                }))
                resolve()
            })
        })
    }

    addMaker(lat, lng, text) {
        let point = [lat, lng]
        this.bounds.push(point)
        return new LeafletMarker(point, text, this.map)
    }   
    center () {
        // creer une zone par rapportau différents points
        this.map.fitBounds(this.bounds)
    }
}

class LeafletMarker {
    constructor(point, text, map) {
        this.text = text
        this.popup = L.popup({
            autoClose: false,
            closeOnEscapeKey: false,
            closeOnClick: false,
            closeButton: false,
            className: 'marker',
            maxWidth: 400
        })
            .setLatLng(point)
            .setContent(text)
            .openOn(map)
    }

    setActive() {
        this.popup.getElement().classList.add('is-active')
    }
    unsetActive() {
        this.popup.getElement().classList.remove('is-active')
    }

    addEventListener(event, cb){
        this.popup.addEventListener('add', ()=> {
            this.popup.getElement().addEventListener(event, cb)
        })
    }

    setContent(text) {
        this.popup.setContent(text)
        this.popup.getElement().classList.add('is-expanded')
        this.popup.update()
    }

    resetContent(){
        this.popup.setContent(this.text)
        this.popup.getElement().classList.remove('is-expanded')
        this.popup.update()
    }
}

const initMap = async function() {
    let map = new LeafletMap()
    await map.load($map)
    let hoverMaker = null
    let activeMaker = null
    Array.from(document.querySelectorAll('.js-marker')).forEach( item => {
        let marker = map.addMaker( item.dataset.lat, item.dataset.lng, item.dataset.price + ' €')
        item.addEventListener('mouseover', function () {
            hoverMaker !== null ? hoverMaker.unsetActive() : null;
            marker.setActive()
            hoverMaker = marker
        })

        item.addEventListener('mouseleave', function () {
            if(hoverMaker !== null){
                hoverMaker.unsetActive()
            }
        })

        marker.addEventListener('click', function() {
            if(activeMaker !== null){
                activeMaker.resetContent()
            }
            marker.setContent(item.innerHTML)
            activeMaker = marker
        })
    })
    // centré automatiquement
    map.center()
}

if ($map !== null) {
    initMap()
}
