import * as d3 from "d3";

/* ------------------------------------------------
    Start data interfaces and classes 
-------------------------------------------------- */

interface IPactData {
    capability: string;
    colour: string;
    correlation: number[];
}

export function buildVisualisation(data: IPactData[]){
    let svg = d3.select("svg");
    let matrix = data.map(d => d.correlation);

    let chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
        (matrix);
    
    svg.datum(chord)
        .append("g")
        .selectAll("g")
        .data(d => d.groups)
        .join(
            enter => enter.append("g")
                        .call(g => g.append("path")
                            .attr("id", (d, i) => data[i].capability)
                            .style("fill", (d, i) => data[i].colour)
                            .style("stroke", (d, i) => data[i].colour)
                            .style("stroke-width", 1)
                            .attr("d", d3.arc<d3.ChordGroup>()
                                .innerRadius(200)
                                .outerRadius(210)))
                        .call(g => g.append("text")
                            .attr("dy", -10)
                            .append("textPath")
                            .attr("href", (d, i) => "#" + data[i].capability)
                            .attr("startOffset", "25%")
                            .attr("dy", 10)
                            .style("text-anchor", "middle")
                            .style("font-size", "1.5rem")
                            .style("text-transform", "capitalize")
                            .text((d, i) => data[i].capability)),
            update => update,
            exit => exit
        )
    
    svg.datum(chord)
        .append("g")
        .selectAll("path")
        .data(d => d)
        .join("path")
        .attr("d", d3.ribbon<d3.Chord, d3.ChordGroup>()
            .radius(200))
        .style("fill", d => data[d.source.index].colour)
        .style("fill-opacity", 0.5)
        .style("stroke", d => data[d.source.index].colour)
        .style("stroke-width", 1)
}