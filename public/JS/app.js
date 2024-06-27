import { mapbox } from "./map.js"
import { fetchApi, cityList } from "./api.js"

let countryData = {}
let Api_key

const parseCountries = async () => {
    try {
        const response = await fetch('countries.json')
        const data = await response.json()
        countryData = data
    } catch (error) {
        console.error('Oops a problem: ', error)
    }
}


window.onload = async () => {
    const response = await fetch('/api/server')
    const getKey = await response.json()
    Api_key = getKey.key
    await parseCountries()
    const { reload, onsearch } = await fetchApi(Api_key, countryData)
    await reload()
    await cityList(Api_key, countryData)
    mapbox(Api_key)

    document.querySelector('form').onsubmit = async (event) => {
        event.preventDefault()
        event.target.classList.toggle('fm_active')
        if(document.querySelector('form input').value){
            document.querySelector('.carousel').innerHTML = ''
            if ($('.carousel').hasClass('slick-initialized')) {
                $('.carousel').slick('unslick')
            }
            $('.carousel').empty()
            
            await onsearch()
            document.querySelector('form input').value = ''
        }
    }
    document.querySelector('.ic-menu').onclick = () =>{
        document.querySelector('.menu_box').classList.add('menu_active')
    }
    document.querySelector('.close_box').onclick = () => document.querySelector('.menu_box').classList.remove('menu_active')

}


