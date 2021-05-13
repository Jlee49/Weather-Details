$(document).ready(function(){
	$("#country").change(function(){
		let country = $(this).val();
		if (country == "choice"){
			$("#city").hide();
			$("#info").hide();
		}
		else{
			$("#city").load(country+"-cities.html");
			$("#city").show();
		}
	});
	
	$("#city").change(function(){
		let city = $(this).val();
		if (city == "Select a City"){
			$("#info").hide();
		}
		else{
			$("#info").show();
			let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=602bf94ad0c37a7009720b2fd1221b40";
			$.ajax( {
				url: apiUrl,
				type: "GET",
				dataType: "json",
				success: function(response){
					$("#info").html("");
					let date = getDate();
					let milesPerHour = convertToMph(response.wind.speed);
					let kilometersPerHour = convertToKph(response.wind.speed);
					let degrees_Celsius = Math.round(response.main.temp);
					let degrees_Farenheit = convertToFarenheit(response.main.temp);
					let wind_Direction = getDirection(response.wind.deg);
					let weather_Condition = response.weather[0].main;
					let weather_ID = response.weather[0].id;
					let dateString = getDate(response.dt)
					let icon = "";
					let warnings = "None";
					
					/**The logic behind it is taken directly from https://openweathermap.org/weather-conditions**/
					if (weather_ID >= 200 && weather_ID < 300){
						icon = '<img id="icon" src="weather_icons/thunderstorm.png" alt="thunderstorm" ';
					}
					if (weather_ID >= 300 && weather_ID < 322){
						icon = '<img id="icon" src="weather_icons/rain.png" alt="drizzle" ';
					}
					if (weather_ID >= 500 && weather_ID < 532){
						icon = '<img id="icon" src="weather_icons/heavy rain.png" alt="rain" ';
					}
					if (weather_ID >= 600 && weather_ID < 623){
						icon = '<img id="icon" src="weather_icons/snow.png" alt="snow" ';
					}
					if (weather_ID >= 701 && weather_ID < 782){
						icon = '<img id="icon" src="weather_icons/heavy cloud.png" alt="snow" ';
					}
					if (weather_ID == 800){
						icon = '<img id="icon" src="weather_icons/sun and cloud.png" alt="clear" ';
					}
					if (weather_ID >= 801 && weather_ID < 805){
						icon = '<img id="icon" src="weather_icons/cloud.png" alt="clouds" ';
					}
					
					if (degrees_Celsius > 35 || degrees_Celsius < -5){
						warnings = "Very Dangerous Temperature";	
					}
					if (milesPerHour > 50){
						warnings = "Very Strong Winds";	
					 }
					if ((milesPerHour > 50) && (degrees_Celsius > 35 || degrees_Celsius < -5)){
						warnings = "Very Dangerous Temperature AND Very Strong Winds";	
					 }
					
					let string ="";
					string +=   "<div class='weatherdetails'><h1>" + city + ",  " + $("#country option:selected" ).text() + ", " + dateString + "</h1>" +
								"<table border=2><tr><td><b>Weather conditions</b></td><td>" + weather_Condition + " | " + degrees_Farenheit + "&#8457 | " + degrees_Celsius + "&#8451</td></tr>" +
								"<tr><td><b>Wind speed</b></td><td>" + milesPerHour + "mph | " + kilometersPerHour + "kph</td></tr>" +
								"<tr><td><b>Wind direction</b></td><td>" + wind_Direction +" | " + response.wind.deg + "&#176</td></tr>" +
								"<tr><td><b>Warnings</b></td><td>" + warnings + "</td></tr></table>" +
								"<div class = 'icon'>" + icon + "</div></div>";
					
					
					$("#info").append(string);
				},
				error: function(){
					$("#info").html("<p>An error occurred</p>");
				}
			});
		}
	 });
	
	/*Using the website:  https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date to create the function below*/
	function getDate(unix){
		var date = new Date(unix*1000).toLocaleDateString('en-GB');
		return date;
	}
	
	/*Using google search to find the conversion formula, i created a function which would convert metres per second to miles per hour*/
	function convertToMph(mps){
		return Math.round(mps * 2.237);
	}
	
	/*Using google search to find the conversion formula, I created a function which would convert metres per second to kilometres per hour*/
	function convertToKph(mps){
		return Math.round(mps * 3.6);
	}
	
	/*Using google search to find the conversion formula,I created a function which would convert celsius to farenheit*/
	function convertToFarenheit(celsius){
		return Math.round(((celsius * 1.8) + 32));
	}
	
	/*Using the website: http://snowfence.umn.edu/Components/winddirectionanddegrees.htm to create the function below*/
	function getDirection(degree){
		if (degree > 348.75 || degree <= 11.25){
			return "Northerly";
        }
		else if (degree > 11.25 && degree <= 78.75) {
            return "North Easterly";
        } 
		else if (degree > 78.75 && degree <= 101.25) {
            return "Easterly";
        } 
		else if (degree > 101.25 && degree <= 168.75) {
            return "South Easterly";
        } 
		else if (degree > 168.75 && degree <= 191.25) {
            return "Southerly";
        } 
		else if (degree > 191.25 && degree <= 258.75) {
            return "South Westerly";
        } 
		else if (degree > 258.75 && degree <= 281.25) {
            return "Westerly";
        }
		else if (degree > 281.25 && degree <= 348.75) {
            return "North Westerly";
        }
	}
});