import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Baatein - A quiet place to put your thoughts down";
export const size = {
  width: 1200,
  height: 1200,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 800,
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f4f4f5",
          borderRadius: "20%",
          fontFamily: "system-ui, sans-serif",
          fontWeight: "bold",
        }}
      >
        B
      </div>
    ),
    {
      ...size,
    }
  );
}
