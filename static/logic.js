//import data from flask
d3.json("/getData").then(function(data){
    console.log(data);
})

function createMap() {
  //get the data for the map from the flask app
  d3.json('/USmap').then((data) => {
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
      //get us map background
      map.geoData(anychart.maps['united_states_of_america']);
      map.container('map');

      //enable the tooltips and format them at once (still in anychart)
      series.tooltip().format(function(e){
         return "Number of Accidents: " +"\n"+
          e.getData("value")
      });
      //create legend
      map.legend(true);
      map.legend().itemsSourceMode('categories');
      //draw map
      map.draw();
      return map;
    });
  });
}
//put map on page
createMap();


function createScatter() {
  d3.json("/scatter").then((data) => {
    var ages = [];
    var injuries = [];

    for (const entry of data) {
        if(entry.age_youngest <1 || entry.age_youngest >100) continue;
        ages.push(entry.age_youngest);
        injuries.push(entry.numInjured);
    }

    var trace1 = {
      type: "scatter",
      mode: "markers",
      name: "Injuries vs Age Category",
      x: ages,
      y: injuries,
      line: {
        color: "#17BECF",
      },
    };

    var data1 = [trace1];
    var minAge = 1;
    var maxAge = 100;

    var layout = {
      xaxis: {
        range: [minAge, maxAge],
        type: "number",
        title: 'Age'
      },
      yaxis: {
        autorange: true,
        type: "linear",
        title: 'Number of Injuries'
      },
    };

    Plotly.newPlot("scatter", data1, layout);

  });
}
createScatter();

function createBar() {
  d3.json("/bar").then((data) => {
      console.log(data)
      var gender = [];
      var injuries = [];
  
      for (const entry of data) {
        let g 
        if(entry.gender=='F') g='Female'
        if(entry.gender=='M') g='Male'
        if(entry.gender=='U') g='Unknown'
          gender.push(g);
          injuries.push(entry.numInjured);
      }
  
    var trace1 = {
      x: gender,
      y: injuries,
      name: 'Accidents by Gender',
      type: 'bar'
    };
    
    var data1 = [trace1];
    
    Plotly.newPlot('bar', data1);
  
      });
  }
createBar();

function createPie() {
  //the pie data
  const data = [
      {
        label: 'water slide 23%',
        cases: 3530,
      },
      {
        label: 'coaster 18%',
        cases: 2748,
      },
      {
        label: 'spinning 13%',
        cases: 1988,
      },
      {
        label: 'go-kart 12%',
        cases: 1767,
      },
      {
        label: 'other attraction 10%',
        cases: 1477,
        },
      {
        label: 'water ride 8%',
        cases: 1163,
      },
      {
        label: 'cars & track rides 7%',
        cases: 1025,
      },
      {
        label: 'aquatic play 4%',
        cases: 465,
      },
      {
        label: 'play equipment 3%',
        cases: 403,
      },
      {
        label: 'pendulum 2%',
        cases: 318,
      },
    ];
    //colors for the pie chart
    const colors = [ '#caf1ff', '#a2e6ff', '#7bdbff', '#54d1ff', '#2dc6ff', '#05bcff', '#22bdf6', '#34b5e4', '#45add3', '#57a4c1'];

    var width = 771,
      chartWidth = 389,
      chartHeight = 389,
      height = 578,
      radius = Math.min(chartWidth, chartHeight) / 2,
      innerRadius = radius - radius + 50;



    var svg = d3.select('#donut-chart')
      .attr('width', width)
      .attr('height', height);

    var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    var pie = d3.pie().value(d => d.cases);

    var arcGroup = svg
      .append('g')
      .attr('transform', `translate(${chartWidth / 2},${chartHeight / 2})`)
      .attr('class', 'arc-group');

    arcGroup
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc-group')
      .append('path')
      .attr('class', 'arc')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i])
      .on('mousemove', () => {
        var {clientX, clientY} = d3.event;
        d3.select('.tooltip')
          .attr('transform', `translate(${clientX} ${clientY})`);
      })
      .on('mouseenter', d => {
        d3.select('.tooltip').append('text')
          .text(`${d.data.label} = ${d.data.cases} accidents`);
      })
      .on('mouseleave', () => d3.select('.tooltip text').remove());
    //create tooltip
    var tooltipGroup = svg
      .append('g')
      .attr('class', 'tooltip');


}
//put pie chart on page
createPie();
