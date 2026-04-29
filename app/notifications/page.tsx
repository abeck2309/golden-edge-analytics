import { Container } from "@/components/container";
import { PushNotificationSettings } from "@/components/push-notification-settings";

export default function NotificationsPage() {
  return (
    <Container className="py-12 md:py-16">
      <PushNotificationSettings />

      <section className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 p-5">
        <p className="text-sm font-semibold text-gold-bright">iPhone setup</p>
        <p className="mt-2 text-sm leading-6 text-mist">
          On iPhone, open Golden Edge in Safari, tap Share, choose Add to Home Screen, then open the
          installed app icon and enable alerts from this page.
        </p>
      </section>
    </Container>
  );
}
