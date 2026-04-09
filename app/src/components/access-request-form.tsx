"use client";

import { useState } from "react";

const providers = [
  { id: "google", label: "Google" },
  { id: "apple", label: "Apple" },
  { id: "github", label: "GitHub" },
  { id: "email", label: "Email magic link" },
];

const intents = [
  { id: "personal", label: "Save places and history" },
  { id: "alerts", label: "Get local alerts and updates" },
  { id: "partner", label: "Partner or team access" },
  { id: "api", label: "Impact API early access" },
];

export function AccessRequestForm({
  intent = "personal",
  title = "Choose your access path",
  description = "The live account system will support Google, Apple, GitHub, and email magic links. Until then, leave your preferred route and use the public surfaces without a login.",
}: {
  intent?: string;
  title?: string;
  description?: string;
}) {
  const [provider, setProvider] = useState("google");
  const [selectedIntent, setSelectedIntent] = useState(intent);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          type: `access:${selectedIntent}:${provider}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not save your access request.");
        return;
      }

      setStatus("success");
      setMessage(
        data.status === "existing"
          ? "You are already on the list. We will use that preference when access opens."
          : "Access preference saved. You can keep using the open surfaces now."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="impact-panel">
      <div className="impact-mini-label">Account rollout</div>
      <h2 className="mt-4 text-3xl font-display leading-none text-zinc-100">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="mb-3 block text-sm text-zinc-400">Preferred sign-in method</label>
          <div className="impact-provider-grid">
            {providers.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setProvider(option.id)}
                className={`impact-provider-card ${
                  provider === option.id ? "impact-provider-card-active" : ""
                }`}
              >
                <span className="impact-provider-dot" aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm text-zinc-400">What do you want access for?</label>
          <div className="impact-provider-grid">
            {intents.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedIntent(option.id)}
                className={`impact-provider-card ${
                  selectedIntent === option.id ? "impact-provider-card-active" : ""
                }`}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="impact-grid-2">
          <div>
            <label htmlFor="access-email" className="mb-2 block text-sm text-zinc-400">
              Email
            </label>
            <input
              id="access-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="impact-input"
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="impact-button w-full" disabled={status === "saving"}>
              {status === "saving" ? "Saving..." : "Save access preference"}
            </button>
          </div>
        </div>

        <div className="impact-callout p-5 text-sm leading-7 text-zinc-400">
          <strong className="text-zinc-200">Open now:</strong> Water Pulse checks, AI Footprint,
          Methodology, Answers, and the public Observatory preview.
          <br />
          <strong className="text-zinc-200">Account next:</strong> saved places, alerts, history,
          team workspaces, and API access.
        </div>

        {message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              status === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
