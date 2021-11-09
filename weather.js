'use strict'

const API_KEY = '8d806538f88014f91bc539358457b4a8';

function getUserGeo() {

    function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log(lat, lon);
        reverseGeoCode([lat, lon]);
    }

    function error() {
        document.querySelector('.weather-container').textContent = 'Unable to retrieve data';
    }

    if(!navigator.geolocation) {
        document.querySelector('.weather-container').textContent = 'Geolocation is not supported by your browser';
    } else {
        document.querySelector('.weather-container').textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

async function reverseGeoCode(coords) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${coords[0]}&lon=${coords[1]}&limit=5&appid=${API_KEY}`);

    const data = await response.json();
    const location = data[0].name;
    const countryCode = data[0].country;

    getWeather(coords[0], coords[1], location, countryCode);
}

document.querySelector('#geo').addEventListener('click', getUserGeo);

async function getCoordinates(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    
    if (response.status === 404) {
        document.querySelector('.error').textContent = "Please enter a valid city";
    }
    else {
        document.querySelector('.error').textContent = "";
    }
    const data = await response.json();

    // API data
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const location = data.name;
    const countryCode = data.sys.country; 

    getWeather(lat, lon, location, countryCode);
}

async function getWeather(lat, lon, location, countryCode) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${API_KEY}`);

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
                        <h3><span>${location}</span><sup>${countryCode}</sup></h3>
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

    // reset results to empty
    document.querySelector('.weather-container').textContent = 'Loading...';
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
}

// Generate markup for daily weather data
function generateDaily(data) {
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
            <p class="min-max-temp">${Math.round(element.temp.max)}<sup>&#176;</sup> / ${Math.round(element.temp.min)}<sup>&#176;</sup><p>
        </div>`
    });

    return dailyWeather;
}

// Generate markup for hourly weather data
function generateHourly(data) {
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

function getDayOfWeek(dt) {
    const d = new Date(dt * 1000);
    let n = d.getDay();

    const daysAbbrev = ["Sun", "Mon", "Tue" ,"Wed", "Thu", "Fri", "Sat"];
    return `${daysAbbrev[n]}`;
}

function getHour(dt) {
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

function capitalizeFirst(string) {
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

// event listener on enter to run functions
document.querySelector('.weather-input form').addEventListener('submit', (e) => {
    // remove keyboard on submit on mobile
    document.activeElement.blur();
    e.preventDefault();
    let userLocation =  document.querySelector('#location');
    getCoordinates(userLocation.value);
})