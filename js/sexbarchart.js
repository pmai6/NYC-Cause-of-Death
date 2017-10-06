// code written from scratch
let dataset;
let datasetDR;

let mode = 'totalDeaths';

function changeMode(m) {
    if (m == 'totalDeaths') {
        mode = 'totalDeaths';
    } else {
        mode = 'deathRate';
    }
}

// modified imported code
function displayYearSex(inputYear) {

    let marginSexBar = {top: 20, right: 30, bottom: 140, left: 40},
        width = 600 - marginSexBar.left - marginSexBar.right,
        height = 300 - marginSexBar.top - marginSexBar.bottom;

    let x0SexBar = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    let x1SexBar = d3.scale.ordinal();

    let ySexBar = d3.scale.linear()
        .range([height, 0]);

    let xAxisSexBar = d3.svg.axis()
        .scale(x0SexBar)
        .orient("bottom");

    let yAxisSexBar = d3.svg.axis()
        .scale(ySexBar)
        .orient("left")
        .ticks(5);

    let divTooltip = d3.select("body").append("div").attr("class", "toolTip");


    let svgSexBar = d3.select(".sexBarChart").append("svg")
        .attr("width", width + marginSexBar.left + marginSexBar.right)
        .attr("height", height + marginSexBar.top + marginSexBar.bottom)
        .append("g")
        .attr("transform", "translate(" + marginSexBar.left + "," + marginSexBar.top + ")");

    let year;
    let barData;
    let deathsByYear;
    let sexSeparatedDeaths;
    let sexSeparatedDeathRate;

    let boyBlue = "#66ccff";
    let girlPink = "#ff6699";

    d3.csv("data/EDITED_New_York_City_Leading_Causes_of_Death.csv", function (error, data) {
        year = inputYear + "";

        data.forEach(function (d) {
            d.Deaths = +d.Deaths;
        });

        // code written from scratch
        barData = data;

        calculateDeaths();

        let options;
        let yAxisMax;
        let m;
        let f;

        if (mode == 'totalDeaths') {
            options = d3.keys(dataset[0]).filter(function (key) {
                return key !== "cause";
            });

            dataset.forEach(function (d) {
                d.valores = options.map(function (name) {
                    return {name: name, value: +d[name]};
                });
            });

            m = d3.max(dataset, function (e) {
                return e["Male Deaths"]
            });
            f = d3.max(dataset, function (e) {
                return e["Female Deaths"]
            });
        } else {
            options = d3.keys(datasetDR[0]).filter(function (key) {
                return key !== "cause";
            });

            datasetDR.forEach(function (d) {
                d.valores = options.map(function (name) {
                    return {name: name, value: +d[name]};
                });
            });

            m = d3.max(datasetDR, function (e) {
                return e["Male Death Rate"]
            });
            f = d3.max(datasetDR, function (e) {
                return e["Female Death Rate"]
            });
        }
        if (m > f) {
            yAxisMax = m;
        } else {
            yAxisMax = f;
        }

        if (mode == 'totalDeaths') {
            x0SexBar.domain((dataset.map(function (d) {
                return d.cause;
            })).sort());
        } else {
            x0SexBar.domain((datasetDR.map(function (d) {
                return d.cause;
            })).sort());
        }

        //modified imported code
        x1SexBar.domain(options).rangeRoundBands([0, x0SexBar.rangeBand()]);
        ySexBar.domain([0, 1.1 * yAxisMax]);

        svgSexBar.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisSexBar)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-1em")
            .attr("dy", "-1em")
            .attr("transform", "rotate(-90)")
            .style("font-size", "7px");

        svgSexBar.append("g")
            .attr("class", "y axis")
            .call(yAxisSexBar)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function() {
                if (mode == 'totalDeaths') {
                    return "Number of Deaths";
                } else {
                    return "Death Rate";
                }
            });

        bar = svgSexBar.selectAll(".bar")
            .data(function(e) {
                if (mode == 'totalDeaths') {
                    return dataset;
                } else {
                    return datasetDR;
                }
            })
            .enter().append("g")
            .attr("class", "rect")
            .attr("transform", function (d) {
                return "translate(" + x0SexBar(d.cause) + ",0)";
            });

        bar.selectAll("rect")
            .data(function (d) {
                return d.valores;
            })
            .enter().append("rect")
            .attr("width", x1SexBar.rangeBand())
            .attr("x", function (d) {
                return x1SexBar(d.name);
            })
            .attr("y", function (d) {
                return ySexBar(d.value);
            })
            .attr("value", function (d) {
                return d.name;
            })
            .attr("height", function (d) {
                return height - ySexBar(d.value);
            })
            .style("fill", function (d) {
                if (d.name == "Female Deaths" || d.name == "Female Death Rate") {
                    return girlPink;
                } else {
                    return boyBlue;
                }
            });

        bar.on("mousemove", function (d) {
                divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");
                let x = d3.event.pageX, y = d3.event.pageY;
                let elements = document.querySelectorAll(':hover');
                l = elements.length;
                l = l - 1;
                elementData = elements[l].__data__;
                tooltip.html((d.cause) + "<br>" + elementData.name + "<br>" + elementData.value + " Deaths")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .transition().duration(200).style("opacity", .75);
            });

        bar.on("mouseout", function(d){
            tooltip.transition().duration(200).style("opacity", 0)
        })
            .on("click", function(d) {

                if (scatterHighlight && d.cause == scatterSelected) {
                    resetScatterHighlight();
                } else {
                    resetScatterHighlight();
                    highlightScatter(d);
                }

                if (byRate) { d3.select(".selections")
                    .append("g").html("<br>"+(d.cause)+"<br>"+elementData.name+"<br>"+elementData.value+ " Deaths<br>")
                    .transition().duration(200)
                } else {
                    d3.select(".selections").append("g").html("<br>"+(d.cause)+"<br>"+elementData.name+"<br>"+elementData.value+ " Deaths<br>")
                        .transition().duration(200)
                }
            });


        let legendSexBar = svgSexBar.selectAll(".legend")
            .data(options.slice())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 10 + ")";
            });

        legendSexBar.append("rect")
            .attr("x", width - 9)
            .attr("width", 9)
            .attr("height", 9)
            .style("fill", function (d) {
                if (d == "Female Deaths" || d == "Female Death Rate") {
                    return girlPink;
                } else {
                    return boyBlue;
                }
            });

        legendSexBar.append("text")
            .attr("x", width - 11)
            .attr("y", 9)
            .attr("dy", ".0em")
            .style("text-anchor", "end")
            .style("font-size", "9px")
            .text(function (d) {
                return d;
            });

        headS = svgSexBar.append('rect').transition().duration(500)
                .attr('width', 60)
                .attr('height', 16)
                .attr('x', YRwidth / 2 -47)
                .attr('y', -15)
                .style('fill', '#F4D03F')
                .attr('opacity', .6);

        svgSexBar.append("text")
            .attr("x", YRwidth/2 )
            .attr("y", 0)
            .style("text-anchor", "end")
            .text(function(d) { return inputYear+""; });
    });

    // code written from scratch
    function calculateDeaths() {

        deathsByYear = barData.filter(function (d) {
            return d["Year"] == year;
        });

        sexSeparatedDeaths = d3.nest()

            .key(function (d) {
                return d["Leading Cause"];
            })
            .sortKeys(d3.ascending)
            .key(function (d) {
                return d["Sex"];
            })
            .sortKeys(d3.ascending)
            .rollup(function (v) {
                return d3.sum(v, function (g) {
                    return g.Deaths;
                })
            })
            .entries(deathsByYear);

        sexSeparatedDeathRate = d3.nest()

            .key(function (d) {
                return d["Leading Cause"];
            })
            .sortKeys(d3.ascending)
            .key(function (d) {
                return d["Sex"];
            })
            .sortKeys(d3.ascending)
            .rollup(function (v) {
                return d3.mean(v, function (g) {
                    return g["Death Rate"];
                })
            })
            .entries(deathsByYear);

        makeDataArray();
    }

    // code written from scratch
    function makeDataArray() {

        dataset = new Array();
        datasetDR = new Array();
        for (let i = 0; i < sexSeparatedDeaths.length; i++) {

            let item = sexSeparatedDeaths[i];
            let deathRate = sexSeparatedDeathRate[i];

            let deathRateMatch = false;

            let cause = item.key;

            if (cause == deathRate.key) {
                deathRateMatch = true;
            }

            let femaleDeaths;
            let maleDeaths;
            let femaleDeathRate;
            let maleDeathRate;

            if (item.values[0].key == "F") {
                femaleDeaths = item.values[0].values;

                if (femaleDeaths == ".") {
                    femaleDeaths = 0;
                }
            } else {
                femaleDeaths = 0;
                maleDeaths = item.values[0].values;
            }

            if (deathRateMatch && deathRate.values[0].key == "F") {
                femaleDeathRate = deathRate.values[0].values;

                if (femaleDeathRate == "." || femaleDeathRate == undefined) {
                    femaleDeathRate = 0;
                }
            } else {
                femaleDeathRate = 0;
                maleDeathRate = deathRate.values[0].values;
            }


            if (item.values.length == 2 && item.values[1].key == "M") {
                maleDeaths = item.values[1].values;

                if (maleDeaths == ".") {
                    maleDeaths = 0;
                }
            } else {
                if (!(item.values[0].key == "M")) {
                    maleDeaths = 0;
                }
            }

            if (deathRateMatch && deathRate.values.length == 2 && deathRate.values[1].key == "M") {
                maleDeathRate = deathRate.values[1].values;

                if (maleDeathRate == "." || maleDeathRate == undefined) {
                    maleDeathRate = 0;
                }
            } else {
                if (!(deathRate.values[0].key == "M")) {
                    maleDeathRate = 0;
                }
            }

            femaleDeathRate = Math.round(femaleDeathRate * 100) / 100;
            maleDeathRate = Math.round(maleDeathRate * 100) / 100;

            let instance = {
                "cause": cause,
                "Female Deaths": femaleDeaths,
                "Male Deaths": maleDeaths
            };

            let instanceDR = {
                "cause": cause,
                "Female Death Rate": femaleDeathRate,
                "Male Death Rate": maleDeathRate
            };

            dataset.push(instance);
            datasetDR.push(instanceDR);
        }

    }
}

// code written from scratch
let bar;
let barHighlight = false;
let barSelected = null;

function highlightBar(d) {

    barSelected = d["Leading Cause"];
    barHighlight = true;

    let index = null;

    for (var i = 0; i < dataset.length; i ++) {
        if (dataset[i].cause == barSelected) {
            index = i;
            break;
        }
    }

    var tick = -1;
    bar.selectAll("rect")

        .filter(function(f) {
            if (f.name == "Female Deaths" || f.name == "Female Death Rate") {
                tick++;
            }
            return tick != index;
        })
        .transition()
        .duration(1000)
        .delay(5)
        .style("opacity",0.1);
}

// code written from scratch
function resetBarHighlight() {
    barSelected = null;
    barHighlight = false;

    bar.selectAll("rect")
        .transition()
        .duration(1000)
        .delay(5)
        .style("opacity",1);
}
