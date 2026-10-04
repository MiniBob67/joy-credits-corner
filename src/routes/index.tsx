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

const ALL_PACKAGES = [...PROMO_PACKAGES, ...NORMAL_PACKAGES];

const ROBUX_ICON =
  "https://images.rbxcdn.com/60bedb6518a319544c9445c519ba8d0e-robux_130x130.svg";

type Package = {
  robux: string;
  old: string;
  price: string;
};

type Recipient = {
  username: string;
  foundUsername: string;
  avatar: string;
  amount: string;
  searching: boolean;
};

function RobuxIcon() {
  return (
    <img
      className="robux-icon"
      src={ROBUX_ICON}
      alt=""
      draggable={false}
    />
  );
}

function Home() {
  const [selected, setSelected] = useState<Package>(ALL_PACKAGES[0]);

  const emptyRecipient = (): Recipient => ({
    username: "",
    foundUsername: "",
    avatar: "",
    amount: "",
    searching: false,
  });

  const [sendOpen, setSendOpen] = useState(false);

  const [recipients, setRecipients] = useState<Recipient[]>(() =>
    Array.from({ length: 4 }, emptyRecipient)
  );

  const [activeRecipient, setActiveRecipient] = useState(0);
  const [sent, setSent] = useState(false);

  function updateRecipient(
    index: number,
    patch: Partial<Recipient>
  ) {
    setRecipients((current) =>
      current.map((recipient, i) =>
        i === index
          ? { ...recipient, ...patch }
          : recipient
      )
    );
  }

  async function findRobloxUser(
    index: number,
    name: string
  ) {
    const trimmed = name.trim();

    updateRecipient(index, {
      username: name,
      foundUsername: "",
      avatar: "",
      searching: Boolean(trimmed),
    });

    if (!trimmed) {
      return;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 450)
    );

    try {
      const response = await fetch(
        "https://users.roblox.com/v1/usernames/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernames: [trimmed],
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
        updateRecipient(index, {
          foundUsername: "",
          avatar: "",
          searching: false,
        });

        return;
      }

      const avatarResponse = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`
      );

      let imageUrl = "";

      if (avatarResponse.ok) {
        const avatarData =
          await avatarResponse.json();

        imageUrl =
          avatarData?.data?.[0]?.imageUrl || "";
      }

      updateRecipient(index, {
        foundUsername: user.name,
        avatar: imageUrl,
        searching: false,
      });
    } catch {
      updateRecipient(index, {
        foundUsername: "",
        avatar: "",
        searching: false,
      });
    }
  }

  function openSend() {
    setSent(false);
    setActiveRecipient(0);
    setSendOpen(true);
  }

  function closeSend() {
    setSendOpen(false);
    setSent(false);
  }

  function confirmSend() {
    const recipient =
      recipients[activeRecipient];

    if (
      !recipient.foundUsername ||
      !recipient.avatar ||
      !recipient.amount.trim() ||
      recipient.searching
    ) {
      return;
    }

    setSent(true);
  }

  function formatAmount(value: string) {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/,/g, "");

    if (!normalized) {
      return "";
    }

    const suffix = normalized.endsWith("m")
      ? 1_000_000
      : normalized.endsWith("k")
        ? 1_000
        : 1;

    const numberPart =
      suffix === 1
        ? normalized
        : normalized.slice(0, -1);

    const number = Number(numberPart);

    if (!Number.isFinite(number) || number < 0) {
      return "";
    }

    return Math.round(
      number * suffix
    ).toLocaleString("en-US");
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
          justify-content: flex-end;

          padding: 0 34px;

          position: sticky;
          top: 0;
          z-index: 20;
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

          box-shadow:
            0 4px 18px rgba(0,0,0,.055);

          transform: translateY(-1px);
        }

        .card.selected {
          border-color: #191919;

          box-shadow:
            0 0 0 1px #191919;
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

          box-shadow:
            0 12px 40px rgba(0,0,0,.2);

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

          z-index: 1000;

          backdrop-filter: blur(3px);
        }

        .modal {
          width: min(780px, 100%);

          background: white;

          border-radius: 16px;

          box-shadow:
            0 25px 80px rgba(0,0,0,.25);

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

        .send-layout {
          display: grid;

          grid-template-columns: 235px 1fr;

          min-height: 520px;
        }

        .recipient-sidebar {
          background: #f7f7f7;

          border-right: 1px solid #eeeeee;

          padding: 16px;

          overflow-y: auto;
        }

        .recipient-title {
          font-size: 12px;

          font-weight: 800;

          margin-bottom: 12px;
        }

        .recipient-list {
          display: flex;

          flex-direction: column;

          gap: 9px;
        }

        .recipient-card {
          width: 100%;

          border: 1px solid #e1e1e1;

          background: white;

          border-radius: 11px;

          padding: 9px;

          cursor: pointer;

          text-align: left;

          transition: .15s ease;
        }

        .recipient-card:hover {
          border-color: #bdbdbd;
        }

        .recipient-card.active {
          border-color: #191919;

          box-shadow:
            0 0 0 1px #191919;
        }

        .recipient-head {
          display: flex;

          align-items: center;

          gap: 9px;

          margin-bottom: 8px;
        }

        .recipient-avatar {
          width: 42px;
          height: 42px;

          border-radius: 9px;

          object-fit: cover;

          background: #e9e9e9;

          flex-shrink: 0;
        }

        .empty-avatar {
          display: flex;

          align-items: center;
          justify-content: center;

          color: #a0a0a0;

          font-size: 18px;

          font-weight: 700;
        }

        .recipient-number {
          font-size: 10px;

          color: #8a8a8a;

          margin-bottom: 2px;
        }

        .recipient-name {
          font-size: 11px;

          font-weight: 800;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .recipient-input,
        .amount-input {
          width: 100%;

          height: 34px;

          border: 1px solid #dddddd;

          border-radius: 7px;

          background: white;

          padding: 0 9px;

          outline: none;

          font-size: 11px;
        }

        .recipient-input:focus,
        .amount-input:focus {
          border-color: #777;
        }

        .amount-wrap {
          margin-top: 7px;
        }

        .amount-label {
          display: block;

          font-size: 9px;

          color: #777;

          font-weight: 700;

          margin-bottom: 4px;
        }

        .send-main {
          min-width: 0;
        }

        .send-main .modal-body {
          max-height: 470px;

          overflow-y: auto;

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

        .preview-info {
          min-width: 0;
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

        .amount-preview {
          margin-top: 12px;

          padding: 13px;

          border-radius: 11px;

          background: #f6f6f6;
        }

        .amount-preview strong {
          display: block;

          font-size: 18px;
        }

        .amount-preview span {
          display: block;

          color: #777;

          font-size: 11px;

          margin-top: 3px;
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

        .note {
          color: #999;

          font-size: 10px;

          line-height: 1.45;

          text-align: center;

          margin: 11px 15px 0;
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

          .send-layout {
            grid-template-columns: 1fr;
          }

          .recipient-sidebar {
            border-right: 0;

            border-bottom: 1px solid #eeeeee;

            max-height: 220px;
          }

          .recipient-list {
            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <header className="topbar">
        <button
          type="button"
          className="send-top"
          onClick={openSend}
        >
          Send
        </button>
      </header>

      <main className="content">
        <section className="hero">
          <h1>
            Enjoy up to 25% more Robux
          </h1>

          <p>
            Choose a package below.
          </p>
        </section>

        <section>
          <h2 className="section-title">
            Robux packages
          </h2>

          <div className="cards">
            {PROMO_PACKAGES.map((pkg) => {
              const isSelected =
                selected.robux === pkg.robux;

              return (
                <div
                  key={pkg.robux}
                  className={`card ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelected(pkg)
                  }
                >
                  <div className="icon-box">
                    <RobuxIcon />
                  </div>

                  <div className="package-info">
                    <div className="package-amount">
                      <span>
                        {pkg.robux}
                      </span>

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
                selected.robux === pkg.robux;

              return (
                <div
                  key={pkg.robux}
                  className={`card ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelected(pkg)
                  }
                >
                  <div className="icon-box">
                    <RobuxIcon />
                  </div>

                  <div className="package-info">
                    <div className="package-amount">
                      <span>
                        {pkg.robux}
                      </span>

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

      <div className="selection-bar">
        <div className="selection-text">
          <strong>
            {selected.robux} Robux selected
          </strong>

          <span>
            {selected.price}
          </span>
        </div>

        <button
          type="button"
          className="selection-send"
          onClick={openSend}
        >
          Send
        </button>
      </div>

      <div className="frh">
        FRH
      </div>

      {sendOpen && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                Send Robux
              </div>

              <button
                type="button"
                className="close"
                onClick={closeSend}
              >
                ×
              </button>
            </div>

            <div className="send-layout">
              <aside className="recipient-sidebar">
                <div className="recipient-title">
                  Recipients
                </div>

                <div className="recipient-list">
                  {recipients.map(
                    (recipient, index) => (
                      <div
                        className={`recipient-card ${
                          activeRecipient === index
                            ? "active"
                            : ""
                        }`}
                        key={index}
                        onClick={() =>
                          setActiveRecipient(index)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" ||
                            e.key === " "
                          ) {
                            setActiveRecipient(
                              index
                            );
                          }
                        }}
                      >
                        <div className="recipient-head">
                          {recipient.avatar ? (
                            <img
                              className="recipient-avatar"
                              src={recipient.avatar}
                              alt=""
                            />
                          ) : (
                            <div className="recipient-avatar empty-avatar">
                              +
                            </div>
                          )}

                          <div
                            style={{
                              minWidth: 0,
                            }}
                          >
                            <div className="recipient-number">
                              User {index + 1}
                            </div>

                            <div className="recipient-name">
                              {recipient.foundUsername ||
                                "Empty slot"}
                            </div>
                          </div>
                        </div>

                        <input
                          className="recipient-input"
                          value={
                            recipient.username
                          }
                          onChange={(e) =>
                            void findRobloxUser(
                              index,
                              e.target.value
                            )
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          placeholder="Roblox username"
                          autoComplete="off"
                          spellCheck={false}
                        />

                        <div className="amount-wrap">
                          <label className="amount-label">
                            Robux to display
                          </label>

                          <input
                            className="amount-input"
                            value={
                              recipient.amount
                            }
                            onChange={(e) =>
                              updateRecipient(
                                index,
                                {
                                  amount:
                                    e.target.value,
                                }
                              )
                            }
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            placeholder="e.g. 52M"
                            inputMode="text"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </aside>

              <section className="send-main">
                <div className="modal-body">
                  {!sent ? (
                    <>
                      <div className="selected-preview">
                        {recipients[
                          activeRecipient
                        ].avatar ? (
                          <img
                            className="avatar"
                            src={
                              recipients[
                                activeRecipient
                              ].avatar
                            }
                            alt=""
                          />
                        ) : (
                          <div className="avatar empty-avatar">
                            ?
                          </div>
                        )}

                        <div className="preview-info">
                          <strong>
                            {recipients[
                              activeRecipient
                            ].foundUsername ||
                              "Choose a user"}
                          </strong>

                          <span>
                            Choose how much Robux you want
                          </span>
                        </div>
                      </div>

                      <label className="field-label">
                        Choose how much Robux you want
                      </label>

                      <input
                        className="username-input"
                        value={
                          recipients[
                            activeRecipient
                          ].amount
                        }
                        onChange={(e) =>
                          updateRecipient(
                            activeRecipient,
                            {
                              amount:
                                e.target.value,
                            }
                          )
                        }
                        placeholder="e.g. 52M"
                        inputMode="text"
                      />

                      {formatAmount(
                        recipients[
                          activeRecipient
                        ].amount
                      ) && (
                        <div className="amount-preview">
                          <strong>
                            {
                              formatAmount(
                                recipients[
                                  activeRecipient
                                ].amount
                              )
                            }{" "}
                            Robux
                          </strong>

                          <span>
                            This is a
                            display-only demo
                            balance for{" "}
                            {recipients[
                              activeRecipient
                            ].foundUsername ||
                              "this user"}
                            .
                          </span>
                        </div>
                      )}

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="confirm-button"
                          disabled={
                            !recipients[
                              activeRecipient
                            ].foundUsername ||
                            !recipients[
                              activeRecipient
                            ].avatar ||
                            !recipients[
                              activeRecipient
                            ].amount.trim() ||
                            recipients[
                              activeRecipient
                            ].searching
                          }
                          onClick={confirmSend}
                        >
                          Send
                        </button>

                        <div className="note">
                          FRH — Fake Robux Hub.
                          This only creates a
                          display preview; it
                          does not transfer real
                          Robux.
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
                        {
                          formatAmount(
                            recipients[
                              activeRecipient
                            ].amount
                          )
                        }{" "}
                        Robux shown for @
                        {
                          recipients[
                            activeRecipient
                          ].foundUsername
                        }
                        .
                      </p>

                      <button
                        type="button"
                        className="success-button"
                        onClick={closeSend}
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
