import { Container } from "@/components/container";
import { PushNotificationSettings } from "@/components/push-notification-settings";

export default function NotificationsPage() {
  return (
    <Container className="py-12 md:py-16">
      <PushNotificationSettings />

      <section className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 p-5">
        <p className="text-sm font-semibold text-gold-bright">iPhone setup</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-mist">
          <li>Go to https://goldenedgeanalytics.vercel.app</li>
          <li>Tap Share.</li>
          <li>Tap Add to Home Screen.</li>
          <li>Open the new Golden Edge icon.</li>
          <li>Go to Alerts.</li>
          <li>Enable alerts.</li>
          <li>Hit Send Test.</li>
        </ol>
      </section>
    </Container>
  );
}
