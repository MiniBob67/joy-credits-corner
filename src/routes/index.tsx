import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

const PROMO_PACKAGES = [
  { robux: "24,000", old: "22,500", price: "1 149,99 zł" },
  { robux: "11,000", old: "10,000", price: "599,99 zł" },
  { robux: "5,250", old: "4,500", price: "299,99 zł" },
  { robux: "3,625", old: "3,150", price: "199,99 zł" },
  { robux: "2,000", old: "1,700", price: "119,99 zł" },
];

const NORMAL_PACKAGES = [
  { robux: "1,500", old: "1,200", price: "79,99 zł" },
];

function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sendOpen, setSendOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  async function findAvatar() {
    const id = userId.trim();

    if (!id || !/^\d+$/.test(id)) return;

    setLoadingAvatar(true);
    setAvatar("");

    try {
      const response = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=false`,
      );

      const data = await response.json();

      if (data.data?.[0]?.imageUrl) {
        setAvatar(data.data[0].imageUrl);
      }
    } catch {
      setAvatar("");
    } finally {
      setLoadingAvatar(false);
    }
  }

  function selectPackage(robux: string) {
    setSelected(robux);
  }

  function openSend() {
    setSendOpen(true);
  }

  function closeSend() {
    setSendOpen(false);
  }

  return (
    <div className="site">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">R$</div>

          <div className="brand-text">
            <strong>Robux Center</strong>
            <span>Currency Store</span>
          </div>
        </div>

        <button className="send-button" onClick={openSend}>
          Send
          <span>→</span>
        </button>
      </header>

      <main className="content">
        <section className="hero">
          <h1>Enjoy up to 25% more Robux</h1>
          <p>Get more Robux with selected packages.</p>
        </section>

        <section className="package-section">
          <div className="cards">
            {PROMO_PACKAGES.map((item) => (
              <button
                key={item.robux}
                className={`package-card ${
                  selected === item.robux ? "active" : ""
                }`}
                onClick={() => selectPackage(item.robux)}
              >
                <div className="robux-icon">R$</div>

                <div className="package-info">
                  <strong>{item.robux}</strong>

                  <span className="old-value">
                    {item.old}
                  </span>

                  <span className="robux-label">Robux</span>
                </div>

                <div className="price">{item.price}</div>

                {selected === item.robux && (
                  <div className="selected-check">✓</div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="normal-section">
          <h2>Robux packages</h2>

          <div className="normal-card-row">
            {NORMAL_PACKAGES.map((item) => (
              <button
                key={item.robux}
                className={`normal-card ${
                  selected === item.robux ? "active" : ""
                }`}
                onClick={() => selectPackage(item.robux)}
              >
                <div className="normal-left">
                  <div className="robux-icon">R$</div>

                  <div>
                    <strong>{item.robux}</strong>

                    <div className="normal-sub">
                      <span className="old-value">
                        {item.old}
                      </span>
                      <span>Robux</span>
                    </div>
                  </div>
                </div>

                <strong className="normal-price">
                  {item.price}
                </strong>
              </button>
            ))}
          </div>
        </section>

        {selected && (
          <div className="selection-bar">
            <div>
              <span>Selected package</span>
              <strong>{selected} Robux</strong>
            </div>

            <button onClick={openSend}>
              Continue →
            </button>
          </div>
        )}

        {sendOpen && (
          <div className="overlay">
            <div className="send-panel">
              <button className="close" onClick={closeSend}>
                ×
              </button>

              <div className="send-title">
                <div className="send-icon">→</div>

                <div>
                  <h2>Send Robux</h2>
                  <p>Choose a recipient for your selected package.</p>
                </div>
              </div>

              <div className="chosen">
                <span>Selected package</span>
                <strong>
                  {selected ? `${selected} Robux` : "None selected"}
                </strong>
              </div>

              <label>Roblox User ID</label>

              <div className="user-input">
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                />

                <button
                  onClick={findAvatar}
                  disabled={loadingAvatar}
                >
                  {loadingAvatar ? "..." : "Find"}
                </button>
              </div>

              {avatar && (
                <div className="user-preview">
                  <img src={avatar} alt="Avatar" />

                  <div>
                    <span>Recipient</span>
                    <strong>User {userId}</strong>
                  </div>

                  <b>✓</b>
                </div>
              )}

              <button
                className="confirm"
                disabled={!selected || !userId}
                onClick={() => {
                  closeSend();
                }}
              >
                Send {selected || "Robux"}
                <span>→</span>
              </button>

              <p className="small-note">
                No account credentials are requested.
              </p>
            </div>
          </div>
        )}
      </main>

      <div className="frh">FRH</div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #0f1114;
          color: #f4f5f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .site {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% -15%,
              #26313d 0%,
              #15191e 38%,
              #0f1114 72%
            );
          position: relative;
          padding-bottom: 55px;
        }

        .topbar {
          height: 68px;
          border-bottom: 1px solid #2b3037;
          background: rgba(13, 15, 18, 0.94);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brand-logo {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #00a2ff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-weight: 900;
          box-shadow: 0 5px 20px rgba(0, 162, 255, .25);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .brand-text strong {
          font-size: 15px;
        }

        .brand-text span {
          font-size: 10px;
          color: #707781;
        }

        .send-button {
          height: 40px;
          padding: 0 17px;
          border: 0;
          border-radius: 7px;
          background: #00a2ff;
          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: .15s;
        }

        .send-button:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .send-button span {
          font-size: 18px;
        }

        .content {
          width: min(930px, calc(100% - 28px));
          margin: 0 auto;
          padding-top: 55px;
        }

        .hero {
          text-align: center;
          margin-bottom: 32px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(25px, 4vw, 34px);
          letter-spacing: -.7px;
        }

        .hero p {
          color: #858d97;
          font-size: 13px;
          margin-top: 9px;
        }

        .package-section {
          width: 100%;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .package-card {
          min-height: 205px;
          padding: 22px 13px 17px;
          border-radius: 12px;
          border: 1px solid #30353d;
          background: linear-gradient(
            145deg,
            #1c2025,
            #15181c
          );
          color: white;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          transition: .16s;
        }

        .package-card:hover {
          border-color: #4c5661;
          transform: translateY(-3px);
          background: #1d2228;
        }

        .package-card.active {
          border-color: #00a2ff;
          box-shadow: 0 0 0 1px #00a2ff,
            0 10px 35px rgba(0, 162, 255, .13);
        }

        .robux-icon {
          width: 43px;
          height: 43px;
          border-radius: 10px;
          background: #00a2ff;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 6px 20px rgba(0, 162, 255, .2);
        }

        .package-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .package-info strong {
          font-size: 24px;
          letter-spacing: -.4px;
        }

        .old-value {
          color: #777f89;
          text-decoration: line-through;
          font-size: 12px;
        }

        .robux-label {
          color: #969da6;
          font-size: 11px;
        }

        .price {
          font-size: 13px;
          font-weight: 800;
          color: #e8eaed;
        }

        .selected-check {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: #00a2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .normal-section {
          margin-top: 38px;
        }

        .normal-section h2 {
          font-size: 16px;
          margin: 0 0 13px;
        }

        .normal-card {
          width: 100%;
          min-height: 82px;
          padding: 15px 18px;
          border: 1px solid #30353d;
          border-radius: 11px;
          background: #191c20;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: .15s;
        }

        .normal-card:hover {
          border-color: #4c5661;
        }

        .normal-card.active {
          border-color: #00a2ff;
          box-shadow: 0 0 0 1px #00a2ff;
        }

        .normal-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .normal-left strong {
          font-size: 17px;
        }

        .normal-sub {
          display: flex;
          gap: 6px;
          color: #707781;
          font-size: 11px;
          margin-top: 4px;
        }

        .normal-price {
          font-size: 14px;
        }

        .selection-bar {
          margin-top: 20px;
          padding: 13px 15px;
          border: 1px solid #30353d;
          border-radius: 10px;
          background: #191c20;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .selection-bar div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .selection-bar span {
          color: #707781;
          font-size: 10px;
          text-transform: uppercase;
        }

        .selection-bar strong {
          font-size: 14px;
        }

        .selection-bar button {
          border: 0;
          border-radius: 7px;
          background: #00a2ff;
          color: white;
          padding: 10px 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0, 0, 0, .68);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          backdrop-filter: blur(7px);
        }

        .send-panel {
          width: min(450px, 100%);
          padding: 29px;
          border-radius: 14px;
          border: 1px solid #353b43;
          background: #191c20;
          box-shadow: 0 30px 100px rgba(0,0,0,.6);
          position: relative;
        }

        .close {
          position: absolute;
          top: 15px;
          right: 17px;
          border: 0;
          background: transparent;
          color: #747c86;
          font-size: 25px;
          cursor: pointer;
        }

        .send-title {
          display: flex;
          gap: 13px;
          align-items: center;
          margin-bottom: 25px;
        }

        .send-icon {
          width: 45px;
          height: 45px;
          border-radius: 10px;
          background: #00a2ff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 900;
          font-size: 21px;
        }

        .send-title h2 {
          margin: 0;
          font-size: 21px;
        }

        .send-title p {
          margin: 4px 0 0;
          color: #7d858f;
          font-size: 11px;
        }

        .chosen {
          padding: 13px;
          border-radius: 8px;
          border: 1px solid #2e343b;
          background: #121519;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chosen span {
          color: #707781;
          font-size: 11px;
        }

        .chosen strong {
          color: #00a2ff;
          font-size: 14px;
        }

        label {
          display: block;
          color: #d7dbe0;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .user-input {
          height: 48px;
          border: 1px solid #343a42;
          border-radius: 8px;
          background: #101216;
          display: flex;
          overflow: hidden;
        }

        .user-input:focus-within {
          border-color: #00a2ff;
        }

        .user-input input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          padding: 0 13px;
        }

        .findButton {
          margin: 7px;
          border: 0;
          border-radius: 6px;
          background: #292f36;
          color: white;
          padding: 0 12px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .user-preview {
          margin-top: 12px;
          padding: 10px;
          border-radius: 8px;
          background: #121519;
          border: 1px solid #2d333a;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-preview img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 8px;
        }

        .user-preview div {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .user-preview span {
          color: #707781;
          font-size: 10px;
        }

        .user-preview strong {
          font-size: 12px;
        }

        .user-preview b {
          color: #25d47b;
        }

        .confirm {
          width: 100%;
          height: 49px;
          margin-top: 17px;
          border: 0;
          border-radius: 8px;
          background: #00a2ff;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .confirm:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .confirm span {
          margin-left: 7px;
          font-size: 17px;
        }

        .small-note {
          text-align: center;
          color: #555d67;
          font-size: 9px;
          margin: 13px 0 0;
        }

        .frh {
          position: fixed;
          left: 13px;
          bottom: 9px;
          color: #4b5159;
          font-size: 10px;
          letter-spacing: 1px;
          user-select: none;
          z-index: 20;
        }

        @media (max-width: 800px) {
          .cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .topbar {
            padding: 0 15px;
          }

          .content {
            padding-top: 35px;
          }

          .cards {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .package-card {
            min-height: 180px;
          }

          .package-info strong {
            font-size: 21px;
          }

          .send-panel {
            padding: 24px 19px;
          }
        }
      `}</style>
    </div>
  );
}
