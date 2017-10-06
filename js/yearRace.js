//initialize variables
let isDisplayed = new Array();
let scatter = null;
var byRate = d3.selectAll("input[name='dataMode']:checked").attr("value") == "deathRate";

//Creates small multiples, from scratch
function runSmallMultiples(yearsToDisplay, clearList) {
    console.log("SmallMult: " + yearsToDisplay);
    byRate = (d3.selectAll("input[name='dataMode']:checked").attr("value")) == "deathRate";
    console.log(byRate);
    if (clearList) {
        isDisplayed.length = 0;
        d3.select(".sexBarChart").selectAll("svg").transition().duration(750).remove();
        d3.select(".yearRace").selectAll("svg").transition().duration(750).remove();
    }

    let yearsToDisplayArr = Array.from(yearsToDisplay);
    for (i = 0; i < yearsToDisplayArr.length; i++) {
        if (!(isDisplayed.includes(yearsToDisplayArr[i]))) {
            displayYearRace(yearsToDisplayArr[i]);
            displayYearSex(yearsToDisplayArr[i]);
            isDisplayed.push(yearsToDisplayArr[i]);
        }
    }
}


let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip label")
    .style("opacity", 0);


//Parts are written from scratch and parts are modified
//Creates individual charts for years and displays race and cause of death
function displayYearRace(inputYear) {
// setup the chart variables
    let marginYearRace = {top: 20, right: 20, bottom: 130, left: 40},
        width = 600 - marginYearRace.left - marginYearRace.right,
        height = 300 - marginYearRace.top - marginYearRace.bottom;

// setup scales and axis
    let xyr = d3.scale.ordinal().rangeRoundBands([0, width], .2);
    let yyr = d3.scale.linear().range([height, 0]);
    let yearRacexAxis = d3.svg.axis()
        .scale(xyr)
        .orient("bottom");

    let yearRaceyAxis = d3.svg.axis()
        .scale(yyr)
        .orient("left")
        .ticks(5);

    let rootYearRace = d3.select(".yearRace").append("svg")
        .attr("width", width + marginYearRace.left + marginYearRace.right)
        .attr("height", height + marginYearRace.top + marginYearRace.bottom)
        .append("g")
        .attr("transform",
            "translate(" + marginYearRace.left + "," + marginYearRace.top + ")");

    let contentYearRace = rootYearRace.append("g");
    let contextYearRace = rootYearRace.append("g");

    scatter = contentYearRace;

        let cValue = function (d) {
            return d["Race Ethnicity"];
        },
        colorYearRace = d3.scale.category10();

//load data
    d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function (error, yearRaceData) {

        year = inputYear + "";
        console.log(inputYear);
        yearRaceData = yearRaceData.filter(function (d) {
            return d["Year"] === year
        });

        yearRaceData.forEach(function (d) {
            d.Deaths = +d.Deaths;
        });

        xyr.domain((yearRaceData.map(function (d) {
            return d["Leading Cause"];
        })).sort());

        if (byRate) {
            yyr.domain([0, 500]);
        } else {
            yyr.domain([0, d3.max(yearRaceData, function (d) {
                return d.Deaths;
            })]);
        }

        // append axis to svg
        contextYearRace.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(yearRacexAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-2.5em")
            .attr("transform", "rotate(-90)")
            .style("font-size", "7px");

        contextYearRace.append("g")
            .attr("class", "y axis")
            .call(yearRaceyAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function () {
                if (byRate) {
                    return "Death Rate"
                } else {
                    return "Number of Deaths"
                }
            });

        //set scatter dots positions and encodings
        contentYearRace.selectAll(".dot").data(yearRaceData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) {
                return xyr(d["Leading Cause"])
            })
            .attr("cy", function (d) {
                if (byRate) {
                    return yyr(d3.mean(yearRaceData.filter(function (e) {
                            return e["Leading Cause"] === d["Leading Cause"] && e["Race Ethnicity"] === d["Race Ethnicity"]
                        }),
                        function (d) {
                            if (d["Death Rate"] == ".") {
                                return 0
                            } else {
                                return +d["Death Rate"]
                            }
                        }));
                } else {
                    return yyr(d3.sum(yearRaceData.filter(function (e) {
                            return e["Leading Cause"] === d["Leading Cause"] && e["Race Ethnicity"] === d["Race Ethnicity"]
                        }),
                        function (d) {
                            return +d.Deaths
                        }));
                }
            })
            .attr("r", 4)
            //sets colors
            .style("fill", function (d) {
                return colorYearRace(cValue(d));
            })
            //displays data value on hover
            .on("mouseover", function (d) {
                if (byRate) {
                    tooltip.html("<p>" + d["Leading Cause"] + "</p><p>" + d["Race Ethnicity"] + "<p>Number of Deaths: "
                        + d3.mean(yearRaceData.filter(function (e) {
                                return e["Leading Cause"] === d["Leading Cause"] && e["Race Ethnicity"] === d["Race Ethnicity"]
                            }),
                            function (d) {
                                if (d["Death Rate"] == ".") {
                                    return 0
                                } else {
                                    return +d["Death Rate"]
                                }
                            }) + "</p>")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .transition().duration(200).style("opacity", .75)
                } else {
                    tooltip.html("<p>" + d["Leading Cause"] + "</p><p>" + d["Race Ethnicity"] + "<p>Number of Deaths: "
                        + d3.sum(yearRaceData.filter(function (e) {
                                return e["Leading Cause"] === d["Leading Cause"] && e["Race Ethnicity"] === d["Race Ethnicity"]
                            }),
                            function (d) {
                                return +d.Deaths
                            }) + "</p>")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .transition().duration(200).style("opacity", .75)
                }
            })
            .on("mouseout", function (d) {
                tooltip.transition().duration(200).style("opacity", 0)
            })
            //detects selection and highlighting on click
            .on("click", function (d) {

                if (barHighlight && d["Leading Cause"] == barSelected) {
                    resetBarHighlight();
                } else {
                    resetBarHighlight();
                    highlightBar(d);
                }

                if (byRate) {
                    d3.select(".selections")
                        .append("g").html("<br>" + d["Leading Cause"] + " " + d["Year"] + "<br>" + d["Race Ethnicity"] + "<br>Number of Deaths: "
                        + d3.mean(yearRaceData.filter(function (e) {
                                return e["Leading Cause"] === d["Leading Cause"] && e["Race Ethnicity"] === d["Race Ethnicity"]
                            }),
                            function (d) {
                                if (d["Death Rate"] == ".") {
                                    return 0
                                } else {
                                    return +d["Death Rate"]
                                }
                            }) + "<br>")
                        .transition().duration(200)
                } else {
                    d3.select(".selections")
                        .append("g").html("<br>" + d["Leading Cause"] + " " + d["Year"] + "<br>" + d["Race Ethnicity"] + "<br>Number of Deaths: "
                        + d3.sum(yearRaceData.filter(function (e) {
                                return e["Leading Cause"] === d["Leading Cause"] && e["Race Ethnicity"] === d["Race Ethnicity"]
                            }),
                            function (d) {
                                return +d.Deaths
                            }) + "<br>")
                        .transition().duration(200)
                }
            });

        //create legend
        let legendYearRace = rootYearRace.selectAll(".legendYearRace")
            .data(colorYearRace.domain())
            .enter().append("g")
            .attr("class", "legendYearRace")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 10 + ")";
            });

        // draw legend colored rectangles
        legendYearRace.append("rect")
            .attr("x", width - 9)
            .attr("width", 9)
            .attr("height", 9)
            .style("fill", colorYearRace);

        // draw legend text
        legendYearRace.append("text")
            .attr("x", width - 11)
            .attr("y", 9)
            .attr("dy", ".0em")
            .style("text-anchor", "end")
            .style("font-size", "9px")
            .text(function (d) {
                return d
            });

        //add chart title
        headS = contextYearRace.append('rect').transition().duration(500)
                .attr('width', 60)
                .attr('height', 16)
                .attr('x', YRwidth / 2 -47)
                .attr('y', -15)
                .style('fill', '#F4D03F')
                .attr('opacity', .6);

          contextYearRace.append("text")
                .attr("x", YRwidth/2 )
                .attr("y", 0)
                .style("text-anchor", "end")
                .text(function(d) { return inputYear+""; });
    });
}


//From scratch
let scatterHighlight = false;
let scatterSelected = null;

//Highlights corresponding cause in the scatter plot
function highlightScatter(d) {
    scatterSelected = d.cause;
    scatterHighlight = true;

    scatter.selectAll(".dot")
        .filter(function(f) {
            return scatterSelected != f["Leading Cause"]
        })

        .transition()
        .duration(1000)
        .delay(5)
        .style("opacity",0.1);
}

//Removes highlight from scatter
function resetScatterHighlight() {
    scatterSelected = null;
    scatterHighlight = false;

    scatter.selectAll(".dot")
        .transition()
        .duration(1000)
        .delay(5)
        .style("opacity",1);
}

//Removes highlight from bar and scatter
function resetAllHighlight() {
    resetScatterHighlight();
    resetBarHighlight();
}

