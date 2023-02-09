<template>
    <div class="weather-settings">
        <div class="weather-settings__header">
            <h1>Settings</h1>
            <img
                @click="clickToCloseSettings"
                src="@/assets/images/weather-settings/close-icon.svg"
                alt="close"
            >
        </div>
        <!--    <div class="weather-settings__cities">-->
        <!--      <div-->
        <!--          v-for="city in cities"-->
        <!--          :key="city.id"-->
        <!--          class="weather-settings__city"-->
        <!--      >-->
        <!--        <span>-->
        <!--          <img-->
        <!--              draggable="false"-->
        <!--              src="@/assets/images/weather-settings/burger-menu.svg"-->
        <!--              alt="pull"-->
        <!--          >-->
        <!--          {{ city.name }}, {{ city.sys?.country }}-->
        <!--        </span>-->
        <!--        <img-->
        <!--            draggable="false"-->
        <!--            @click="deleteCity(city)"-->
        <!--            src="@/assets/images/weather-settings/delete-icon.svg"-->
        <!--            alt="delete"-->
        <!--        >-->
        <!--      </div>-->
        <!--    </div>-->

        <Draggable
            :list="cities"
            item-key="name"
            class="list-group"
            ghost-class="ghost"
            @end="checkMove"
        >
            <template #item="{ element }">
                <div class="weather-settings__city">
                    <span>
                        <img
                            draggable="false"
                            src="@/assets/images/weather-settings/burger-menu.svg"
                            alt="pull"
                        >
                        {{ element.name }}, {{ element.sys?.country }}
                    </span>
                    <img
                        draggable="false"
                        @click="deleteCity(element)"
                        src="@/assets/images/weather-settings/delete-icon.svg"
                        alt="delete"
                    >
                </div>
            </template>
        </Draggable>


        <div class="weather-settings__add-block">
            <div class="weather-settings__header">
                <h1>Add location:</h1>
            </div>
            <div class="weather-settings__input">
                <input
                    @keyup.enter="searchCity"
                    type="text"
                    v-model="cityInput"
                    :class="{'weather-settings__error-border': !!errorMessage}"
                >
                <img
                    @click="searchCity"
                    src="@/assets/images/weather-settings/add-city.svg"
                    alt="add"
                >
            </div>
            <span
                v-if="errorMessage"
                class="weather-settings__error-message"
            >
        {{ errorMessage }}
      </span>
        </div>


    </div>
</template>

<script setup>
import {ref, defineEmits} from "vue";
import {storeToRefs} from 'pinia'
import {useCity} from '@/stores/City'
import Draggable from 'vuedraggable'


const emit = defineEmits(['close'])
const cityInput = ref('')
const store = useCity()
const {city, cities, errorMessage} = storeToRefs(store)
const {getCity} = store

async function searchCity() {
    if (cityInput.value) {
        try {
            await getCity(cityInput.value)
            if (!errorMessage.value) {
                if (!cities.value.find(item => item.id === city.value.id)) {
                    cities.value.push(city.value)
                    localStorage.removeItem('cities')
                    localStorage.setItem('cities', JSON.stringify(cities.value))
                    cityInput.value = ''
                    city.value = ''
                } else {
                    cityInput.value = ''
                    errorMessage.value = 'enter another city'
                    setTimeout(() => {
                        errorMessage.value = ''
                    }, 3000)
                }
            } else {
                cityInput.value = ''
                setTimeout(() => {
                    errorMessage.value = ''
                }, 3000)
            }
        } catch (e) {
            console.log(e)
        }
    }
}

const checkMove = function () {
    localStorage.removeItem('cities')
    localStorage.setItem('cities', JSON.stringify(cities.value))
}

function deleteCity(city) {
    cities.value.splice(cities.value.indexOf(city), 1)
    localStorage.setItem('cities', JSON.stringify(cities.value))
}

function clickToCloseSettings() {
    emit('close')
}
</script>


<style lang="scss" scoped>
.weather-settings {
    width: 500px;
    margin: 40px auto;
    background: #FFFFFF;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 40px;

    &__header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 30px;

        img {
            position: relative;
            width: 40px;
            height: auto;
            right: -83px;
            top: -49px;
            cursor: pointer;
        }
    }

    &__cities {
        display: flex;
        flex-direction: column;
        margin-bottom: 40px;
    }

    &__city {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #000000;
        border-radius: 10px;
        padding: 10px;
        color: #000000;
        margin-bottom: 20px;
        cursor: pointer;


        img {
            width: 40px;
            height: auto;
        }

        span {
            display: flex;
            align-items: center;

            img {
                margin-right: 15px;
            }
        }
    }

    &__add-block {
        display: flex;
        flex-direction: column;

        input {
            border: 1px solid #000000;
        }
    }

    &__input {
        display: flex;
        flex-direction: row;

        input {
            width: 100%;
            border-radius: 10px;
            padding: 5px;
        }

        img {
            width: 40px;
            height: auto;
            margin-left: 10px;
            cursor: pointer;
        }
    }

    &__error-border {
        border: 1px solid red !important;
    }

    &__error-message {
        color: red;
    }
}

.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.not-draggable {
    cursor: no-drop;
}
</style>