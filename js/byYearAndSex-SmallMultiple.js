// from scratch - this is the function that handles changes made in the view
function displaySmallMultiples(d) {

    if (!causeOfDeath.has(d)) {
        causeOfDeath.add(d);
        currentCauses.push(d);

        if (byRate) {
            multipleYearRaceRate(d);
            multipleYearSexRate(d);
        } else {
            multipleYearRace(d);
            multipleYearSex(d);
        }
    }
}


// from scratch - switches helps toggle the small multiples by cause
function switchToRateCauseMultiples() {
    d3.select(".yearRaceMultiple").selectAll("svg").transition().duration(750).remove();
    d3.select(".yearSexMultiple").selectAll("svg").transition().duration(750).remove();
    causeOfDeath.forEach(function(d){
        multipleYearRaceRate(d);
         multipleYearSexRate(d);
    });
 }

function switchToTotalCauseMultiples() {
    d3.select(".yearRaceMultiple").selectAll("svg").transition().duration(750).remove();
    d3.select(".yearSexMultiple").selectAll("svg").transition().duration(750).remove();
    causeOfDeath.forEach(function(d){
            multipleYearRace(d);
            multipleYearSex(d);
 });

}



var yearSexMultiple;



// modified imported - just margin and standard set
var deathtotalsbyYear;
var parseDate = d3.time.format("%Y").parse;


var YSmargin = {top: 40, right: 20, bottom: 20, left: 50},
    YSwidth = 600 - YSmargin.left - YSmargin.right,
    YSheight = 300 - YSmargin.top - YSmargin.bottom;


var xsy = d3.time.scale()
    .range([0, YSwidth]);

var ysy = d3.scale.linear()
    .range([YSheight, 0]);


var xAxisSexYear = d3.svg.axis()
    .scale(xsy)
    .orient("bottom");

var yAxisSexYear = d3.svg.axis()
    .scale(ysy)
    .orient("left")
    .ticks(6);

// var color = d3.scale.category20();



// from scratch sets up all the lines
var area = d3.svg.area()
    .x(function(d) { return xsy(d.year); })
    .y0(YSheight)
    .y1(function(d) { return ysy(d.values.male); });

var femalearea = d3.svg.area()
    .x(function(d) { return xsy(d.year); })
    .y0(YSheight)
    .y1(function(d) { return ysy(d.values.female); });

var maleline = d3.svg.line()

    .x(function(d) { return xsy(d.year); })
    .y(function(d) { return ysy(d.values.male); });

var femaleline = d3.svg.line()
    .x(function(d) { return xsy(d.year); })
    .y(function(d) { return ysy(d.values.female); });


var arearate = d3.svg.area()
    .x(function(d) { return xsy(d.year); })
    .y0(YSheight)
    .y1(function(d) { return ysy(d.values.malerate); });

var femalearearate = d3.svg.area()
    .x(function(d) { return xsy(d.year); })
    .y0(YSheight)
    .y1(function(d) { return ysy(d.values.femalerate); });

var malelinerate = d3.svg.line()
    .x(function(d) { return xsy(d.year); })
    .y(function(d) { return ysy(d.values.malerate); });

var femalelinerate = d3.svg.line()
    .x(function(d) { return xsy(d.year); })
    .y(function(d) { return ysy(d.values.femalerate); });



// heavility modified imported - creates the male female line charts
function multipleYearSex(deathcause) {


    var rootSexYear = d3.select(".yearSexMultiple").append("svg")
        .attr("width", YSwidth + YSmargin.left + YSmargin.right)
        .attr("height", YSheight + YSmargin.top + YSmargin.bottom)
        .append("g")
        .attr("transform", "translate(" + YSmargin.left + "," + YSmargin.top + ")");

    var contentSexYear = rootSexYear.append("g")


    d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function(error, deathdata) {
        var deathdata = deathdata.filter(function (e) {
            return e["Leading Cause"] === deathcause;
        });

        formatYearSexData(deathdata);

        xsy.domain([
            d3.min(deathtotalsbyYear, function (s) {
                return s.values[0].year;
            }),
            d3.max(deathtotalsbyYear, function (s) {
                return s.values[s.values.length - 1].year;
            })
        ]);

        contentSexYear.selectAll(".maleline")
            .data(deathtotalsbyYear)

            .enter().append("path")
            .attr("width", YSwidth + YSmargin.left + YSmargin.right)
            .attr("class", "maleline line")
            .attr("d", function (d) {
                ysy.domain([0, d.maxdeath]);
                return maleline(d.values);
            })
            .style("stroke-width",'3px')
            .style("stroke", "#66ccff")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Maximum Number of Male Deaths from " + d.cause + ": "
                    + d.maxdeathsmale + "</p>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            .on("click", function (d) {
                d3.select(".selections").append("g").html(
                    "<br>Maximum Number of Male Deaths from " + d.cause + ": " + d.maxdeathsmale + "<br>")
            });


        //
        contentSexYear.append("path")
        .data(deathtotalsbyYear)
            .attr("class", "femaleline line")
            .attr("d", function (d) {
                ysy.domain([0, d.maxdeath]);
                return femaleline(d.values);
            })
            .style("stroke-width",'3px')
            .style("stroke", "#ff6699")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Maximum Number of Female Deaths from " + d.cause + ": "
                    + d.maxdeathsfemale + "</p>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            .on("click", function (d) {
                d3.select(".selections").append("g").html(
                    "<br>Maximum Numberof Female Deaths from " + d.cause + ": " + d.maxdeathsfemale + "<br>")
            });



        headS = contentSexYear.append('rect').transition().duration(500)
                .attr('width', 460)
                .attr('height', 16)
                .attr('x', YSwidth / 4 - 130)
                .attr('y', -20)
                .style('fill', '#F4D03F')
                .attr('opacity', .3);

        contentSexYear.append("text")
            .data(deathtotalsbyYear)
            .attr("x", YSwidth/2 - 10)
            .attr("y", -9)
            .style("text-anchor", "end")
            .text(function (d) {
                return d.cause;
            });
        contentSexYear.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + YSheight + ")")
            .call(xAxisSexYear);

        contentSexYear.append("g")
            .attr("class", "y axis")
            .call(yAxisSexYear)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", "-4.0em");
    });
};



// heavility modified - changes the charts to death rate
function multipleYearSexRate(deathcause) {

    var rootSexYearRate = d3.select(".yearSexMultiple").append("svg")
        .attr("width", YSwidth + YSmargin.left + YSmargin.right)
        .attr("height", YSheight + YSmargin.top + YSmargin.bottom)
        .append("g")
        .attr("transform", "translate(" + YSmargin.left + "," + YSmargin.top + ")");

    var contentSexYear = rootSexYearRate.append("g")


    d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function(error, deathdata) {
        var deathdata = deathdata.filter(function (e) {
            return e["Leading Cause"] === deathcause;
        });

        formatYearSexData(deathdata);

        xsy.domain([
            d3.min(deathtotalsbyYear, function (s) {
                return s.values[0].year;
            }),
            d3.max(deathtotalsbyYear, function (s) {
                return s.values[s.values.length - 1].year;
            })
        ]);

        contentSexYear.selectAll(".maleline")
            .data(deathtotalsbyYear)

            .enter().append("path")
            .attr("width", YSwidth + YSmargin.left + YSmargin.right)
            .attr("class", "maleline")
            .attr("d", function(d) { ysy.domain([0, d.maxdeathrate*1.5]); return malelinerate(d.values); })
            .style("stroke-width",'3px')
            .style("stroke", "#66ccff")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Maximum Male Death Rate from " + d.cause + ": "
                    + d.maxdeathsmalerate + "</p>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            .on("click", function (d) {
                d2.select(".selections").appeng("g").html(
                    "<br>Maximun Male Death Rate from " + d.cause + ": " + d.maxdeathsmalerate + "<br>")
            });



        contentSexYear.selectAll(".femaleline")
            .data(deathtotalsbyYear)
            .enter().append("path")
            .attr("width", YSwidth + YSmargin.left + YSmargin.right)
            .attr("class", "femaleline")
            .attr("d", function(d) { ysy.domain([0, d.maxdeathrate*1.5]); return femalelinerate(d.values); })
            .style("stroke-width",'3px')
            .style("stroke", "#ff6699")
            .on("mouseover", function (d) {
                stackedtooltips.html("<p>Maximum Female Death Rate from " + d.cause + ": "
                    + d.maxdeathsfemalerate + "</p>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function (d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            })
            .on("click", function (d) {
                d3.select(".selections").append("g").html(
                    "<br>Maximum Female Death Rate from " + d.cause + ": " +
                    d.maxdeathsfemalerate + "<br>")
            });
/*
        contentSexYear.append("path")
            .data(deathtotalsbyYear)
            .attr("class", "femalearea")
            .attr("d", function(d) { ysy.domain([0, d.maxdeathrate * 1.5]); return femalearearate(d.values); })
            .on("mouseover", function(d) {
                stackedtooltips.html("<p>" + d.cause + "</p><p>Death Rate Male: "
                    + d.maxdeathsmalerate.toFixed(2) + "</p>" + "</p><p>Death Rate Female: "
                    + d.maxdeathsfemalerate.toFixed(2) + "</p>")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75)
            })
            .on("mouseout", function(d) {
                stackedtooltips.transition().duration(200).style("opacity", 0)
            });
*/

        contentSexYear.append("text")
            .data(deathtotalsbyYear)
            .attr("x", YSwidth / 2)
            .attr("y", 0)
            .style("text-anchor", "end")
            .text(function (d) {
                return d.cause;
            });

        contentSexYear.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + YSheight + ")")
            .call(xAxisSexYear);

        contentSexYear.append("g")
            .attr("class", "y axis")
            .call(yAxisSexYear)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 5)
            .attr("dy", "-4.0em");
    });


};



// from scratch formats the data to be usuable with line charts
function formatYearSexData(deathdata) {

    deathtotalsbyYear = d3.nest()

        .key(function(d) { return d["Leading Cause"]; })
        .key(function(d) { return d.Year; })
        .sortKeys(d3.ascending)

        .key(function(d) { return d["Sex"]; })
        .sortKeys(d3.ascending)
        .rollup(function (d) {
            return {
                d: d,
                "total_deaths": d3.sum(d, function (g) {
                    return +g.Deaths;
                }),
                "median_death_rate": d3.mean(d, function (r) {
                    if (r["Death Rate"] != ".") {
                        return +r["Death Rate"];
                    }
                })
            }
        })
        .entries(deathdata);

    deathtotalsbyYear.forEach(function(d) {
        d.cause = d.key;
        d.values.forEach(function(v) {
            v.year = parseDate(v.key);
            v.values.male = 0;
            v.values.female = 0;
            v.values.malerate = 0;
            v.values.femalerate = 0;
            //v.year = +v.key;
            v.values.forEach(function(sex) {

                if (sex.key == "M") {
                    v.values.male = +sex.values.total_deaths;
                    v.values.malerate = +sex.values.median_death_rate;

                } else if (sex.key == "F") {
                    v.values.female = +sex.values.total_deaths;
                    v.values.femalerate = +sex.values.median_death_rate;

               }
            });
        });
    });

    deathtotalsbyYear.forEach(function(s) {
        s.maxdeathsmale = d3.max(s.values, function(v) { return v.values.male; });
        s.maxdeathsfemale = d3.max(s.values, function(v) { return v.values.female; });
        if (s.maxdeathsmale > s.maxdeathsfemale) {
            s.maxdeath = +s.maxdeathsmale;
        } else {
            s.maxdeath = +s.maxdeathsfemale;
        }

    });

        deathtotalsbyYear.forEach(function(s) {
        s.maxdeathsmalerate = d3.mean(s.values, function(v) { return v.values.malerate; });
        s.maxdeathsfemalerate = d3.mean(s.values, function(v) { return v.values.femalerate; });
        if (s.maxdeathsmalerate > s.maxdeathsfemalerate) {
            s.maxdeathrate = +s.maxdeathsmalerate;
        } else {
            s.maxdeathrate = +s.maxdeathsfemalerate;
        }

    });
}

