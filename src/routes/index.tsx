import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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

const ALL_PACKAGES = [...PROMO_PACKAGES, ...NORMAL_PACKAGES];

const ROBUX_ICON =
  "https://images.rbxcdn.com/60bedb6518a319544c9445c519ba8d0e-robux_130x130.svg";

type Package = {
  robux: string;
  old: string;
  price: string;
};

function RobuxIcon({ small = false }: { small?: boolean }) {
  return (
    <img
      className={`robux-icon ${small ? "small" : ""}`}
      src={ROBUX_ICON}
      alt=""
      draggable={false}
    />
  );
}

function Home() {
  const [selected, setSelected] = useState<Package | null>(null);

  const [sendOpen, setSendOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [foundUsername, setFoundUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [searching, setSearching] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const name = username.trim();

    setFoundUsername("");
    setAvatar("");

    if (!name) {
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);

      try {
        const response = await fetch(
          "https://users.roblox.com/v1/usernames/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usernames: [name],
              excludeBannedUsers: false,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("User lookup failed");
        }

        const data = await response.json();
        const user = data?.data?.[0];

        if (!user) {
          setFoundUsername("");
          setAvatar("");
          return;
        }

        setFoundUsername(user.name);

        const avatarResponse = await fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`
        );

        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();

          setAvatar(
            avatarData?.data?.[0]?.imageUrl || ""
          );
        }
      } catch {
        setFoundUsername("");
        setAvatar("");
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  function openSend() {
    // Jeśli nie wybrano paczki, automatycznie wybierz pierwszą.
    if (!selected) {
      setSelected(ALL_PACKAGES[0]);
    }

    setSent(false);
    setSendOpen(true);
  }

  function closeSend() {
    setSendOpen(false);
    setSent(false);
  }

  function confirmSend() {
    if (!selected || !foundUsername || !avatar) return;

    setSent(true);
  }

  return (
    <div className="page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #f5f5f5;
          color: #191919;
        }

        button,
        input {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% -100px,
              #ffffff,
              #f5f5f5 500px,
              #f3f3f3 900px
            );
          padding-bottom: 110px;
        }

        .topbar {
          height: 68px;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 34px;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .brand-icon {
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-icon .robux-icon {
          width: 30px;
          height: 30px;
        }

        .send-top {
          border: 0;
          background: #191919;
          color: white;
          height: 40px;
          padding: 0 21px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.15s ease;
        }

        .send-top:hover {
          background: #303030;
          transform: translateY(-1px);
        }

        .send-top:active {
          transform: translateY(0);
        }

        .content {
          width: min(780px, calc(100% - 32px));
          margin: 0 auto;
          padding-top: 48px;
        }

        .hero {
          text-align: center;
          margin-bottom: 30px;
        }

        .hero h1 {
          margin: 0;
          font-size: 31px;
          line-height: 1.15;
          letter-spacing: -1.1px;
          font-weight: 800;
        }

        .hero p {
          margin: 10px 0 0;
          color: #6d6d6d;
          font-size: 14px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 14px;
        }

        .cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card {
          width: 100%;
          min-height: 94px;
          background: white;
          border: 1px solid #e1e1e1;
          border-radius: 13px;
          display: flex;
          align-items: center;
          padding: 15px 19px;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            transform 0.15s ease;
        }

        .card:hover {
          border-color: #c9c9c9;
          box-shadow: 0 4px 18px rgba(0,0,0,.055);
          transform: translateY(-1px);
        }

        .card.selected {
          border-color: #191919;
          box-shadow: 0 0 0 1px #191919;
        }

        .icon-box {
          width: 58px;
          height: 58px;
          border-radius: 11px;
          background: #f3f3f3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-right: 17px;
        }

        .robux-icon {
          width: 43px;
          height: 43px;
          object-fit: contain;
          display: block;
        }

        .robux-icon.small {
          width: 29px;
          height: 29px;
        }

        .package-info {
          min-width: 0;
          flex: 1;
        }

        .package-amount {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 20px;
          line-height: 1;
          font-weight: 800;
        }

        .package-old {
          color: #a0a0a0;
          font-size: 14px;
          font-weight: 500;
          text-decoration: line-through;
        }

        .package-label {
          margin-top: 7px;
          color: #777;
          font-size: 12px;
        }

        .package-price {
          font-size: 16px;
          font-weight: 800;
          white-space: nowrap;
          margin-left: 18px;
        }

        .check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #d2d2d2;
          margin-left: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card.selected .check {
          border-color: #191919;
          background: #191919;
        }

        .check-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        }

        .normal-section {
          margin-top: 34px;
        }

        .selection-bar {
          position: fixed;
          left: 50%;
          bottom: 25px;
          transform: translateX(-50%);
          width: min(600px, calc(100% - 28px));
          min-height: 65px;
          background: #191919;
          border-radius: 13px;
          padding: 10px 12px 10px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          box-shadow: 0 12px 40px rgba(0,0,0,.2);
          z-index: 30;
        }

        .selection-text {
          color: white;
          min-width: 0;
        }

        .selection-text strong {
          display: block;
          font-size: 13px;
        }

        .selection-text span {
          display: block;
          color: #bdbdbd;
          font-size: 11px;
          margin-top: 3px;
        }

        .selection-send {
          border: 0;
          border-radius: 9px;
          background: white;
          color: #191919;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          flex-shrink: 0;
        }

        .selection-send:hover {
          background: #eeeeee;
        }

        .frh {
          position: fixed;
          left: 11px;
          bottom: 7px;
          color: #a6a6a6;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.5px;
          user-select: none;
          z-index: 50;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.48);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 100;
          backdrop-filter: blur(3px);
        }

        .modal {
          width: min(450px, 100%);
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 80px rgba(0,0,0,.25);
          overflow: hidden;
        }

        .modal-header {
          padding: 21px 23px;
          border-bottom: 1px solid #eeeeee;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 800;
        }

        .close {
          border: 0;
          background: transparent;
          color: #777;
          font-size: 24px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          border-radius: 7px;
        }

        .close:hover {
          background: #f1f1f1;
          color: #222;
        }

        .modal-body {
          padding: 23px;
        }

        .selected-preview {
          display: flex;
          align-items: center;
          gap: 13px;
          background: #f6f6f6;
          border-radius: 11px;
          padding: 12px;
          margin-bottom: 22px;
        }

        .selected-preview .robux-icon {
          width: 36px;
          height: 36px;
        }

        .preview-info strong {
          display: block;
          font-size: 15px;
        }

        .preview-info span {
          color: #777;
          font-size: 12px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .username-input {
          width: 100%;
          height: 45px;
          border: 1px solid #d8d8d8;
          border-radius: 8px;
          padding: 0 13px;
          outline: none;
          font-size: 14px;
        }

        .username-input:focus {
          border-color: #777;
        }

        .search-status {
          height: 18px;
          margin-top: 7px;
          color: #999;
          font-size: 11px;
        }

        .user-result {
          margin-top: 5px;
          border: 1px solid #e2e2e2;
          border-radius: 11px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 54px;
          height: 54px;
          border-radius: 9px;
          object-fit: cover;
          background: #eeeeee;
        }

        .avatar-name {
          font-weight: 800;
          font-size: 14px;
        }

        .avatar-id {
          color: #888;
          font-size: 11px;
          margin-top: 3px;
        }

        .not-found {
          margin-top: 5px;
          border-radius: 9px;
          background: #f7f7f7;
          color: #888;
          padding: 12px;
          font-size: 12px;
        }

        .modal-footer {
          margin-top: 22px;
        }

        .confirm-button {
          width: 100%;
          height: 46px;
          border: 0;
          border-radius: 9px;
          background: #191919;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .confirm-button:hover {
          background: #303030;
        }

        .confirm-button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .success {
          text-align: center;
          padding: 18px 0 5px;
        }

        .success-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #191919;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          font-size: 25px;
          font-weight: 900;
        }

        .success h2 {
          margin: 0;
          font-size: 20px;
        }

        .success p {
          color: #777;
          font-size: 13px;
          line-height: 1.5;
          margin: 8px 20px 0;
        }

        .success-button {
          margin-top: 20px;
          width: 100%;
          height: 44px;
          border: 0;
          border-radius: 9px;
          background: #191919;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .note {
          color: #999;
          font-size: 10px;
          line-height: 1.45;
          text-align: center;
          margin: 11px 15px 0;
        }

        @media (max-width: 600px) {
          .topbar {
            padding: 0 16px;
          }

          .content {
            width: min(100% - 20px, 780px);
            padding-top: 32px;
          }

          .hero h1 {
            font-size: 25px;
          }

          .card {
            padding: 13px;
          }

          .icon-box {
            width: 50px;
            height: 50px;
            margin-right: 12px;
          }

          .icon-box .robux-icon {
            width: 36px;
            height: 36px;
          }

          .package-amount {
            font-size: 17px;
          }

          .package-price {
            font-size: 14px;
            margin-left: 8px;
          }

          .check {
            margin-left: 8px;
          }
        }
      `}</style>

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <RobuxIcon small />
          </div>

          <span>Robux</span>
        </div>

        <button className="send-top" onClick={openSend}>
          Send
        </button>
      </header>

      <main className="content">
        <section className="hero">
          <h1>Enjoy up to 25% more Robux</h1>
          <p>Choose a package below.</p>
        </section>

        <section>
          <h2 className="section-title">
            Robux packages
          </h2>

          <div className="cards">
            {PROMO_PACKAGES.map((pkg) => {
              const isSelected =
                selected?.robux === pkg.robux;

              return (
                <div
                  key={pkg.robux}
                  className={`card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => setSelected(pkg)}
                >
                  <div className="icon-box">
                    <RobuxIcon />
                  </div>

                  <div className="package-info">
                    <div className="package-amount">
                      <span>{pkg.robux}</span>

                      <span className="package-old">
                        {pkg.old}
                      </span>
                    </div>

                    <div className="package-label">
                      Robux package
                    </div>
                  </div>

                  <div className="package-price">
                    {pkg.price}
                  </div>

                  <div className="check">
                    {isSelected && (
                      <div className="check-inner" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="normal-section">
          <h2 className="section-title">
            More packages
          </h2>

          <div className="cards">
            {NORMAL_PACKAGES.map((pkg) => {
              const isSelected =
                selected?.robux === pkg.robux;

              return (
                <div
                  key={pkg.robux}
                  className={`card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => setSelected(pkg)}
                >
                  <div className="icon-box">
                    <RobuxIcon />
                  </div>

                  <div className="package-info">
                    <div className="package-amount">
                      <span>{pkg.robux}</span>

                      <span className="package-old">
                        {pkg.old}
                      </span>
                    </div>

                    <div className="package-label">
                      Robux package
                    </div>
                  </div>

                  <div className="package-price">
                    {pkg.price}
                  </div>

                  <div className="check">
                    {isSelected && (
                      <div className="check-inner" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {selected && (
        <div className="selection-bar">
          <div className="selection-text">
            <strong>
              {selected.robux} Robux selected
            </strong>

            <span>{selected.price}</span>
          </div>

          <button
            className="selection-send"
            onClick={openSend}
          >
            Send
          </button>
        </div>
      )}

      <div className="frh">FRH</div>

      {sendOpen && selected && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                Send Robux
              </div>

              <button
                className="close"
                onClick={closeSend}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {!sent ? (
                <>
                  <div className="selected-preview">
                    <RobuxIcon />

                    <div className="preview-info">
                      <strong>
                        {selected.robux} Robux
                      </strong>

                      <span>
                        {selected.price}
                      </span>
                    </div>
                  </div>

                  <label className="field-label">
                    Roblox username
                  </label>

                  <input
                    className="username-input"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Enter username"
                    autoComplete="off"
                    spellCheck={false}
                  />

                  <div className="search-status">
                    {searching
                      ? "Finding user..."
                      : ""}
                  </div>

                  {foundUsername && avatar && (
                    <div className="user-result">
                      <img
                        className="avatar"
                        src={avatar}
                        alt=""
                      />

                      <div>
                        <div className="avatar-name">
                          {foundUsername}
                        </div>

                        <div className="avatar-id">
                          Roblox user
                        </div>
                      </div>
                    </div>
                  )}

                  {username.trim() &&
                    !searching &&
                    !foundUsername && (
                      <div className="not-found">
                        User not found.
                      </div>
                    )}

                  <div className="modal-footer">
                    <button
                      className="confirm-button"
                      disabled={
                        !foundUsername ||
                        !avatar ||
                        searching
                      }
                      onClick={confirmSend}
                    >
                      Send
                    </button>

                    <div className="note">
                      FRH — Fake Robux Hub. No account
                      credentials are requested.
                    </div>
                  </div>
                </>
              ) : (
                <div className="success">
                  <div className="success-icon">
                    ✓
                  </div>

                  <h2>
                    Send preview created
                  </h2>

                  <p>
                    {selected.robux} Robux package
                    selected for @{foundUsername}.
                  </p>

                  <button
                    className="success-button"
                    onClick={closeSend}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
