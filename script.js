const api_key = "39f4750bb7773a35191e18889ddbb91e";
const submit_btn = document.getElementById("get-weather");
const weatherCard = document.querySelector(".weathercard");

// Show current location's weather on page load
window.addEventListener("load", async () => {
  weatherCard.textContent = "";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      const data = await getWeatherByCoordinates(latitude, longitude);
      displayWeather(data);
    }, error => {
      displayError("Unable to access your location. Please search manually.");
    });
  } else {
    displayError("Geolocation is not supported by your browser.");
  }
});

// Fetch weather data for a city
submit_btn.addEventListener("click", async event => {
  weatherCard.textContent = "";
  const city = document.getElementById("cityname").value;
  if (city) {
    const data = await getWeatherData(city.toLowerCase());
    displayWeather(data);
  } else {
    displayError("Please Enter City");
  }
});

// Fetch weather data by city name
async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`);
    if (!response.ok) {
      displayError("Can't fetch data :(");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    displayError("Something went wrong.");
  }
}

// Fetch weather data by latitude and longitude
async function getWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`);
    if (!response.ok) {
      displayError("Can't fetch data for your location :(");
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    displayError("Something went wrong.");
  }
}

// Display weather details
function displayWeather(data) {
  if (!data || !data.main) {
    displayError("Weather data unavailable.");
    return;
  }

  const temperature = (data.main.temp - 273).toFixed(2);
  const humidity = data.main.humidity;
  const feelsLike = (data.main.feels_like - 273).toFixed(2);
  const description = data.weather[0].description;
  const id = data.weather[0].id;

  const cityName = document.createElement("h1");
  cityName.textContent = data.name;
  const tempDisplay = document.createElement("p");
  tempDisplay.textContent = `Temperature: ${temperature}°C`;
  const humidityDisplay = document.createElement("p");
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  const feelsLikeDisplay = document.createElement("p");
  feelsLikeDisplay.textContent = `Feels Like: ${feelsLike}°C`;
  const descriptionDisplay = document.createElement("p");
  descriptionDisplay.textContent = description;
  const emojiDisplay = document.createElement("p");
  emojiDisplay.textContent = displayEmoji(id);
  emojiDisplay.classList.add("emojiDisplay");

  weatherCard.appendChild(cityName);
  weatherCard.appendChild(tempDisplay);
  weatherCard.appendChild(humidityDisplay);
  weatherCard.appendChild(feelsLikeDisplay);
  weatherCard.appendChild(descriptionDisplay);
  weatherCard.appendChild(emojiDisplay);
  weatherCard.style.display = "flex";
}

// Display weather emoji
function displayEmoji(id) {
  switch (true) {
    case (id >= 200 && id < 300):
      return "⛈";
    case (id >= 300 && id < 400):
      return "🌦";
    case (id >= 500 && id < 600):
      return "🌧";
    case (id >= 600 && id < 700):
      return "🌨";
    case (id >= 700 && id < 800):
      return "🌪";
    case (id === 800 || id === 801):
      return "☀️";
    default:
      return "?";
  }
}

// Display error messages
function displayError(message) {
  const error = document.createElement("p");
  error.textContent = message;
  weatherCard.style.display = "flex";
  weatherCard.appendChild(error);
}