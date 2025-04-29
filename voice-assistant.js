class VoiceAssistant {
    constructor() {
        this.maxRetries = 3;
        this.currentRetry = 0;
        
        // Check if browser supports speech recognition
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            this.showError("Voice recognition is not supported in your browser. Please use Chrome or Edge.");
            return;
        }
        
        try {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.synthesis = window.speechSynthesis;
        } catch (e) {
            this.showError("Failed to initialize voice recognition. Please check your microphone permissions.");
            return;
        }

        this.isListening = false;
        this.currentQuestion = 0;
        this.answers = {
            temperature: '',
            water: '',
            soil: '',
            season: ''
        };

        this.questions = [
            "What is the temperature in your area - hot, moderate, or cold?",
            "How much water is available - high, medium, or low?",
            "What type of soil do you have - sandy, clay, loamy, or silty?",
            "Which season is it currently - summer, winter, or monsoon?"
        ];

        this.setupRecognition();
    }

    showError(message) {
        const voiceStatus = document.getElementById('voiceStatus');
        voiceStatus.textContent = message;
        voiceStatus.classList.add('text-red-600');

        const voiceButton = document.getElementById('voiceButton');
        voiceButton.classList.add('bg-gray-400');
        voiceButton.disabled = true;
    }

    setupRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN';

        this.recognition.onstart = () => {
            this.isListening = true;
            document.getElementById('voiceStatus').textContent = "Listening...";
            const voiceButton = document.getElementById('voiceButton');
            voiceButton.classList.add('animate-pulse', 'bg-red-600');
            voiceButton.querySelector('i').classList.add('animate-bounce');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            const voiceButton = document.getElementById('voiceButton');
            voiceButton.classList.remove('animate-pulse', 'bg-red-600');
            voiceButton.classList.add('bg-green-600');
            voiceButton.querySelector('i').classList.remove('animate-bounce');
            
            // If no result was received and we haven't exceeded max retries, try again
            if (this.currentRetry < this.maxRetries) {
                this.currentRetry++;
                this.speak("I didn't catch that. Please try again. Attempt " + this.currentRetry + " of " + this.maxRetries);
                setTimeout(() => this.recognition.start(), 2000);
            } else {
                this.currentRetry = 0;
                this.speak("I'm having trouble understanding. Please try using the manual input form below.");
                document.getElementById('voiceStatus').textContent = "Please use manual input form";
            }
        };

        this.recognition.onresult = (event) => {
            this.currentRetry = 0; // Reset retry counter on successful result
            const result = event.results[0][0].transcript.toLowerCase();
            this.processVoiceInput(result);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            let errorMessage = "An error occurred. ";
            switch (event.error) {
                case 'network':
                    errorMessage += "Please check your internet connection.";
                    break;
                case 'not-allowed':
                    errorMessage += "Please allow microphone access in your browser settings.";
                    break;
                case 'no-speech':
                    errorMessage += "No speech was detected. Please try again.";
                    break;
                default:
                    errorMessage += "Please try again or use the manual input form.";
            }
            
            this.speak(errorMessage);
            document.getElementById('voiceStatus').textContent = errorMessage;
            
            // Visual feedback for error
            const voiceButton = document.getElementById('voiceButton');
            voiceButton.classList.remove('bg-green-600', 'bg-red-600');
            voiceButton.classList.add('bg-yellow-600');
            setTimeout(() => {
                voiceButton.classList.remove('bg-yellow-600');
                voiceButton.classList.add('bg-green-600');
            }, 2000);
        };
    }

    start() {
        if (!this.recognition) return;

        // Check if microphone permission is granted
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                this.currentQuestion = 0;
                this.answers = {
                    temperature: '',
                    water: '',
                    soil: '',
                    season: ''
                };
                this.speak("Welcome to Kissan Crop Advisor. " + this.questions[0]);
                setTimeout(() => this.recognition.start(), 2000);
            })
            .catch(() => {
                this.showError("Microphone access denied. Please allow microphone access to use voice input.");
            });
    }

    processVoiceInput(input) {
        let validInput = false;

        switch (this.currentQuestion) {
            case 0: // Temperature
                if (input.includes('hot') || input.includes('moderate') || input.includes('cold')) {
                    if (input.includes('hot')) this.answers.temperature = 'hot';
                    else if (input.includes('moderate')) this.answers.temperature = 'moderate';
                    else this.answers.temperature = 'cold';
                    validInput = true;
                }
                break;

            case 1: // Water
                if (input.includes('high') || input.includes('medium') || input.includes('low')) {
                    if (input.includes('high')) this.answers.water = 'high';
                    else if (input.includes('medium')) this.answers.water = 'medium';
                    else this.answers.water = 'low';
                    validInput = true;
                }
                break;

            case 2: // Soil
                if (input.includes('sandy') || input.includes('clay') || input.includes('loamy') || input.includes('silty')) {
                    if (input.includes('sandy')) this.answers.soil = 'sandy';
                    else if (input.includes('clay')) this.answers.soil = 'clay';
                    else if (input.includes('loamy')) this.answers.soil = 'loamy';
                    else this.answers.soil = 'silt';
                    validInput = true;
                }
                break;

            case 3: // Season
                if (input.includes('summer') || input.includes('winter') || input.includes('monsoon')) {
                    if (input.includes('summer')) this.answers.season = 'summer';
                    else if (input.includes('winter')) this.answers.season = 'winter';
                    else this.answers.season = 'monsoon';
                    validInput = true;
                }
                break;
        }

        if (validInput) {
            this.currentQuestion++;
            if (this.currentQuestion < this.questions.length) {
                this.speak("Thank you. " + this.questions[this.currentQuestion]);
                setTimeout(() => this.recognition.start(), 2000);
            } else {
                this.provideRecommendations();
            }
        } else {
            this.speak("Sorry, I didn't understand. " + this.questions[this.currentQuestion]);
            setTimeout(() => this.recognition.start(), 2000);
        }
    }

    speak(text) {
        document.getElementById('voiceStatus').textContent = text;

        // Stop any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        this.synthesis.speak(utterance);
    }

    provideRecommendations() {
        const recommendations = getCropRecommendations(this.answers);

        if (recommendations.length === 0) {
            this.speak("Sorry, I couldn't find any suitable crops for these conditions. Please try with different conditions.");
            return;
        }

        // Update UI with recommendations
        const cropResults = document.getElementById('cropResults');
        cropResults.innerHTML = '';

        recommendations.forEach(crop => {
            // Check weather suitability for each crop
            const weatherSuitability = window.weatherAlert ? window.weatherAlert.checkCropWeatherSuitability(crop) : { suitable: true };
            
            const cropCard = document.createElement('div');
            cropCard.className = `bg-white p-4 rounded-lg shadow border ${weatherSuitability.suitable ? 'border-green-200' : 'border-yellow-200'}`;
            
            let weatherWarning = '';
            if (!weatherSuitability.suitable) {
                weatherWarning = `
                    <div class="mt-2 p-2 bg-yellow-50 rounded text-yellow-700">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Weather Warning: ${weatherSuitability.reason}
                    </div>
                `;
            }

            cropCard.innerHTML = `
                <h3 class="text-xl font-semibold text-green-800 mb-2">${crop.name}</h3>
                <div class="space-y-2">
                    <p class="text-gray-600">
                        <i class="fas fa-calendar-alt text-green-600 mr-2"></i>
                        Growing Period: ${crop.growingPeriod}
                    </p>
                    <p class="text-gray-600">
                        <i class="fas fa-temperature-high text-green-600 mr-2"></i>
                        Temperature: ${crop.tempRange.min}°C - ${crop.tempRange.max}°C
                    </p>
                    <p class="text-gray-600">
                        <i class="fas fa-tint text-green-600 mr-2"></i>
                        Water Need: ${crop.waterNeed}
                    </p>
                    <p class="text-gray-600">
                        <i class="fas fa-info-circle text-green-600 mr-2"></i>
                        ${crop.careInstructions}
                    </p>
                    ${weatherWarning}
                </div>
            `;
            cropResults.appendChild(cropCard);
        });

        // Show results section
        document.getElementById('results').classList.remove('hidden');

        // Speak recommendations
        let speechText = "Based on your conditions, I recommend growing: ";
        recommendations.forEach((crop, index) => {
            if (index === recommendations.length - 1) {
                speechText += "and " + crop.name + ".";
            } else {
                speechText += crop.name + ", ";
            }
        });

        this.speak(speechText);
    }
}

// Initialize voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const voiceAssistant = new VoiceAssistant();

    document.getElementById('voiceButton').addEventListener('click', () => {
        if (!voiceAssistant.isListening) {
            voiceAssistant.start();
        }
    });
});
