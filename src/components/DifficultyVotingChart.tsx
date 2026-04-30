import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
  ease_vote: string;
  voted: string;
  n: number;
  percent: number;
};

const DIFFICULTY_ORDER = [
  "Very difficult",
  "Somewhat difficult",
  "Neither easy nor difficult",
  "Somewhat easy",
  "Very easy",
  "Not Sure",
];

const COLOR_MAP: Record<string, string> = {
  Yes: "#d91023",
  No: "#f4c7b9",
};

export default function DifficultyVotingChart() {
  const ref = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    d3.csv(`${import.meta.env.BASE_URL}data/difficulty_by_voting.csv`).then((data) => {
      const parsed: Row[] = data
        .map((d) => ({
          ease_vote: d.ease_vote ?? "",
          voted: d.voted ?? "",
          n: Number(d.n),
          percent: Number(d.percent),
        }))
        .filter((d) => d.voted === "Yes" || d.voted === "No");

      const wide = DIFFICULTY_ORDER.map((level) => {
        const rows = parsed.filter((d) => d.ease_vote === level);
        const yes = rows.find((d) => d.voted === "Yes");
        const no = rows.find((d) => d.voted === "No");

        return {
          ease_vote: level,
          yesPercent: yes?.percent ?? 0,
          noPercent: no?.percent ?? 0,
          yesN: yes?.n ?? 0,
          noN: no?.n ?? 0,
        };
      });

      const width = 850;
      const height = 480;
      const margin = { top: 50, right: 80, bottom: 70, left: 210 };

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleLinear()
        .domain([-1, 1])
        .range([0, innerWidth]);

      const y = d3
        .scaleBand()
        .domain(DIFFICULTY_ORDER)
        .range([0, innerHeight])
        .padding(0.28);

      chart
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#1f1f1f")
        .attr("stroke-width", 1.5);

      chart
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain")
        .remove();

      chart
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(5)
            .tickFormat((d) => d3.format(".0%")(Math.abs(Number(d))))
        );

      chart
        .selectAll(".bar-no")
        .data(wide)
        .enter()
        .append("rect")
        .attr("x", (d) => x(-d.noPercent))
        .attr("y", (d) => y(d.ease_vote) ?? 0)
        .attr("width", (d) => x(0) - x(-d.noPercent))
        .attr("height", y.bandwidth())
        .attr("fill", COLOR_MAP.No)
        .style("cursor", "pointer")
        .on("mouseenter", function (event, d) {
          d3.select(this).attr("opacity", 0.75);

          d3.select(tooltipRef.current)
            .style("opacity", "1")
            .html(`
              <div class="tooltip-title">${d.ease_vote}</div>
              <div><strong>No</strong></div>
              <div>${d.noN} respondents</div>
              <div>${d3.format(".1%")(d.noPercent)}</div>
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
          d3.select(this).attr("opacity", 1);
          d3.select(tooltipRef.current).style("opacity", "0");
        });

      chart
        .selectAll(".bar-yes")
        .data(wide)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", (d) => y(d.ease_vote) ?? 0)
        .attr("width", (d) => x(d.yesPercent) - x(0))
        .attr("height", y.bandwidth())
        .attr("fill", COLOR_MAP.Yes)
        .style("cursor", "pointer")
        .on("mouseenter", function (event, d) {
          d3.select(this).attr("opacity", 0.75);

          d3.select(tooltipRef.current)
            .style("opacity", "1")
            .html(`
              <div class="tooltip-title">${d.ease_vote}</div>
              <div><strong>Yes</strong></div>
              <div>${d.yesN} respondents</div>
              <div>${d3.format(".1%")(d.yesPercent)}</div>
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
          d3.select(this).attr("opacity", 1);
          d3.select(tooltipRef.current).style("opacity", "0");
        });

      chart
        .append("text")
        .attr("x", x(-0.5))
        .attr("y", -18)
        .attr("text-anchor", "middle")
        .attr("font-weight", 700)
        .attr("fill", "#1f1f1f")
        .text("Did not vote");

      chart
        .append("text")
        .attr("x", x(0.5))
        .attr("y", -18)
        .attr("text-anchor", "middle")
        .attr("font-weight", 700)
        .attr("fill", "#1f1f1f")
        .text("Voted");
    });
  }, []);

  return (
    <div ref={containerRef} className="chart-container">
      <svg ref={ref}></svg>
      <div ref={tooltipRef} className="chart-tooltip" />
    </div>
  );
}