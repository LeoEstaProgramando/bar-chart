const width = 800;
const height = 400;
const barWidth = width / 275;

const tooltip = d3
    .select(".chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

const overlay = d3
    .select(".chart")
    .append("div")
    .attr("class", "overlay")
    .style("opacity", 0);

const svgContainer = d3
    .select(".chart")
    .append("svg")
    .attr("width", 920)
    .attr("height", 460);

d3.json(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
    .then((data) => {
        svgContainer
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -250)
            .attr("y", 80)
            .text("Gross Domestic Product");

        svgContainer
            .append("text")
            .attr("x", 490)
            .attr("y", 450)
            .text(
                "More Information: http://www.bea.gov/national/pdf/nipaguid.pdf"
            )
            .attr("class", "info");

        const years = data.data.map(([date]) => {
            const quarterMap = { "01": "Q1", "04": "Q2", "07": "Q3", 10: "Q4" };
            const quarter = quarterMap[date.substring(5, 7)];
            return `${date.substring(0, 4)} ${quarter}`;
        });

        const yearsDate = data.data.map(([date]) => new Date(date));
        const values = data.data.map(([date, gdp]) => [new Date(date), gdp]);

        // Ajuste de la última barra para la escala X
        const xMax = d3.timeMonth.offset(d3.max(yearsDate), 3);

        const xScale = d3
            .scaleTime()
            .domain([d3.min(values[0]), xMax])
            .range([0, width]);

        svgContainer
            .append("g")
            .call(d3.axisBottom(xScale))
            .attr("id", "x-axis")
            .attr("transform", "translate(60, 400)");

        const GDP = data.data.map(([, gdp]) => gdp);
        const gdpMax = d3.max(GDP);

        // var linearScale = d3
        //     .scaleLinear()
        //     .domain([0, gdpMax])
        //     .range([0, height]);

        // scaledGDP = GDP.map(function (item) {
        //     return linearScale(item);
        // });

        var yScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

        svgContainer
            .append("g")
            .call(d3.axisLeft(yScale))
            .attr("id", "y-axis")
            .attr("transform", "translate(60, 0)");

        d3.select("svg")
            .selectAll("rect")
            .data(GDP)
            .enter()
            .append("rect")
            .attr("data-date", (d, i) => data.data[i][0])
            .attr("data-gdp", (d, i) => GDP[i])
            .attr("index", (d, i) => i)
            .attr("class", "bar")
            .attr("x", (d, i) => xScale(yearsDate[i]))
            .attr("y", (d) => yScale(d))
            .attr("width", barWidth)
            .attr("height", (d) => height - yScale(d))
            .attr("transform", "translate(60, 0)")
            .style("fill", "#33adff")
            .attr("transform", "translate(60, 0)")
            .on("mouseover", function (event, d, i) {
                // d or datum is the height of the
                // current rect
                var i = this.getAttribute("index");

                overlay
                    .transition()
                    .duration(0)
                    .style("height", `${height - yScale(d)}px`)
                    .style("width", `${barWidth}px`)
                    .style("opacity", 0.9)
                    .style("top", `${yScale(d)}px`)
                    .style("left", i * barWidth + "px")
                    .style("transform", "translateX(60px)");

                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(
                        `${years[i]}<br>$${d
                            .toFixed(1)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Billion`
                    )
                    .attr("data-date", data.data[i][0])
                    .style("left", `${i * barWidth}px`)
                    .style("top", `${yScale(d) - 100}px`)
                    .style("transform", "translateX(60px)");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(200).style("opacity", 0);
                overlay.transition().duration(200).style("opacity", 0);
            });
    })
    .catch((e) => console.log(e));
