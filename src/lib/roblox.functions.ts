import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type RobloxUser = {
  id: number;
  name: string;
  displayName: string;
  imageUrl: string | null;
};

type LookupResult = { user: RobloxUser | null; error?: string };

/**
 * Looks up a real Roblox account by exact username and fetches its avatar
 * headshot. Server-side so the browser never hits Roblox CORS limits.
 * Demo only — no transfers, payments, or account access.
 */
export const searchRobloxUsers = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ query: z.string().min(1).max(50) }).parse(data)
  )
  .handler(async ({ data }): Promise<LookupResult> => {
    const q = data.query.trim();
    if (!q) return { user: null };

    try {
      const res = await fetch("https://users.roblox.com/v1/usernames/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [q], excludeBannedUsers: true }),
      });
      if (!res.ok) return { user: null, error: "roblox_unavailable" };

      const json = (await res.json()) as {
        data?: { id: number; name: string; displayName: string }[];
      };
      const u = json.data?.[0];
      if (!u) return { user: null };

      let imageUrl: string | null = null;
      try {
        const tRes = await fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${u.id}&size=150x150&format=Png&isCircular=false`
        );
        if (tRes.ok) {
          const tJson = (await tRes.json()) as {
            data?: { state: string; imageUrl: string }[];
          };
          if (tJson.data?.[0]?.state === "Completed") {
            imageUrl = tJson.data[0].imageUrl;
          }
        }
      } catch {
        // avatar is optional — username match is enough
      }

      return { user: { id: u.id, name: u.name, displayName: u.displayName, imageUrl } };
    } catch {
      return { user: null, error: "network" };
    }
  });
