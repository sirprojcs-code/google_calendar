Google Calendar Viewer & Event Manager

Overview

This project allows users to view and create events on their Google Calendar directly from a web interface. It consists of two parts: the frontend (HTML & CSS) for UI and the JavaScript logic for interacting with the Google Calendar API.

Features

•	View events from a specific calendar.

•	Filter events by keyword, start date, and end date.

•	Create new events with title, description, date, start/end time.

•	Loading states and error handling for better user experience.

•	Responsive design for desktop and mobile devices.

Role Assignment 

•	Kasandra Joy Cruz – JavaScript Logic / Data Processing / UI & CSS Designer

•	Jessielyn Llomo – JavaScript Logic / Data Processing / API & Authentication Handler

•	Tiffany Angel Caoile – GitHub & Documentation Manager

•	Pia Joy Tenepere – UI & CSS Designer

Project Structure

project/

│

├─ index.html          # Main HTML interface

├─ style.css           # Styles for layout, buttons, cards, and responsive design

├─ script.js           # JavaScript for fetching and creating calendar events

├─ config.js           # Stores API key or configuration for Google Calendar API

How It Works

1.	View Events
   
o	Enter a Calendar ID (e.g., your Gmail or calendar ID).

o	Add optional filters like keyword, start date, and end date.

o	Click Load Events to fetch events from Google Calendar API.

o	Events display in cards showing title, date & time, location, and description.

3.	Create Events
   
o	Fill in Calendar ID, event title, date, start and end time, optional description.

o	Enter a valid OAuth access token.

o	Click Create Event to add it to your Google Calendar.

o	Success or error messages are shown after submission.

5.	User Feedback
   
o	Shows loading indicators when fetching or creating events.

o	Displays errors like invalid input, authentication issues, or network problems.


Technologies Used

•	HTML5, CSS3 for UI layout and styling

•	JavaScript (ES6) for API interaction and DOM manipulation

•	Google Calendar API for fetching and creating events

•	Bootstrap Icons for button icons

Instructions to Run

Open the index.html file inside the folder and it will automatically open in your browser. No server setup is required.

Notes

•	Make sure the calendar is shared properly if using someone else’s calendar.

•	Ensure the OAuth token has permissions to create events.

•	API key must have access to Google Calendar API.

