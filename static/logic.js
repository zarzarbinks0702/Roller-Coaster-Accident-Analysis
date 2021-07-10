//import data from flask

d3.json("/getData").then(function(data){
    console.log(data);
})

function createMap() {
  d3.json('/map').then((data) => {
    //used anychart docs for this section
    anychart.onDocumentReady(function () {
      var map = anychart.map();
      var accData = anychart.data.set(data);

      var series = map.choropleth(accData);
      series.geoIdField('id');

      //set colors
      ordinalScale = anychart.scales.ordinalColor([
          {less: 20},
          {from: 20, to: 50},
          {from: 50, to: 250},
          {from: 250, to: 1000},
          {greater:1000}
      ]);
      ordinalScale.colors(['#daf8e3','#97ebdb', '#00c2c7', '#0086ad', '#005582']);

      series.colorScale(ordinalScale);

      map.geoData(anychart.maps['united_states_of_america']);
      map.container('map');

      // enable the tooltips and format them at once
      series.tooltip().format(function(e){
         return "Number of Accidents: " +"\n"+
          e.getData("value")
      });
      map.legend(true);
      map.legend().itemsSourceMode('categories');
      map.draw();
    })
  });
}
createMap();
