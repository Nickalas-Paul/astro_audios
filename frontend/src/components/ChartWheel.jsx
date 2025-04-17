import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./ChartWheel.css";

const houses = Array.from({ length: 12 }, (_, i) => i + 1);
const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ChartWheel = ({ activeHouse, setActiveHouse }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = 300;
    const height = 300;
    const radius = 140;
    const centerX = width / 2;
    const centerY = height / 2;

    svg.selectAll("*").remove(); // Clear previous render

    const arcGenerator = d3.arc()
      .innerRadius(60)
      .outerRadius(radius);

    const pieGenerator = d3.pie().value(1);

    const arcs = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`)
      .selectAll("path")
      .data(pieGenerator(houses))
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) =>
        d.data === activeHouse ? "#FFD700" : d3.schemeCategory10[i % 10]
      )
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .attr("class", (d) => (d.data === activeHouse ? "glow" : "")) // ✨ Add glow here
      .on("click", (event, d) => setActiveHouse(d.data));

    // Add labels
    svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`)
      .selectAll("text")
      .data(pieGenerator(houses))
      .enter()
      .append("text")
      .attr("transform", d => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "10px")
      .text((d, i) => zodiacSigns[i].slice(0, 3));
  }, [activeHouse]); // ✨ Depend on activeHouse to rerender glow

  return (
    <div className="chart-container">
      <svg ref={ref} width={300} height={300}></svg>
    </div>
  );
};

export default ChartWheel;
