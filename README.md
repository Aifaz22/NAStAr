# NAStAr
Uses NASA's Api (APOD and Asteroid NeoWs) and displays information on a Single Page Application. It uses hashmap to store session's data to avoid sending requests to the api.

Features:
- Ability to change Date and get its result
- Ability to have a Slideshow
- A sidebar to show you different pages on the application
- Quicker access to already accessed pages

To use this, get an apikey from 'https://api.nasa.gov/' and the follow the following steps:
- create config.js file in the same directory as index.html
- create a hashmap/dictionary named config like shown below with your api key instead of ```<key here> ```
```
const config = {
  ApiKey_NASA : <key here>;
}
```
---------------------------
