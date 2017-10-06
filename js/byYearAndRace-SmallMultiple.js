// this section is basically from scratch this sets up all the line for the races
//
var parseDate = d3.time.format("%Y").parse;

var deathtotalsbyYearRace;

var headS;

var YRmargin = {top: 20, right: 20, bottom: 20, left: 40},
    YRwidth = 600 - YRmargin.left - YRmargin.right,
    YRheight = 300 - YRmargin.top - YRmargin.bottom;

var xry = d3.time.scale()
    .range([0, YRwidth]);

var yry = d3.scale.linear()
    .range([YRheight, 0]);

var xAxisRaceYear = d3.svg.axis()
    .scale(xry)
    .orient("bottom");

var yAxisRaceYear = d3.svg.axis()
    .scale(yry)
    .orient("left")
    .ticks(6);

var blackline = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.black); });

var asianline = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.asian); });

var whiteline = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.white); });

var otherline = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.other); });

var unknownline = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(d.values.unknown); });

var hispanicline = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.hispanic); });

var blacklinerate = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.blackrate); });

var asianlinerate = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.asianrate); });

var whitelinerate = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.whiterate); });

var otherlinerate = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.otherrate); });

var unknownlinerate = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(d.values.unknownrate); });

var hispaniclinerate = d3.svg.line()
    .x(function(d) { return xry(d.year); })
    .y(function(d) { return yry(+d.values.hispanicrate); });



// from scratch - this sets up the line charts for year and race
function multipleYearRace(deathcause) {

    var rootRaceYear = d3.select(".yearRaceMultiple").append("svg")
        .attr("width", YRwidth + YRmargin.left + YRmargin.right)
        .attr("height", YRheight + YRmargin.top + YRmargin.bottom)
        .append("g")
        .attr("transform", "translate(" + YRmargin.left + "," + YRmargin.top + ")");

    var contentRaceYear = rootRaceYear.append("g")

    d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function (error, deathdata) {

        var deathdata = deathdata.filter(function (e) {
            return e["Leading Cause"] === deathcause;
        });

        formatYearRaceData(deathdata);

        xry.domain([
            d3.min(deathtotalsbyYearRace, function (s) {
                return s.values[0].year;
            }),
            d3.max(deathtotalsbyYearRace, function (s) {
                return s.values[s.values.length - 1].year;
            })
        ]);

        contentRaceYear.selectAll(".whiteline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("width", YRwidth + YRmargin.left + YRmargin.right)

            .attr("class", "whiteline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathrace]);
                return whiteline(d.values);
            })
            .style("stroke", "steelblue")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>White Non-Hispanic Number of Deaths:  " + d.maxdeathwhite + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            // display total data in a UI box for user's review
            .on("click", function (d) {
                d3.selectAll("span").remove()
                // d3.select(".results").append("p").html("<br>" + deathcause +
                //     "<br>Black Non-Hispanic Number of Deaths: " +  d.maxdeathblack + "<br>");
                d3.select(".results").append("span").html("<br>" + deathcause +
                    "<br>White Non-Hispanic Number of Deaths: " +  d.maxdeathwhite + "<br>")
            });


        contentRaceYear.selectAll(".blackline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("class", "blackline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathrace]);
                return blackline(d.values);
            })
            .style("stroke", "orange")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Black Non-Hispanic Number of Deaths: " + d.maxdeathblack + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
           
            // display total data in a UI box for user's review
            .on("click", function (d) { 
                d3.selectAll("span").remove()
                d3.select(".results").append("span").html("<br>" + deathcause +
                    "<br>Black Non-Hispanic Number of Deaths: " +  d.maxdeathblack + "<br>")
            });


        contentRaceYear.selectAll(".hispanicline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("class", "hispanicline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathrace]);
                return hispanicline(d.values);
            })
            .style("stroke", "violet")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Hispanic Number of Deaths: " + d.maxdeathhispanic + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            // display total data in a UI box for user's review
            .on("click", function (d) {
                d3.selectAll("span").remove()
                d3.select(".results").append("span").html("<br>" + deathcause +
                    "<br>Hispanic Number of Deaths: " +  d.maxdeathhispanic + "<br>")
                // d3.selectAll("span").style("font-weight","bold");
            });




        contentRaceYear.selectAll(".asianline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("class", "asianline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathrace]);
                return asianline(d.values);
            })
            .style("stroke", "green")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Asian and Pacific Islander Number of Deaths: " + d.maxdeathasian + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
           
            // display total data in a UI box for user's review
            .on("click", function (d) {
                d3.selectAll("span").remove()
                d3.select(".results").append("span").html("<br>" + deathcause +
                    "<br>Asian and Pacific Islander Number of Deaths: " +  d.maxdeathasian + "<br>")

            });

        contentRaceYear.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + YRheight  + ")")
            .call(xAxisRaceYear);

        headS = contentRaceYear.append('rect').transition().duration(500).attr('width', 150)
                .attr('width', 460)
                .attr('height', 16)
                .attr('x', YRwidth / 4 - 130)
                .attr('y', -20)
                .style('fill', '#F4D03F')
                .attr('opacity', .3);

        contentRaceYear.append("text")
            .data(deathtotalsbyYearRace)
            .attr("x", YRwidth/2 - 10)
            .attr("y", -9)
            .style("text-anchor", "end")
            // .style("border: solid 6px")
            .text(function(d) { return d.cause; });


        contentRaceYear.append("g")
            .attr("class", "y axis")
            .call(yAxisRaceYear)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", "-4.0em");

    });
}



// from scratch this change the charts to by death rate
function multipleYearRaceRate(deathcause) {
    var rootRaceYearRate = d3.select(".yearRaceMultiple").append("svg")
        .attr("width", YRwidth + YRmargin.left + YRmargin.right)
        .attr("height", YRheight + YRmargin.top + YRmargin.bottom)
        .append("g")
        .attr("transform", "translate(" + YRmargin.left + "," + YRmargin.top + ")");

    var contentRaceYear = rootRaceYearRate.append("g")

    d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function (error, deathdata) {

        var deathdata = deathdata.filter(function (e) {
            return e["Leading Cause"] === deathcause;
        });

        formatYearRaceData(deathdata);

        xry.domain([
            d3.min(deathtotalsbyYearRace, function (s) {
                return s.values[0].year;
            }),
            d3.max(deathtotalsbyYearRace, function (s) {
                return s.values[s.values.length - 1].year;
            })
        ]);

        contentRaceYear.selectAll(".whiteline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("width", YRwidth + YRmargin.left + YRmargin.right)

            .attr("class", "whiteline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathracerate]);
                return whitelinerate(d.values);
            })
            .style("stroke", "steelblue")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>White Non-Hispanic Death Rate:  " + d.maxdeathwhiterate + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            // display total data in a UI box for user's review
            .on("click", function (d) {
                // d3.select(".selections").append("g").html("<br>" + deathcause + 
                //     "<br>White Non-Hispanic Death Rate: " +  d.maxdeathwhiterate + "<br>")
                d3.selectAll("span").remove()
                d3.select(".results").append("span").html("<br>" + deathcause + 
                    "<br>White Non-Hispanic Death Rate: " +  d.maxdeathwhiterate + "<br>")
            });

        contentRaceYear.selectAll(".blackline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("class", "blackline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathracerate]);
                return blacklinerate(d.values);
            })
            .style("stroke", "orange")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Black Non-Hispanic Death Rate: " + d.maxdeathblackrate + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            // display total data in a UI box for user's review
            .on("click", function (d) {
                // d3.select(".selections").append("g").html("<br>" + deathcause +
                //     "<br>Black Non-Hispanic Death Rate: " +  d.maxdeathblackrate + "<br>")
                d3.selectAll("span").remove()
                d3.select(".results").append("span").html("<br>" + deathcause +
                    "<br>Black Non-Hispanic Death Rate: " +  d.maxdeathblackrate + "<br>")

            });


        contentRaceYear.selectAll(".hispanicline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("class", "hispanicline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathracerate]);
                return hispaniclinerate(d.values);
            })
            .style("stroke", "violet")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Hispanic Death Rate: " + d.maxdeathhispanicrate + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            // display total data in a UI box for user's review
            .on("click", function (d) {
                // d3.select(".selections").append("g").html("<br>" + deathcause +
                //     "<br>Hispanic Death Rate: " +  d.maxdeathhispanicrate + "<br>")
                d3.selectAll("span").remove()
                d3.select(".results").append("span").html("<br>" + deathcause +
                    "<br>Hispanic Death Rate: " +  d.maxdeathhispanicrate + "<br>")
            });




        contentRaceYear.selectAll(".asianline")
            .data(deathtotalsbyYearRace)
            .enter().append("path")
            .attr("class", "asianline line")
            .attr("d", function (d) {
                yry.domain([0, d.maxdeathracerate]);
                return asianlinerate(d.values);
            })
            .style("stroke", "green")
            .style("stroke-width", "3px")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Asian and Pacific Islander Death Rate: " + d.maxdeathasianrate + "</p>")

                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            // display total data in a UI box for user's review
            .on("click", function (d) {
                // d3.select(".selections").append("g").html("<br>" + deathcause +
                //     "<br>Asian and Pacific Islander Death Rate: " +  d.maxdeathasianrate + "<br>")
                d3.selectAll("span").remove()
                d3.select(".results").append("span").html("<br>" + deathcause +
                    "<br>Asian and Pacific Islander Death Rate: " +  d.maxdeathasianrate + "<br>")
            });
        

        contentRaceYear.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + YRheight  + ")")
            .call(xAxisRaceYear);

        contentRaceYear.append("text")
            .data(deathtotalsbyYearRace)

            .attr("x", YRwidth / 2)
            .attr("y", 0)
            .style("text-anchor", "end")
            .text(function(d) { return d.cause; });


        contentRaceYear.append("g")
            .attr("class", "y axis")
            .call(yAxisRaceYear)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", "-4.0em");

    });

};


// from scratch - this formats the data so it can be used by line charts
function formatYearRaceData(deathdata) {

    deathtotalsbyYearRace = d3.nest()

        .key(function (d) {
            return d["Leading Cause"];
        })

        .key(function (d) {
            return d.Year;
        })
        .sortKeys(d3.ascending)

        .key(function (d) {
            return d["Race Ethnicity"];
        })
        .rollup(function (d) {
            return {
                d: d,
                "total_deaths": d3.sum(d, function (g) {
                    return +g.Deaths;
                }),
                "median_death_rate": d3.median(d, function (r) {
                    if (r["Death Rate"] != ".") {
                        return +r["Death Rate"];
                    }
                })
            }
        })
        .entries(deathdata);

    deathtotalsbyYearRace.forEach(function (d) {
        d.cause = d.key;
        d.values.forEach(function (v) {
            v.year = parseDate(v.key);
            v.values.black = 0;
            v.values.asian = 0;
            v.values.unknown = 0;
            v.values.hispanic = 0;

            v.values.other = 0;
            v.values.white = 0;


            v.values.blackrate = 0;
            v.values.asianrate = 0;
            v.values.unknownrate = 0;
            v.values.hispanicrate = 0;

            v.values.otherrate = 0;
            v.values.whiterate = 0;

            //v.year = +v.key;
            v.values.forEach(function (race) {

                if (race.key == "Black Non-Hispanic") {
                    v.values.black = +race.values.total_deaths;
                    v.values.blackrate = +race.values.median_death_rate;

                } else if (race.key == "Asian and Pacific Islander") {
                    v.values.asian = +race.values.total_deaths;
                    v.values.asianrate = +race.values.median_death_rate;

                }
                else if (race.key == "Hispanic") {
                    v.values.hispanic = +race.values.total_deaths;
                    v.values.hispanicrate = +race.values.median_death_rate;

                }
                else if (race.key == "Not Stated/Unknown") {
                    v.values.unknown = +race.values.total_deaths;
                    v.values.unknownrate = +race.values.median_death_rate;

                }
                else if (race.key == "Other Race/ Ethnicity") {
                    v.values.other = +race.values.total_deaths;
                    v.values.otherrate = +race.values.median_death_rate;

                }
                else if (race.key == "White Non-Hispanic") {
                    v.values.white = +race.values.total_deaths;
                    v.values.whiterate = +race.values.median_death_rate;

                }
            });
        });
    });

    deathtotalsbyYearRace.forEach(function (s) {
        s.maxdeathasian = +d3.max(s.values, function (v) {
            return v.values.asian;
        });
        s.maxdeathblack = +d3.max(s.values, function (v) {
            return v.values.black;
        });
        s.maxdeathwhite = +d3.max(s.values, function (v) {
            return v.values.white;
        });
        s.maxdeathother = +d3.max(s.values, function (v) {
            return v.values.other;
        });
        s.maxdeathhispanic = +d3.max(s.values, function (v) {
            return v.values.hispanic;
        });
        s.maxdeathrace = +Math.max(s.maxdeathasian, s.maxdeathblack, s.maxdeathwhite, s.maxdeathother, s.maxdeathhispanic);


        s.maxdeathasianrate = +d3.max(s.values, function (v) {
            return +v.values.asianrate;
        });
        s.maxdeathblackrate = +d3.max(s.values, function (v) {
            return +v.values.blackrate;
        });
        s.maxdeathwhiterate = +d3.max(s.values, function (v) {
            return +v.values.whiterate;
        });
        s.maxdeathotherrate = +d3.max(s.values, function (v) {
            return +v.values.otherrate;
        });
        s.maxdeathhispanicrate = +d3.max(s.values, function (v) {
            return +v.values.hispanicrate;
        });
        s.maxdeathracerate = +Math.max(s.maxdeathasianrate, s.maxdeathblackrate, s.maxdeathwhiterate, s.maxdeathhispanicrate);

    });
}

