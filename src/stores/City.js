import {defineStore} from 'pinia';
import axios from "axios";
import {reactive, ref} from "vue";

export const useCity = defineStore('City', () => {
    const city = ref('')
    const cities = reactive(JSON?.parse(localStorage.getItem("cities")) || [])
    const errorMessage = ref('')

    async function getCityByGeo(lat, lon) {
        try {
            if (!cities.length) {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.VUE_APP_KEY}`)
                if (response.status === 200) {
                    cities.push(response.data)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function getCity(item) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${item}&appid=${process.env.VUE_APP_KEY}`)
            if (response.status === 200) {
                city.value = response.data
            }

        } catch (e) {
            errorMessage.value = e.response.data.message
        }
    }

    return {city, cities, errorMessage, getCity, getCityByGeo}
})