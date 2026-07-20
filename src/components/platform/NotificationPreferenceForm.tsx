"use client";

import { useActionState } from "react";
import { updateNotificationPreferenceAction, type ActionState } from "@/lib/actions/profile";
import { CheckboxField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

interface NotificationPreferenceFormProps {
  preference?: {
    emailEnabled: boolean;
    inAppEnabled: boolean;
    communityNotifications: boolean;
    reminderFrequency: string;
  };
}

export function NotificationPreferenceForm({ preference }: NotificationPreferenceFormProps) {
  const [state, formAction] = useActionState(updateNotificationPreferenceAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-graphite">Notification preferences</h2>

      <CheckboxField label="Email notifications" name="emailEnabled" defaultChecked={preference?.emailEnabled ?? true} />
      <CheckboxField label="In-app notifications" name="inAppEnabled" defaultChecked={preference?.inAppEnabled ?? true} />
      <CheckboxField
        label="Community message notifications"
        name="communityNotifications"
        defaultChecked={preference?.communityNotifications ?? true}
      />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Reminder frequency</span>
        <select
          name="reminderFrequency"
          defaultValue={preference?.reminderFrequency ?? "ALL"}
          className="mt-2 w-full max-w-xs rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="ALL">All reminders</option>
          <option value="IMPORTANT_ONLY">Important only</option>
          <option value="NONE">No reminders</option>
        </select>
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald">Saved.</p>}

      <div>
        <SubmitButton>Save preferences</SubmitButton>
      </div>
    </form>
  );
}
