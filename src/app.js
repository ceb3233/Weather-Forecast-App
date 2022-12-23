
import styles from "./style.css"; // import stylesheet

//variables use in the application
const apiKey = process.env.API_SECRET;
const apiKeyName = process.env.API_SECRET_KEY_NAME;
const table = document.querySelector('#weather-table > tbody');
const weatherTable = document.querySelector('#weather-table');
const city = document.querySelector('#city h2');
const searchBox = document.querySelector(".search-box");
const form = document.querySelector("form");
const numberOfDays = document.querySelector(".number-of-days");

/**
 * @description: This function is used to add forecast data to the page
 * @param {string} date - The date of the forecast
 * @param {string} dayOfTheWeek - The day of the week of the forecast
 * @param {string} temperature - The temperature of the forecast
 * @param {string} weatherState - The weather state of the forecast
 * @param {string} weatherIcon - The weather icon of the forecast
 * @param {string} windSpeed - The wind speed of the forecast
 * @param {string} windDirection - The wind direction of the forecast
 * @returns {void}
 */
const addDataToTable = (date, dayOfTheWeek, temperature, weatherState, weatherIcon, windSpeed, windDirection) => {
	const row = document.createElement('tr');
	row.innerHTML = `
		<td>${date}</td>
		<td>${dayOfTheWeek}</td>		
		<td>${temperature}</td>
		<td>${weatherState}</td>
		<td><img src="${weatherIcon}" alt="${weatherState}" class="icon"></td>
		<td>${windSpeed}</td>
		<td>${windDirection}</td>		
	`;	
	table.appendChild(row);
};

/**
 * @param {number} timestamp - The timestamp to convert to a day of the week.
 * @returns {string} - The day of the week.
 */
const getDayOfTheWeek = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday'];
    return days[date.getDay()];
};

/**
 * Converts Celsius to Fahrenheit
 * @param {number} celsius - The temperature in Celsius
 * @returns {string} - The temperature in Fahrenheit
 */
const convertToF = (celsius) => {
  let fahrenheit;  
  fahrenheit = celsius * 9/5 + 32; // convert to Fahrenheit
  return `${fahrenheit} &deg; F`; 
};

/**
 * @description Converts a date from the format YYYY-MM-DD to MM-DD-YYYY
 * @param {string} date - The date to be converted
 * @returns {string} - The converted date
 */
const convertDate = (date) => {
	const dateArray = date.split('-');
	const newDate = `${dateArray[1]}-${dateArray[2]}-${dateArray[0]}`;
	return newDate;
};

/**
 * @description: This function is used to get the weather data from the weatherstack API.
 * @param {string} apiName - The name of the API key.
 * @param {string} apiKeyValue - The value of the API key.
 * @param {string} query - The name of the city.
 * @param {number} forecast_days - The number of days to forecast.
 * @returns {object} - The weather data.
 */
const getWeather = async (apiName = apiKeyName, apiKeyValue = apiKey, query = searchBox.value, forecast_days = numberOfDays.value ) =>{
	try {			
		const response = await fetch(`http://api.weatherstack.com/forecast?${apiName}=${apiKeyValue}&query=${query}&forecast_days=${forecast_days}&hourly=1`);		
		// guard clause			
		if(response.status!==200){
			return console.log(response);
		}		
		const data = await response.json(); 		
		const name = data.location.name;
		const provicence = data.location.region;		
		const territory = data.location.country;		
		let forecast = data.forecast;
		// add current weather data to the page
		city.innerText = `${name}, ${provicence} (${territory})`;			
		// convert forecast object to an array
		forecast=Object.entries(forecast);		
		progressBar(forecast);		
	} catch (error) {		
		console.log(error);
	}
};

/**
 * @description: This function is used to display the progress bar
 * @param {string} forecast - The forecast of the weather
 * @returns {void}
 */
const progressBar = (forecast) => {	
	// guard clause	
  if(forecast.length == 0){
	  return;
  }	
  var i = 0;
  if (i == 0) {
	i = 1;		
	var elem =  document.querySelector('#progress-stats');
	var width = 1;	
	var id = setInterval(frame, 1); // 1 millisecond		
	function frame (){	
	  elem .style.display = "block"; // show progress bar	
	  if (width >= 100) {
		clearInterval(id); // stop progress bar		
		i = 0;			
		weatherTable.style.display = "block";		
		table.innerHTML = ""; // clears table before writing data;
		elem.style.display = "none"; // hide progress bar	
		displayTableData(forecast); // display data		
	  } else {
		width++;			
		elem.style.width = width + "%"; // update progress bar		
	  }
	}
  }
};

/**
 * @description This function displays the weather forecast data for the next 7 days in a table format.
 * @param {Object} forecast - The weather forecast data for the next 7 days.
 * @returns {void}
 */
const displayTableData = (forecast) =>{
	// loops over each forecast data for each day of the week and adds the data to the page	
	forecast.forEach(day => {				
		const dayOfTheWeek = getDayOfTheWeek(day[1].date_epoch);
		const date = convertDate(day[1].date);	
		const temperature = convertToF(day[1].avgtemp) + " / " + day[1].avgtemp +" &deg; C"; // temp in F & C                  
		const weatherState = day[1].hourly[0].weather_descriptions[0];		
		const weatherIcon = day[1].hourly[0].weather_icons[0];		
		const windSpeed = day[1].hourly[0].wind_speed;		
		const windDirection = day[1].hourly[0].wind_dir;		
		addDataToTable(date, dayOfTheWeek, temperature, weatherState, weatherIcon, windSpeed, windDirection); // add data to table
	});		
};

/**
 * @description This function validates the input from the user.
 * @param {string} input - The input from the user.
 * @returns {boolean} - Returns true if the input is valid, otherwise returns false.
 */
const validate = (input) => {	    
    let valid = true; 
    if (input.length < 3) { // if the input is less than 3 characters long, then it is invalid.
        alert("Please enter at least 3 characters.");
        valid = false;
	 } else if (input.match(/[0-9]/g)) { // Check if the input contains numbers.
        alert("Please enter only non numeric characters.");
        valid = false;
    }   
    return valid;
};


if(form){	
	// search button event
	form.addEventListener("submit", (e) => {	
		e.preventDefault();	// prevent the form from submitting.	
		validate(searchBox.value) && getWeather(); // validate input then call get weather function.
	});
}

module.exports = {validate, convertDate, getDayOfTheWeek}; // export the validate function.