function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open(
    'GET',
    'https://www.quandl.com/api/v3/datasets/OPEC/ORB.json?api_key=WM1sPNxVq71tRxyQdsfv',
    true
  );

  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

var groupByYear = function(response) {
   var parsedResponse = JSON.parse(response); 
   var data = parsedResponse.dataset.data;
   var startDate1 = new Date('2016');
   var greaterThan2016 = [];

   for (var i = 0; i < data.length; i++) {
      var date = new Date(data[i][0]);
      var value = data[i][1];
      
      if (date >= startDate1) {
         greaterThan2016.push([date, value]);
      }
   }   
   
   var groupsObject = greaterThan2016.reduce(function(acc, currentValue) {
      var date = new Date(currentValue[0]);
      var year = date.getFullYear();
      var value = currentValue[1];

      var currentYearValues = acc[year] || [];
      currentYearValues.push(value);
      acc[year] = currentYearValues;

      return acc;
   }, {});

   var years = Object.keys(groupsObject);

   for (var i = 0; i < years.length; i++) {
      var year = years[i];
      var yearvalues = groupsObject[year];
      
      let sum = yearvalues.reduce((previous, current) => current += previous);
      let avgfinal = sum / yearvalues.length;
      console.log('Year: ', year);
      console.log('Average: ', avgfinal);
      
       }
}

loadJSON(groupByYear);
