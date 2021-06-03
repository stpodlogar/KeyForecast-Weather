'use strict'

const API_KEY = '8d806538f88014f91bc539358457b4a8';

async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${API_KEY}`)
    console.log(response);

    const data = await response.json();
    console.log(data);

    // API data
    let location = data.name;
    let temp = Math.round(data.main.temp);
    let conditions = data.weather[0].description;
    let weatherIcon = await `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    console.log(location, temp, conditions);

    let info = 
    `
    <div class="location-title">
        <h3>${location}</h3>
        <p>${getDate()}</p>
    </div>
    <div class="location-temp">
        <p>${temp}&#176;F</p>
    </div>
    <div class="location-conditions">
        <img src=${weatherIcon}>
        <p>${conditions.toUpperCase()}</p>
    </div>
    `

    // reset results to empty
    document.querySelector('.weather-results').textContent = '';
    // insert html for desired location
    document.querySelector('.weather-results').insertAdjacentHTML('afterbegin', info);
}

function getDate() {
    // Date data
    const d = new Date();
    let day = d.getDay();
    let date = d.getDate();
    let month = d.getMonth();
    console.log(day, date, month);

    const days = ["Monday", "Tuesday" ,"Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    console.log(days[day - 1]);
    console.log(months[month]);

    return `${days[day - 1]}, ${months[month]} ${date}`
}

document.querySelector('#location').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let userLocation =  document.querySelector('#location');
        getWeather(userLocation.value);
    }
})