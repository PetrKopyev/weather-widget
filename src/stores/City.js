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
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=14600bd2f6d700f1f5b00ff08d7775b5`)
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
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${item}&appid=14600bd2f6d700f1f5b00ff08d7775b5`)
            if (response.status === 200) {
                city.value = response.data
            }

        } catch (e) {
            errorMessage.value = e.response.data.message
        }
    }

    return {city, cities, errorMessage, getCity, getCityByGeo}
})