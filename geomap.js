
// Load all three datasets at the same time
Promise.all([
    d3.json("./topo.json"),
    d3.csv("./cities.csv"),
    d3.csv("./states.csv")

    
]).then((data) => {

    // Give our data sensible names
    const topology = data[0];
    const cities = data[1];
    const states = data[2];

    // Extract the states' topographic features
    const topo = topojson.feature(
        topology,
        topology.objects.states
    );

    // Create a dictionary for states and populations
// Create a dictionary for states and populations
const stateDictionary = new Map();

states.forEach((state) => {

    stateDictionary.set(
        state.State,
        Number(state["2018 Population"])
    );
});

console.log("Dictionary:", stateDictionary);


    // Create a sequential color scale
    var blues = d3.scaleSequential()
        .domain(d3.extent(stateDictionary.values()))
        .range(["white", "steelblue"]);

    // Create the US map projection
    var projection = d3.geoAlbersUsa()
        .scale(700)
        .translate([487.5, 305]);

    // Create a path generator
    var path = d3.geoPath(projection);

    // Select SVG and append a group
    const svg = d3.select("#geomap")
        .append("g")
        .attr("transform", "translate(50,50)");

    // Draw the states and color them by population
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
            return blues(
                stateDictionary.get(d.properties.name)
            );
        })
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

    // Add circles representing the state capitals
    svg.append("g")
        .selectAll("circle")
        .data(cities)
        .join("circle")
        .attr("cx", (d) => {
            return projection([
                +d.longitude,
                +d.latitude
            ])[0];
        })
        .attr("cy", (d) => {
            return projection([
                +d.longitude,
                +d.latitude
            ])[1];
        })
        .attr("r", 4)
        .attr("fill", "red")
        .attr("stroke", "white")
        .attr("stroke-width", "1px");

});
