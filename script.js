const container = document.querySelector('.app-container');
const search = document.querySelector('#searchButton');
const locationButton = document.querySelector('#locationButton');
const cityInput = document.querySelector('#cityInput');
const currentWeather = document.querySelector('#currentWeather');
const forecastContainer = document.querySelector('#forecastContainer');
const cityName = document.querySelector('#cityName');

const APIkey = 'YOUR_OPENWEATHER_API_KEY';

search.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeatherByCity(city);
    }
});


cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        search.click(); 
    }
});

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            error => {
                handleGeolocationError(error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        default:
            alert('An unknown error occurred.');
            break;
    }
}

function getWeatherByCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                currentWeather.classList.remove('active');
                currentWeather.classList.add('hidden');
                return;
            }

            cityName.textContent = json.name;
            showCurrentWeather(json);
            fetchForecast(city);
        });
}

function getWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                currentWeather.classList.remove('active');
                currentWeather.classList.add('hidden');
                return;
            }

            cityName.textContent = json.name;
            showCurrentWeather(json);
            fetchForecastByCoords(lat, lon);
        });
}

function showCurrentWeather(json) {
    container.style.height = 'auto';
    currentWeather.classList.remove('hidden');
    currentWeather.classList.add('active');

    const image = document.querySelector('#weatherIcon');
    const temperature = document.querySelector('#temperature');
    const description = document.querySelector('#weatherDescription');
    const humidity = document.querySelector('#humidity');
    const windSpeed = document.querySelector('#windSpeed');

    image.src = `http://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png`;

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `Humidity: ${json.main.humidity}%`;
    windSpeed.innerHTML = `Wind Speed: ${parseInt(json.wind.speed)} Km/h`;

    setWeatherBackground(json.weather[0].main);
}

function fetchForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIkey}`)
        .then(response => response.json())
        .then(forecastJson => {
            displayForecast(forecastJson);
        });
}

function fetchForecastByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`)
        .then(response => response.json())
        .then(forecastJson => {
            displayForecast(forecastJson);
        });
}

function displayForecast(forecastJson) {
    forecastContainer.innerHTML = '';
    const forecastList = forecastJson.list.filter((_, index) => index % 8 === 0);
    forecastList.forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
            <p>${new Date(day.dt_txt).toDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
            <p>Temp: ${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastDay);
    });
}

function setWeatherBackground(weatherDescription) {
    switch (weatherDescription) {
                case 'Clear':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    break;
                case 'Clouds':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    break;
                case 'Rain':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1511634829096-045a111727eb?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    createRainAnimation();
                    break;
                case 'Drizzle':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1541919329513-35f7af297129?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    createRainAnimation();
                    break;
                case 'Mist':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1580193483760-d0ef2abaa348?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    break;
                case 'Thunderstorm':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    createRainAnimation();
                    break;
                case 'Snow':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1511131341194-24e2eeeebb09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    createSnowAnimation();
                    break;
                case 'Fog':
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
                    break;
                default:
                    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1682685797828-d3b2561deef4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
            }
}

function createRainAnimation() {
    const rainContainer = document.createElement('div');
    rainContainer.classList.add('animation-container');
    document.body.appendChild(rainContainer);

    for (let i = 0; i < 100; i++) {
        const rainDrop = document.createElement('div');
        rainDrop.classList.add('rain');
        rainDrop.style.left = `${Math.random() * 100}vw`;
        rainDrop.style.animationDuration = `${0.5 + Math.random()}s`;
        rainContainer.appendChild(rainDrop);
    }
}

function createSnowAnimation() {
    const snowContainer = document.createElement('div');
    snowContainer.classList.add('animation-container');
    document.body.appendChild(snowContainer);

    for (let i = 0; i < 100; i++) {
        const snowFlake = document.createElement('div');
        snowFlake.classList.add('snow');
        snowFlake.style.left = `${Math.random() * 100}vw`;
        snowFlake.style.animationDuration = `${1 + Math.random()}s`;
        snowContainer.appendChild(snowFlake);
    }
}
