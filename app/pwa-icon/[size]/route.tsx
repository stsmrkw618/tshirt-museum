import { ImageResponse } from "next/og";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeStr } = await params;
  const size = parseInt(sizeStr, 10) || 512;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 512 512"
        >
          <path
            d="M 176,105
               L 80,112
               L 76,202
               L 170,199
               L 170,408
               L 342,408
               L 342,199
               L 436,202
               L 432,112
               L 336,105
               Q 314,102 300,120
               Q 278,152 256,155
               Q 234,152 212,120
               Q 198,102 176,105
               Z"
            fill="white"
          />
          <polygon
            points="256,230 263,252 287,252 268,265 275,287 256,274 237,287 244,265 225,252 249,252"
            fill="#0a0a0a"
            opacity="0.5"
          />
        </svg>
      </div>
    ),
    { width: size, height: size }
  );
}
