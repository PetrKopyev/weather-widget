<template>
  <div
      v-if="!showSettings"
      class="weather-widget"
  >
    <div class="weather-widget__container">
      <img
          @click="toUp"
          class="weather-widget__button-up"
          src="@/assets/images/up-arrow.svg"
          alt="up"
          :class="{visible : !isArrowUp}"
      >
      <img
          @click="showSettings = true"
          class="weather-widget__button--open"
          src="@/assets/images/weather-card/settings.svg"
          alt="settings"
      >
      <div class="weather-widget__cards">
        <weather-card
            v-for="city in cities"
            :key="city"
            :city="city"
        />
      </div>
    </div>
  </div>
  <weather-settings
      v-else
      @close="showSettings = false"
  />
</template>

<script setup>
import WeatherSettings from "@/components/WeatherSettings.vue";
import {computed, onBeforeUnmount, onMounted, ref, watchEffect} from "vue";
import WeatherCard from "@/components/WeatherCard.vue";
import {useCity} from '@/stores/City'
import {storeToRefs} from "pinia";


const showSettings = ref(false)
const store = useCity()
const {cities} = storeToRefs(store)
const {getCityByGeo} = store

function locatorButtonPressed() {
  navigator.geolocation.getCurrentPosition(
      position => {
        getCityByGeo(position.coords.latitude, position.coords.longitude)
      },
      error => {
        console.log(error.message);
      },
  )
}

function toUp() {
  window.scrollTo(0, 0)
}

const isArrowUp = computed(() => windowTop.value > 200)

const windowTop = ref(window.top.scrollY)

onMounted(() => {
  window.addEventListener("scroll", onScroll, true)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll, true)
})

function onScroll(e) {
  windowTop.value = e.target.documentElement.scrollTop
}



onMounted(() => {
  locatorButtonPressed()
})

</script>

<style lang="scss" scoped>
.weather-widget {
  height: 100%;
  margin: 40px 0;

  &__container {
    width: 610px;
    margin: 0 auto;
    display: flex;
    flex-direction: row-reverse;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    margin: 0 auto;
  }

  &__button--open {
    position: sticky;
    width: 40px;
    height: 40px;
    top: 20px;
    cursor: pointer;
  }

  &__button-up {
    position: sticky;
    width: 40px;
    height: 40px;
    top: 90%;
    cursor: pointer;

  }
}
.visible {
  opacity: 0;
}
</style>