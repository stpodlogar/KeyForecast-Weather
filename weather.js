'use strict'

const API_KEY = '8d806538f88014f91bc539358457b4a8';
// const API_KEY = 'bbaf86cac3c0e62ef035b4a051fdf664'

async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${API_KEY}`)
    console.log(response);

    const data = await response.json();
    console.log(data);

    let location = data.name;
    let temp = data.main.temp;
    let conditions = data.weather[0].main;

    console.log(location, temp, conditions);
}

document.querySelector('button').addEventListener('click', () => {
    let userLocation =  document.querySelector('#location');
    getWeather(userLocation.value);
})