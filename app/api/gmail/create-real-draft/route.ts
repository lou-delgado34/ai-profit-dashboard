import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function base64UrlEncode(text: string) {
  return Buffer.from(text)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function extractEmailDraft(content: string) {
  const toMatch = content.match(/TO:\s*(.*)/i);
  const subjectMatch = content.match(/SUBJECT:\s*([\s\S]*?)BODY:/i);
  const bodyMatch = content.match(/BODY:\s*([\s\S]*)/i);

  return {
    to: toMatch?.[1]?.trim() || "",
    subject: subjectMatch?.[1]?.trim() || "Follow Up",
    body: bodyMatch?.[1]?.trim() || content,
  };
}

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
    const { actionId } = await req.json();

    const { data: action, error: actionError } = await supabase
      .from("agent_actions")
      .select("*")
      .eq("id", actionId)
      .single();

    if (actionError || !action) throw new Error("Action not found.");

    const { data: tokenRow, error: tokenError } = await supabase
      .from("google_tokens")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenRow) throw new Error("Google not connected.");

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

    const draft = extractEmailDraft(action.content);

    if (!draft.to || draft.to === "Add recipient") {
      throw new Error("Missing recipient email.");
    }

    const rawEmail = [
      `To: ${draft.to}`,
      `Subject: ${draft.subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      draft.body,
    ].join("\n");

    const gmailResponse = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            raw: base64UrlEncode(rawEmail),
          },
        }),
      }
    );

    const gmailData = await gmailResponse.json();

    if (!gmailResponse.ok) {
      console.log(gmailData);
      throw new Error("Gmail draft creation failed.");
    }

    await supabase
      .from("agent_actions")
      .update({ status: "gmail_draft_created" })
      .eq("id", actionId);

    return NextResponse.json({
      success: true,
      gmailDraftId: gmailData.id,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Could not create real Gmail draft." },
      { status: 500 }
    );
  }
}