import { PageHeader } from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/events/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <PageHeader title="New event" description="Create an event and choose how people register." />
      <EventForm />
    </div>
  );
}
