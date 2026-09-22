import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { searchRobloxUsers, type RobloxUser } from "@/lib/roblox.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Credit Store — Demo" },
      {
        name: "description",
        content:
          "Fictional virtual-credit store demo. Buy demo credit packages and send credits to friends. No real currency or payments.",
      },
      { property: "og:title", content: "Credit Store — Demo" },
      {
        property: "og:description",
        content:
          "Fictional virtual-credit store demo. Buy demo credit packages and send credits to friends.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------------------------------- data ---------------------------------- */

type PackageRow = {
  amount: string;
  old?: string;
  more?: string;
  price: string;
};

const BONUS_ROWS: PackageRow[] = [
  { amount: "24 000", old: "22 500", more: "+ 1500 more", price: "1149,99" },
  { amount: "11 000", old: "10 000", more: "+ 1000 more", price: "599,99" },
  { amount: "5250", old: "4500", more: "+ 750 more", price: "299,99" },
  { amount: "3625", old: "3150", more: "+ 475 more", price: "199,99" },
  { amount: "2000", old: "1700", more: "+ 300 more", price: "119,99" },
];

const PACKAGE_ROWS: PackageRow[] = [
  { amount: "1500", old: "1200", more: "+ 300 more", price: "79,99" },
  { amount: "800", old: "700", more: "+ 100 more", price: "44,99" },
  { amount: "400", old: "350", more: "+ 50 more", price: "23,99" },
  { amount: "200", price: "12,99" },
  { amount: "80", price: "5,99" },
];


const AMOUNT_CHIPS = [25, 50, 100, 200];

/* ---------------------------------- icons --------------------------------- */

function CoinIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5 16 9.8v4.4L12 16.5 8 14.2V9.8l4-2.3Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function SendIcon({ size = 13, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 19V5m0 0-5 5m5-5 5 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GemIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h10l4 6-9 12L3 9l4-6Z"
        fill="#ffd66e"
        stroke="#b8860b"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M3 9h18M12 21 8.5 9l3.5-6 3.5 6L12 21Z" stroke="#b8860b" strokeWidth="1" />
    </svg>
  );
}

/* --------------------------------- screen --------------------------------- */

function Index() {
  const [sendOpen, setSendOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-10 items-center bg-header px-4">
        <button
          type="button"
          aria-label="Close"
          className="flex h-7 w-7 items-center justify-center rounded text-header-foreground transition-colors hover:bg-white/10"
          onClick={() => setSendOpen(false)}
        >
          <CloseIcon size={18} />
        </button>
        <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold text-header-foreground">
          Balance: 5 zł
        </p>
      </header>

      <main className="relative pb-24 pt-10">
        {/* faint wireframe backdrop behind the hero */}
        <div className="hero-grid pointer-events-none absolute inset-x-0 top-10 h-[340px]" aria-hidden="true" />

        {/* Balance + Send (top-right of the content container) */}
        <div className="mx-auto flex w-full max-w-[1280px] justify-end px-6 pt-5">
          <div className="flex items-center gap-2 rounded-full bg-surface-2 py-1.5 pl-4 pr-1.5">
            <CoinIcon size={20} className="text-foreground" />
            <span className="pr-1 text-[19px] font-bold leading-none">5</span>
            <button
              type="button"
              onClick={() => setSendOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-btn-muted px-3.5 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-btn-muted-hover"
            >
              <SendIcon />
              Send
            </button>
          </div>
        </div>

        {/* Hero heading */}
        <h1 className="relative mx-auto mt-16 max-w-[760px] px-6 text-center text-[44px] font-extrabold leading-[1.15] tracking-tight md:text-[52px]">
          Get up to 25%
          <br />
          more zł
        </h1>

        {/* Content column */}
        <div className="mx-auto mt-16 w-full max-w-[760px] px-6">
          {/* Bonus item */}
          <section>
            <h2 className="text-[22px] font-bold">Bonus item we picked for you</h2>
            <div className="mt-4 rounded-2xl bg-card">
              {/* banner (demo artwork, CSS-drawn) */}
              <div className="relative h-[132px] overflow-hidden rounded-t-2xl banner-art">
                <div className="absolute right-16 top-6 h-16 w-16 rotate-12 rounded-xl bg-white/10" />
                <div className="absolute right-40 bottom-2 h-10 w-10 -rotate-6 rounded-lg bg-white/10" />
                <div className="absolute right-6 bottom-4 h-6 w-6 rotate-45 bg-white/10" />
                <div className="absolute left-8 top-1/2 flex -translate-y-1/2 items-center gap-4">
                  <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 shadow-lg">
                    <GemIcon size={40} />
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-[15px] font-semibold text-white">
                      [🏆] Pixel Quest
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/50 text-[10px] leading-none text-white/80">
                        i
                      </span>
                    </p>
                    <p className="mt-0.5 text-[13px] text-white/85">RPG Bundle!</p>
                  </div>
                </div>
              </div>
              {/* rows */}
              <div className="px-7 pb-5 pt-5">
                {BONUS_ROWS.map((row) => (
                  <PackageLine key={row.amount} row={row} onBuy={() => setToast("Demo store — purchases are disabled.")} />
                ))}
              </div>
            </div>
          </section>

          {/* Packages */}
          <section className="mt-12">
            <h2 className="text-[22px] font-bold">Packages</h2>
            <div className="mt-4 rounded-2xl bg-card px-7 py-5">
              {PACKAGE_ROWS.map((row) => (
                <PackageLine key={row.amount} row={row} onBuy={() => setToast("Demo store — purchases are disabled.")} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {sendOpen && <SendModal onClose={() => setSendOpen(false)} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-surface-2 px-5 py-2.5 text-sm text-foreground shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ package row ------------------------------- */

function PackageLine({ row, onBuy }: { row: PackageRow; onBuy: () => void }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div className="flex items-center gap-3">
        <CoinIcon size={22} className="text-foreground" />
        <span className="text-[21px] font-bold tracking-wide">{row.amount}</span>
        {row.old && (
          <span className="flex items-center gap-1 text-[21px] font-bold tracking-wide text-muted-foreground line-through decoration-2">
            <CoinIcon size={20} />
            {row.old}
          </span>
        )}
        {row.more && (
          <span className="ml-2 rounded-full bg-btn-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
            {row.more}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onBuy}
        className="h-[42px] w-[210px] rounded-lg bg-btn-muted text-[13px] text-foreground/90 transition-colors hover:bg-btn-muted-hover"
      >
        {row.price} zł
      </button>
    </div>
  );
}

/* ------------------------------- send modal ------------------------------- */

function SendModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"friends" | "amount" | "done">("friends");
  const [query, setQuery] = useState("");
  const [friend, setFriend] = useState<RobloxUser | null>(null);
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState<
    { status: "idle" } | { status: "loading" } | { status: "error" } | { status: "done"; user: RobloxUser | null }
  >({ status: "idle" });

  // Debounced lookup of a real Roblox account by username
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSearch({ status: "idle" });
      return;
    }
    setSearch({ status: "loading" });
    const t = setTimeout(() => {
      searchRobloxUsers({ data: { query: q } })
        .then((res) => setSearch({ status: "done", user: res.user }))
        .catch(() => setSearch({ status: "error" }));
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const numeric = parseInt(amount.replace(/\D/g, ""), 10) || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[480px] rounded-xl bg-surface-modal shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <CoinIcon size={20} className="text-foreground" />
            <span className="text-[17px] font-semibold">Send zł</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[15px] font-semibold">
              <CoinIcon size={16} />
              5
            </span>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-white/10"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {step === "friends" && (
          <div className="px-4 pb-5">
            <div className="flex h-11 items-center gap-2.5 rounded-full border border-input-focus bg-input px-4 focus-within:border-primary">
              <SearchIcon className="shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Roblox username"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
            </div>
            <p className="mt-4 px-1 text-[15px] font-bold">
              {search.status === "done" && search.user ? "Roblox user" : "Roblox search"}
            </p>
            <div className="mt-2 max-h-[340px] space-y-1 overflow-y-auto pr-1">
              {search.status === "idle" && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Type a Roblox username to find their account.
                </p>
              )}
              {search.status === "loading" && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Searching Roblox…
                </p>
              )}
              {search.status === "error" && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  Could not reach Roblox. Please try again.
                </p>
              )}
              {search.status === "done" && !search.user && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No Roblox user named “{query.trim()}”
                </p>
              )}
              {search.status === "done" && search.user && (
                <button
                  type="button"
                  onClick={() => {
                    setFriend(search.user);
                    setStep("amount");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-btn-muted"
                >
                  {search.user.imageUrl ? (
                    <img
                      src={search.user.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-btn-muted text-[15px] font-bold text-foreground">
                      {search.user.name[0]}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold">
                      {search.user.name}
                    </span>
                    {search.user.displayName !== search.user.name && (
                      <span className="block truncate text-[12px] text-muted-foreground">
                        {search.user.displayName}
                      </span>
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {step === "amount" && friend && (
          <div className="px-6 pb-5 pt-2">
            <div className="flex flex-col items-center">
              {friend.imageUrl ? (
                <img
                  src={friend.imageUrl}
                  alt=""
                  className="h-[72px] w-[72px] rounded-full object-cover"
                />
              ) : (
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-btn-muted text-[26px] font-bold text-foreground">
                  {friend.name[0]}
                </span>
              )}
              <p className="mt-3 text-[15px] font-bold uppercase tracking-wide">
                {friend.name}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <CoinIcon size={30} className="text-foreground" />
                <input
                  autoFocus
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                  placeholder="0"
                  aria-label="Amount to send"
                  className="w-[200px] bg-transparent text-center text-[38px] font-extrabold tracking-wide outline-none placeholder:text-muted-foreground/50"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                {AMOUNT_CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAmount(String(c))}
                    className="flex items-center gap-1.5 rounded-lg bg-btn-muted px-3.5 py-2 text-[14px] font-semibold transition-colors hover:bg-btn-muted-hover"
                  >
                    <CoinIcon size={14} />
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              disabled={numeric <= 0}
              onClick={() => setStep("done")}
              className="mt-6 h-11 w-full rounded-lg bg-primary text-[15px] font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              NEXT
            </button>
            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              zł are sent instantly with no fees
            </p>
          </div>
        )}

        {step === "done" && friend && (
          <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
            <CoinIcon size={44} className="text-foreground" />
            <p className="mt-4 text-[19px] font-bold">
              Sent {numeric.toLocaleString("en-US").replace(/,/g, " ")} zł to{" "}
              @{friend.name}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Demo only — nothing real was sent or charged.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 w-full rounded-lg bg-primary text-[15px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              DONE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
