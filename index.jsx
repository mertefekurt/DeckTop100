export const refreshFrequency = 1000 * 60 * 60; // refresh interval
export const command = "cat /Users/YourUser/Documents/Projects/DeckTop100/steamdeck_top.json";

const EMPTY_STATE = "Loading...";
const JSON_ERROR = "⚠️ JSON can't read.";
const EMPTY_LIST = "No games found.";

const widgetStyle = {
  fontFamily: "SF Pro Display",
  color: "white",
  padding: "14px",
  width: "420px",
  height: "600px",
  background: "rgba(0,0,0,0.35)",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
  overflow: "hidden",
};
const titleStyle = {
  margin: "0 0 12px 0",
  fontSize: "18px",
  fontWeight: 600,
};
const listStyle = {
  overflowY: "scroll",
  maxHeight: "540px",
  paddingRight: "6px",
};
const itemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
  textDecoration: "none",
  color: "white",
  padding: "6px",
  borderRadius: "10px",
  transition: "background 0.2s",
};
const imageStyle = {
  width: "72px",
  height: "28px",
  borderRadius: "6px",
  marginRight: "10px",
  objectFit: "cover",
};
const nameStyle = {
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const priceStyle = {
  fontSize: "12px",
  opacity: 0.8,
  marginTop: "2px",
};

/**
 * Render the Übersicht widget from the Steam Deck chart JSON payload.
 */
export const render = ({ output }) => {
  if (!output) return <div>{EMPTY_STATE}</div>;

  let games;
  try {
    games = JSON.parse(output);
  } catch {
    return <div>{JSON_ERROR}</div>;
  }

  if (!Array.isArray(games) || games.length === 0) {
    return <div>{EMPTY_LIST}</div>;
  }

  return (
    <div style={widgetStyle}>
      <h2 style={titleStyle}>
        🎮 Steam Deck Top 100
      </h2>

      <div style={listStyle}>
        {games.map((game) => (
          <a
            href={game.url}
            key={game.url || `${game.rank}-${game.name}`}
            style={itemStyle}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <img
              src={game.image}
              alt={game.name}
              style={imageStyle}
            />
            <div style={{ flexGrow: 1, overflow: "hidden" }}>
              <div style={nameStyle}>
                {game.rank}. {game.name}
              </div>
              <div style={priceStyle}>
                {game.price}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
