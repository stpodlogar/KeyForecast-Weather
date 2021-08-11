'use strict'

const API_KEY = '8d806538f88014f91bc539358457b4a8';

async function getCoordinates(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    console.log(response.status);
    
    if (response.status === 404) {
        document.querySelector('.error').textContent = "Please enter a valid city";
    }
    else {
        document.querySelector('.error').textContent = "";
    }
    const data = await response.json();
    console.log(data);

    // API data
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    const location = data.name;
    const countryCode = data.sys.country; 

    getWeather(lat, lon, location);
}

async function getWeather(lat, lon, location) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=imperial&appid=${API_KEY}`)
    console.log(response.status);

    const data = await response.json();
    console.log(data);

    console.log(location);

    // API data
    const temp = Math.round(data.current.temp);
    const conditions = data.current.weather[0].description;
    const weatherIcon = `https://weather-icons-stpodlogar.s3.us-east-2.amazonaws.com/${data.current.weather[0].icon}.svg`;
    const humidity = data.current.humidity;
    const feelsLike = Math.round(data.current.feels_like);
    const pressure = data.current.pressure;
    const wind = Math.round(data.current.wind_speed);

    let dailyWeather = '';

    data.daily.forEach((element, index) => {
        if (index === 0) return;
        const dailyWeatherIcon = `https://weather-icons-stpodlogar.s3.us-east-2.amazonaws.com/${element.weather[0].icon}.svg`;
        dailyWeather += 
        `<div class="forecast-day">
            <h3>${getDayOfWeek(element.dt)}</h3>
            <img src="${dailyWeatherIcon}">
            <p>${element.weather[0].main}</p>
            <p>${Math.round(element.temp.max)}<sup>&#176;</sup> / ${Math.round(element.temp.min)}<sup>&#176;</sup><p>
        </div>`
        console.log(element.temp.max, element.temp.min);
        console.log(element.weather[0].main, element.weather[0].icon);
    });

    let markup = 
    `
    <article class="weather-results">
        <div style="display: flex; justify-content: space-between">
            <h2>Current Weather</h2>
            <p>F or C</p>
        </div>
        <article class="weather-data">
            <section>
                <div class="location-title">
                    <h3><span>${location}</span></h3>
                    <!-- <p><em>${getDate()}</em></p> -->
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
            <section>
                <h3>Feels like ${feelsLike}<sup>&#176;</sup></h3>
                <p>Humidity ${humidity}%</p>
                <p>Wind ${wind}mph</p>
                <p>Pressure ${pressure}hPa</p>
            </section>
        </article>
    </article>
    <article class="weather-results" style="margin-top: 20px">
        <h2>Extended Forecast</h2>
        <section class="week-forecast">
            ${dailyWeather}
        </section>
    </article>
    `

    // reset results to empty
    document.querySelector('.weather-container').textContent = '';
    // insert html for desired location
    document.querySelector('.weather-container').insertAdjacentHTML('afterbegin', markup);
}

function getDayOfWeek(dt) {
    const d = new Date(dt * 1000);
    console.log(d);
    let n = d.getDay();

    const daysAbbrev = ["Sun", "Mon", "Tue" ,"Wed", "Thu", "Fri", "Sat"];
    return `${daysAbbrev[n]}`;
}

function getDate() {
    // Date data
    const d = new Date();
    let day = d.getDay();
    let date = d.getDate();
    let month = d.getMonth();

    // Arrays for days and months
    const days = ["Monday", "Tuesday" ,"Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    return `${days[day - 1]}, ${months[month]} ${date}`
}

// event lsitener on enter to run functions
document.querySelector('.weather-input form').addEventListener('submit', (e) => {
    // if (e.key === 'Enter') {
    //     let userLocation =  document.querySelector('#location');
    //     getWeather(userLocation.value);
    // }
    e.preventDefault();
    let userLocation =  document.querySelector('#location');
    getCoordinates(userLocation.value);
})