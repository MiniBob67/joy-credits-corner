import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((old) => {
        const next = old + Math.floor(Math.random() * 8) + 3;

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            setLoading(false);
            setSuccess(true);
          }, 700);

          return 100;
        }

        return next;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [loading]);

  const startTransfer = () => {
    if (!username.trim() || !amount || Number(amount) <= 0) return;

    setProgress(0);
    setSuccess(false);
    setLoading(true);
  };

  const reset = () => {
    setUsername("");
    setAmount("");
    setProgress(0);
    setSuccess(false);
    setLoading(false);
  };

  const status =
    progress < 20
      ? "Connecting..."
      : progress < 40
        ? "Finding user..."
        : progress < 60
          ? "Preparing transfer..."
          : progress < 80
            ? "Processing..."
            : "Finalizing...";

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <div className="brandIcon">R</div>
          <span>Robux Transfer</span>
        </div>

        <div className="topStatus">
          <span className="onlineDot" />
          Transfer service
        </div>
      </div>

      <main className="content">
        <div className="card">
          {!loading && !success && (
            <>
              <div className="header">
                <div className="headerIcon">R$</div>

                <h1>Send Robux</h1>

                <p>
                  Send Robux to another player using their username.
                </p>
              </div>

              <div className="form">
                <label>Recipient</label>

                <div className="inputBox">
                  <div className="miniAvatar">
                    {username.trim()
                      ? username.trim().charAt(0).toUpperCase()
                      : "?"}
                  </div>

                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    maxLength={30}
                  />
                </div>

                <label>Amount</label>

                <div className="inputBox robuxInput">
                  <span className="robuxSymbol">R$</span>

                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                  />

                  <span className="robuxText">Robux</span>
                </div>

                <div className="summary">
                  <div>
                    <span>Recipient</span>
                    <strong>
                      {username.trim() ? `@${username}` : "—"}
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
                  className="sendButton"
                  onClick={startTransfer}
                  disabled={
                    !username.trim() ||
                    !amount ||
                    Number(amount) <= 0
                  }
                >
                  Continue
                  <span>›</span>
                </button>
              </div>
            </>
          )}

          {loading && (
            <div className="processing">
              <div className="loader">
                <div className="loaderInner">R$</div>
              </div>

              <h1>Processing transfer</h1>

              <p className="processingText">{status}</p>

              <div className="progressOuter">
                <div
                  className="progressInner"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="progressInfo">
                <span>{progress}%</span>
                <span>Please wait...</span>
              </div>

              <div className="recipientPreview">
                <div className="bigAvatar">
                  {username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>@{username}</strong>
                  <span>
                    {Number(amount).toLocaleString()} Robux
                  </span>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="success">
              <div className="check">✓</div>

              <h1>Transfer complete</h1>

              <p className="successText">
                The transfer has been successfully processed.
              </p>

              <div className="receivedCard">
                <span>Amount</span>

                <strong>
                  +{Number(amount).toLocaleString()} R$
                </strong>

                <small>Robux</small>
              </div>

              <div className="userCard">
                <div className="bigAvatar">
                  {username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <span>Recipient</span>
                  <strong>@{username}</strong>
                </div>
              </div>

              <div className="transaction">
                Transaction ID
                <strong>RBX-{Math.floor(10000000 + Math.random() * 89999999)}</strong>
              </div>

              <button className="againButton" onClick={reset}>
                Make another transfer
              </button>
            </div>
          )}
        </div>

        <p className="footer">
          This is a fictional fan-made interface. No real Robux are
          transferred.
        </p>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #111214;
          color: #f1f2f3;
          font-family: Arial, Helvetica, sans-serif;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% -10%, #29303a 0%, #111214 45%),
            #111214;
        }

        .topbar {
          height: 64px;
          border-bottom: 1px solid #292c31;
          background: rgba(17, 18, 20, 0.92);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 17px;
          font-weight: 700;
        }

        .brandIcon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #00a2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
        }

        .topStatus {
          color: #a8adb5;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .onlineDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #27d17f;
          box-shadow: 0 0 8px #27d17f;
        }

        .content {
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 18px;
        }

        .card {
          width: 100%;
          max-width: 470px;
          background: #1b1d21;
          border: 1px solid #30343a;
          border-radius: 14px;
          padding: 34px;
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .headerIcon {
          width: 58px;
          height: 58px;
          margin: 0 auto 17px;
          border-radius: 13px;
          background: #00a2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          font-weight: 900;
          box-shadow: 0 8px 25px rgba(0, 162, 255, 0.25);
        }

        h1 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.3px;
        }

        .header p {
          margin: 9px 0 0;
          color: #9298a1;
          font-size: 14px;
          line-height: 1.5;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        label {
          color: #d7d9dd;
          font-size: 13px;
          font-weight: 700;
          margin-top: 5px;
        }

        .inputBox {
          height: 52px;
          background: #111316;
          border: 1px solid #353941;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          transition: border-color 0.15s;
        }

        .inputBox:focus-within {
          border-color: #00a2ff;
        }

        .miniAvatar {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #343940;
          color: #dfe2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          margin-right: 10px;
        }

        input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 15px;
        }

        input::placeholder {
          color: #666c75;
        }

        .robuxSymbol {
          color: #00a2ff;
          font-weight: 900;
          margin-right: 11px;
        }

        .robuxText {
          color: #737983;
          font-size: 13px;
          white-space: nowrap;
        }

        .summary {
          margin-top: 13px;
          padding: 14px;
          background: #15171a;
          border: 1px solid #292d32;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .summary div {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .summary span {
          color: #777d86;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary strong {
          color: #e7e9ec;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sendButton,
        .againButton {
          margin-top: 8px;
          height: 50px;
          border: none;
          border-radius: 8px;
          background: #00a2ff;
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.12s, filter 0.12s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .sendButton:hover:not(:disabled),
        .againButton:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .sendButton:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sendButton span {
          font-size: 23px;
          line-height: 0;
        }

        .processing,
        .success {
          text-align: center;
          padding: 15px 0;
        }

        .loader {
          width: 82px;
          height: 82px;
          margin: 0 auto 24px;
          border-radius: 50%;
          border: 4px solid #30343a;
          border-top-color: #00a2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: spin 1s linear infinite;
        }

        .loaderInner {
          animation: counterSpin 1s linear infinite;
          color: #00a2ff;
          font-weight: 900;
          font-size: 17px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes counterSpin {
          to {
            transform: rotate(-360deg);
          }
        }

        .processingText,
        .successText {
          color: #9298a1;
          font-size: 14px;
          margin: 10px 0 26px;
        }

        .progressOuter {
          height: 8px;
          background: #30343a;
          border-radius: 20px;
          overflow: hidden;
        }

        .progressInner {
          height: 100%;
          background: #00a2ff;
          border-radius: 20px;
          transition: width 0.25s ease;
          box-shadow: 0 0 12px rgba(0, 162, 255, 0.45);
        }

        .progressInfo {
          display: flex;
          justify-content: space-between;
          color: #707680;
          font-size: 12px;
          margin-top: 8px;
        }

        .recipientPreview {
          margin-top: 28px;
          padding: 13px;
          background: #15171a;
          border: 1px solid #292d32;
          border-radius: 9px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .bigAvatar {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: #343940;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
          flex-shrink: 0;
        }

        .recipientPreview div:last-child,
        .userCard div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .recipientPreview strong,
        .userCard strong {
          font-size: 14px;
        }

        .recipientPreview span {
          color: #747a83;
          font-size: 12px;
        }

        .check {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #20c879;
          color: white;
          font-size: 42px;
          font-weight: 700;
          line-height: 76px;
          margin: 0 auto 23px;
          box-shadow: 0 10px 30px rgba(32, 200, 121, 0.2);
        }

        .receivedCard {
          margin: 25px 0 13px;
          padding: 20px;
          background: #15171a;
          border: 1px solid #292d32;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .receivedCard span,
        .receivedCard small {
          color: #747a83;
          font-size: 12px;
        }

        .receivedCard strong {
          font-size: 30px;
          color: #20c879;
        }

        .userCard {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          padding: 13px;
          border: 1px solid #292d32;
          background: #15171a;
          border-radius: 9px;
        }

        .userCard span {
          color: #747a83;
          font-size: 11px;
        }

        .transaction {
          margin-top: 18px;
          color: #666c75;
          font-size: 11px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .transaction strong {
          color: #8d939c;
          font-weight: 500;
        }

        .againButton {
          width: 100%;
          margin-top: 23px;
        }

        .footer {
          color: #555a62;
          font-size: 11px;
          margin: 18px 0 0;
          text-align: center;
        }

        @media (max-width: 520px) {
          .topbar {
            padding: 0 16px;
          }

          .topStatus {
            display: none;
          }

          .card {
            padding: 25px 20px;
          }

          .content {
            padding: 25px 12px;
          }
        }
      `}</style>
    </div>
  );
}
