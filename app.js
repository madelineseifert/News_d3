var svgWidth = 900;
var svgHeight = 440;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select("#scatter")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data.csv", function(err, cdcData) {
  if (err) throw err;

// convert the integers to strings?
  cdcData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });


  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([8, d3.max(cdcData, function(data) {
    return +data.poverty *1.1;
  })]);
  yLinearScale.domain([3, d3.max(cdcData, function(data) {
    return +data.healthcare * 1.15; 
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    // .offset([80, -60])
    .html(function(data) {
      var state = data.abbr;
      var poverty = +data.poverty;
      var healthcare = +data.healthcare;
      return (data.state + "<br> In Poverty: " + poverty + "%<br> Lack Healthcare: " + healthcare + "%");
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(cdcData)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        return xLinearScale(data.poverty);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.healthcare);
      })
      .attr("r", "10")
      .attr("class", "circle")
      .on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  // add the state abbreviations
  chart.selectAll("text")
      .data(cdcData)
      .enter().append("text")
        .attr("x", function(data){
          console.log(xLinearScale(data.poverty));
          return xLinearScale(data.poverty)-7;  //move them to the center of the circle
        })
        .attr("y", function(data){
          return yLinearScale(data.healthcare)+4  ;
        })
        .text(function(data){
          return data.abbr;
        })
        .attr("class", "circleText")
        // add listeners on text too since it is on top of circle
        .on("mouseover", function(data) {
          toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacking Healthcare (%)");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Percentage in Poverty");
});
