"use client";

export default function ProjectCopyButtons({
  prompt,
  result,
}: {
  prompt: string;
  result: string;
}) {
  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={() => copyText(prompt)}
        className="rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-700"
      >
        Copy Prompt
      </button>

      <button
        onClick={() => copyText(result)}
        className="rounded-xl bg-green-600 px-5 py-3 font-bold hover:bg-green-700"
      >
        Copy Full Plan
      </button>
    </div>
  );
}