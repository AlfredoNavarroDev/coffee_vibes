import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f7f3ec",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 9h13a3 3 0 010 6h-1"
            stroke="#4a2818"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 9v6a4 4 0 004 4h4a4 4 0 004-4V9H4z"
            fill="#8c4a2f"
          />
          <path
            d="M7 4c0 1-1.2 1-1.2 2S7 7 7 8M11 4c0 1-1.2 1-1.2 2S11 7 11 8"
            stroke="#4a2818"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    size
  );
}
