document.addEventListener('DOMContentLoaded', () => {
    // Existing code...

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

    // Existing code...
});
