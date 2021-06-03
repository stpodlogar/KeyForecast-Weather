'use strict'

const API_KEY = '8d806538f88014f91bc539358457b4a8';

async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${API_KEY}`)
    console.log(response);

    const data = await response.json();
    console.log(data);

    // API data
    const location = data.name;
    const temp = Math.round(data.main.temp);
    const conditions = data.weather[0].description;
    const countryCode = data.sys.country; 
    const weatherIcon = await `https://weather-icons-stpodlogar.s3.us-east-2.amazonaws.com/${data.weather[0].icon}.svg`;

    console.log(location, temp, conditions);

    let info = 
    `
    <article class="weather-results">
        <div class="location-title">
            <h3><span>${location}</span><sup>${countryCode}</sup></h3>
            <p><em>${getDate()}</em></p>
        </div>
        <div class="location-temp">
            ${temp}<sup>&#176;F</sup>
        </div>
        <div class="location-conditions">
            <img src=${weatherIcon}>
            <p>${conditions.toUpperCase()}</p>
        </div>
    </article>
    `

    // reset results to empty
    document.querySelector('.weather-container').textContent = '';
    // insert html for desired location
    document.querySelector('.weather-container').insertAdjacentHTML('afterbegin', info);
}

function getDate() {
    // Date data
    const d = new Date();
    let day = d.getDay();
    let date = d.getDate();
    let month = d.getMonth();
    console.log(day, date, month);

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
    getWeather(userLocation.value);
})