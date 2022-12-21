
import "./style.css"; // inport stylesheet

//variables use in the application
const apiKey = process.env.API_SECRET;
const apiKeyName = process.env.API_SECRET_KEY_NAME;
const table = document.querySelector('#weather-table > tbody');
const weatherTable = document.querySelector('#weather-table');
const searchBox = document.querySelector(".search-box");
const form = document.querySelector("form");
const containerElm = document.querySelector(".container");
const numberOfDays = document.querySelector(".number-of-days");
const city = document.querySelector('#city h2');
const weather = document.querySelector("#weather");
const weatherIcon = document.querySelector('.weather-icon img');
const temperature = document.querySelector('.temperature h1');
const weatherState = document.querySelector('.temperature h2');
const windSpeed = document.querySelector('.wind h1');
const windDirection = document.querySelector('.wind h2');

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
 * @description: This function is used to resolve the day of the week
 * @param {string} epoch - The epoch of the forecast
 * @returns {string} - The day of the week
 */
const getDayOfTheWeek = (epoch) =>{
	const d = new Date(epoch * 1000);
	const weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	return weekday[d.getDay()];
};

/**
 * @description: This function is used to convert from celsius to fahrenheit
 * @param {string} celsius - The celsius of the forecast
 * @returns {string} - The fahrenheit of the forecast
 */
const convertToF = (celsius) => {
  let fahrenheit;  
  fahrenheit = celsius * 9/5 + 32; 
  return `${fahrenheit} &deg; F`;
}

/**
 * @description: This function is used to convert the date
 * @param {string} inputFormat - The input format of the forecast
 * @returns {string} - The date of the forecast
 */
const convertDate = (inputFormat) =>{
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat);
  return [pad(d.getMonth()+1), pad(d.getDate()), d.getFullYear()].join('-');
}

/**
 * @description: This function is used to get the weather
 * @returns {void}
 */
const getWeather = async () =>{
	try {	
		const response = await fetch(`http://api.weatherstack.com/forecast?${apiKeyName}=${apiKey}&query=${searchBox.value}&forecast_days=${numberOfDays.value}&hourly=1`);		
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
	var id = setInterval(frame, 1);
	function frame (){	
	  elem .style.display = "block"; // show progress bar	
	  if (width >= 100) {
		clearInterval(id);
		i = 0;			
		weatherTable.style.display = "block";		
		table.innerHTML = ""; // clears table before writing data;
		elem.style.display = "none"; // hide progress bar	
		displayTableData(forecast);		
	  } else {
		width++;			
		elem.style.width = width + "%";
	  }
	}
  }
}

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
		addDataToTable(date, dayOfTheWeek, temperature, weatherState, weatherIcon, windSpeed, windDirection);
	});		
}

/**
 * @description This function validates the input from the user.
 * @param {string} input - The input from the user.
 * @returns {boolean} - Returns true if the input is valid, otherwise returns false.
 */
const validate = (input) => {	
    if (input.length > 0 && !/^[a-zA-Z]*$/g.test(input.value)) {
        alert("Please enter letters only");
        input.name.focus();
        return false;
    }	
}

// search button event
form.addEventListener("submit", (e) => {	
	e.preventDefault();		
	// data validation
	if (searchBox.value == "" || typeof searchBox.value === 'number' || isFinite(searchBox.value)) {
        alert("Enter a location");
        searchBox.name.focus();
        return false;
    }	
	getWeather();
});

// seach box key up event
form.addEventListener("keyup", () => {
	searchBox.value = searchBox.value.toUpperCase(); // convert input to uppercase
	validate(searchBox);
});
