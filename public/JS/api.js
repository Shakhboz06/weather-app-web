import {
    displayWeather,
    currentWeather,
    displayCityWeather
} from "./weather.js"
import { slickCarousel } from "./carousel.js"
import { barGraph } from "./chart.js"


export const fetchApi = async (Api_key, countryData) => {
    const reload = async () => {
        document.querySelector('.today_btn').classList.add('active_btn')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (location) => {
                const longtitude = location.coords.longitude
                const latitude = location.coords.latitude
                const api = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longtitude}&units=metric&exclude=minutely&appid=${Api_key}`
                await weatherData(api)
            },
                (error) => {
                    console.error('Error fetching location:', error)
                    const defaultLat = 40.7128;
                    const defaultLon = -74.0060;
                    const api = `https://api.openweathermap.org/data/3.0/onecall?lat=${defaultLat}&lon=${defaultLon}&units=metric&exclude=minutely&appid=${Api_key}`;
                    weatherData(api)
                }
            )
        }
    }

    const onsearch = async () => {
        try {
            let city = document.querySelector('form input').value.trim()
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${Api_key}`)
            const locationData = await response.json()
            const { lat, lon, name, country } = locationData[0]
            const api = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=${Api_key}`
            document.querySelector('.location_indicator p').innerText = `${name}, ${countryData[country]}`
            await weatherData(api)
        }
        catch (error) {
            slickCarousel()
            setTimeout(() => {
                alert('No location or data found')
            }, 200)
        }
    }

    const weatherData = async (api) => {
        const response = await fetch(api)
        const data = await response.json()
        await LocationName(data.lat, data.lon)

        const now = new Date()
        const remain = 24 - now.getHours()
        const tomorrowData = data.hourly.slice(remain, remain + 24)
        data.tomorrow = tomorrowData
        displayWeather(data)
        currentWeather(data)
        barGraph(data.hourly)
    }


    const LocationName = async (lat, lon) => {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${Api_key}`)
        const locationData = await response.json()
        const location = locationData[0]
        document.querySelector('.location_indicator p').innerText = `${location.name}, ${countryData[location.country]}`
    }


    return {
        reload, onsearch
    }
}

export const cityList = async (Api_key, countryData) => {
    const response = await fetch("cities.json")
    const cities = await response.json()

    for (let i = cities.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cities[i], cities[j]] = [cities[j], cities[i]]
    }

    for(let i = 0; i < 3; i++){
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&units=metric&appid=${Api_key}`)
        const cityData = await response.json()
        displayCityWeather(cityData, countryData)
    }
}
