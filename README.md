<h1 align="center">
  <br>
  KeyForecast Weather
  <br>
</h1>

<h4 align="center">A clean and intuitive weather application using the <a href="https://openweathermap.org/" target="_blank">OpenWeather API</a>.</h4>
<br>

![Screenshot](https://d1mleo7jrx2xoj.cloudfront.net/KeyForecast-README.png)

## Key Features

- Allows users to view the weather for a chosen city or their current location
  - Current Weather
  - 24 Hour Forecast
  - 7 Day Forecast
- Autocomplete provides suggestions as a user types a location
- Precise weather details such as humidity, wind speed, and pressure are provided at the time of searching

## How to Use

```zsh
# Clone this repository
git clone https://github.com/stpodlogar/KeyForecast-Weather.git

# Install Dependencies
npm install

# Run the app
npm start
```

## Built With

- [OpenWeather API](https://openweathermap.org/) - weather data and information
- [Netlify Serverless Functions](https://www.netlify.com/products/functions/) - allows secure use of API endpoints without the need for a separate server
- [AWS CloudFront](https://aws.amazon.com/) - CDN to serve weather icons quickly and securely
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) - provides places autocomplete and geolocation services
- [Icons8](https://icons8.com/) - weather icons
