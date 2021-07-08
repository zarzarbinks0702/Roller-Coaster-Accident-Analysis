//import data from flask

d3.json('/accidents').then((accidents) => {
  console.log(accidents);
})
