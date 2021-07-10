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
      series.colorScale(anychart.scales.linearColor('#97ebdb','#005582'));

      map.geoData(anychart.maps['united_states_of_america']);
      map.container('map');

      // enable the tooltips and format them at once
      series.tooltip().format(function(e){
         return "Number of Accidents: " +"\n"+
          e.getData("value")
      });
      map.legend(true);
      map.draw();
    })
  });
}
createMap();
