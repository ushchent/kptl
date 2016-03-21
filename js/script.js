var jsonData;

function formatDate(number) {
  return (number < 10) ? "0" + number : number;
}

function addTolist(data, i, results) {
        var year = data.getFullYear();
        var month = i;
        var day = data.getDate();
        results.push(year + "-" + (formatDate(month + 1)) + "-" + formatDate(day));
        return results;
}

function pushDates(startMonth, step, year, weekday, everyWeekDay, results) {
  for (var i = startMonth; i < 12; i += step) {
   var data = new Date(year, i, 1);

    var firstWeekDayOfMonth = data.getDay();
       
    if (firstWeekDayOfMonth == weekday && everyWeekDay == 1) {
      addTolist(data, i, results);
      
    } else if (weekday < firstWeekDayOfMonth) {
      var range = firstWeekDayOfMonth - weekday;
      
      var firstDayFound = (data.getDate() + 7) - range;
      
      firstDayFound = (everyWeekDay != 1) ? firstDayFound + (7 * (everyWeekDay - 1)) : firstDayFound;
      
      data.setDate(firstDayFound);
      addTolist(data, i, results)
      
    } else if (weekday > firstWeekDayOfMonth) {
      firstDayFound = data.getDate() + weekday - firstWeekDayOfMonth;
      
      firstDayFound = (everyWeekDay != 1) ? firstDayFound + (7 * (everyWeekDay - 1)) : firstDayFound;
     

      data.setDate(firstDayFound);
      
      addTolist(data, i, results)
    } else if (firstWeekDayOfMonth == weekday && everyWeekDay > 1) {
      firstDayFound = data.getDate();
      firstDayFound = firstDayFound + (7 * (everyWeekDay - 1));
      data.setDate(firstDayFound)
      addTolist(data, i, results); 
      
    }
    }
}

function findDates(year, weekday, everyWeekDay, everyQuarterMonth) {
  var results = [];
  
  if (everyQuarterMonth == undefined) {
    var startMonth = 0;
    var step = 1;
    pushDates(startMonth, step, year, weekday, everyWeekDay, results)
  } else {
    startMonth = everyQuarterMonth - 1;
    step = 3;
    pushDates(startMonth, step, year, weekday, everyWeekDay, results)
  }
  return results;
}

var button = document.getElementById("calc");
button.onclick = function() {
  
  document.getElementById("output").innerHTML = "";
  var year = document.getElementById("year").value;
  var weekDay = document.getElementById("weekDay").value;
  var everyWeekDay = document.getElementById("everyWeekDay").value;
  var everyQuarterMonth = document.getElementById("everyQuarterMonth").value;
  
  var quarter = (everyQuarterMonth == "") ? undefined : parseInt(everyQuarterMonth);
  
  var dates = findDates(parseInt(year), parseInt(weekDay), parseInt(everyWeekDay), quarter);
  
  var target = document.getElementById("output");
  var list = document.createElement("ul");
  target.appendChild(list);
  
  for (var i = 0; i < dates.length; i++) {
    var listItem = document.createElement("li");
    var itemText = document.createTextNode(dates[i]);
    listItem.appendChild(itemText);
    list.appendChild(listItem);
    
  }
};


window.onload = function() {
  var today = new Date();

  var request = new XMLHttpRequest();
  var gallery = document.getElementById("gallery");

  request.onreadystatechange = function() {
      if (request.readyState === 4) {
          jsonData = JSON.parse(request.responseText);
          jsonData.sort(function(a, b) { 
            return new Date(a.data) - new Date(b.data);
          });
          var aktualno = jsonData.filter(function(b) { if (new Date(b.data) >= today) {return b; }; });

          var nearest = [];
          var firstItem = aktualno.shift();
          nearest.push(firstItem);
          
          var headerTime = document.getElementById("nearest");
          var nearestTimeText = document.createTextNode(firstItem.data);
          headerTime.appendChild(nearestTimeText);
          
          var plus = aktualno.filter(function(d) { return d.data == firstItem.data; });
          console.log(plus.length);
          
          var final = nearest.concat(plus);
          console.log(final.length);
          
          
          for (var i = 0; i < final.length; i++) {
              var face = document.createElement("div");
              var image = document.createElement("img");
              image.setAttribute("src", "img/" + final[i].photo);
              image.setAttribute("title", final[i].fio + " - " + final[i].data);
              
              var organHeader = document.createElement("h3");
              var organText = document.createTextNode(final[i].organ);
              organHeader.appendChild(organText);
              
              var positionPar = document.createElement("p");
              var positionText = document.createTextNode(final[i].dolzhnost);
              positionPar.appendChild(positionText);
              
              var fioPar = document.createElement("p");
              var fioText = document.createTextNode(final[i].fio);
              fioPar.appendChild(fioText);
              
              var timePar = document.createElement("p");
              var timeText = document.createTextNode(final[i].vremia);
              timePar.appendChild(timeText);

              var telPar = document.createElement("p");
              var telText = document.createTextNode(final[i].tel);
              telPar.appendChild(telText);
              
              face.appendChild(organHeader);
              
              face.appendChild(image);
              face.appendChild(fioPar);

              face.appendChild(positionPar);
              face.appendChild(timePar);
              face.appendChild(telPar);
              gallery.appendChild(face);
          }

        };
      };
    request.open("GET", "data/data.json", true);
    request.send(null);
}
