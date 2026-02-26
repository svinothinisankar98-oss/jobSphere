import  { useState } from "react";

type FunnelItem = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: FunnelItem[];
  height?: number;
  title?: string;
};

export default function FunnelChart({ data, height = 260, title }: Props) {
  const width = 420;
  const sectionHeight = height / data.length;

  const [hovered, setHovered] = useState<{
    x: number;
    y: number;
    item: FunnelItem;
  } | null>(null);

  const maxWidth = width;
  const minWidth = width * 0.30;

  const getWidth = (i: number) => {
    const step = (maxWidth - minWidth) / (data.length - 1);
    return maxWidth - step * i;
  };

  return (
    <div
      style={{
        position: "relative",
        width: width,
        margin: "0 auto",
        padding: "14px 12px 8px",
        borderRadius: 14,
       
      }}
    >
      {/* Title */}
      {title && (
        <div
          style={{
            color: "#e5e7eb",
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 8,
            textAlign: "center",
            letterSpacing: 0.3,
          }}
        >
          {title}
        </div>
      )}

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block", margin: "0 auto" }}
      >
        {data.map((item, i) => {
          const topWidth = getWidth(i);
          const bottomWidth = getWidth(i + 1) || minWidth;

          const xTop = (width - topWidth) / 2;
          const xBottom = (width - bottomWidth) / 2;

          const yTop = i * sectionHeight;
          const yBottom = (i + 1) * sectionHeight;

          const path = `
            M ${xTop} ${yTop}
            L ${xTop + topWidth} ${yTop}
            L ${xBottom + bottomWidth} ${yBottom}
            L ${xBottom} ${yBottom}
            Z
          `;

          return (
            <g key={i}>
              <path
                d={path}
                fill={item.color}
                stroke={item.color}
                strokeWidth={1.5}
                style={{
                  cursor: "pointer",
                  transition: "0.25s",
                  filter: `drop-shadow(0 0 4px ${item.color}66)`,
                }}
                onMouseMove={(e) => {
                  const rect = (e.target as SVGElement).getBoundingClientRect();
                  setHovered({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    item,
                  });
                }}
                onMouseLeave={() => setHovered(null)}
              />

              {/* Percent text */}
              <text
                x={width / 2}
                y={yTop + sectionHeight / 2 + 4}
                fill="white"
                fontSize="14"
                textAnchor="middle"
                fontWeight="600"
                pointerEvents="none"
              >
                {item.value}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            left: hovered.x + 14,
            top: hovered.y - 10,
            background: "#111827",
            color: "white",
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: hovered.item.color,
              display: "inline-block",
            }}
          />
          {hovered.item.label} <b>{hovered.item.value}%</b>
        </div>
      )}
    </div>
  );
}