import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Row = {
  label: string;
  percent: number;
};

type MiniBarChartProps = {
  file: string;
  labelColumn: string;
  maxItems?: number;
};

export default function MiniBarChart({
  file,
  labelColumn,
  maxItems = 4,
}: MiniBarChartProps) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    d3.csv(`${import.meta.env.BASE_URL}data/${file}`).then((data) => {
      const parsed: Row[] = data
        .map((d) => ({
          label: d[labelColumn] ?? "",
          percent: Number(d.percent),
        }))
        .filter((d) => d.label && !Number.isNaN(d.percent))
        .sort((a, b) => b.percent - a.percent)
        .slice(0, maxItems);

      const width = 380;
      const height = parsed.length * 34;
      const maxLabelLength = d3.max(parsed, d => d.label.length) ?? 0;

const margin = {
  top: 4,
  right: 30,
  bottom: 4,
  left: Math.min(200, maxLabelLength * 7) // adjust based on label length
};

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const y = d3
        .scaleBand()
        .domain(parsed.map((d) => d.label))
        .range([0, innerHeight])
        .padding(0.35);

      const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);

      chart
        .selectAll("rect")
        .data(parsed)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d) => y(d.label) ?? 0)
        .attr("width", (d) => x(d.percent))
        .attr("height", y.bandwidth())
        .attr("fill", "#d91023");

      chart
        .selectAll(".mini-label")
        .data(parsed)
        .enter()
        .append("text")
        .attr("class", "mini-label")
        .attr("x", -8)
        .attr("y", (d) => (y(d.label) ?? 0) + y.bandwidth() / 2 + 4)
        .attr("text-anchor", "end")
        .attr("font-size", 11)
        .attr("fill", "#6b625c")
        .text((d) =>
          d.label.length > 22 ? `${d.label.slice(0, 22)}…` : d.label
        );

      chart
        .selectAll(".mini-value")
        .data(parsed)
        .enter()
        .append("text")
        .attr("class", "mini-value")
        .attr("x", (d) => x(d.percent) + 6)
        .attr("y", (d) => (y(d.label) ?? 0) + y.bandwidth() / 2 + 4)
        .attr("font-size", 11)
        .attr("font-weight", 700)
        .attr("fill", "#1f1f1f")
        .text((d) => d3.format(".0%")(d.percent));
    });
  }, [file, labelColumn, maxItems]);

  return <svg className="mini-chart" ref={ref}></svg>;
}