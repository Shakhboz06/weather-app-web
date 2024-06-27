export const mapbox = (Api_key) => {
    const mapInit = () => {
        const openWeatherMapUrl = `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${Api_key}`

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [-74.5, 40],
            zoom: 5,
            accessToken: 'pk.eyJ1IjoiZGFuaWVsMjkiLCJhIjoiY2x3ZTR6NGFyMGQydDJxcWpzeHozcXprdSJ9.hQOyVfJH1Y0glfDfaAHEEQ'
        })

        map.on('click', async (event) => {
            const long = event.lngLat.lng
            const lat = event.lngLat.lat
            new mapboxgl.Marker({
                element: await displayDataOnMap(long, lat)
            }).setLngLat([long, lat])
                .addTo(map)
        })

        const control_panel = document.createElement('div')
        control_panel.className = 'mapboxgl-ctrl mapboxgl-ctrl-group layer-control '
        control_panel.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 24 24" width="30px"
    fill="#333333">
    <path d="M0 0h24v24H0z" fill="none" />
    <path
    d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" />
    </svg>
        <div class="weather_layers">
        <label for="precipitation"><input type="checkbox" id="precipitation" checked> Precipitation</label>
        <label for="temperature"><input type="checkbox" id="temperature"> Temperature</label>
        <label for="clouds"><input type="checkbox" id="clouds"> Clouds</label>
        <label for="wind"><input type="checkbox" id="wind"> Wind</label>
        </div>`

        const weatherControl = {
            onAdd: function (map) {
                this._map = map
                return control_panel
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((location) => {
                const long = location.coords.longitude
                const lat = location.coords.latitude
                map.setCenter([long, lat])

                map.on('load', async () => {
                    new mapboxgl.Marker({
                        element: await displayDataOnMap(long, lat)
                    }).setLngLat([long, lat])
                        .addTo(map)
                })
            })
        }

        map.on('load', () => {
            map.addSource('clouds', {
                'type': 'raster',
                'tiles': [openWeatherMapUrl.replace('{layer}', 'clouds_new')],
                'tileSize': 256
            })
            map.addLayer({
                'id': 'clouds',
                'type': 'raster',
                'source': 'clouds',
                'layout': {
                    'visibility': 'none'
                }
            })

            map.addSource('temperature', {
                'type': 'raster',
                'tiles': [openWeatherMapUrl.replace('{layer}', 'temp_new')],
                'tileSize': 256
            })
            map.addLayer({
                'id': 'temperature',
                'type': 'raster',
                'source': 'temperature',
                'layout': {
                    'visibility': 'none'
                }
            })

            map.addSource('precipitation', {
                'type': 'raster',
                'tiles': [openWeatherMapUrl.replace('{layer}', 'precipitation_new')],
                'tileSize': 256
            })
            map.addLayer({
                'id': 'precipitation',
                'type': 'raster',
                'source': 'precipitation',
                'layout': {
                    'visibility': 'visible'
                }
            })

            map.addSource('wind', {
                'type': 'raster',
                'tiles': [openWeatherMapUrl.replace('{layer}', 'wind_new')],
                'tileSize': 256
            })
            map.addLayer({
                'id': 'wind',
                'type': 'raster',
                'source': 'wind',
                'layout': {
                    'visibility': 'none'
                }
            })
        })


        const toggleLayer = (layerId, isVisible) => {
            const visibility = isVisible ? 'visible' : 'none'
            map.setLayoutProperty(layerId, 'visibility', visibility)
        }

        map.addControl(weatherControl, 'top-left')
        const control_layers = document.querySelectorAll('.layer-control label')
        const weather_layers = document.querySelector('.layer-control .weather_layers')

        const CheckboxChange = (event) => {
            event.target.setAttribute('checked', 'checked')
            toggleLayer(event.target.id, event.target.checked)

            control_layers.forEach(el => {
                if (el.querySelector('input').id === event.target.id) {
                    if (event.target.checked) {
                        weather_layers.classList.remove('active')
                        control_panel.classList.remove('active-1')
                        control_panel.firstElementChild.style.display = 'block'
                    } else {
                        weather_layers.classList.add('active')
                        control_panel.classList.add('active-1')
                        control_panel.firstElementChild.style.display = 'none'
                    }
                }
            })
        }
        document.getElementById('clouds').onchange = CheckboxChange
        document.getElementById('precipitation').onchange = CheckboxChange
        document.getElementById('temperature').onchange = CheckboxChange
        document.getElementById('wind').onchange = CheckboxChange


        control_panel.onclick = () => {
            control_panel.classList.add('active-1')
            weather_layers.classList.add('active')
            control_panel.classList.contains('active-1')
                ? control_panel.firstElementChild.style.display = 'none'
                : control_panel.firstElementChild.style.display = 'block'
        }


        map.addControl(new mapboxgl.FullscreenControl())
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: false,
            },
            fitBoundsOptions: {
                maxZoom: 10
            },
            showUserLocation: false,
            trackUserLocation: false,
        })
        )
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }))
        map.boxZoom.enable()

    }

    const displayDataOnMap = async (lon, lat) => {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lon=${lon}&lat=${lat}&units=metric&exclude=minutely&appid=${Api_key}`)
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