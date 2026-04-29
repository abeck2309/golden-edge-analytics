"use client";

import { useEffect, useState } from "react";

type PushStatus =
  | "checking"
  | "unsupported"
  | "not-installed"
  | "not-configured"
  | "ready"
  | "subscribed"
  | "denied"
  | "error";

type AlertTopic = "game-start" | "goals" | "final-score" | "vgk-news";

const alertTopics: { description: string; label: string; value: AlertTopic }[] = [
  { description: "Puck-drop notifications when VGK games start.", label: "Game Starting", value: "game-start" },
  { description: "Goal notifications during VGK games for either team.", label: "Goals", value: "goals" },
  { description: "Final score notifications after VGK games end.", label: "Final Score", value: "final-score" },
  { description: "Golden Edge updates and custom VGK alerts.", label: "VGK News", value: "vgk-news" }
];

const defaultTopics = alertTopics.map((topic) => topic.value);

function isStandalonePwa() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

async function getReadyServiceWorker() {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error("Service worker registration timed out.")), 8000);
    })
  ]);
}

export function PushNotificationSettings() {
  const [status, setStatus] = useState<PushStatus>("checking");
  const [message, setMessage] = useState("Checking this device...");
  const [busy, setBusy] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<AlertTopic[]>(defaultTopics);

  useEffect(() => {
    async function checkSupport() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        setMessage("This browser does not support web push notifications.");
        return;
      }

      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIos && !isStandalonePwa()) {
        setStatus("not-installed");
        setMessage("On iPhone, install Golden Edge to your Home Screen before enabling alerts.");
        return;
      }

      const keyResponse = await fetch("/api/push/public-key");
      const keyData = (await keyResponse.json()) as { configured: boolean; publicKey: string };

      if (!keyData.configured || !keyData.publicKey) {
        setStatus("not-configured");
        setMessage("Web push keys are not configured yet.");
        return;
      }

      const registration = await getReadyServiceWorker();
      const existingSubscription = await registration.pushManager.getSubscription();

      if (Notification.permission === "denied") {
        setStatus("denied");
        setMessage("Notifications are blocked for this site in your browser settings.");
        return;
      }

      if (existingSubscription) {
        const preferencesResponse = await fetch("/api/push/preferences", {
          body: JSON.stringify({ endpoint: existingSubscription.endpoint }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });

        if (preferencesResponse.ok) {
          const preferences = (await preferencesResponse.json()) as { topics: AlertTopic[] };
          setSelectedTopics(preferences.topics.filter((topic) => defaultTopics.includes(topic)));
        }

        setStatus("subscribed");
        setMessage("VGK push alerts are enabled on this device.");
      } else {
        setStatus("ready");
        setMessage("Enable alerts for game starts, final scores, new articles, and breaking VGK news.");
      }

      await fetch("/api/push/subscribe");
    }

    checkSupport().catch(() => {
      setStatus("error");
      setMessage("Could not check notification support. Try refreshing the page.");
    });
  }, []);

  async function enableNotifications() {
    setBusy(true);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "ready");
        setMessage("Notification permission was not granted.");
        return;
      }

      const keyResponse = await fetch("/api/push/public-key");
      const keyData = (await keyResponse.json()) as { publicKey: string };
      const registration = await getReadyServiceWorker();
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
          userVisibleOnly: true
        }));

      const response = await fetch("/api/push/subscribe", {
        body: JSON.stringify({
          subscription,
          topics: selectedTopics
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Subscription save failed.");
      }

      await response.json();
      setStatus("subscribed");
      setMessage("VGK push alerts are enabled on this device.");
    } catch {
      setStatus("error");
      setMessage("Could not enable push alerts. Check the web push configuration and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function disableNotifications() {
    setBusy(true);

    try {
      const registration = await getReadyServiceWorker();
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          body: JSON.stringify({ endpoint: subscription.endpoint }),
          headers: { "Content-Type": "application/json" },
          method: "POST"
        });
        await subscription.unsubscribe();
      }

      setStatus("ready");
      setMessage("Push alerts are off on this device.");
      setSelectedTopics(defaultTopics);
    } catch {
      setStatus("error");
      setMessage("Could not turn off push alerts. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendTestNotification() {
    setBusy(true);

    try {
      const response = await fetch("/api/push/test", { method: "POST" });

      if (!response.ok) {
        throw new Error("Test push failed.");
      }

      setMessage("Three test alerts sent. They should arrive shortly.");
    } catch {
      setStatus("error");
      setMessage("Could not send the test alert. Make sure push keys are configured.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleTopic(topic: AlertTopic) {
    const nextTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((selectedTopic) => selectedTopic !== topic)
      : [...selectedTopics, topic];

    setSelectedTopics(nextTopics);

    if (status !== "subscribed") {
      return;
    }

    try {
      const registration = await getReadyServiceWorker();
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setStatus("ready");
        setMessage("Enable alerts before choosing alert types.");
        return;
      }

      const response = await fetch("/api/push/preferences", {
        body: JSON.stringify({
          subscription,
          topics: nextTopics
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH"
      });

      if (!response.ok) {
        throw new Error("Preference update failed.");
      }

      setMessage(nextTopics.length ? "Alert preferences updated." : "All alert types are turned off.");
    } catch {
      setSelectedTopics(selectedTopics);
      setStatus("error");
      setMessage("Could not update alert preferences. Try again.");
    }
  }

  const canEnable = status === "ready" || status === "error";
  const canTest = status === "subscribed";
  const canDisable = status === "subscribed";
  const canEditTopics = status === "subscribed" && !busy;

  return (
    <section className="panel p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Push Alerts</p>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white md:text-6xl">
            VGK Notifications
          </h1>
          <p className="mt-4 text-sm leading-7 text-mist md:text-base">{message}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:min-w-72">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Device Status</p>
          <p className="mt-3 text-2xl font-bold capitalize text-white">{status.replace("-", " ")}</p>
          <p className="mt-2 text-sm text-mist">Alerts for this device</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          disabled={!canEnable || busy}
          onClick={enableNotifications}
          className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-45"
        >
          Enable Alerts
        </button>
        <button
          type="button"
          disabled={!canTest || busy}
          onClick={sendTestNotification}
          className="rounded-xl border border-gold/40 px-5 py-3 text-sm font-bold text-gold-bright transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Send Test
        </button>
        <button
          type="button"
          disabled={!canDisable || busy}
          onClick={disableNotifications}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-mist transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Turn Off
        </button>
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div>
          <p className="text-sm font-bold text-white">Choose Alert Types</p>
          <p className="mt-2 text-sm leading-6 text-mist">
            Pick which notifications this device receives.
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {alertTopics.map((topic) => {
            const checked = selectedTopics.includes(topic.value);

            return (
              <button
                key={topic.value}
                type="button"
                disabled={!canEditTopics}
                onClick={() => toggleTopic(topic.value)}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-gold/30 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <span>
                  <span className="block text-sm font-bold text-white">{topic.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-mist">{topic.description}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={
                    checked
                      ? "flex h-8 w-14 shrink-0 items-center rounded-full bg-gold p-1 transition"
                      : "flex h-8 w-14 shrink-0 items-center rounded-full bg-white/15 p-1 transition"
                  }
                >
                  <span
                    className={
                      checked
                        ? "h-6 w-6 translate-x-6 rounded-full bg-ink transition"
                        : "h-6 w-6 translate-x-0 rounded-full bg-white transition"
                    }
                  />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </section>
  );
}
