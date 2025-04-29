class WeatherAlert {
    constructor() {
        this.API_KEY = '5c0433a1b68505b73553840c7d4e380a'; // Add your OpenWeatherMap API key here
        this.weatherData = null;
        this.forecastData = null;
        this.alerts = [];
    }

    async initWeather(latitude, longitude) {
        try {
            this.showLoading();

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`);
            this.weatherData = await response.json();

            // Fetch 5-day forecast
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`);
            this.forecastData = await forecastResponse.json();

            this.checkWeatherThreats();
            this.displayForecast();
        } catch (error) {
            console.error('Weather fetch failed:', error);
            this.showError('Unable to fetch weather data. Please try again later.');
        }
    }

    showLoading() {
        const alertContainer = document.getElementById('weatherAlerts');
        const forecastContainer = document.getElementById('forecastDetails');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="flex justify-center items-center py-6">
                    <svg class="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                </div>
            `;
        }
        if (forecastContainer) {
            forecastContainer.innerHTML = `
                <div class="flex justify-center items-center py-6">
                    <svg class="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                </div>
            `;
        }
    }

    checkWeatherThreats() {
        if (!this.weatherData) return;

        const temp = this.weatherData.main.temp;
        const humidity = this.weatherData.main.humidity;
        const windSpeed = this.weatherData.wind.speed;
        const weather = this.weatherData.weather[0].main.toLowerCase();

        // Clear previous alerts
        this.alerts = [];

        // Check temperature extremes
        if (temp > 40) {
            this.addAlert('Extreme heat warning! Protect crops from heat stress.', 'severe');
        } else if (temp < 5) {
            this.addAlert('Frost warning! Take measures to protect sensitive crops.', 'severe');
        }

        // Check rain and storm conditions
        if (weather.includes('rain') || weather.includes('storm')) {
            this.addAlert('Heavy rain/storm expected. Ensure proper drainage.', 'warning');
        }

        // Check wind conditions
        if (windSpeed > 20) {
            this.addAlert('High winds expected. Protect crops from wind damage.', 'warning');
        }

        this.updateAlertUI();
    }

    displayForecast() {
        if (!this.forecastData) return;

        const forecastContainer = document.getElementById('forecastDetails');
        forecastContainer.innerHTML = '';

        // Group forecast by date
        const dailyForecasts = {};
        this.forecastData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = [];
            }
            dailyForecasts[date].push(item);
        });

        // Display forecast for next 5 days
        Object.keys(dailyForecasts).slice(0, 5).forEach(date => {
            const dayData = dailyForecasts[date];
            // Use midday data for summary
            const middayData = dayData[Math.floor(dayData.length / 2)];

            const dateObj = new Date(date);
            const options = { weekday: 'long', month: 'short', day: 'numeric' };
            const dateStr = dateObj.toLocaleDateString(undefined, options);

            const iconCode = middayData.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            const tempMin = Math.min(...dayData.map(d => d.main.temp_min));
            const tempMax = Math.max(...dayData.map(d => d.main.temp_max));

            const forecastCard = document.createElement('div');
            forecastCard.className = 'flex items-center space-x-4 p-4 border border-green-200 rounded-lg bg-green-50 relative group';

            forecastCard.innerHTML = `
                <img src="${iconUrl}" alt="${middayData.weather[0].description}" class="w-16 h-16" />
                <div>
                    <h3 class="font-semibold text-green-800">${dateStr}</h3>
                    <p class="text-gray-700 capitalize">${middayData.weather[0].description}</p>
                    <p class="text-gray-700">Min: ${tempMin.toFixed(1)}°C | Max: ${tempMax.toFixed(1)}°C</p>
                </div>
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                    Weather icon: ${middayData.weather[0].description}
                </div>
            `;

            forecastContainer.appendChild(forecastCard);
        });
    }

    addAlert(message, severity) {
        this.alerts.push({
            message,
            severity,
            timestamp: new Date().toLocaleString()
        });
    }

    updateAlertUI() {
        const alertContainer = document.getElementById('weatherAlerts');
        if (!alertContainer) return;

        alertContainer.innerHTML = '';

        if (this.alerts.length === 0) {
            alertContainer.innerHTML = '<p class="text-green-600">No weather alerts at this time.</p>';
            return;
        }

        this.alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `p-4 rounded-lg mb-3 ${
                alert.severity === 'severe' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`;
            alertElement.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${
                        alert.severity === 'severe' ? 'fa-exclamation-triangle' : 'fa-exclamation-circle'
                    } mr-2"></i>
                    <div>
                        <p class="font-semibold">${alert.message}</p>
                        <p class="text-sm opacity-75">Updated: ${alert.timestamp}</p>
                    </div>
                </div>
            `;
            alertContainer.appendChild(alertElement);
        });
    }

    showError(message) {
        const alertContainer = document.getElementById('weatherAlerts');
        if (!alertContainer) return;

        alertContainer.innerHTML = `
            <div class="p-4 rounded-lg mb-3 bg-red-100 text-red-700">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    <p>${message}</p>
                </div>
            </div>
        `;
    }

    // Method to check if weather conditions are suitable for a specific crop
    checkCropWeatherSuitability(crop) {
        if (!this.weatherData) return true; // If no weather data, assume suitable

        const temp = this.weatherData.main.temp;
        const weather = this.weatherData.weather[0].main.toLowerCase();

        // Check temperature suitability
        if (temp < crop.tempRange.min || temp > crop.tempRange.max) {
            return {
                suitable: false,
                reason: `Current temperature (${temp}°C) is outside the ideal range for ${crop.name}`
            };
        }

        // Check weather conditions
        if (weather.includes('storm')) {
            return {
                suitable: false,
                reason: 'Storm conditions may damage crops'
            };
        }

        return { suitable: true };
    }
}

// Initialize weather alert system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.weatherAlert = new WeatherAlert();
    
    // Get user's location for weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                weatherAlert.initWeather(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error('Geolocation error:', error);
                if (error.code === error.PERMISSION_DENIED) {
                    weatherAlert.showError('Location permission denied. Please allow location access to see weather information.');
                } else {
                    weatherAlert.showError('Unable to get location. Please enable location services.');
                }
            }
        );
    } else {
        weatherAlert.showError('Geolocation is not supported by your browser.');
    }
});
