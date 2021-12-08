'use strict'

const getUserGeo = () => {

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        reverseGeoCode([latitude, longitude]);
    }

    function error() {
        document.querySelector('.weather-container').textContent = 'Unable to retrieve weather';
    }

    if(!navigator.geolocation) {
        document.querySelector('.weather-container').textContent = 'Geolocation is not supported by your browser';
    } else {
        document.querySelector('.error').textContent = '';
        displayLoadingIcon();
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

const reverseGeoCode = async (coords) => {
    const urlDataObj = {
        latitude: coords[0],
        longitude: coords[1]
    };
    try {
        const response = await fetch("./.netlify/functions/reverse_geo", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const data = await response.json();
        const location = `${data[0].name}, ${data[0].country}`;
        getWeather(coords, location);
    } catch (err) {
        console.log(err)
        removeLoadingIcon();
        document.querySelector('.weather-container').textContent = 'Unable to retrieve weather';
    };
}

const getWeather = async (coords, location) => {
    const urlDataObj = {
        latitude: coords[0],
        longitude: coords[1]
    };
    try {
        const response = await fetch("./.netlify/functions/get_weather", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const data = await response.json();

        // API data
        const temp = Math.round(data.current.temp);
        const conditions = data.current.weather[0].description;
        const weatherIcon = `https://weather-icons-stpodlogar.s3.us-east-2.amazonaws.com/${data.current.weather[0].icon}.svg`;
        const humidity = data.current.humidity;
        const feelsLike = Math.round(data.current.feels_like);
        const pressure = data.current.pressure;
        const wind = Math.round(data.current.wind_speed);
        const currentHi = Math.round(data.daily[0].temp.max);
        const currentLo = Math.round(data.daily[0].temp.min);

        // Markup to be rendered on screen
        let markup = 
        `
        <article class="weather-results">
            <section style="padding: 0 1rem">
                <h2>Current Weather</h2>
                <article class="weather-data">
                    <section>
                        <div class="location-title">
                            <h3><span>${location}</span></h3>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center">
                            <div class="location-conditions" style="display: inline">
                                <img src=${weatherIcon}>
                            </div>
                            <div class="location-temp" style="display: inline">
                                ${temp}<sup>&#176;</sup>
                            </div>
                        </div>
                        <p>${conditions.toUpperCase()}</p>
                    </section>
                    <section class="feels-like">
                        <h3>Feels like ${feelsLike}<sup>&#176;</sup></h3>
                        <div class="hi-lo">
                            <div><i class="fas fa-arrow-up"></i>${currentHi}<sup>&#176;</sup></div>
                            <div><i class="fas fa-arrow-down"></i>${currentLo}<sup>&#176;</sup></div>
                        </div>
                        <div class="feels-like-attribute">
                            <div>
                                <i class="fas fa-thermometer-half"></i>Humidity
                            </div>
                            <span class="data-value">${humidity}%</span>
                        </div>
                        <div class="feels-like-attribute">
                            <div>
                                <i class="fas fa-wind"></i>Wind
                            </div>
                            <span class="data-value">${wind}mph</span>
                        </div>
                        <div class="feels-like-attribute">
                            <div>
                                <i class="fas fa-compress-alt"></i>Pressure
                            </div>
                            <span class="data-value">${pressure}hPa</span>
                        </div>
                    </section>
                </article>
            </section>
        </article>
        <article class="weather-results hourly-forecast" style="margin-top: 30px; padding-bottom: 10px">
            <h2 style="padding-left: 1rem">Hourly Forecast</h2>
            <div class="collapse">
                ${generateHourly(data)}
            </div>
            <div class="collapse-button">
                <button data-toggle="collapse" data-target=".collapse" data-text="Collapse">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        </article>
        <article class="weather-results" style="margin-top: 30px; padding: 1.5rem 2rem">
            <h2>7-Day Forecast</h2>
            <section class="week-forecast">
                ${generateDaily(data)}
            </section>
        </article>
        `

        removeLoadingIcon();
        // insert html for desired location
        document.querySelector('.weather-container').insertAdjacentHTML('afterbegin', markup);

        // Rotate chevron icon on click
        let open = false;
        const collapseButton = document.querySelector('button[data-toggle="collapse"]');
        const arrow = document.querySelector('button[data-toggle="collapse"] > i');

        collapseButton.addEventListener('click', function() {
            if (open) {
                arrow.className = 'fas fa-chevron-down'
            } else {
                arrow.className = 'fas fa-chevron-down open'
            }
            open = !open;
        })

        // Setup event listener to expand or collapse hourly weather
        // Grab all the trigger elements on the page
        const triggers = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));

        // Listen for click events, but only on our triggers
        window.addEventListener('click', (event) => {
            const elm = event.target;
            if (triggers.includes(elm)) {
                const selector = elm.getAttribute('data-target');
                collapse(selector, 'toggle');
            }
        });

        const fnmap = {
            'toggle': 'toggle',
            'show': 'add',
            'hide': 'remove'
        }

        const collapse = (selector, cmd) => {
            const targets = Array.from(document.querySelectorAll(selector));
            targets.forEach(target => {
                target.classList[fnmap[cmd]]('show');
            })
        }
    } catch (err) {
        console.log(err)
        removeLoadingIcon();
        document.querySelector('.weather-container').textContent = 'Unable to retrieve weather';
    };

}

// Generate markup for daily weather data
const generateDaily = (data) => {
    let dailyWeather = '';

    // loop through each element and append HTML to dailyWeather
    data.daily.forEach((element, index) => {
        if (index === 0) return;
        const dailyWeatherIcon = `https://weather-icons-stpodlogar.s3.us-east-2.amazonaws.com/${element.weather[0].icon}.svg`;
        dailyWeather += 
        `<div class="forecast-day">
            <h3>${getDayOfWeek(element.dt)}</h3>
            <img src="${dailyWeatherIcon}">
            <p>${element.weather[0].main}</p>
            <p class="min-max-temp">${Math.round(element.temp.max)}<sup>&#176;</sup> | ${Math.round(element.temp.min)}<sup>&#176;</sup><p>
        </div>`
    });

    return dailyWeather;
}

// Generate markup for hourly weather data
const generateHourly = (data) => {
    let hourlyWeather = '';
    // only grab first 24 hours of weather data
    const hourlyWeatherData = data.hourly.slice(1, 23);

    // loop through each element and append HTML to hourlyWeather
    for (const element of hourlyWeatherData) {
        const hourlyWeatherIcon = `https://weather-icons-stpodlogar.s3.us-east-2.amazonaws.com/${element.weather[0].icon}.svg`;
        
        hourlyWeather +=
        `<div class="hourly-weather-row">
            <div class="hourly-temp">
                <div>${getHour(element.dt)}</div>
                <div>${Math.round(element.temp)}<sup>&#176;</sup></div>
                <div class="hourly-description">
                    <img src="${hourlyWeatherIcon}">
                    <p>${capitalizeFirst(element.weather[0].description)}</p>
                </div>
            </div>
            <div class="hourly-pop">
                <i class="fas fa-tint"></i>${Math.round(element.pop * 100)}%
            </div>
        </div>
        <hr>`
    }

    return hourlyWeather;
}

const getDayOfWeek = (dt) => {
    const d = new Date(dt * 1000);
    let n = d.getDay();

    const daysAbbrev = ["Sun", "Mon", "Tue" ,"Wed", "Thu", "Fri", "Sat"];
    return `${daysAbbrev[n]}`;
}

const getHour = (dt) => {
    const d = new Date(dt * 1000);
    let hours = d.getHours();
    let timeValue;

    if (hours > 0 && hours <= 12) {
        timeValue = hours;
    }
    else if (hours > 12) {
        timeValue = hours - 12;
    }
    else if (hours === 0) {
        timeValue = 12;
    }

    timeValue += ":00";
    timeValue += (hours >= 12) ? " pm" : " am";
    return timeValue;
}

const capitalizeFirst = (string) => {
    const words = string.split(" ");

     return words.map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
}

// function getDate() {
//     // Date data
//     const d = new Date();
//     let day = d.getDay();
//     let date = d.getDate();
//     let month = d.getMonth();

//     // Arrays for days and months
//     const days = ["Monday", "Tuesday" ,"Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//     const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

//     return `${days[day - 1]}, ${months[month]} ${date}`
// }

let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'), 
        {
            types: ['(cities)'],
            fields: ['geometry', 'formatted_address']
        });
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
        document.getElementById('autocomplete').placeholder = 'Enter a place...';
    } else {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        // remove keyboard on submit on mobile
        document.activeElement.blur();
        displayLoadingIcon();
        getWeather([latitude, longitude], place.formatted_address);
    }
}

const displayLoadingIcon = () => {
    document.querySelector('.weather-container').textContent = '';
    document.querySelector('.loading-icon').style.display = 'flex';
}

const removeLoadingIcon = () => {
    document.querySelector('.weather-container').textContent = '';
    document.querySelector('.loading-icon').style.display = 'none';
}

// event listener on enter to run functions
// document.querySelector('.weather-input form').addEventListener('submit', (e) => {
//     // remove keyboard on submit on mobile
//     document.activeElement.blur();
//     e.preventDefault();
// })

// on page load request for user location
// document.addEventListener('DOMContentLoaded', getUserGeo);

document.querySelector('#geo').addEventListener('click', () => {
    document.querySelector('#autocomplete').value = '';
    getUserGeo();
});