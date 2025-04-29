document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Collapsible weather alerts
    const weatherAlertsContainer = document.getElementById('weatherAlerts');
    if (weatherAlertsContainer) {
        weatherAlertsContainer.addEventListener('click', (e) => {
            const alertHeader = e.target.closest('.weather-alert-header');
            if (alertHeader) {
                const alertContent = alertHeader.nextElementSibling;
                if (alertContent) {
                    alertContent.classList.toggle('hidden');
                }
            }
        });
    }

    // Add hover effect to voice button
    const voiceButton = document.getElementById('voiceButton');
    voiceButton.addEventListener('mouseenter', () => {
        if (!voiceButton.disabled) {
            voiceButton.classList.add('scale-105');
        }
    });
    voiceButton.addEventListener('mouseleave', () => {
        voiceButton.classList.remove('scale-105');
    });

    // Initialize form elements
    const cropForm = document.getElementById('cropForm');
    const radioGroups = ['temperature', 'water', 'soil', 'season'];

    // Add validation styling to radio groups
    radioGroups.forEach(groupName => {
        const radioInputs = document.querySelectorAll(`input[name="${groupName}"]`);

        radioInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                // Update styling for the entire group
                radioInputs.forEach(radio => {
                    const label = radio.closest('label');
                    if (radio.checked) {
                        label.classList.add('bg-green-50', 'border-green-500');
                    } else {
                        label.classList.remove('bg-green-50', 'border-green-500');
                    }
                });
            });
        });
    });

    // Handle form submission for manual input
    cropForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const conditions = {
            temperature: document.querySelector('input[name="temperature"]:checked')?.value,
            water: document.querySelector('input[name="water"]:checked')?.value,
            soil: document.querySelector('input[name="soil"]:checked')?.value,
            season: document.querySelector('input[name="season"]:checked')?.value
        };

        // Validate inputs and show errors
        let isValid = true;
        radioGroups.forEach(group => {
            const checkedInput = document.querySelector(`input[name="${group}"]:checked`);
            const groupContainer = document.querySelector(`input[name="${group}"]`).closest('div');

            if (!checkedInput) {
                isValid = false;
                // Add error styling to the group container
                groupContainer.classList.add('ring-2', 'ring-red-200');

                // Remove any existing error message
                const existingError = groupContainer.querySelector('.error-message');
                if (existingError) existingError.remove();

                // Add error message
                const errorMsg = document.createElement('p');
                errorMsg.className = 'text-red-600 text-sm mt-2 error-message';
                errorMsg.textContent = `Please select a ${group}`;
                groupContainer.appendChild(errorMsg);
            } else {
                groupContainer.classList.remove('ring-2', 'ring-red-200');
                const existingError = groupContainer.querySelector('.error-message');
                if (existingError) existingError.remove();
            }
        });

        if (!isValid) {
            return;
        }

        // Get and display recommendations with loading state
        const submitButton = cropForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Simulate processing delay for better UX
        setTimeout(() => {
            const recommendations = getCropRecommendations(conditions);

            // Check weather conditions for each recommendation
            if (window.weatherAlert && window.weatherAlert.weatherData) {
                recommendations.forEach(crop => {
                    const weatherSuitability = window.weatherAlert.checkCropWeatherSuitability(crop);
                    crop.weatherWarning = !weatherSuitability.suitable ? weatherSuitability.reason : null;
                });
            }

            displayRecommendations(recommendations);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1000);
    });

    // Function to display recommendations
    function displayRecommendations(recommendations) {
        const resultsSection = document.getElementById('results');
        const noResultsSection = document.getElementById('noResults');
        const cropResults = document.getElementById('cropResults');

        // Clear previous results
        cropResults.innerHTML = '';

        if (recommendations.length === 0) {
            resultsSection.classList.add('hidden');
            noResultsSection.classList.remove('hidden');
            noResultsSection.classList.add('animate-fade-in');
            noResultsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            noResultsSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');

            recommendations.forEach((crop, index) => {
                const cropCard = document.createElement('div');
                cropCard.className = `crop-card bg-white p-6 rounded-xl shadow-md border-2 ${
                    crop.weatherWarning ? 'border-yellow-200' : 'border-green-200'
                } hover:shadow-xl transition-all animate-fade-in`;
                cropCard.style.animationDelay = `${index * 0.1}s`;

                let weatherWarning = '';
                if (crop.weatherWarning) {
                    weatherWarning = `
                        <div class="mt-4 p-3 bg-yellow-50 rounded-lg text-yellow-700 weather-alert">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-triangle mr-2 text-yellow-600"></i>
                                <span class="font-medium">Weather Warning:</span>
                            </div>
                            <p class="mt-1 ml-6">${crop.weatherWarning}</p>
                        </div>
                    `;
                }

                cropCard.innerHTML = `
                    <div class="flex items-start justify-between">
                        <h3 class="text-xl font-semibold text-green-800">${crop.name}</h3>
                        <span class="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            ${crop.waterNeed} water need
                        </span>
                    </div>
                    <div class="mt-4 space-y-3">
                        <p class="flex items-center text-gray-600">
                            <i class="fas fa-calendar-alt text-green-600 mr-2 w-5"></i>
                            <span class="font-medium mr-2">Growing Period:</span> ${crop.growingPeriod}
                        </p>
                        <p class="flex items-center text-gray-600">
                            <i class="fas fa-temperature-high text-green-600 mr-2 w-5"></i>
                            <span class="font-medium mr-2">Temperature:</span> ${crop.tempRange.min}°C - ${crop.tempRange.max}°C
                        </p>
                        <p class="flex items-center text-gray-600">
                            <i class="fas fa-info-circle text-green-600 mr-2 w-5"></i>
                            <span class="font-medium mr-2">Care:</span> ${crop.careInstructions}
                        </p>
                    </div>
                    ${weatherWarning}
                `;
                cropResults.appendChild(cropCard);
            });

            // Smooth scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
