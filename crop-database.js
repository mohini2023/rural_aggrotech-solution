const cropDatabase = {
    rice: {
        name: "Rice (धान)",
        tempRange: { min: 21, max: 37 },
        waterNeed: "high",
        soilTypes: ["clay", "loamy"],
        seasons: ["monsoon"],
        growingPeriod: "3-4 months",
        careInstructions: "Needs standing water, regular weeding, and proper drainage system",
        weatherSensitivity: {
            wind: "high",
            rain: "moderate",
            frost: "high",
            drought: "high",
            storm: "high"
        }
    },
    wheat: {
        name: "Wheat (गेहूं)",
        tempRange: { min: 10, max: 25 },
        waterNeed: "medium",
        soilTypes: ["loamy", "clay"],
        seasons: ["winter"],
        growingPeriod: "4-5 months",
        careInstructions: "Requires well-drained soil, moderate irrigation, and sunny conditions",
        weatherSensitivity: {
            wind: "moderate",
            rain: "moderate",
            frost: "low",
            drought: "moderate",
            storm: "high"
        }
    },
    cotton: {
        name: "Cotton (कपास)",
        tempRange: { min: 21, max: 35 },
        waterNeed: "medium",
        soilTypes: ["sandy", "loamy"],
        seasons: ["monsoon"],
        growingPeriod: "6-8 months",
        careInstructions: "Needs good drainage, regular pest control, and proper spacing",
        weatherSensitivity: {
            wind: "high",
            rain: "moderate",
            frost: "high",
            drought: "moderate",
            storm: "high"
        }
    },
    sugarcane: {
        name: "Sugarcane (गन्ना)",
        tempRange: { min: 20, max: 35 },
        waterNeed: "high",
        soilTypes: ["loamy"],
        seasons: ["summer", "monsoon"],
        growingPeriod: "12-18 months",
        careInstructions: "Requires regular irrigation, proper fertilization, and weed control",
        weatherSensitivity: {
            wind: "high",
            rain: "moderate",
            frost: "high",
            drought: "high",
            storm: "high"
        }
    },
    potato: {
        name: "Potato (आलू)",
        tempRange: { min: 15, max: 25 },
        waterNeed: "medium",
        soilTypes: ["loamy", "sandy"],
        seasons: ["winter"],
        growingPeriod: "3-4 months",
        careInstructions: "Needs well-drained soil, regular earthing up, and proper spacing",
        weatherSensitivity: {
            wind: "low",
            rain: "high",
            frost: "moderate",
            drought: "moderate",
            storm: "moderate"
        }
    },
    tomato: {
        name: "Tomato (टमाटर)",
        tempRange: { min: 20, max: 30 },
        waterNeed: "medium",
        soilTypes: ["loamy", "sandy"],
        seasons: ["winter", "summer"],
        growingPeriod: "3-4 months",
        careInstructions: "Requires staking, regular watering, and pest monitoring",
        weatherSensitivity: {
            wind: "high",
            rain: "moderate",
            frost: "high",
            drought: "moderate",
            storm: "high"
        }
    },
    maize: {
        name: "Maize (मक्का)",
        tempRange: { min: 20, max: 35 },
        waterNeed: "medium",
        soilTypes: ["loamy", "sandy"],
        seasons: ["monsoon", "summer"],
        growingPeriod: "3-4 months",
        careInstructions: "Needs proper spacing, regular weeding, and adequate sunlight",
        weatherSensitivity: {
            wind: "high",
            rain: "moderate",
            frost: "high",
            drought: "moderate",
            storm: "high"
        }
    },
    groundnut: {
        name: "Groundnut (मूंगफली)",
        tempRange: { min: 20, max: 35 },
        waterNeed: "low",
        soilTypes: ["sandy", "loamy"],
        seasons: ["monsoon"],
        growingPeriod: "4-5 months",
        careInstructions: "Requires well-drained soil, regular weeding, and proper soil moisture",
        weatherSensitivity: {
            wind: "low",
            rain: "high",
            frost: "moderate",
            drought: "low",
            storm: "moderate"
        }
    }
};

// Function to get temperature range from input
function getTemperatureRange(temp) {
    switch(temp) {
        case 'hot': return { min: 30, max: 40 };
        case 'moderate': return { min: 20, max: 30 };
        case 'cold': return { min: 10, max: 20 };
        default: return null;
    }
}

// Function to get crop recommendations based on conditions
function getCropRecommendations(conditions) {
    const recommendations = [];
    const tempRange = getTemperatureRange(conditions.temperature);
    
    for (const [cropId, crop] of Object.entries(cropDatabase)) {
        let suitable = true;
        
        // Check temperature compatibility
        if (tempRange) {
            if (crop.tempRange.min > tempRange.max || crop.tempRange.max < tempRange.min) {
                suitable = false;
            }
        }
        
        // Check water needs
        if (conditions.water && conditions.water !== crop.waterNeed) {
            suitable = false;
        }
        
        // Check soil type
        if (conditions.soil && !crop.soilTypes.includes(conditions.soil)) {
            suitable = false;
        }
        
        // Check season
        if (conditions.season && !crop.seasons.includes(conditions.season)) {
            suitable = false;
        }
        
        if (suitable) {
            recommendations.push({
                id: cropId,
                ...crop
            });
        }
    }
    
    return recommendations;
}
