<template>
  <div class="weather-card">
    <div class="weather-card__header">
      <h1>{{ city.name }}, {{ city.sys?.country }}</h1>
    </div>
    <div class="weather-card__temperature">
      <img :src="weatherImage" alt="weather">
      <span>{{ tempCel }} ℃</span>
    </div>
    <span class="weather-card__description">Feels like {{ feelsLike }}'C. {{ weatherMain }}. {{
        weatherDescription
      }}</span>
    <div class="weather-card__info">
      <span>
        <img src="@/assets/images/weather-card/wind-weather.svg" alt="wind">
        {{ windSpeed }} m/s
      </span>
      <span>
        <img src="@/assets/images/weather-card/hpa.png" alt="hpa">
        {{ pressure }} hPa
      </span>
      <span>Humidity: {{ humidity }}%</span>
      <span>Visibility: {{ visibility }}km</span>
      <span v-if="rain">Rain volume for the last 1 hour: {{ rain }} mm</span>
      <span v-if="snow">Snow volume for the last 1 hour: {{ snow }} mm</span>
    </div>

  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";

export default defineComponent({
  name: "WeatherCard",
  props: ['city'],
  setup(props) {
    const tempCel = computed(() => Math.round(props.city?.main?.temp - 273.15))
    const feelsLike = computed(() => Math.round(props.city?.main?.feels_like - 273.15))
    const weatherMain = computed(() => props.city?.weather?.[0].main)
    const weatherDescription = computed(() => props.city?.weather?.[0].description?.[0].toUpperCase() + props.city?.weather?.[0].description.slice(1))
    const windSpeed = computed(() => props.city?.wind.speed.toFixed(1))
    const pressure = computed(() => props.city?.main.pressure)
    const humidity = computed(() => props.city?.main.humidity)
    const visibility = computed(() => {
      if (props.city?.visibility > 9999) {
        return props.city?.visibility / 1000 + '.' + props.city?.visibility % 1000
      } else {
        return props.city?.visibility
      }
    })
    const weatherImage = computed(() => 'http://openweathermap.org/img/w/' + props.city?.weather?.[0].icon + '.png')
    const snow = computed(() => props.city?.snow?.['1h'])
    const rain = computed(() => props.city?.rain?.['1h'])

    return {
      tempCel,
      feelsLike,
      weatherMain,
      weatherDescription,
      windSpeed,
      pressure,
      humidity,
      visibility,
      weatherImage,
      snow,
      rain
    }
  }
})
</script>

<style lang="scss" scoped>
.weather-card {
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 40px;

  &:not(:last-child){
    margin-bottom: 30px;
  }

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  &__temperature {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;

    img {
      width: 100px;
      height: auto;
      margin-right: 40px;
    }

    span {
      font-weight: 700;
      font-size: 74px;
      line-height: 28px;
      color: #000000;
    }
  }

  &__description {
    margin-bottom: 20px;
    display: flex;
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: self-start;
    row-gap: 20px;
    column-gap: 20px;
    margin-bottom: 20px;

    img {
      width: 30px;
      height: auto;
      margin-right: 10px;
    }

    span {
      display: flex;
      align-items: center;
      text-align: start;
      line-height: 30px;
    }
  }

}
</style>