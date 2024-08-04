const apiKey = '1ddb98e0b8cb1647ea1bdde765718ab9';
const searchBox = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');
const locationName = document.querySelector('.location-name');
const dateTime = document.querySelector('.date-time');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const forecastContainer = document.querySelector('.forecast');

const iconMapping = {
    '01d': 'clear.png', // Clear sky, daytime
    '01n': 'clear.png', // Clear sky, nighttime
    '02d': 'cloud.png', // Few clouds, daytime
    '02n': 'cloud.png', // Few clouds, nighttime
    '03d': 'cloud.png', // Scattered clouds
    '03n': 'cloud.png', // Scattered clouds
    '04d': 'cloud.png', // Broken clouds
    '04n': 'cloud.png', // Broken clouds
    '09d': 'rain.png',  // Shower rain
    '09n': 'rain.png',  // Shower rain
    '10d': 'rain.png',  // Rain, daytime
    '10n': 'rain.png',  // Rain, nighttime
    '11d': 'mist.png',  // Thunderstorm
    '11n': 'mist.png',  // Thunderstorm
    '13d': 'snow.png',  // Snow
    '13n': 'snow.png',  // Snow
    '50d': 'mist.png',  // Mist
    '50n': 'mist.png'   // Mist
};

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'London';
    fetchWeatherData(defaultLocation);
    fetchForecastData(defaultLocation);
});

function fetchWeatherData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            locationName.textContent = data.name;
            dateTime.textContent = formatDateTime(new Date());
            temperature.textContent = `${Math.round(data.main.temp)}°C`;
            description.textContent = data.weather[0].description;
            humidity.textContent = `Humidity ${data.main.humidity}%`;
            wind.textContent = `Wind ${data.wind.speed} km/h`;

            const iconCode = data.weather[0].icon;
            document.querySelector('.weather-icon').src = `images/${iconMapping[iconCode]}`;
            document.querySelector('.weather-icon').alt = data.weather[0].description;
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchForecastData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecastDays = {};
            
            data.list.forEach(forecast => {
                const date = new Date(forecast.dt_txt).toLocaleDateString("en-GB", {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                });
                if (!forecastDays[date]) {
                    forecastDays[date] = {
                        temp: Math.round(forecast.main.temp),
                        desc: forecast.weather[0].description,
                        icon: iconMapping[forecast.weather[0].icon]
                    };
                }
            });

            let dayIndex = 1;
            for (let day in forecastDays) {
                const forecastElement = document.getElementById(`day${dayIndex}`);
                forecastElement.querySelector('.date').textContent = day;
                forecastElement.querySelector('.temp').textContent = `${forecastDays[day].temp}°C`;
                forecastElement.querySelector('.desc').textContent = forecastDays[day].desc;
                
                const iconFile = forecastDays[day].icon;
                forecastElement.querySelector('.weather-forecast-icon').src = `images/${iconFile}`;
                forecastElement.querySelector('.weather-forecast-icon').alt = forecastDays[day].desc;

                dayIndex++;
                if (dayIndex > 5) break;
            }
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

searchButton.addEventListener('click', () => {
    const location = searchBox.value;
    if (location) {
        fetchWeatherData(location);
        fetchForecastData(location);
    }
});

function formatDateTime(date) {
    const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${dayName}, ${day} ${month} ${year} | ${time}`;
}
