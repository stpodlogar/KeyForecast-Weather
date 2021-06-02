'use strict'

const API_KEY = '8d806538f88014f91bc539358457b4a8';

async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${API_KEY}`)
    console.log(response);

    const data = await response.json();
    console.log(data);

    let location = data.name;
    let temp = Math.round(data.main.temp);
    let conditions = data.weather[0].main;

    console.log(location, temp, conditions);

    let info = 
    `
    <div class="location-title">
        <h3>${location}</h3>
        <p>Thursday, May 20th, 2021</p>
    </div>
    <div class="location-temp">
        <p>${temp}&#176;F</p>
    </div>
    <div class="location-conditions">
        <p>${conditions}</p>
    </div>
    `

    // reset results to empty
    document.querySelector('.weather-results').textContent = '';
    // insert html for desired location
    document.querySelector('.weather-results').insertAdjacentHTML('afterbegin', info);
}

document.querySelector('#location').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let userLocation =  document.querySelector('#location');
        getWeather(userLocation.value);
    }
})