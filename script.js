const width = 800;
const height = 400;

const tooltip = d3
    .select(".plot")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

const svgContainer = d3
    .select(".plot")
    .append("svg")
    .attr("class", "graph")
    .attr("width", 920)
    .attr("height", 650);

const color = d3.scaleOrdinal(d3.schemeCategory10);
const timeFormat = d3.timeFormat("%M:%S");

d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
    .then((data) => {
        svgContainer
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -275)
            .attr("y", 40)
            .text("Time in Minutes")
            .style("font-size", "20px");

        svgContainer
            .append("text")
            .attr("x", 200)
            .attr("y", 450)
            .text("No doping allegations")
            .style("font-size", "15px");

        svgContainer
            .append("text")
            .attr("x", 490)
            .attr("y", 450)
            .text("Riders with doping allegations")
            .style("font-size", "15px");

        const times = data.map((item) => {
            const [minutes, seconds] = item["Time"].split(":");
            return new Date(1970, 0, 1, 0, minutes, seconds);
        });
        const years = data.map((item) => item["Year"]);

        const xScale = d3
            .scaleLinear()
            .domain([d3.min(years) - 1, d3.max(years) + 1])
            .range([0, width]);

        svgContainer
            .append("g")
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
            .attr("id", "x-axis")
            .attr("transform", "translate(100, 400)");

        var yScale = d3
            .scaleTime()
            .domain([
                new Date(1970, 0, 1, 0, 40, 0),
                new Date(1970, 0, 1, 0, 36, 40),
            ])
            // .domain([d3.max(times), d3.min(times)])
            .range([height, 0]);

        svgContainer
            .append("g")
            .call(d3.axisLeft(yScale).tickFormat(timeFormat))
            .attr("id", "y-axis")
            .attr("transform", "translate(100, 0)");

        d3.select("svg")
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("data-xvalue", (d, i) => years[i])
            .attr("data-yvalue", (d, i) => times[i])
            .attr("index", (d, i) => i)
            .attr("class", "dot")
            .attr("cx", (d, i) => xScale(years[i]))
            .attr("cy", (d, i) => yScale(times[i]))
            .attr("r", 6)
            .attr("transform", "translate(100, 0)")
            .style("fill", (d, i) => color(data[i]["Doping"] !== ""))
            .on("mouseover", function (event, d, i) {
                tooltip
                    .html(
                        d.Name +
                            ": " +
                            d.Nationality +
                            "<br/>" +
                            "Year: " +
                            d.Year +
                            ", Time: " +
                            d.Time +
                            (d.Doping ? "<br/><br/>" + d.Doping : "")
                    )
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY - 28 + "px")
                    .style("opacity", 0.9)
                    .attr("data-year", d.Year)
            })
            .on("mouseout", function () {
                tooltip.style("opacity", 0);
            });

        svgContainer
            .selectAll("legend")
            .data(color.domain())
            .enter()
            .append("rect")
            .attr("class", "legend-label")
            .attr("id", "legend")
            .attr("width", 18)
            .attr("height", 18)
            .attr("y", 435)
            .attr("transform", function (d, i) {
                return `translate(${470 - (290 * i)}, 0)`;
            })
            .style("fill", color);
    })
    .catch((e) => console.log(e));
