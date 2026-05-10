export const refreshFrequency = 1000 * 60 * 60; // refresh interval
export const command = "cat /Users/YourUser/Documents/Projects/DeckTop100/steamdeck_top.json";

export const render = ({ output }) => {
  if (!output) return <div> Loading...</div>;
  let games;
  try {
    games = JSON.parse(output);
  } catch {
    return <div>⚠️ JSON can't read.</div>;
  }

  return (
    <div
      style={{
        fontFamily: "SF Pro Display",
        color: "white",
        padding: "14px",
        width: "420px",
        height: "600px",
        background: "rgba(0,0,0,0.35)",
        borderRadius: "16px",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
      }}
    >
      <h2
        style={{
          margin: "0 0 12px 0",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        🎮 Steam Deck Top 100
      </h2>

      <div
        style={{
          overflowY: "scroll",
          maxHeight: "540px",
          paddingRight: "6px",
        }}
      >
        {games.map((g) => (
          <a
            href={g.url}
            key={g.url || `${g.rank}-${g.name}`}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              textDecoration: "none",
              color: "white",
              padding: "6px",
              borderRadius: "10px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <img
              src={g.image}
              alt={g.name}
              style={{
                width: "72px",
                height: "28px",
                borderRadius: "6px",
                marginRight: "10px",
                objectFit: "cover",
              }}
            />
            <div style={{ flexGrow: 1, overflow: "hidden" }}>
              <div
                style={{
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {g.rank}. {g.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.8,
                  marginTop: "2px",
                }}
              >
                {g.price}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
