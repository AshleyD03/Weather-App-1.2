// all current weather tags
var current1 = document.querySelector(".current1");
var currentImg = document.querySelector(".currentImg");
var currentDesc = document.querySelector(".currentDesc");
var currentTemp = document.querySelector(".currentTemp");
var currentWind = document.querySelector(".currentWind");

// button tags
var buttons = [];
for (var i = 0; i < 7; i++) {
  buttons.push(document.querySelector(".b" + i));
}

// all other weather tags
var header2 = document.querySelector(".header2");
var imgs = [];
var descs = [];
var temps = [];
var winds = [];
for (var i = 0; i < 8; i++) {
  imgs.push(document.querySelector(".i" + i));
  descs.push(document.querySelector(".p1" + i));
  temps.push(document.querySelector(".p2" + i));
  winds.push(document.querySelector(".p3" + i));
}

// date / day number 0-6 / day list 0-6
var date = new Date();
var dayCurrent = date.getDay();
var dayList = ["Sunday",
               "Monday",
               "Tuesday",
               "Wednesday",
               "Thursday",
               "Friday",
               "Saturday"]

// globalises variable that tells if imgs are allready present
// and if so, should be cleared 
var imgThere = false;

// On load up begin the program
window.addEventListener("load", function() {
    // Change Current Weather in HTML 
    geoBegin("current", dayCurrent)

    // Give buttons text and onclick attributes
    for (var i = 0; i < 7; i++) {
      buttons[i].innerHTML = dayList[(i+dayCurrent)%7];
      buttons[i].setAttribute("onclick", "geoBegin('forecast'," + (i + dayCurrent + 1)%7 + ")");
    }
    console.log("day current" + dayCurrent)
    geoBegin("forecast", 5);
});

// Begin geoBegin progress
// Event order: 1. check geo works
//              2. return lat and long array from function
//              3. begin 
function geoBegin(weatherType, dayChoice) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
          // Create lat & long values in array
          var chords = getLocation(position);

          // Begin dataTakeAndAdd
          dataTAA(chords, weatherType, dayChoice);
      });
    }
  }

// Return lat & long array
function getLocation(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    return [lat, long];
  }

// Begin dataTakeAndAdd
// Event order: 1. create url
//              2. take data from url
//              3. Decide which weatherType process
//              4. Re-write HMTL with data accordingly
async function dataTAA(chords, weatherType, dayChoice) {
    // create url
    var app_key = "f162c8307ad1d92efc9fa8afa90b7577";
    var app_id = "a048333e";
    var url = "http://api.weatherunlocked.com/api/" + weatherType +"/" + chords[0] + "," + chords[1] + "?app_id=" + app_id + "&app_key=" + app_key;
    
    //recieve data
    var response = await fetch(url);
    var data = await response.json();

    // weather currently happening
    if (weatherType == "current") {
        // Adds day
        current1.innerHTML = dayList[dayChoice] + " - Today";

        // Adds weather gif
        var weatherImg = document.createElement("img");
        var imgsrc = "image/weatherGif/" + data.wx_icon;
        weatherImg.setAttribute("src", imgsrc); weatherImg.setAttribute("class", "gif1");
        currentImg.appendChild(weatherImg);

        // Adds weather description
        currentDesc.innerHTML = data.wx_desc;
        currentTemp.innerHTML = data.temp_c + "°C";
        currentWind.innerHTML = "Wind Direction " + data.winddir_compass + "/" + data.winddir_deg + "° at " + data.windspd_kmh + "kts";
    }

    // weather for specific day 
    if (weatherType == "forecast"){

      header2.innerHTML = dayList[(dayChoice*dayChoice)%7];
      console.log((dayChoice*dayChoice)%7);
      
      if (imgThere) {
        for (var i = 0; i < 8; i++) {
          if (lastImgList[i] != "ignore") {
            imgs[i].removeChild(lastImgList[i]);
          }
          
        }
      }
      else {
          imgThere = true;
      }

      console.log(data);
      lastImgList = [];
      for (var i = 0; i < 8; i++) {
        var weatherImg = document.createElement("img");
        var imgsrc = "image/weatherGif/" + data.Days[dayChoice].Timeframes[i].wx_icon;
        weatherImg.setAttribute("src", imgsrc); weatherImg.setAttribute("class", "gif2")
        imgs[i].appendChild(weatherImg);
        lastImgList.push(weatherImg);

        descs[i].innerHTML = data.Days[dayChoice].Timeframes[i].wx_desc;

        temps[i].innerHTML = data.Days[dayChoice].Timeframes[i].temp_c + "°C";  
        
        winds[i].innerHTML = "Wind Direction " + data.Days[dayChoice].Timeframes[i].winddir_compass + "/" + data.Days[dayChoice].Timeframes[i].winddir_deg + "° at " + data.Days[dayChoice].Timeframes[i].windspd_kmh + "kts";

        var newData = (data.Days[dayChoice].Timeframes[i]);
      }
      
    }
}