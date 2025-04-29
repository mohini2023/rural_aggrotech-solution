# Kissan Crop Advisor

A web application that provides crop recommendations based on various environmental factors.

## How to Run Locally

1. Extract the zip file to your local machine
2. Navigate to the extracted folder
3. You can run the application using any of these methods:

   ### Using Python's built-in HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then open http://localhost:8000 in your web browser

   ### Using VS Code Live Server:
   - Install Live Server extension in VS Code
   - Right click on index-updated.html and select "Open with Live Server"

   ### Using any other local server:
   - You can use any HTTP server of your choice (XAMPP, Node.js http-server, etc.)
   - Simply serve the root directory and access index-updated.html

## Features

- Voice-based input for crop recommendations
- Manual input form for detailed specifications
- Real-time weather alerts
- Agricultural news updates
- Interactive chatbot support
- Responsive design for all devices

## File Structure

- `index-updated.html` - Main application file
- `js/` - Directory containing all JavaScript files
  - `agriculture-news.js` - Agricultural news functionality
  - `chatbot-updated.js` - Chatbot implementation
  - `crop-database.js` - Crop recommendation database
  - `main-updated.js` - Main application logic
  - `voice-assistant.js` - Voice input processing
  - `weather-alert.js` - Weather alerts system
