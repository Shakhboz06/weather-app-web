import { slickCarousel } from "./carousel.js"

const today_btn = document.querySelector('.today_btn')
const tomorrow_btn = document.querySelector('.tomorrow_btn')
const weekly_btn = document.querySelector('.weekly_btn')
const weather_con = document.querySelector('.carousel')
export const displayWeather = (data) => {

    today_btn.onclick = (event) => {
        weather_con.innerHTML = ''
        event.target.classList.add('active_btn')
        tomorrow_btn.classList.remove('active_btn')
        weekly_btn.classList.remove('active_btn')
        currentWeather(data)
    }

    tomorrow_btn.onclick = (event) => {
        weather_con.innerHTML = ''
        event.target.classList.add('active_btn')
        today_btn.classList.remove('active_btn')
        weekly_btn.classList.remove('active_btn')
        if ($('.carousel').hasClass('slick-initialized')) {
            $('.carousel').slick('unslick')
        }
        $('.carousel').empty()

        for (let item of data.tomorrow) {
            weather_con.append(WeatherElement('tomorrow', item, { hour: '2-digit', minute: '2-digit' }))
        }
        slickCarousel()
    }

    weekly_btn.onclick = (event) => {
        weather_con.innerHTML = ''
        event.target.classList.add('active_btn')
        tomorrow_btn.classList.remove('active_btn')
        today_btn.classList.remove('active_btn')

        if ($('.carousel').hasClass('slick-initialized')) {
            $('.carousel').slick('unslick')
        }
        $('.carousel').empty()

        for (let i = 1; i < data.daily.length; i++) {
            weather_con.append(WeatherElement('daily', data.daily[i], { hour: '2-digit', minute: '2-digit' }))
        }
        slickCarousel()
    }
}

const WeatherElement = (type, weatherData, dateFormat) => {
    const date = new Date(weatherData.dt * 1000)
    const dayOftheWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const ImgSrc = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
    const WeatherElem = document.createElement('div')
    WeatherElem.classList.add(type === 'current' ? 'current_weather' : 'hourly_weather')
    WeatherElem.innerHTML = `
    <div class="date">
    <h3 class="day">${dayOftheWeek}</h3>
    <p class="time">${type === 'daily' ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : time}</p>
    </div>
    <div class="info_forecast">
    <h3 class="temperature">${type === 'daily' ? Math.round(weatherData.temp.day) : Math.round(weatherData.temp)}°C</h3>
    <img src="${ImgSrc}" alt="?">
    <p class="feel">Real feel: <span>${type === 'daily' ? Math.round(weatherData.feels_like.day) : Math.round(weatherData.feels_like)}°C</span></p>
    ${type === 'current' ? `<p class="sunrise">Sunrise: <span>${new Date(weatherData.sunrise * 1000).toLocaleTimeString([], dateFormat)}</span></p>
                <p class="sunset">Sunset: <span>${new Date(weatherData.sunset * 1000).toLocaleTimeString([], dateFormat)}</span></p>` :
            `<p class="sunrise">Wind Speed: <span>${weatherData.wind_speed} m/s</span></p>
                <p class="sunset">Humidity: <span>${weatherData.humidity}%</span></p>`}
                </div>
                </div>`

    return WeatherElem
}

export const currentWeather = (data) => {
    if ($('.carousel').hasClass('slick-initialized')) {
        $('.carousel').slick('unslick')
    }
    $('.carousel').empty()
    weather_con.append(WeatherElement('current', data.current, { hour: '2-digit', minute: '2-digit' }))
    for (let i = 1; i < data.hourly.length / 2; i++) {
        weather_con.append(WeatherElement('hourly', data.hourly[i], { hour: '2-digit', minute: '2-digit' }))
    }
    slickCarousel()
}

export const displayCityWeather = async (data, countryData) => {
    const city_box = document.createElement('div')
    city_box.classList.add('city_box')
    const names = document.createElement('div')
    names.classList.add('names')
    const country = document.createElement('p')
    const cityName = document.createElement('h2')
    const weather = document.createElement('h3')
    const weather_cond = document.createElement('div')
    weather_cond.classList.add('weather_cond')
    const img = document.createElement('img')
    const temp = document.createElement('p')

    country.innerText = countryData[data.sys.country]
    cityName.innerText = data.name
    weather.innerText = data.weather[0].description
    img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    temp.innerText = Math.round(data.main.temp) + '°C'
    weather_cond.append(img, temp)
    names.append(country, cityName, weather)
    city_box.append(names, weather_cond)
    document.querySelector('.cities').append(city_box)
}
