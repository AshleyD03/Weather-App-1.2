var weather = document.getElementsByClassName("weather");
var today = document.getElementsByClassName("today")[0];
var tabs = document.getElementsByClassName("tablinks");
var d = new Date();
var day = d.getDay() - 1;
var days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

window.addEventListener("load", function() {
  for (i = 0; i < 7; i++) {
    if (day > 7) {
      day = 1;
    }
    tabs[i].textContent = days[day];
    day++;
  }

  for (i = 0; i < 7; i++) {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    document.getElementById(days[i]).appendChild(clon);
    getLocation();
  }
});

var next = 0;
var pageClass = 0;
async function getWeather(lat, long) {
  var response = await fetch(
    "http://api.weatherunlocked.com/api/forecast/" +
      lat +
      "," +
      long +
      "?app_id=9e946863&app_key=e08ee008e50d82b421467fee14ab421b"
  );
  var data = await response.json();
  console.log(data);
  weather[0 + next].innerHTML =
    "Min Temp = " + data.Days[pageClass].temp_min_c + " °C";
  weather[1 + next].innerHTML =
    "Max Temp = " + data.Days[pageClass].temp_max_c + " °C";
  weather[2 + next].innerHTML =
    "Max Wind Speed = " + data.Days[pageClass].windspd_max_mph + "mph";
  next += 3;
  pageClass++;
}

async function getCurrentWeather(lat, long) {
  var response = await fetch(
    "http://api.weatherunlocked.com/api/current/" +
      lat +
      "," +
      long +
      "?app_id=9e946863&app_key=e08ee008e50d82b421467fee14ab421b"
  );
  var current = await response.json();
  var top = document.getElementsByClassName("top");
  top[0].innerHTML = "Current Weather - Today - " + days[day];
  top[1].innerHTML = "Weather = " + current.wx_desc;
  top[2].innerHTML = "Current Wind Speed = " + current.windspd_mph + "mph";
  top[3].innerHTML = "Current Temp = " + current.temp_c + " °C";
  top[4].innerHTML =
    "Wind Direction = " +
    current.winddir_deg +
    " degrees / " +
    current.winddir_compass;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  getCurrentWeather(lat, long);
  getWeather(lat, long);
}

function openCity(evt, cityName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
