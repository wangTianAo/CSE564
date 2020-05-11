window.onload = function() {

}

var url="http://127.0.0.1:5000";



function scatterPlotMatrixOriginal(){
	$.getJSON(url+'/scatterPlotMatrixOriginal',{
		},function(d){
			console.log(d)
			DrawScatterPlotMatrix(d.data,false)
		});
		return false;			
}

function scatterPlotMatrixRandomSampling(){
	$.getJSON(url+'/scatterPlotMatrixRandomSampling',{
		},function(d){
			console.log(d)
			DrawScatterPlotMatrix(d.data,false)
		});
		return false;			
}

function scatterPlotMatrixStratifiedSampling(){
	$.getJSON(url+'/scatterPlotMatrixStratifiedSampling',{
		},function(d){
			console.log(d)
			DrawScatterPlotMatrix(d.data,true)
		});
		return false;		
}

function scatterPlotStratifiedSamplingMDSCor(){
	$.getJSON(url+'/scatterPlotStratifiedSamplingMDSCor',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'MDS1','MDS2',true)
		});
		return false;		
}

function scatterPlotOriginalMDSCor(){
	$.getJSON(url+'/scatterPlotOriginalMDSCor',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'MDS1','MDS2',false)
		});
		return false;		
}


function scatterPlotRandomMDSCor(){
	$.getJSON(url+'/scatterPlotRandomMDSCor',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'MDS1','MDS2',false)
		});
		return false;		
}

function scatterPlotStratifiedSamplingMDSEuc(){
	$.getJSON(url+'/scatterPlotStratifiedSamplingMDSEuc',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'MDS1','MDS2',true)
		});
		return false;		
}

function scatterPlotOriginalMDSEuc(){
	$.getJSON(url+'/scatterPlotOriginalMDSEuc',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'MDS1','MDS2',false)
		});
		return false;		
}

function scatterPlotRandomMDSEuc(){
	$.getJSON(url+'/scatterPlotRandomMDSEuc',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'MDS1','MDS2',false)
		});
		return false;		
}

function ScatterplotforOriginalPCA(){
	$.getJSON(url+'/ScatterplotforOriginalPCA',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'PCA1','PCA2',false)
		});
		return false;
}

function ScatterplotforStratifiedSamplingPCA(){
	$.getJSON(url+'/ScatterplotforStratifiedSamplingPCA',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'PCA1','PCA2',true)
		});
		return false;
}

function ScatterplotforRandomPCA(){
	$.getJSON(url+'/ScatterplotforRandomPCA',{
		},function(d){
			console.log(d)
			DrawScatterPlot(d.data,'PCA1','PCA2',false)
		});
		return false;
}

// function GetHighestTopThreePCALoading(){
// 	$.getJSON(url+'/GetHighestTopThreePCALoading',{
// 	},function(d){
// 		console.log(d)
// 	});
// 	return false;
// }

function KMeansElbow(){
	$.getJSON(url+'/KMeansElbow',{
	},function(d){
		console.log(d)
		isKmeans = true;
		DrawLineChart(d.data,'KNumber','SS');
		isKmeans = false;
	});
	return false;
}

function ScreePlotOriginalPCA(){
	$.getJSON(url+'/ScreePlotOriginalPCA',{
	},function(d){
		console.log(d)
		DrawLineChart(d.data,'Component','Explained Variance Ratio');
	});
	return false;
}

function ScreePlotRandomSamplingPCA(){
	$.getJSON(url+'/ScreePlotRandomSamplingPCA',{
	},function(d){
		console.log(d)
		DrawLineChart(d.data,'Component','Explained Variance Ratio');
	});
	return false;
}

function ScreePlotStratifiedSamplingPCA(){
	$.getJSON(url+'/ScreePlotStratifiedSamplingPCA',{
	},function(d){
		console.log(d)
		DrawLineChart(d.data,'Component','Explained Variance Ratio');
	});
	return false;
}

function DrawScatterPlotMatrix(data,flag){
    size = 230,
    padding = 20;
	d3.select("svg").html("");
    var columnsDomain = {},
        columns = d3.keys(data[0]).filter(function(d) { return d !== "clusters"; }),
        n = columns.length;//Number of Columns
        //Domain based on columns
        columns.forEach(function(column) {
        columnsDomain[column] = d3.extent(data, function(d) { return d[column]; });
    });

    var xScale  = d3.scale.linear()
    .range([padding / 2, size - padding / 2]);

	var yScale  = d3.scale.linear()
	    .range([size - padding / 2, padding / 2]);

	var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom")
	    .ticks(6);

	var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left")
	    .ticks(6);

	xAxis.tickSize(size * n);
  	yAxis.tickSize(-size * n);

	var color = d3.scale.category10();

	var svg = d3.select("svg")
				.attr("width", size * n + padding+100)
                .attr("height", size * n + padding+100)
	  			.attr("transform", "translate(0," + padding + ")")

	svg.selectAll(".x.axis")
      .data(columns)
    .enter().append("g")
      .attr("class", "x axis1")
      .attr("transform", function(d, i) { return "translate(" + ((n - i - 1) * size+40) + ",0)"; })
      .each(function(d) { xScale.domain(columnsDomain[d]); d3.select(this).call(xAxis); });

  svg.selectAll(".y.axis")
      .data(columns)
    .enter().append("g")
      .attr("class", "y axis1")
      .attr("transform", function(d, i) { return "translate(40," + i * size + ")"; })
      .each(function(d) { yScale.domain(columnsDomain[d]); d3.select(this).call(yAxis); });

      var cell = svg.selectAll(".cell")
      .data(cross(columns, columns))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + ((n - d.i - 1) * size+40) + "," + d.j * size + ")"; })
      .each(plot);

	// Titles for the diagonal.
	  cell.filter(function(d) { return d.i === d.j; }).append("text")
	      .attr("x", padding+40)
	      .attr("y", padding)
	      .attr("dy", ".71em")
	      .text(function(d) { return d.x; });

	 function plot(p) {
                 var cell = d3.select(this);

                 xScale.domain(columnsDomain[p.x]);
                 yScale.domain(columnsDomain[p.y]);

	 			cell.append("rect")
                     .attr("class", "frame")
                     .attr("x", (padding / 2))
                     .attr("y", padding / 2)
                     .attr("width", size - padding)
                     .attr("height", size - padding);

                 cell.selectAll("circle")
                     .data(data)
                   .enter().append("circle")
                     .attr("cx", function(d) { return xScale(d[p.x]); })
                     .attr("cy", function(d) { return yScale(d[p.y]); })
                     .attr("r", 4)
                     .style("fill", function(d) { return color(d.clusters); });
                 }
}

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}

function DrawScatterPlot(data,xAxisName,yAxisName,flag){
	d3.select("svg").html("");
	var padding={top:20,right:20,bottom:20,left:20};
	var width = 1200;
	var height = 800;
	var x = []
	var y = []
	for(var i = 0;i<data.length;i++){
		x.push(data[i].x)
		y.push(data[i].y)
	}
	var svg = d3.select("svg")
				.attr("width",width+100)
				.attr("height",height+100)
	  			.attr("transform", "translate(0," + padding.top + ")")

	var xScale = d3.scale.linear()
				.domain([d3.min(x)-1,d3.max(x)+1])
				.range([0,width-100])

	var yScale = d3.scale.linear()
				.domain([d3.min(y)-1,d3.max(y)+1])
				.range([height-100,0])

	var cValue = function(d) { return d.Manufacturer;};
    var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	        .scale(xScale)
	        .orient('bottom')

	var yAxis = d3.svg.axis()
	        .scale(yScale)
	        .orient('left');

	// x-axis
	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height-100) + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(xAxisName);

    // y-axis
    svg.append("g")
	  .attr("class","y axis")
	  .call(yAxis)
	  .attr("transform", "translate(50,0)")
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yAxisName);

    //draw dots
    svg.selectAll(".dot")
    	.data(data)
    	.enter()
    	.append("circle")
    	.attr("class","dot")
    	.attr("r", 3.5)
    	.attr("cx", function(d) { return xScale(d.x) })
        .attr("cy", function(d) { return yScale(d.y) })
        .style("fill", function(d) { return color(d.cluster);})

    if(flag){
    	var legend = svg.selectAll(".legend")
	      				.data(color.domain())
	    				.enter().append("g")
	      				.attr("class", "legend")
	      				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
    	legend.append("rect")
		      .attr("x", width - 18)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", color);

		 // draw legend text
		 legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { return d;})
    }
}

var isKmeans = false;
function DrawLineChart(data,xAxisName,yAxisName){
	d3.select("svg").html("");
	var padding={top:20,right:20,bottom:20,left:20};
	var width = 1200;
	var height = 800;
	var x = []
	var y = []
	for(var i = 0;i<data.length;i++){
		x.push(data[i].x)
		y.push(data[i].y)
	}
	var svg = d3.select("svg")
				.attr("width",width+100)
				.attr("height",height+100)
	  			.attr("transform", "translate(0," + padding.top + ")")

	var xScale = d3.scale.linear()
					.domain([0,d3.max(x)])
					.range([0,width-100]);
	var yScale = d3.scale.linear()
					.domain([0,d3.max(y)])
					.range([height-100,0])


	var xAxis = d3.svg.axis()
	        .scale(xScale)
	        .orient('bottom')
	        .ticks(data.length)

	var yAxis = d3.svg.axis()
	        .scale(yScale)
	        .orient('left');

	var line = d3.svg.line()
			.x(function(d){ return xScale(d.x); })
			.y(function(d){ return yScale(d.y); })
			

	svg.append("path")
			.datum(data)
			.attr("class","line")
			.attr("d",line)
			.attr("transform", "translate(100,50)");

	var temp = 0;
	var flag = true;
	svg.selectAll(".dot")
        .data(data)
      	.enter().append("circle")
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale(d.x) })
        .attr("cy", function(d) { return yScale(d.y) })
        .attr("r", 5)
        .attr("transform", "translate(100,50)")
        .attr("fill",function(d){
        	if(isKmeans){
        		if(d.x==4){
					return "#DC143C";
        		}else{
        			return "#401400";
        		}
        	}else{
        		temp+=d.y;
	        	if(temp>0.75){
	        		if(flag){
	        			flag = false
	        			return "#DC143C";
	        		}else{
	        			return "#401400";
	        	}
	 
	        	}else{
	        		return "#401400";
	        	}
        	}
        	
        	
        })
        .on("mouseover",function(d,i){
        			d3.select(this).attr("opacity",0.5)
        							.attr("r",10)
					svg.append("text")
	                    .text(d.y.toFixed(3))
					    .attr("x", xScale((d.x+1)))
					    .attr("y", yScale(d.y)+30)
					    .attr("text-anchor", "middle")
					})
         .on("mouseout",function(d,i){
         	d3.select(this).attr("opacity",1)
         					.attr("r",5)
            d3.selectAll("text").remove();
            svg.append("g")
				  .attr("class","x axis")
				  .attr("transform", "translate(100," + (height-50) + ")")
				  .call(xAxis)
				  .append("text")
			svg.append("g")
			  .attr("class","y axis")
			  .call(yAxis)
			  .attr("transform", "translate(100,50)")

			 svg.append("text")
			        .attr("text-anchor", "middle")
			        .attr("transform", "translate("+ (width/2) +","+(height)+")")
			 		.text(xAxisName);
			 svg.append("text")
			        .attr("text-anchor", "middle")
			        .text(yAxisName)
			        .attr("transform", "translate("+ (20) +","+(height/2)+")rotate(-90)")
	        }

    )

	svg.append("g")
	  .attr("class","x axis")
	  .attr("transform", "translate(100," + (height-50) + ")")
	  .call(xAxis)
	  .append("text")

	//draw y axis
	svg.append("g")
	  .attr("class","y axis")
	  .call(yAxis)
	  .attr("transform", "translate(100,50)")

	 svg.append("text")
	        .attr("text-anchor", "middle")
	        .attr("transform", "translate("+ (width/2) +","+(height)+")")
	 		.text(xAxisName);
	 svg.append("text")
	        .attr("text-anchor", "middle")
	        .text(yAxisName)
	        .attr("transform", "translate("+ (20) +","+(height/2)+")rotate(-90)")
}