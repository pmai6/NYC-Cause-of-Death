// is from scratch - bunch of variables neeed

var byRate = false;
var isSorted = true;
var causeOfDeath = new Set();
var isNewChart = true;
var bySelectedCauses = false;
var stackedtooltips = d3.select("body").append("div").attr("class", "stackedtooltips tooltip");




// modified imported code
var margin = {top: 20, right: 250, bottom: 40, left: 60},
    width  = 900 - margin.left - margin.right,
    height = 500  - margin.top  - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var fs=["20px"];
var headS;

// this is mostly from scrathc
var yearsToDisplaySM = new Set();

var color = d3.scale.category20b();

var deathtotalsbyYear;
var legend;

var stackedsvg = d3.select(".stackedBar").append("svg")
    .attr("width",  width  + margin.left + margin.right)
    .attr("height", height + margin.top  + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var deathdata;
var causeColorNames = ["Accidental Poisoning & Drug Overdose","Accidents Except Drug Poisoning","Alzheimer's Disease","Blood Poisoning","Cancer","Diabetes","Emphysema & Bronchitis","Essential Hypertension","Heart Disease","HIV","Homicide","Influenza & Pneumonia","Kidney Disease","Liver Disease","Other","Pregnancy & Childbirth Complications","Stroke","Suicide"];
var causeNames = ["Accidental Poisoning & Drug Overdose","Accidents Except Drug Poisoning","Alzheimer's Disease","Blood Poisoning","Cancer","Diabetes","Emphysema & Bronchitis","Essential Hypertension","Heart Disease","HIV","Homicide","Influenza & Pneumonia","Kidney Disease","Liver Disease","Other","Pregnancy & Childbirth Complications","Stroke","Suicide"];

var currentCauses = causeNames.slice();


// from scrath - resets records
d3.select("input[name=clearRecords]").on("click", function() {
    d3.select(".selections").selectAll("g").transition().duration(200).remove();
})



//  this is the main stacked bar chart and selector buttons
d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function(error, deathdata) {
    formatDataStacked(deathdata);

    color.domain(causeColorNames);

    x.domain(deathtotalsbyYear.map(function (d) { return d.Year; }));
    y.domain([0, d3.max(deathtotalsbyYear, function (d) { return d.total; })]);

    // this section heavilty modified for the stacked bar chart
    stackedsvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    stackedsvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(function() {
            if (byRate) {
                return "Death Rate"
            } else {
                return "Number of Deaths"
            }} )      .style("font-size", "10px");


    var selection = stackedsvg.selectAll(".series")
        .data(deathtotalsbyYear)
        .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) { return "translate(" + x(d.Year) + ",0)"; });

    selection.selectAll("rect")
        .data(function (d) { return d.mapping; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.y1); })
        .attr("height", function (d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d, i) { return color(d.name); })
        .on("mouseover", function(d) {
            //
            d3.select(this).attr("stroke", "black").attr("stroke-width", 0.5);
            stackedtooltips.html("<p>Cause: " + d.name + "</p><p>"  + "<p>Number of Deaths: " +
                (d.y1 - d.y0).toFixed(2) + "</p>")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition().duration(200).style("opacity", .75)
        })
        .on("mouseout", function(d) {
            d3.select(this).transition().duration(200).attr("stroke","none");
            stackedtooltips.transition().duration(200).style("opacity", 0)
        })
        .on('click', function(d) {
            var searchVal = d3.selectAll("input[name='mode']:checked").attr("value");
            if (searchVal==="byYear") {
                yearsToDisplaySM.add(d.year);
                //yearsToDisplaySM.add(2014);
                runSmallMultiples(yearsToDisplaySM, false);
                d3.selectAll("p").remove();
                d3.select(".selections")
                    .append("p").html("<br>Total Number of Deaths in " + d.year + " from " + d.name + ": " + (d.y1 - d.y0).toFixed(2) + "<br>")
                    .transition().duration(200);
                d3.selectAll("p").data(fs).style("font-size",String)
                d3.selectAll("p").style("font-weight","bold");
            } else {
                displaySmallMultiples(d.name);
                d3.selectAll("p").remove();
                d3.select(".selections")
                    .append("p").html("<br>Total Number of Deaths in " + d.year + " from " + d.name + ": " + (d.y1 - d.y0).toFixed(2) + "<br>")
                    .transition().duration(200);
                d3.selectAll("p").data(fs).style("font-size",String)
                d3.selectAll("p").style("font-weight","bold");
            }
        });



    // modified import - this is the legend that has the list of death causes

    legend = stackedsvg.selectAll(".legend")
        .data(causeColorNames)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(160," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 140 )
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function(d) { return color(d) ;} )
        .on('click', function(d) {
            var searchVal = d3.selectAll("input[name='mode']:checked").attr("value");
            if (searchVal==="byCause") {
                isSorted = false;
                isNewChart = false;

                if (bySelectedCauses == false) {
                    changeMainChartToSelectedCauses();
                }
                bySelectedCauses = true;
                displaySmallMultiples(d);
                updateChart();
            }
        });

    legend.append("text")
        .style("fill", color)
        .attr("x", width -120)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "right")
        .text(function (d) { return d; });


    // this is from scratch for reset button
    d3.select(resetButton)
        .append('button')
        .text('Reset')
        .attr('class','resetButton')
        .on('click', function() {
            causeOfDeath.clear();
            d3.select(".yearRaceMultiple").selectAll("svg").transition().duration(750).remove();
            d3.select(".yearSexMultiple").selectAll("svg").transition().duration(750).remove();
            clearYears();
            byRate = false;
            isNewChart = true;
            bySelectedCauses = false;
            currentCauses = causeNames.slice();
            updateChart();
            d3.select("#modeDefault").property("checked", true);
            d3.select("#totalDeaths").property("checked", true);
        });



    // from scratch - reset button
    d3.select(SortAZ)
        .append('button')
        .text('Sort by Name A-Z')
        .attr('class','SortAZ')
        .on('click', function() {

            if (isSorted) {
                currentCauses = currentCauses.reverse();

            } else {
                currentCauses = currentCauses.sort();
                isSorted = true;
            }
            updateChart();

        });




   // from scratch this is the selector change from total deaths to by death rate
    d3.selectAll("input[name=dataMode]").on("change", function (d) {
        var whichData = d3.selectAll("input[name=dataMode]:checked").attr("value");
        console.log(whichData);
        if (whichData=="totalDeaths") {
            byRate = false;
            switchToTotalCauseMultiples();
            updateChart();
            runSmallMultiples(yearsToDisplaySM, true);
        } else {
            switchToRate();
            runSmallMultiples(yearsToDisplaySM, true);
        }
    });


    // this section is from scratch - changes from years to by cause
d3.selectAll("input[name='mode']").on("change", clearYears);

function clearYears() {
    yearsToDisplaySM.clear();
    isDisplayed.length = 0;
    d3.select(".sexBarChart").selectAll("svg").transition().duration(750).remove();
    d3.select(".yearRace").selectAll("svg").transition().duration(750).remove();


    d3.select(".yearRaceMultiple").selectAll("svg").transition().duration(750).remove();
    d3.select(".yearSexMultiple").selectAll("svg").transition().duration(750).remove();
    causeOfDeath.clear();
    currentCauses = causeNames.slice();
    byRate = false;
    isNewChart = true;
    bySelectedCauses = false;
    currentCauses = causeNames.slice();
    updateChart();
}



// from scratch - changes main chart
function changeMainChartToSelectedCauses() {
    causeOfDeath.clear();
    currentCauses.length = 0;
    bySelectedCauses = true;

}



// this is imported heavily modified - this updated the main chart when changes are made
    function updateChart() {
        d3.select(".stackedBar").selectAll("svg").remove();
        var stackedsvg = d3.select(".stackedBar").append("svg")
            .attr("width",  width  + margin.left + margin.right)
            .attr("height", height + margin.top  + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function(error, newdeathdata) {


            if (!isNewChart) {
                newdeathdata = newdeathdata.filter(function (d) {
                    return causeOfDeath.has(d["Leading Cause"])
                });
            }
            if (!byRate) {
                formatDataStacked(newdeathdata);
            } else {
                formatDataStackedRate(newdeathdata);
            }
            color.domain(causeColorNames);


            x.domain(deathtotalsbyYear.map(function (d) {
                return d.Year;
            }));
            y.domain([0, d3.max(deathtotalsbyYear, function (d) {
                return d.total;
            })]);

            stackedsvg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            stackedsvg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 5)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(function() {
                    if (byRate) {
                        return "Death Rate"
                    } else {
                        return "Number of Deaths"
                    }} );



            var selection = stackedsvg.selectAll(".series")
                .data(deathtotalsbyYear)
                .enter().append("g")
                .attr("class", "series")
                .attr("transform", function (d) {
                    return "translate(" + x(d.Year) + ",0)";
                });

            selection.selectAll("rect")
                .data(function (d) {
                    return d.mapping;
                })
                .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function (d) {
                    return y(d.y1);
                })
                .attr("height", function (d) {
                    return y(d.y0) - y(d.y1);
                })
                .style("fill", function (d, i) {
                    return color(d.name);
                })
                .on("mouseover", function (d) {
                    //
                    d3.select(this).attr("stroke", "black").attr("stroke-width", 0.5);
                    stackedtooltips.html("<p>Cause: " + d.name + "</p><p>" + "<p>Number of Deaths: " +
                        (d.y1 - d.y0).toFixed(2) + "</p>")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px")
                        .transition().duration(200).style("opacity", .75)
                })
                .on("mouseout", function (d) {
                    d3.select(this).transition().duration(200).attr("stroke", "none");
                    stackedtooltips.transition().duration(200).style("opacity", 0)
                })
                .on('click', function (d) {
                    var searchVal = d3.selectAll("input[name='mode']:checked").attr("value");
                    if (searchVal === "byYear") {
                        yearsToDisplaySM.add(d.year);
                        runSmallMultiples(yearsToDisplaySM);

                    } else {
                        displaySmallMultiples(d.name);

                    }
                });

            legend = stackedsvg.selectAll(".legend")
                .data(causeColorNames)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(160," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 140 )
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", function(d) { return color(d) ;} )
                .on('click', function(d) {
                    var searchVal = d3.selectAll("input[name='mode']:checked").attr("value");
                    if (searchVal==="byCause") {
                        isSorted = false;
                        console.log("what");
                        isNewChart = false;
                        if (bySelectedCauses == false) {

                            changeMainChartToSelectedCauses();
                        }
                        bySelectedCauses = true;
                        displaySmallMultiples(d);
                        updateChart();

                    }
                });

            legend.append("text")
                .style("fill", color)
                .attr("x", width -120)
                .attr("y", 6)
                .attr("dy", ".35em")
                .style("text-anchor", "right")
                .text(function (d) { return d; });

        });
    }
    



    // this is from scratch - changes from total deaths
d3.selectAll("input[name=dataMode]").on("change", function (d) {
    var whichData = d3.selectAll("input[name=dataMode]:checked").attr("value");
    console.log(whichData);
    if (whichData=="totalDeaths") {
        byRate = false;

            runSmallMultiples(yearsToDisplaySM, true);
            switchToTotalCauseMultiples();
            updateChart();

    } else {
       
             runSmallMultiples(yearsToDisplaySM, true);
            switchToRate();
                }
});



//  this is from scrate this formats the data when selects
    function formatDataStacked(thedeathdata) {

        thedeathdata.forEach(function(d) {
            deaths = +d.Deaths;
            d["Death Rate"] = +d["Death Rate"];
        });

        deathtotalsbyYear = d3.nest()
            .key(function(d) { return d.Year; })
            .sortKeys(d3.ascending)

            .key(function(d) { return d["Leading Cause"]; })

            .rollup(function(d) {
                return {
                    d: d,
                    "total_deaths": d3.sum(d, function(g) {return +g.Deaths;})
                }})
            .entries(thedeathdata);

        deathtotalsbyYear.forEach(function(d) {
            d.Year = d.key;
            d.total = 0;
            d.values.forEach(function(v) {
                v.cause = v.key;

                v.total = +v.values.total_deaths;
                d[v.cause] = v.total ;
            });

        });
        deathtotalsbyYear.forEach(function(d) {
            d.values.forEach(function(v) {
                d.total += v.total;

            });
        });

        deathtotalsbyYear.forEach(function (d) {
            var y0 = 0;
            d.mapping = currentCauses.map(function (name) {
                return {
                    year : d.Year,
                    name: name,
                    y0: y0,
                    y1: y0 += +d[name].toFixed(2)
                };
            });
            d.total = d.mapping[d.mapping.length - 1].y1;
        });
    }

// from scratch - this changes the data for the by rate in instead of total deaths
    function formatDataStackedRate(deathdata) {

        deathdata.forEach(function(d) {
            deaths = +d.Deaths;
            d["Death Rate"] = +d["Death Rate"];
        });

        deathtotalsbyYear = d3.nest()
            .key(function(d) { return d.Year; })
            .sortKeys(d3.ascending)

            .key(function(d) { return d["Leading Cause"]; })

            .rollup(function(d) {
                return {
                    d: d,
                    "total_deaths": d3.mean(d, function (r) {
                        if (r["Death Rate"] == "." || isNaN(+r["Death Rate"] ) ){
                            return 0;
                        } else {
                            return +r["Death Rate"];

                        }
                    }).toFixed(2)
                    }
                })
            .entries(deathdata);

        deathtotalsbyYear.forEach(function(d) {
            d.Year = d.key;
            d.total = 0;
            d.values.forEach(function(v) {
                v.cause = v.key;

                v.total = +v.values.total_deaths;
                d[v.cause] = v.total ;
            });

        });
        deathtotalsbyYear.forEach(function(d) {
            d.values.forEach(function(v) {
                d.total += v.total;

            });
        });

        deathtotalsbyYear.forEach(function (d) {
            var y0 = 0;
            d.mapping = currentCauses.map(function (name) {
                return {
                    year : d.Year,
                    name: name,
                    y0: y0,
                    y1: y0 += +d[name].toFixed(2)
                };
            });
            d.total = d.mapping[d.mapping.length - 1].y1;
        });
    }



    // from scratch - small function to change to by rate in the stacked bar chart
    function switchToRate() {
        byRate = true;
        switchToRateCauseMultiples();
        updateChart();

    }
});
API Training Shop Blog About
© 2017 GitHub, Inc. Help Support