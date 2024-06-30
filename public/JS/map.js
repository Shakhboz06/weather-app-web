export const mapbox = (Api_key) => {
    let markers = []
    let unit = 'metric'

    const mapInit = () => {
        const openWeatherMapUrl = `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${Api_key}`

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [-74.5, 40],
            zoom: 5,
            accessToken: 'pk.eyJ1IjoiZGFuaWVsMjkiLCJhIjoiY2x3ZTR6NGFyMGQydDJxcWpzeHozcXprdSJ9.hQOyVfJH1Y0glfDfaAHEEQ'
        })

        const addMarker = async (long, lat) => {
            const markerElement = await displayDataOnMap(long, lat)
            const marker = new mapboxgl.Marker({ element: markerElement })
                .setLngLat([long, lat])
                .addTo(map)

            markers.push({ marker, long, lat })
        }

        map.on('click', async (event) => {
            const { lng, lat } = event.lngLat
            addMarker(lng, lat)
        })

        const controlPanel = document.createElement('div')
        controlPanel.className = 'mapboxgl-ctrl mapboxgl-ctrl-group layer-control'
        controlPanel.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="30px" fill="#333333">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
            </svg>
            <div class="weather_layers">
                <label for="precipitation"><input type="checkbox" id="precipitation" checked> Precipitation</label>
                <label for="temperature"><input type="checkbox" id="temperature"> Temperature</label>
                <label for="clouds"><input type="checkbox" id="clouds"> Clouds</label>
                <label for="wind"><input type="checkbox" id="wind"> Wind</label>
                <div class="measure">
                    <label for="cel"><input type="checkbox" id="cel" checked>°C</label>
                    <label for="far"><input type="checkbox" id="far">°F</label>
                </div>
            </div>`

        const weatherControl = {
            onAdd: function (map) {
                this._map = map
                return controlPanel
            }
        }

        const initializeMapLayers = () => {
            const layers = [
                { id: 'clouds', layer: 'clouds_new', visible: false },
                { id: 'temperature', layer: 'temp_new', visible: true },
                { id: 'precipitation', layer: 'precipitation_new', visible: false },
                { id: 'wind', layer: 'wind_new', visible: false }
            ]

            layers.forEach(({ id, layer, visible }) => {
                map.addSource(id, {
                    'type': 'raster',
                    'tiles': [openWeatherMapUrl.replace('{layer}', layer)],
                    'tileSize': 256
                })
                map.addLayer({
                    'id': id,
                    'type': 'raster',
                    'source': id,
                    'layout': {
                        'visibility': visible ? 'visible' : 'none'
                    }
                })
            })
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((location) => {
                const { longitude, latitude } = location.coords
                map.setCenter([longitude, latitude])
                map.on('load', () => addMarker(longitude, latitude))
            })
        }

        map.on('load', initializeMapLayers)

        const toggleLayer = (layerId, isVisible) => {
            map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none')
        }

        map.addControl(weatherControl, 'top-left')
        const controlLayers = document.querySelectorAll('.layer-control label')
        const weatherLayers = document.querySelector('.layer-control .weather_layers')

        const checkboxChange = (event) => {
            const { id, checked } = event.target
            toggleLayer(id, checked)
            controlLayers.forEach(el => {
                if (el.querySelector('input').id === id) {
                    weatherLayers.classList.toggle('active', !checked)
                    controlPanel.classList.toggle('active-1', !checked)
                    controlPanel.firstElementChild.style.display = checked ? 'block' : 'none'
                }
            })
        }

        const unitChange = async (event) => {
            unit = event.target.id === 'cel' ? 'metric' : 'imperial'
            document.getElementById('cel').checked = (unit === 'metric')
            document.getElementById('far').checked = (unit === 'imperial')

            controlLayers.forEach(el => {
                if (el.querySelector('input').id === event.target.id) {
                    weatherLayers.classList.toggle('active', !event.target.checked)
                    controlPanel.classList.toggle('active-1', !event.target.checked)
                    controlPanel.firstElementChild.style.display = event.target.checked ? 'block' : 'none'
                }
            })

     
            markers.forEach(({ marker }) => marker.remove())
            markers = []

     
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (location) => {
                    const { longitude, latitude } = location.coords
                    addMarker(longitude, latitude)
                })
            }
        }

        document.getElementById('clouds').onchange = checkboxChange
        document.getElementById('precipitation').onchange = checkboxChange
        document.getElementById('temperature').onchange = checkboxChange
        document.getElementById('wind').onchange = checkboxChange
        document.getElementById('cel').onchange = unitChange
        document.getElementById('far').onchange = unitChange

        controlPanel.onclick = () => {
            controlPanel.classList.toggle('active-1')
            weatherLayers.classList.toggle('active')
            controlPanel.firstElementChild.style.display = controlPanel.classList.contains('active-1') ? 'none' : 'block'
        }

        map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('#map')}))
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: false,
            },
            fitBoundsOptions: {
                maxZoom: 10
            },
            showUserLocation: false,
            trackUserLocation: false,
        }))
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }))
        map.boxZoom.enable()
    }

    const displayDataOnMap = async (lon, lat) => {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lon=${lon}&lat=${lat}&units=${unit}&exclude=minutely&appid=${Api_key}`)
        const data = await response.json()
        return weatherMarker(data)
    }

    const weatherMarker = (data) => {
        const marker = document.createElement('div')
        marker.className = 'weather-marker'
        marker.innerHTML = `
            <div class="temperature">${Math.round(data.current.temp)}° <img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" alt=""></div>`
        return marker
    }

    return mapInit()
}
