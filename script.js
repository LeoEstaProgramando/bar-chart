import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function getData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}

const json = await getData(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
);

const data = json.data.map(d => [new Date(d[0]), d[1]]); // Convertir las fechas a objetos Date

const width = 928;
const height = 500;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 40;

// Declarar la escala x (posición horizontal).
const x = d3.scaleTime()
    .domain(d3.extent(data, d => d[0]))
    .range([marginLeft, width - marginRight]);

// Declarar la escala y (posición vertical).
const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[1])])
    .range([height - marginBottom, marginTop]);

// Crear el contenedor SVG.
const svg = d3.select("section")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Añadir un rectángulo para cada barra.
svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(0) - y(d[1]))
    .attr("width", 5); // Ajustar el ancho de las barras

// Añadir el eje x y la etiqueta.
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
        .ticks(d3.timeYear.every(5)) // Intervalo de 50 años
        .tickFormat(d3.timeFormat("%Y"))
    );

// Añadir el eje y y la etiqueta, y eliminar la línea del dominio.
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));
