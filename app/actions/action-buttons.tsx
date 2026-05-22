"use client";

import { useRouter } from "next/navigation";

function extractMessage(content: string) {
  const phoneMatch = content.match(/PHONE:\s*(.*)/i);
  const messageMatch = content.match(/MESSAGE:\s*([\s\S]*)/i);

  return {
    phone: phoneMatch?.[1]?.trim().replace(/\s+/g, "") || "",
    message: messageMatch?.[1]?.trim() || content,
  };
}

export default function ActionButtons({
  id,
  actionType,
  content,
}: {
  id: string;
  actionType: string;
  content: string;
}) {
  const router = useRouter();

  const updateAction = async (status: string) => {
    await fetch("/api/update-agent-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    router.refresh();
  };

  const createRealGmailDraft = async () => {
    await fetch("/api/gmail/create-real-draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ actionId: id }),
    });

    router.refresh();
  };

  const sendWhatsApp = async () => {
    const extracted = extractMessage(content);

    if (!extracted.phone || extracted.phone === "Addphonenumber") {
      alert("Missing WhatsApp phone number.");
      return;
    }

    const response = await fetch("/api/twilio/send-whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: extracted.phone,
        message: extracted.message,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.error || "WhatsApp send failed.");
      return;
    }

    await updateAction("whatsapp_sent");
  };

  const openSmsApp = async () => {
    const extracted = extractMessage(content);

    if (!extracted.phone || extracted.phone === "Addphonenumber") {
      alert("Missing SMS phone number.");
      return;
    }

    const smsLink = `sms:${extracted.phone}?body=${encodeURIComponent(
      extracted.message
    )}`;

    window.open(smsLink, "_blank");
    await updateAction("sms_opened_on_phone");
  };

  const copyContent = async () => {
    await navigator.clipboard.writeText(content);
    alert("Copied!");
  };

  const copyOnlyMessage = async () => {
    const extracted = extractMessage(content);
    await navigator.clipboard.writeText(extracted.message);
    alert("Message copied!");
  };

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button
        onClick={copyContent}
        className="rounded-xl bg-zinc-700 px-5 py-3 font-bold hover:bg-zinc-600"
      >
        Copy Full Action
      </button>

      {(actionType === "sms_draft" || actionType === "whatsapp_draft") && (
        <button
          onClick={copyOnlyMessage}
          className="rounded-xl bg-zinc-600 px-5 py-3 font-bold hover:bg-zinc-700"
        >
          Copy Message Only
        </button>
      )}

      {actionType === "gmail_draft" && (
        <button
          onClick={createRealGmailDraft}
          className="rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-700"
        >
          Create Gmail Draft
        </button>
      )}

      {actionType === "whatsapp_draft" && (
        <button
          onClick={sendWhatsApp}
          className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
        >
          Send WhatsApp
        </button>
      )}

      {actionType === "sms_draft" && (
        <button
          onClick={openSmsApp}
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold hover:bg-blue-700"
        >
          Open SMS App
        </button>
      )}

      <button
        onClick={() => updateAction("approved")}
        className="rounded-xl bg-emerald-600 px-5 py-3 font-bold hover:bg-emerald-700"
      >
        Approve
      </button>

      <button
        onClick={() => updateAction("completed")}
        className="rounded-xl bg-indigo-600 px-5 py-3 font-bold hover:bg-indigo-700"
      >
        Complete
      </button>

      <button
        onClick={() => updateAction("rejected")}
        className="rounded-xl bg-red-800 px-5 py-3 font-bold hover:bg-red-900"
      >
        Reject
      </button>
    </div>
  );
}