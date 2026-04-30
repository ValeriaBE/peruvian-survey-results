import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
  trust: string;
  voted: string;
  n: number;
  percent: number;
};

const TRUST_ORDER = [
  "Not at all",
  "Not very much",
  "A fair amount",
  "A great deal",
  "Not Sure",
];

const COLOR_MAP: Record<string, string> = {
  Yes: "#d91023",
  No: "#f4c7b9",
};

export default function TrustVotingDotPlot() {
  const ref = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    d3.csv(`${import.meta.env.BASE_URL}data/trust_by_voting.csv`).then((data) => {
      const parsed: Row[] = data.map((d) => ({
        trust: d.trust ?? "",
        voted: d.voted ?? "",
        n: Number(d.n),
        percent: Number(d.percent),
      }));

      const width = 850;
      const height = 440;
      const margin = { top: 50, right: 150, bottom: 90, left: 80 };

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scalePoint()
        .domain(TRUST_ORDER)
        .range([0, innerWidth])
        .padding(0.5);

      const y = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

      chart
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-25)")
        .style("text-anchor", "end");

      chart
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

      chart
        .selectAll(".trust-line")
        .data(parsed)
        .enter()
        .append("line")
        .attr("x1", (d) => x(d.trust) ?? 0)
        .attr("x2", (d) => x(d.trust) ?? 0)
        .attr("y1", innerHeight)
        .attr("y2", (d) => y(d.percent))
        .attr("stroke", "#ead8c5")
        .attr("stroke-width", 2);

      chart
        .selectAll("circle")
        .data(parsed)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.trust) ?? 0)
        .attr("cy", (d) => y(d.percent))
        .attr("r", 9)
        .attr("fill", (d) => COLOR_MAP[d.voted])
        .attr("stroke", "#1f1f1f")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("mouseenter", function (event, d) {
          d3.select(this).attr("r", 13);

          d3.select(tooltipRef.current)
            .style("opacity", "1")
            .html(`
              <div class="tooltip-title">${d.trust}</div>
              <div><strong>${d.voted}</strong></div>
              <div>${d.n} respondents</div>
              <div>${d3.format(".1%")(d.percent)}</div>
            `);
        })
        .on("mousemove", function (event) {
          const container = containerRef.current;
          if (!container) return;

          const bounds = container.getBoundingClientRect();

          d3.select(tooltipRef.current)
            .style("left", `${event.clientX - bounds.left + 12}px`)
            .style("top", `${event.clientY - bounds.top - 40}px`);
        })
        .on("mouseleave", function () {
          d3.select(this).attr("r", 9);
          d3.select(tooltipRef.current).style("opacity", "0");
        });

      chart
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 75)
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("font-weight", 700)
        .attr("fill", "#1f1f1f")
        .text("Trust in election information");

      chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("font-weight", 700)
        .attr("fill", "#1f1f1f")
        .text("Percent within trust level");

      const legend = svg
        .append("g")
        .attr("transform", `translate(${width - 120}, ${margin.top + 50})`);

      legend
        .append("text")
        .attr("font-size", 16)
        .attr("font-weight", 700)
        .text("Voted");

      ["Yes", "No"].forEach((label, i) => {
        const row = legend
          .append("g")
          .attr("transform", `translate(0, ${25 + i * 30})`);

        row
          .append("circle")
          .attr("r", 7)
          .attr("cx", 7)
          .attr("cy", 7)
          .attr("fill", COLOR_MAP[label]);

        row
          .append("text")
          .attr("x", 22)
          .attr("y", 12)
          .attr("font-size", 14)
          .text(label);
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="chart-container">
      <svg ref={ref}></svg>
      <div ref={tooltipRef} className="chart-tooltip" />
    </div>
  );
}