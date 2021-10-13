$(document).ready(function () {
  var apiKey = "78daff65cdab37ad46fddfaac41188fb";
  searchHistory = [];
  searchHistoryDiv = $("#searchHistory");

  $("#searchButton").on("click", function (e) {
    e.preventDefault();

    var searchValue = $("#search-input").val();

    searchCurrentWeather(searchValue);

    addToHistory(searchValue);
  });

  function addToHistory(search) {
    searchHistory.push(search);
    console.log("searchhistory", searchHistory);

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderHistory();
  }

  function renderHistory() {
    let storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory === null) {
      return;
    } else {
      searchHistory = JSON.parse(storedHistory);
    }

    searchHistoryDiv.empty("");

    for (var i = searchHistory.length - 1; i >= 0; i--) {
      let li = $("<li>");
      let button = $("<button class='historyBtn'>");
      button.attr("data-name", searchHistory[i]);
      button.text(searchHistory[i]);
      li.append(button);
      searchHistoryDiv.append(li);
    }
  }

  searchHistoryDiv.on("click", "button", handleHistoryClick);

  function handleHistoryClick(event) {
    event.preventDefault();
    let search = $(this).attr("data-name");
    localStorage.setItem("button", search);

    searchCurrentWeather(search);
  }

  function searchCurrentWeather(search) {
    var weatherApiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      search +
      "&units=imperial" +
      "&APPID=" +
      apiKey;

    console.log("WEATHER API URL", weatherApiUrl);
    fetch(weatherApiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        $("#currentWeather").empty();
        console.log(data);

        var wind = $("<p>")
          .addClass("card-text")
          .text("Wind: " + data.wind.speed + "MPH");
        var cityName = $("<h2>").addClass("card-title").text(data.name);
        var temp = $("<p>")
          .addClass("card-text")
          .text("Temperature: " + data.main.temp + "F");
        var humidity = $("<p>")
          .addClass("card-text")
          .text("Humidity: " + data.main.humidity + "%");

        var col = $("<div>").addClass("col-md");
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");

        col.append(card);
        card.append(cardBody);
        cardBody.append(cityName, temp, wind, humidity);

        $("#currentWeather").append(col);

        var coords = {
          lat: data.coord.lat,
          lon: data.coord.lon,
        };

        searchFiveDay(coords);
      })
      .catch(function (err) {
        console.log(err);
      });

    function searchFiveDay(coords) {
      var fiveDayWeatherApiUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        coords.lat +
        "&lon=" +
        coords.lon +
        "&units=imperial" +
        "&APPID=" +
        apiKey;

      console.log("WERE IN 5 DAY SEARCH", coords);
      fetch(fiveDayWeatherApiUrl)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          $("#fiveDayWeather").empty();
          console.log(data);

          let UVIndex = $("<p class='btn'>").text(data.current.uvi);
          let UVElement = $("<div class='card-text'>").text("UV Index: ");

          console.log("UV INDEX", parseInt(UVIndex[0].innerHTML));

          if (parseInt(UVIndex[0].innerHTML) < 3) {
            UVIndex.addClass("btn-success");
          } else if (parseInt(UVIndex[0].innerHTML) < 7) {
            UVIndex.addClass("btn-warning");
          } else {
            UVIndex.addClass("btn-danger");
          }

          UVElement.append(UVIndex);
          $("#currentWeather").append(UVElement);

          for (var i = 1; i < 6; i++) {
            console.log("DAiLY DATA", data.daily[i]);

            let card = $("<div class='card col-md-2'>");
            let cardTitle = $("<div class='card-title'>").text(
              moment().add(i, "days").format("M/D/YY")
            );
            let cardBody = $("<div class='card-body'>");

            let temp = $("<div>").text(
              "Temperature: " + data.daily[i].temp.day + "F"
            );
            let humidity = $("<div>").text(
              "Humidity: " + data.daily[i].humidity + "%"
            );
            let wind = $("<div>").text(
              "Wind: " + data.daily[i].wind_speed + "MPH"
            );
            let icon = $(
              `<img src=http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png >`
            );

            cardBody.append(icon, temp, humidity, wind);
            card.append(cardTitle, cardBody);
            $("#fiveDayWeather").append(card);
          }
        });
    }
  }
});
