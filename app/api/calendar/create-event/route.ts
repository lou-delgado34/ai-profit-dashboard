import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  return response.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data: tokenRow } = await supabase
      .from("google_tokens")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!tokenRow) {
      throw new Error("Google not connected.");
    }

    let accessToken = tokenRow.access_token;

    if (tokenRow.expires_at < Math.floor(Date.now() / 1000)) {
      const refreshed = await refreshAccessToken(tokenRow.refresh_token);

      accessToken = refreshed.access_token;

      await supabase
        .from("google_tokens")
        .update({
          access_token: accessToken,
          expires_at:
            Math.floor(Date.now() / 1000) + (refreshed.expires_in || 3600),
        })
        .eq("id", tokenRow.id);
    }

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: body.title,
          description: body.description,
          start: {
            dateTime: body.start,
            timeZone: "America/New_York",
          },
          end: {
            dateTime: body.end,
            timeZone: "America/New_York",
          },
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not create calendar event" },
      { status: 500 }
    );
  }
}