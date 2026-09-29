import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  const findAvatar = async () => {
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
  };

  const startDemo = () => {
    if (!userId || !amount || Number(amount) <= 0) return;

    setProcessing(true);
    setFinished(false);
    setProgress(0);

    let value = 0;

    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 9) + 4;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);

        setTimeout(() => {
          setProcessing(false);
          setFinished(true);
        }, 600);
      }

      setProgress(value);
    }, 300);
  };

  const reset = () => {
    setProcessing(false);
    setFinished(false);
    setProgress(0);
    setUserId("");
    setAmount("");
    setAvatar("");
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <div className="logoBox">R</div>
          <span>Robux Center</span>
        </div>

        <div className="status">
          <span />
          Online
        </div>
      </header>

      <main className="main">
        <section className="panel">
          {!processing && !finished && (
            <>
              <div className="hero">
                <div className="heroIcon">R$</div>

                <h1>Robux Transfer</h1>

                <p>
                  Create a fictional Robux transfer preview using
                  publicly available avatar information.
                </p>
              </div>

              <div className="field">
                <label>Roblox User ID</label>

                <div className="input">
                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Example: 123456789"
                    inputMode="numeric"
                  />

                  <button
                    className="lookup"
                    onClick={findAvatar}
                    disabled={loadingAvatar}
                  >
                    {loadingAvatar ? "..." : "Find"}
                  </button>
                </div>
              </div>

              {avatar && (
                <div className="profile">
                  <img src={avatar} alt="Roblox avatar" />

                  <div>
                    <span>Recipient avatar</span>
                    <strong>User ID: {userId}</strong>
                  </div>

                  <div className="verified">✓</div>
                </div>
              )}

              <div className="field">
                <label>Amount</label>

                <div className="amountInput">
                  <span>R$</span>

                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="preview">
                <div>
                  <span>Recipient</span>
                  <strong>
                    {userId ? `User ${userId}` : "Not selected"}
                  </strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>
                    {amount
                      ? `${Number(amount).toLocaleString()} R$`
                      : "—"}
                  </strong>
                </div>
              </div>

              <button
                className="primary"
                onClick={startDemo}
                disabled={
                  !userId ||
                  !amount ||
                  Number(amount) <= 0
                }
              >
                Preview Transfer
                <b>→</b>
              </button>

              <div className="notice">
                <span>ⓘ</span>
                This is a fictional transfer preview. No Robux are
                actually transferred.
              </div>
            </>
          )}

          {processing && (
            <div className="processing">
              <div className="spinner">
                <div>R$</div>
              </div>

              <h1>Preparing preview</h1>

              <p>
                Generating a fictional transfer preview...
              </p>

              <div className="progress">
                <div style={{ width: `${progress}%` }} />
              </div>

              <div className="percent">
                <span>{progress}%</span>
                <span>Please wait</span>
              </div>

              {avatar && (
                <img
                  className="processingAvatar"
                  src={avatar}
                  alt="Avatar"
                />
              )}
            </div>
          )}

          {finished && (
            <div className="finished">
              <div className="successIcon">✓</div>

              <h1>Preview ready</h1>

              <p>
                Your fictional transfer preview has been created.
              </p>

              {avatar && (
                <img
                  className="finishedAvatar"
                  src={avatar}
                  alt="Avatar"
                />
              )}

              <div className="result">
                <span>Preview amount</span>

                <strong>
                  +{Number(amount).toLocaleString()} R$
                </strong>
              </div>

              <div className="transaction">
                <span>Preview ID</span>
                <strong>
                  DEMO-{Math.floor(10000000 + Math.random() * 89999999)}
                </strong>
              </div>

              <button className="primary" onClick={reset}>
                New Preview
              </button>
            </div>
          )}
        </section>

        <footer>
          Fan-made interface • No real Robux transactions
        </footer>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #0d0f12;
          color: #f4f5f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        .app {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% -20%,
              #27313d 0%,
              #121519 38%,
              #0d0f12 75%
            );
        }

        .navbar {
          height: 64px;
          padding: 0 28px;
          border-bottom: 1px solid #292d33;
          background: rgba(13, 15, 18, .92);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 11px;
          font-weight: 800;
        }

        .logoBox {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          background: #00a2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          box-shadow: 0 5px 20px rgba(0,162,255,.25);
        }

        .status {
          color: #8e969f;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .status span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #25d47b;
          box-shadow: 0 0 8px #25d47b;
        }

        .main {
          min-height: calc(100vh - 64px);
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          padding: 45px 18px;
        }

        .panel {
          width: 100%;
          max-width: 475px;
          background: #191c20;
          border: 1px solid #30353c;
          border-radius: 15px;
          padding: 32px;
          box-shadow: 0 30px 80px rgba(0,0,0,.45);
        }

        .hero {
          text-align: center;
          margin-bottom: 30px;
        }

        .heroIcon {
          width: 60px;
          height: 60px;
          margin: auto auto 16px;
          border-radius: 14px;
          background: #00a2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 900;
          box-shadow: 0 10px 30px rgba(0,162,255,.25);
        }

        h1 {
          margin: 0;
          font-size: 25px;
        }

        .hero p {
          margin: 10px auto 0;
          max-width: 360px;
          color: #8e969f;
          font-size: 13px;
          line-height: 1.55;
        }

        .field {
          margin-top: 17px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: #d9dce0;
          font-size: 13px;
          font-weight: 700;
        }

        .input,
        .amountInput {
          height: 52px;
          border: 1px solid #353a42;
          border-radius: 9px;
          background: #101216;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .input:focus-within,
        .amountInput:focus-within {
          border-color: #00a2ff;
        }

        input {
          min-width: 0;
          width: 100%;
          height: 100%;
          padding: 0 14px;
          border: 0;
          outline: 0;
          color: white;
          background: transparent;
        }

        input::placeholder {
          color: #626a74;
        }

        .lookup {
          height: 34px;
          margin-right: 9px;
          padding: 0 13px;
          border: 0;
          border-radius: 6px;
          color: white;
          background: #292e35;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .lookup:hover {
          background: #353b43;
        }

        .amountInput span {
          padding-left: 14px;
          color: #00a2ff;
          font-weight: 900;
        }

        .profile {
          margin-top: 13px;
          padding: 11px;
          border-radius: 9px;
          background: #121519;
          border: 1px solid #2d3239;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .profile img {
          width: 47px;
          height: 47px;
          border-radius: 8px;
          object-fit: cover;
          background: #292e35;
        }

        .profile div:nth-child(2) {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .profile span {
          color: #777f89;
          font-size: 11px;
        }

        .profile strong {
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .verified {
          color: #25d47b;
          font-weight: 900;
        }

        .preview {
          margin-top: 18px;
          padding: 14px;
          border-radius: 9px;
          background: #121519;
          border: 1px solid #292e35;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .preview div {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .preview span {
          color: #6e7680;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .6px;
        }

        .preview strong {
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .primary {
          width: 100%;
          height: 51px;
          margin-top: 15px;
          border: 0;
          border-radius: 8px;
          background: #00a2ff;
          color: white;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: .15s;
        }

        .primary:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .primary:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .primary b {
          font-size: 20px;
        }

        .notice {
          margin-top: 13px;
          padding: 11px;
          border-radius: 8px;
          background: #15181c;
          color: #737b85;
          font-size: 10px;
          line-height: 1.45;
          text-align: center;
        }

        .notice span {
          color: #00a2ff;
          margin-right: 4px;
        }

        .processing,
        .finished {
          text-align: center;
          padding: 12px 0;
        }

        .spinner {
          width: 82px;
          height: 82px;
          margin: 0 auto 25px;
          border: 4px solid #30353c;
          border-top-color: #00a2ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spin 1s linear infinite;
        }

        .spinner div {
          color: #00a2ff;
          font-weight: 900;
          animation: counter 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes counter {
          to {
            transform: rotate(-360deg);
          }
        }

        .processing p {
          color: #89919b;
          font-size: 13px;
        }

        .progress {
          margin-top: 27px;
          height: 8px;
          border-radius: 20px;
          background: #30353c;
          overflow: hidden;
        }

        .progress div {
          height: 100%;
          border-radius: 20px;
          background: #00a2ff;
          transition: width .2s;
          box-shadow: 0 0 12px rgba(0,162,255,.5);
        }

        .percent {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          color: #68717c;
          font-size: 11px;
        }

        .processingAvatar,
        .finishedAvatar {
          width: 82px;
          height: 82px;
          margin-top: 25px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid #353a42;
        }

        .successIcon {
          width: 78px;
          height: 78px;
          margin: 0 auto 22px;
          border-radius: 50%;
          background: #20c879;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 42px;
          font-weight: 900;
          box-shadow: 0 10px 35px rgba(32,200,121,.2);
        }

        .finished > p {
          color: #89919b;
          font-size: 13px;
        }

        .result {
          margin-top: 23px;
          padding: 20px;
          border: 1px solid #293038;
          border-radius: 10px;
          background: #121519;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .result span {
          color: #737b85;
          font-size: 11px;
        }

        .result strong {
          color: #20c879;
          font-size: 30px;
        }

        .transaction {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #626a74;
          font-size: 10px;
        }

        .transaction strong {
          color: #858d97;
          font-weight: 500;
        }

        footer {
          margin-top: 18px;
          color: #505760;
          font-size: 10px;
        }

        @media (max-width: 520px) {
          .navbar {
            padding: 0 16px;
          }

          .panel {
            padding: 24px 19px;
          }

          .main {
            padding: 25px 12px;
          }
        }
      `}</style>
    </div>
  );
}
