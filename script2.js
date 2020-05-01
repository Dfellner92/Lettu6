var apiKey = "4e5dbe7db2b5e9c8b47fa40b691443d5";
var city = "";
var currentConditions = "https://api.openweathermap.org/data/2.5/weather?appid=";
var fiveDay = "https://api.openweathermap.org/data/2.5/forecast?4e5dbe7db2b5e9c8b47fa40b691443d5q={city name},{country code}";

$(document).ready(function() {
  $("#search-input").on("click", function(event) {
    event.preventDefault();
    clear()
    var userInput = $("#city-search").val()
    console.log(userInput)
    getWeather(userInput)
  
  })
})

function clear() {
    $("#current-weather").empty();
    $("#five-day").empty();
  }

function getWeather(cityName) {
  var apiCall = ""

  if (cityName !== "") {
    apiCall = currentConditions + apiKey + "&q=" + cityName
  } else {
    apiCall = currentConditions + apiKey + "&q=" + city
  }

  $.ajax({
    url: apiCall,
    method: "GET"
  }).then(function(response) {
    console.log(response)
    var feelslike = response.main.temp
    feelslike = (feelslike - 273.15) * 1.8 + 32
    feelslike = Math.floor(feelslike)
    var city = response.name;
    var humidity = response.main.humidity;
    var wind = response.wind.speed;
    $("#current-weather").append('<div class="city">' + city + " " + moment().format("MM/DD/YYYY") + '<span class="test"></span>' + "</div>")
        if (response.weather[0].main === "Clouds") {
            $(".test").html(' <i class="fa fa-cloud"></i>')
        };
        if (response.weather[0].main === "Clear") {
            $(".test").html(' <i class="fas fa-sun"></i>')

        }
    $("#current-weather").append("<div>Temperature(F): " + feelslike + "</div>")
    $("#current-weather").append("<div>Humidity: " + humidity + " %</div>")
    $("#current-weather").append("<div>Wind Speed: " + wind + " MPH</div>")
    $("#list").prepend('<button type="button" class="btn btn-secondary btn-lg btn-block">' + city + '</button>')
    $('.btn').each(function(){  
        var searchHistory = 'latest item';
        var searchEntry = (('MMMM Do YYYY, h:mm:ss a'), city);
        localStorage.setItem(searchHistory, searchEntry);  
        return searchEntry;      
    });

    fiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

     $.ajax({
      url: fiveDay,
      method: "GET"
    }).then(function(response) {
      console.log(response)

      var averageTemp = 0
      var previousdate = ""
      var count = 0
      var results = 0
      previousdate = moment().format("MM/DD/YYYY")
      for (let index = 0; index < response.list.length; index++) {
        var currentDate = moment(response.list[index].dt, "X").format(
          "MM/DD/YYYY"
        )
        var temp = response.list[index].main.temp
        temp = (temp - 273.15) * 1.8 + 32
        temp = Math.floor(temp)
        console.log(currentDate)
        console.log(temp)

        if (previousdate === currentDate) {
          averageTemp = averageTemp + temp
          count++
          previousdate = currentDate
        } else {
          results = averageTemp / count
          results = Math.floor(results)
          console.log("results:", results)
          var card = $("<div class = 'card m-1 p-1 col-sm-2'>")

          var div1 = $("<div class= 'card-header'>")
          div1.append(currentDate)
          card.append(div1)

          var div2 = $("<div class= 'card-body'>")
          div2.append("Temp: " + results)
          card.append(div2)

          $("#five-day").append(card)

          count = 0
          averageTemp = 0
          previousdate = currentDate



         
        }
      }
    })
  })
}