function createTable() {
d3.csv("reduced_data_frame.csv", function(err, rows){

  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
  }

  var headerNames = d3.keys(rows[0]);

  var headerValues = [];
  var cellValues = [];
  for (i = 0; i < headerNames.length; i++) {
    headerValue = [headerNames[i]];
    headerValues[i] = headerValue;
    cellValue = unpack(rows, headerNames[i]);
    cellValues[i] = cellValue;
  }



var data = [{
  type: 'table',
  columnwidth: [50,400,400,400,400,400,400,400],
  columnorder: [1,2,3,4,5,6,7,8],
  header: {
    values: headerValues,
    align: "center",
    line: {width: 1, color: 'rgb(50, 50, 50)'},
    fill: {color: ['#17becf']},
    font: {family: "Arial", size: 8, color: "white"}
  },
  cells: {
    values: cellValues,
    align: ["center", "center"],
    line: {color: "black", width: 1},
    fill: {color: ['#17becf', 'rgba(228, 222, 249, 0.65)']},
    font: {family: "Arial", size: 9, color: ["black"]}
  }
}]

var layout = {
  title: "Safer Parks Accident Dataset"
  
}

Plotly.newPlot('table', data, layout);
});
}
createTable();
