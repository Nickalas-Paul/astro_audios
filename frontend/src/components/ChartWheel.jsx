import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./ChartWheel.css";

const houses = Array.from({ length: 12 }, (_, i) => i + 1);
const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// ChartWheel highlights the activeHouse sector with a glow and updates when activeHouse changes.
// It emits clicks back up via onHouseSelect.
export default function ChartWheel({ activeHouse, onHouseSelect }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 300;
    const height = 300;
    const radius = 140;
    const innerRadius = 60;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Prepare pie & arc generators
    const pie = d3.pie().value(() => 1);
    const arcGen = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const data = pie(houses);

    // Ensure a single 'wheel' group for arcs
    let wheelGroup = svg.select("g.wheel");
    if (wheelGroup.empty()) {
      wheelGroup = svg.append("g")
        .attr("class", "wheel")
        .attr("transform", `translate(${centerX},${centerY})`);
    }

    // Data join for arcs
    const arcs = wheelGroup.selectAll("path").data(data);

    arcs.join(
      enter => enter.append("path")
        .attr("d", arcGen)
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("class", "arc")
        .on("click", (e, d) => onHouseSelect(d.data)),
      update => update,
      exit => exit.remove()
    )
    .transition()
      .duration(250)
      .attr("fill", d => d.data === activeHouse ? "#FFD700" : d3.schemeCategory10[d.index % 10])
      .attr("class", d => d.data === activeHouse ? "arc glow" : "arc");

    // Labels join
    let labelGroup = svg.select("g.labels");
    if (labelGroup.empty()) {
      labelGroup = svg.append("g")
        .attr("class", "labels")
        .attr("transform", `translate(${centerX},${centerY})`);
    }

    const texts = labelGroup.selectAll("text").data(data);
    texts.join(
      enter => enter.append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "10px"),
      update => update,
      exit => exit.remove()
    )
    .attr("transform", d => `translate(${arcGen.centroid(d)})`)
    .attr("fill", "#fff")
    .text((d, i) => zodiacSigns[i].slice(0, 3));

  }, [activeHouse, onHouseSelect]);

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
}
