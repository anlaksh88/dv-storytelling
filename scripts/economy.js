async function init() {
    var data = await d3.csv("2017.csv");
    
    data.sort(function(a, b) {
        return a.Happiness_Score - b.Happiness_Score;
      });


  
    var margin = {top: 100, right: 100, bottom: 100, left: 200},
    width =  1000 - margin.left - margin.right,
    height = 2000 - margin.top - margin.bottom;

    var svg = d3.select("#chartArea2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height",height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

    // set the ranges
    var x = d3.scaleLinear()
          .range([0,width])
          .domain([0, d3.max(data, function(d) { return d.Economy_GDP; })]);
    var y = d3.scaleBand()
          .range([height, 0]).padding(0.1).domain(data.map(function(d) { return d.Country; }));
    
    var color = d3.scaleLinear().domain([0, data.length]).range(["blue", "green"]);

    // Define the div for the tooltip
    var div = d3.select("#chartArea2").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
          
  // append the rectangles for the bar chart
    svg.selectAll(".bar")
      .data(data)
      .enter().append("g").append("rect")
      .attr("class", "bar")
      .attr("x", 0 )
      .attr("width", function(d) { return x(d.Economy_GDP);})
      .attr("y", function(d) { return y(d.Country); })
      .attr("height", y.bandwidth())
      .style('fill', function(d, i) {
        return color(i);
      })
      .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html("Country: "+d.Country + "<br/> per capita income: "  + d.Economy_GDP + "<br/>Happiness Rank: " + d.Happiness_Rank)	
                .style("left", (d3.event.pageX - 300) + "px")		
                .style("top", (d3.event.pageY - 200) + "px");		
            })					
            .on("mouseout", function(d) {		
                div.transition()		
                .duration(500)		
                .style("opacity", 0);	
            });
  
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

      


	function createAnno(coords){

        //type=d3.annotationCalloutCircle;
        let type=d3.annotationLabel;
        let annoConnector="dot";
        let annoTitle = "Norway does not have highest per capita income. But it's income is significantly more than most countries."
        let annoText = "Norway ranks no 1 in happiness index"
        
        const thisAnno = [{
		note: {
			//label:annoText,
			title:annoTitle,
			wrap:250,
			align:"middle",
			},
			connector:{
				end:annoConnector
			},
			x:coords[0]-margin.left,
			y:coords[1]-margin.top,
			dx:30,
			dy:-30

		}];

		const makeThis = d3.annotation()
			.type(type)
			.annotations(thisAnno)
			.editMode(true);

		svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class","annotation-group")
      .call(makeThis);
  }
  svg.call(createAnno([100.5, 5]));
}

init();
