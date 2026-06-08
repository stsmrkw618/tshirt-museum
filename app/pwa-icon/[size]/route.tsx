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
        <svg width={size} height={size} viewBox="0 0 512 512">
          {/*
            Tシャツシルエット（クルーネック・袖付き）
            ★なし・クリーンなシルエットのみ
            袖先はmaskableセーフゾーン（80%=x:51-461）内に収まっている
          */}
          <path
            d="
              M 200,90
              Q 256,54 312,90
              L 370,116
              L 454,152
              L 450,236
              L 370,210
              L 370,442
              L 142,442
              L 142,210
              L 62,236
              L 58,152
              L 142,116
              Z
            "
            fill="white"
          />
        </svg>
      </div>
    ),
    { width: size, height: size }
  );
}
