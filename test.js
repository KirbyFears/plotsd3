var mydata = [
  {
    "label": "a",
    "y": [1, 2, 5],
    "y2": [5, 5, 5],
  },
  {
    "label": "b",
    "y": [3, 2, 1],
    "y2": [1, 2, 1],
  },
  {
    "label": "c",
    "y": [3, 3, 1],
    "y2": [1, 1, 1],
  }
];

var mylabels = ["2y", "5y", "10y"];

var zerodata = [];
for (i=0; i<mylabels.length; i++) {
  zerodata.push(0);
}

var div_select = d3.select("#div_select");

div_select
  .append("p")
  .text("Choose data to plot");

div_select
  .append("select")
  .attr("multiple", "multiple")
  .attr("id", "select_data")
  .attr("style", "width: 400px")
  .selectAll("option")
  .data(mydata, function(d) { return d.label; })
  .enter()
  .append("option")
  .text(function(d, i) { return d.label; })
  .attr("value", function(d, i) { return d.label; });

$("#select_data").change(function () {
  selection_changed(this);
});

$("#select_data").select2();

var plotdata;
var plotdata2;

function selection_changed(select_element) {
  selected = $(select_element).val();
  plotdata = zerodata.slice(); // done to copy by values
  plotdata2 = zerodata.slice();
  for (i=0; i<mydata.length; i++) {
    current_label = mydata[i].label;
    if (selected.indexOf(current_label)>=0) {
      for (j=0; j<mylabels.length; j++) {
        plotdata[j] += mydata[i].y[j];
        plotdata2[j] += mydata[i].y2[j];
      }
    }
  }
  update_plot();
}

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var xScale = d3.scaleBand().rangeRound([0, width]).paddingOuter(0.1).paddingInner(0.1).domain(mylabels);
var xScale2 = d3.scaleBand().rangeRound([0, width]).paddingOuter(0.1).paddingInner(0.1).domain(mylabels);
var yScale = d3.scaleLinear().rangeRound([height, 0]).domain([0, d3.max(zerodata)]);

var plotAreaSelection = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

var group_xAxis = plotAreaSelection.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var group_yAxis = plotAreaSelection.append("g")
  .attr("class", "axis axis--y")
  .call(yAxis.ticks(10, "s"));

var group_bars2 = plotAreaSelection.append("g").attr("id", "bars_group2");
var group_bars = plotAreaSelection.append("g").attr("id", "bars_group");


function draw(data, data2) {
  yScale.domain([0, Math.max(d3.max(data), d3.max(data2))]);

  group_yAxis
    .transition()
    .duration(200)
    .call(function(group) {
      group.call(yAxis);
    })

  var selection_bars2 = group_bars2.selectAll(".bar2")
    .data(data2, function(d, i) { return mylabels[i]; });

  selection_bars2
    .transition().duration(200)
    .attr("y", function(d, i) { return yScale(d); })
    .attr("width", xScale2.bandwidth())
    .attr("height", function(d, i) { return height - yScale(d); });

  selection_bars2
    .enter().append("rect")
      .attr("class", "bar2")
      .attr("x", function(d, i) { return xScale2(mylabels[i]); })
      .transition().duration(200)
      .attr("y", function(d, i) { return yScale(d); })
      .attr("width", xScale2.bandwidth())
      .attr("height", function(d, i) { return height - yScale(d); });

  selection_bars2
    .exit().remove();

  var selection_bars = group_bars.selectAll(".bar")
    .data(data, function(d, i) { return mylabels[i]; });

  selection_bars
    .transition().duration(200)
    .attr("y", function(d, i) { return yScale(d); })
    .attr("width", xScale.bandwidth()*0.5)
    .attr("height", function(d, i) { return height - yScale(d); });

  selection_bars
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) { return xScale(mylabels[i]) + xScale.step() / 4; })
      .transition().duration(200)
      .attr("y", function(d, i) { return yScale(d); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d, i) { return height - yScale(d); });

  selection_bars
    .exit().remove();

}

function update_plot() {
  draw(plotdata, plotdata2);
}

draw(zerodata, zerodata);
