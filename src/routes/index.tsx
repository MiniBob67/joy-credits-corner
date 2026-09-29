import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const startTransfer = () => {
    if (!username.trim() || !amount || Number(amount) <= 0) return;

    setLoading(true);
    setProgress(0);

    let value = 0;

    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 9) + 4;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);

        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
        }, 700);
      }

      setProgress(value);
    }, 250);
  };

  const status =
    progress < 25
      ? "Connecting to transfer server..."
      : progress < 45
      ? "Checking recipient..."
      : progress < 65
      ? "Verifying transfer..."
      : progress < 85
      ? "Processing transaction..."
      : "Finalizing transfer...";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f2f2f2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#fff",
          borderRadius: "14px",
          padding: "32px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        }}
      >
        {!loading && !success && (
          <>
            <h1
              style={{
                textAlign: "center",
                marginTop: 0,
                fontSize: "28px",
              }}
            >
              Robux Transfer
            </h1>

            <p
              style={{
                textAlign: "center",
                color: "#777",
                marginBottom: "28px",
              }}
            >
              Send Robux to a Roblox username
            </p>

            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "7px",
              }}
            >
              Username
            </label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "16px",
                marginBottom: "18px",
                boxSizing: "border-box",
              }}
            />

            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "7px",
              }}
            >
              Robux amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={{
                width: "100%",
                padding: "13px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "16px",
                marginBottom: "18px",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={startTransfer}
              style={{
                width: "100%",
                padding: "14px",
                border: 0,
                borderRadius: "8px",
                background: "#00a2ff",
                color: "#fff",
                fontSize: "17px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Send Robux
            </button>
          </>
        )}

        {loading && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "45px",
                height: "45px",
                border: "5px solid #ddd",
                borderTopColor: "#00a2ff",
                borderRadius: "50%",
                margin: "10px auto 20px",
                animation: "spin 0.8s linear infinite",
              }}
            />

            <h2>Processing transfer...</h2>

            <p style={{ color: "#777" }}>{status}</p>

            <div
              style={{
                width: "100%",
                height: "10px",
                background: "#ddd",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#00a2ff",
                  transition: "width 0.2s",
                }}
              />
            </div>

            <p style={{ color: "#999" }}>{progress}%</p>
          </div>
        )}

        {success && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "#22c55e",
                color: "#fff",
                fontSize: "42px",
                lineHeight: "70px",
                margin: "0 auto 20px",
              }}
            >
              ✓
            </div>

            <h2>Transaction successful</h2>

            <div
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                margin: "15px 0",
              }}
            >
              +{Number(amount).toLocaleString()} Robux
            </div>

            <p style={{ color: "#666" }}>
              Sent to @{username}
            </p>

            <p>Your transaction has been completed successfully.</p>

            <p
              style={{
                marginTop: "25px",
                color: "#999",
                fontSize: "12px",
              }}
            >
              Transaction ID: #RBX-829471
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
