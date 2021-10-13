$(document).ready(function () {
    var apiKey = "78daff65cdab37ad46fddfaac41188fb";

    $("#searchButton").on('click', function (e) {
        e.preventDefault();

        var searchValue = $("#search-input").val();


        searchCurrentWeather(searchValue)

    });


    function searchCurrentWeather(searchValue) {
        
        var weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial" + "&APPID=" + apiKey;

        console.log("WEATHER API URL", weatherApiUrl)
        fetch(weatherApiUrl)
            .then(function (res) {
                return res.json();
            }).then(function (data) {
                $("#currentWeather").empty();
                console.log(data);

                var wind = $("<p>").addClass("card-text").text("Wind: " + data.wind.speed + "MPH")
                var cityName = $("<h2>").addClass("card-title").text(data.name);
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + "F");
                var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");

                var col = $("<div>").addClass("col-md");
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");

                col.append(card);
                card.append(cardBody);
                cardBody.append(cityName, temp, wind, humidity);

                $("#currentWeather").append(col);

                var coords = {
                    lat: data.coord.lat,
                    lon: data.coord.lon
                }

                searchFiveDay(coords);


            }).catch(function (err) {
                console.log(err)
            })

            function searchFiveDay(coords){

                var fiveDayWeatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coords.lat + "&lon=" + coords.lon + "&units=imperial" + "&APPID=" + apiKey;  


                console.log("WERE IN 5 DAY SEARCH", coords)
                fetch(fiveDayWeatherApiUrl)
                    .then(function(res) {
                        return res.json(); 
                    }).then(function (data) {
                        $("#fiveDayWeather").empty();
                        console.log(data);

                        
                    })
            }

    }












})