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

    getWeather(lat, lon, location, countryCode);
}

async function getWeather(lat, lon, location, countryCode) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=imperial&appid=${API_KEY}`);

    const data = await response.json();

    console.log(location);
    console.log(countryCode);

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

    console.log(currentHi, currentLo);

    let dailyWeather = '';

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

    let markup = 
    `
    <article class="weather-results">
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
                        <i class="fas fa-tint"></i>Humidity
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
    </article>
    <article class="weather-results" style="margin-top: 40px">
        <h2>7-Day Forecast</h2>
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
    let n = d.getDay();

    const daysAbbrev = ["Sun", "Mon", "Tue" ,"Wed", "Thu", "Fri", "Sat"];
    return `${daysAbbrev[n]}`;
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

// event lsitener on enter to run functions
document.querySelector('.weather-input form').addEventListener('submit', (e) => {
    // if (e.key === 'Enter') {
    //     let userLocation =  document.querySelector('#location');
    //     getWeather(userLocation.value);
    // }
    document.activeElement.blur();
    e.preventDefault();
    let userLocation =  document.querySelector('#location');
    getCoordinates(userLocation.value);
})