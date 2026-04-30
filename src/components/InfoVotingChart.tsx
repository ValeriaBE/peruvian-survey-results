import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
    informed: string;
    voted: string;
    n: number;
    percent: number;
};

const INFORMED_ORDER = [
    "Not at all informed",
    "Not very informed",
    "Somewhat informed",
    "Very informed",
    "Not sure",
];

const VOTED_ORDER = ["Yes", "No", "Prefer not to say"];

const COLOR_MAP: Record<string, string> = {
  Yes: "#d91023",
  No: "#f4c7b9",
  "Prefer not to say": "#b9855b",
};

export default function InfoVotingChart() {
    const ref = useRef<SVGSVGElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        d3.csv(`${import.meta.env.BASE_URL}data/info_by_voting.csv`).then((data) => {
            const parsed: Row[] = data.map((d) => ({
                informed: d.informed ?? "",
                voted: d.voted ?? "",
                n: Number(d.n),
                percent: Number(d.percent),
            }));

            const width = 850;
            const height = 500;
            const margin = { top: 40, right: 180, bottom: 120, left: 80 };

            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const svg = d3.select(ref.current);
            svg.selectAll("*").remove();

            svg.attr("width", width).attr("height", height);

            const chart = svg
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3
                .scaleBand()
                .domain(INFORMED_ORDER)
                .range([0, innerWidth])
                .padding(0.22);

            const y = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

            const color = d3
                .scaleOrdinal<string>()
                .domain(VOTED_ORDER)
                .range(VOTED_ORDER.map((d) => COLOR_MAP[d]));

            const grouped = INFORMED_ORDER.map((level) =>
                parsed.filter((d) => d.informed === level)
            );

            const stack = d3
                .stack<Row[]>()
                .keys(VOTED_ORDER)
                .value((group, key) => {
                    const found = group.find((d) => d.voted === key);
                    return found ? found.percent : 0;
                });

            const stackedData = stack(grouped);

            chart
                .append("g")
                .selectAll("g")
                .data(stackedData)
                .enter()
                .append("g")
                .attr("fill", (d) => color(d.key))
                .selectAll("rect")
                .data((series) =>
                    series.map((segment, i) => ({
                        segment,
                        informed: INFORMED_ORDER[i],
                        voted: series.key,
                        count:
                            grouped[i].find((d) => d.voted === series.key)?.n ?? 0,
                        percent:
                            grouped[i].find((d) => d.voted === series.key)?.percent ?? 0,
                    }))
                )
                .enter()
                .append("rect")
                .attr("x", (d) => x(d.informed) ?? 0)
                .attr("y", (d) => y(d.segment[1]))
                .attr("height", (d) => y(d.segment[0]) - y(d.segment[1]))
                .attr("width", x.bandwidth())
                .style("cursor", "pointer")
                .on("mouseenter", function (event, d) {
  d3.select(this).attr("opacity", 0.78);

  d3.select(tooltipRef.current)
    .style("opacity", "1")
    .html(`
      <div class="tooltip-title">${d.informed}</div>
      <div><strong>${d.voted}</strong></div>
      <div>${d.count} respondents</div>
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
                    d3.select(this).attr("opacity", 1);

                    d3.select(tooltipRef.current).style("opacity", "0");
                });

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
                .append("text")
                .attr("x", innerWidth / 2)
                .attr("y", innerHeight + 95)
                .attr("text-anchor", "middle")
                .attr("font-size", 18)
                .attr("font-weight", 700)
                .attr("fill", "#1f1f1f")
                .text("Level of information");

            chart
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -innerHeight / 2)
                .attr("y", -55)
                .attr("text-anchor", "middle")
                .attr("font-size", 18)
                .attr("font-weight", 700)
                .attr("fill", "#1f1f1f")
                .text("Percent of respondents");

            const legend = svg
                .append("g")
                .attr(
                    "transform",
                    `translate(${width - margin.right + 30}, ${margin.top + 80})`
                );

            legend
                .append("text")
                .attr("class", "legend-label")
                .attr("x", 0)
                .attr("y", -16)
                .attr("font-size", 16)
                .attr("font-weight", 700)
                .text("Voted");

            VOTED_ORDER.forEach((label, i) => {
                const row = legend
                    .append("g")
                    .attr("transform", `translate(0, ${i * 30})`);

                row
                    .append("rect")
                    .attr("width", 16)
                    .attr("height", 16)
                    .attr("fill", COLOR_MAP[label]);

                row
                    .append("text")
                    .attr("x", 24)
                    .attr("y", 13)
                    .attr("font-size", 14)
                    .attr("fill", "#1f1f1f")
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