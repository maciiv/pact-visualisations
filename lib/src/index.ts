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
                            .attr("id", d => data[d.index].capability)
                            .attr("class", "ring")
                            .style("fill", d => data[d.index].colour)
                            .style("stroke", d => data[d.index].colour)
                            .style("stroke-width", 1)
                            .attr("d", d3.arc<d3.ChordGroup>()
                                .innerRadius(200)
                                .outerRadius(210)))
                        .call(g => g.append("text")
                            .attr("dy", -10)
                            .append("textPath")
                            .attr("class", "text")
                            .attr("href", d => "#" + data[d.index].capability)
                            .attr("startOffset", "25%")
                            .attr("dy", 10)
                            .style("text-anchor", "middle")
                            .style("font-size", "1.5rem")
                            .style("text-transform", "capitalize")
                            .text(d => data[d.index].capability)
                            .on("click", (e, g) => {
                                if (d3.select(this).attr("class").includes("clicked")) {
                                    d3.selectAll(".text").classed("clicked", false);
                                    d3.selectAll(".relationship")
                                        .style("opacity", 0.5);
                                    d3.selectAll(".ring")
                                        .style("opacity", null);
                                    return
                                }
                                d3.selectAll(".text").classed("clicked", false);
                                d3.select(this).classed("clicked", true);
                                d3.selectAll<SVGPathElement, d3.Chord>(".relationship")
                                        .style("opacity", d => d.source.index == g.index ?  1 : 0.25);
                                    d3.selectAll<SVGPathElement, d3.ChordGroup>(".ring")
                                        .style("opacity", d => d.index == g.index ? null : 0.25);
                            })),
            update => update,
            exit => exit
        )
    
    svg.datum(chord)
        .append("g")
        .selectAll("path")
        .data(d => d)
        .join("path")
        .attr("class", "relationship")
        .attr("d", d3.ribbon<d3.Chord, d3.ChordGroup>()
            .radius(200))
        .style("fill", d => data[d.source.index].colour)
        .style("fill-opacity", 0.5)
        .style("stroke", d => data[d.source.index].colour)
        .style("stroke-width", 1)
}