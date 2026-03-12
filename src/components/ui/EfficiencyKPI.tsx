import React from "react";
import { colors } from "../theme/colors";

interface EfficiencyKPIProps {
  efficiency: number; // ejemplo: 92.8
}

export const EfficiencyKPI: React.FC<EfficiencyKPIProps> = ({
  efficiency,
}) => {
  const size = 100;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const normalized = Math.min(Math.max(efficiency, 0), 100);
  const offset = circumference - (normalized / 100) * circumference;

  const getGradient = () => {
    if (efficiency >= 95) {
      return {
        id: "grad-leader",
        from: colors.performance.leader,
        to: colors.primary.main,
      };
    }

    if (efficiency >= 80) {
      return {
        id: "grad-mid",
        from: colors.primary.main,
        to: colors.neutral[400],
      };
    }

    return {
      id: "grad-low",
      from: colors.performance.underperforming,
      to: colors.neutral[400],
    };
  };

  const gradient = getGradient();

  return (
    <>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient
              id={gradient.id}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>

          {/* Fondo gris */}
          <circle
            stroke={colors.neutral[200]}
            fill="transparent"
            strokeWidth={stroke}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          {/* Arco activo */}
          <circle
            stroke={`url(#${gradient.id})`}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: "stroke-dashoffset 0.6s ease",
            }}
          />
        </svg>

        {/* Número centrado */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 600,
            color: colors.text.primary,
          }}
        >
          {isNaN(efficiency) ? "--" : `${efficiency.toFixed(1)}%`}
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 16,
          fontSize: 13,
          color: colors.text.tertiary,
        }}
      >
        Eficiencia
      </div>

      {/* Subtexto */}
      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          color: colors.text.muted,
        }}
      >
        vs mejor wallet actual
      </div>
    </>
  );
};