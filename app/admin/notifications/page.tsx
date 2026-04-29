import { AdminNotificationSender } from "@/components/admin-notification-sender";
import { AutomatedAlertLog } from "@/components/automated-alert-log";
import { Container } from "@/components/container";

export default function AdminNotificationsPage() {
  return (
    <Container className="py-12 md:py-16">
      <AdminNotificationSender />
      <AutomatedAlertLog />
    </Container>
  );
}
