window.onload = function() {
addDropDown();
DrawHistogram(DataCate,20);
//DrawBarchart("Type_1")
}

var barType = ["Type_1","Type_2","Generation","isLegendary","Color","hasGender",
"Egg_Group_1","Egg_Group_2","Body_Style"]
var binNum = 20;
var DataCate="Total";

function changeWidth(value){
	var changeValue = parseFloat(value)
	var width = parseInt(d3.selectAll(".bars").attr("width"));
	d3.selectAll(".bars").attr("width",changeValue)
}



function addDropDown(){
	d3.csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm1/pokemon_alopez247.csv",function(error,csvdata){
		console.log(csvdata[0])
		var first = "";
		for(var key in csvdata[0]){
			if(key=="Number"||key=="Name"){
				continue;
			}
			var li=document.createElement("li");
			li.setAttribute("aria-labelledby","dropdownMenu1");
			li.setAttribute("selected",true);
			var a=document.createElement("a");
			if(first==""){
				console.log(key)
				first = key;
			}
            a.innerHTML=key;
            a.href="#";
            li.appendChild(a);
            document.getElementById("drop").appendChild(li);
		}
		$("#dropdownMenu1").text("Total");
		$("#drop").children("li").click(function(e){
        $(this).addClass("active").siblings("li").removeClass("active");
			$("#dropdownMenu1").text($(this).text())
			drawChart($(this).text(),binNum);
		})

    });

}

function drawChart1(bin_num){
	d3.select("svg").html("");
	binNum = bin_num;
	DrawHistogram(DataCate);
}

function drawChart(Data_cate,bin_num){
	console.log(Data_cate);
	d3.select("svg").html("");
	DataCate = Data_cate;
	binNum = bin_num;
	if (barType.indexOf(Data_cate)!=-1){
		DrawBarchart(Data_cate)
	}else{
		DrawHistogram(DataCate);
	}
	
}

function DrawBarchart(DataCate){
	$(".slider").hide()
	var x = [];
	var y = [];
	d3.csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm1/pokemon_alopez247.csv",function(error,csvdata){  
	    if(error){  
	        console.log(error);  
	    }    

		var data = {};
	    for(var i = 0;i<csvdata.length;++i){
	    	if(csvdata[i][DataCate] == ""){
	    		continue;
	    	}
	    		if(csvdata[i][DataCate] in data){
	    			data[csvdata[i][DataCate]]+=1
	    		}else{
	    			data[csvdata[i][DataCate]] = 0;
	    		}
	    }

	    for(var key in data){
			x.push(key)
			y.push(data[key])
		}

		tempData = {x,y}
		console.log(tempData);
		
		var padding={top:50,right:50,bottom:50,left:50};
		var width = 1200;
		var height = 800;
		var max_height = 700;
		var svg = d3.select("svg")
					.attr("width",width)
					.attr("height",height)
					.attr("transform","translate("+(padding.left)+","+padding.top+")")

		var xScale = d3.scale.ordinal()
        .domain(tempData.x)
        .rangeRoundBands([0, width- padding.left - padding.right]);

        var yScale = d3.scale.linear()
        .domain([0, d3.max(tempData.y)+15])
        .range([max_height - padding.top - padding.bottom, 0]);

        var xAxis = d3.svg.axis()
		        .scale(xScale)
		        .orient("bottom");

		var yAxis = d3.svg.axis()
		        .scale(yScale)
		        .orient("left");

		svg.append("g")
	        .attr("class","axis")
	        .attr("transform", "translate(50," + (max_height - padding.bottom - padding.top) + ")")
	        .call(xAxis);

		svg.append("g")
		    .attr("class","axis")
		    .attr("transform", "translate(50,0)")
		    .call(yAxis);  

	 	//draw x axis text
		 svg.append("text")
	        .attr("text-anchor", "middle")
	        .attr("transform", "translate("+ (width/2) +","+(max_height)+")")
	 		.text(DataCate);


	 	svg.append("text")
	        .attr("text-anchor", "middle")
	        .text("Value")
	        .attr("transform", "translate("+ (10) +","+(max_height/2)+")rotate(-90)")

		var rectPadding = 10;
		svg.selectAll(".rect")
			.data(tempData.y)
			.enter()
			.append("rect")
			.attr("class","bar")
			.attr("x",function(d,i){
				return xScale(tempData.x[i])+ rectPadding*6;
			})
			.attr("y",function(d,i){
				return yScale(d)
			})
            .attr("width", xScale.rangeBand() - rectPadding*2 )
            .attr("height", function(d){
                return max_height - padding.top - padding.bottom - yScale(d);
            })
            .attr("fill","steelblue")
		    .on("mouseover",function(d,i){
	            d3.select(this).attr("opacity",0.5)
	            				.attr("x",xScale(tempData.x[i])+ rectPadding*6-5)
	            				.attr("width", xScale.rangeBand() - rectPadding*2+10 )
	            				.attr("height",  max_height - padding.top - padding.bottom - yScale(d)+10)
            					.attr("y", yScale(d)-10)
            					.attr("fill","red")

					svg.select("g")
	                    .append("text")
	                    .text(d)
					    .attr("x", xScale(tempData.x[i])+ rectPadding*3)
					    .attr("y",-1*(max_height-yScale(d)))
					    .attr("dy",80)
					    .attr("text-anchor", "middle")


	        })

	        .on("mouseout",function(d,i){;
            d3.select(this)
                .transition()
                .duration(500)
                .duration(500)
                .attr("fill","steelblue")
                .attr("opacity",1)
                .attr("x",xScale(tempData.x[i])+ rectPadding*6)
                .attr("width", xScale.rangeBand() - rectPadding*2 )
                .attr("height",  max_height - padding.top - padding.bottom - yScale(d))
            	.attr("y", yScale(d))

            d3.selectAll("text").remove();

            //draw x axis
            svg.append("g")
			  .attr("class","axis")
			  .attr("transform", "translate(50," + (max_height - padding.bottom - padding.top) + ")")
			  .call(xAxis);

			//draw y axis
			svg.append("g")
			  .attr("class","axis")
			  .attr("transform", "translate(50,0)")
			  .call(yAxis);

			 //draw x axis text
		 svg.append("text")
	        .attr("text-anchor", "middle")
	        .attr("transform", "translate("+ (width/2) +","+(max_height)+")")
	 		.text(DataCate);


	 	svg.append("text")
	        .attr("text-anchor", "middle")
	        .text("Value")
	        .attr("transform", "translate("+ (10) +","+(max_height/2)+")rotate(-90)")
		
		});


    })
}



function DrawHistogram(DataCate){
	$(".slider").show();
var formatCount = d3.format(",.0f");
var tempData = [];
d3.csv("https://raw.githubusercontent.com/wangTianAo/CSE564/master/hm1/pokemon_alopez247.csv",function(error,csvdata){  
    if(error){  
        console.log(error);  
    }    

    for(var i = 0;i<csvdata.length;++i){
    	tempData.push(parseFloat(csvdata[i][DataCate]));
    }
	console.log(tempData);

	var padding={top:20,right:20,bottom:20,left:20};
	var width = 1200-padding.left-padding.right;
	var height = 800-padding.top-padding.bottom;

	var x_scale = d3.scale.linear()
					.domain([d3.min(tempData),d3.max(tempData)])
					.range([0,width-100])

	var histogram = d3.layout.histogram()
					.range([d3.min(tempData),d3.max(tempData)])
					.bins(x_scale.ticks(binNum))
					.frequency(true)

	var data = histogram(tempData);
	console.log(data);
	// console.log(data);
	var svg = d3.select("svg")
	    .attr("width",width)
	    .attr("height",height)
	    .append("g")
	    .attr("transform","translate("+(padding.left*3)+","+padding.top+")")
	    

    var max_height = 600;
	var yMax = d3.max(data, function(d){return d.length});
	var yMin = d3.min(data, function(d){return d.length});

	var y_scale = d3.scale.linear()
			.domain([0,yMax])
			.range([max_height,0]);

	var xAxis = d3.svg.axis()
					.scale(x_scale)
					.orient("bottom")
					.tickFormat(d3.format(".0f"))
					.ticks(binNum)

	var yAxis = d3.svg.axis()
			    .scale(y_scale)
			    .orient("left")

	var bar = svg.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d){ 
    	return "translate(" + x_scale(d.x) + "," + y_scale(d.y) + ")"; 
    });

	bar.append("rect")
	    .attr("x", 1)
	    .attr("width", (x_scale(data[0].dx) - x_scale(0)) - 1)
	    .attr("height", function(d) { return max_height - y_scale(d.y); })
	    .attr("fill","steelblue")
	    .attr("class","bars")
	    .on("mouseover",function(d,i){
            d3.select(this).attr("opacity",0.5)
            	.attr("height",  max_height - y_scale(d.y)+10)
            	.attr("y",-10)
            	.attr("fill","red")

			bar.append("text")
                .attr("x", (x_scale(data[0].dx) - x_scale(0)) / 2)
                .attr("dy",-10)
                .attr("text-anchor", "middle")
                .text(function(d,j) { 
                	if(i==j)
                	return formatCount(d.y); }
                );
        })


        .on("mouseout",function(d,i){
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill","steelblue")
                .attr("opacity",1)
                .attr("height",  max_height - y_scale(d.y))
            	.attr("y",0)
            d3.selectAll("text").remove();

            //draw x axis
            svg.append("g")
			  .attr("class","axis")
			  .attr("transform", "translate(0," + max_height + ")")
			  .call(xAxis)
			 	
			//draw y axis
			svg.append("g")
			  .attr("class","axis")
			  .call(yAxis)

			//draw x axis text
			 svg.append("text")
		        .attr("text-anchor", "middle") 
		        .attr("transform", "translate("+ (width/2) +","+(max_height+3*padding.top)+")")
		        .text(DataCate);
 			
 			svg.append("text")
		        .attr("text-anchor", "middle")
		        .text("Value")
		        .attr("transform", "translate("+ (padding.left*(-2)) +","+(max_height/2)+")rotate(-90)")
		});

	//draw x axis
	svg.append("g")
	  .attr("class","axis")
	  .attr("transform", "translate(0," + max_height + ")")
	  .call(xAxis)
	  
	//draw y axis
	svg.append("g")
	  .attr("class","axis")
	  .call(yAxis)

	 //draw x axis text
	 svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(max_height+3*padding.top)+")")
 		.text(DataCate);

 	svg.append("text")
        .attr("text-anchor", "middle")
        .text("Value")
        .attr("transform", "translate("+ (padding.left*(-2)) +","+(max_height/2)+")rotate(-90)")
	
	}); 
}
