import AppointmentActions from "./appointment-actions";

export default function AppointmentsPanel({
  appointments,
}: {
  appointments: any[];
}) {
  const upcoming = appointments.filter(
    (appt) =>
      appt.status !== "completed" &&
      appt.status !== "cancelled" &&
      appt.status !== "no_show"
  );

  return (
    <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Calendar Ready
          </p>

          <h2 className="text-3xl font-black">
            Appointment Dashboard
          </h2>

          <p className="mt-2 text-zinc-400">
            Track scheduled appointments, reminders, and status updates.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-800 bg-orange-950/30 px-5 py-3 font-bold text-orange-200">
          Upcoming: {upcoming.length}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {appointments.length === 0 ? (
          <p className="text-zinc-400">No appointments yet.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="rounded-2xl border border-zinc-800 bg-black p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <p className="text-xl font-black">
                    {appt.title || "Term Life Consultation"}
                  </p>

                  <p className="mt-2 text-zinc-400">
                    Lead: {appt.crm_leads?.name || "Unknown"}
                  </p>

                  <p className="mt-2 text-blue-400">
                    {appt.appointment_date
                      ? new Date(appt.appointment_date).toLocaleString()
                      : "No date"}
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    Type: {appt.appointment_type} • Status: {appt.status}
                  </p>

                  <p className="mt-2 text-sm text-zinc-500">
                    Reminder: {appt.reminder_status || "not_sent"}
                  </p>

                  {appt.reminder_message && (
                    <div className="mt-4 rounded-2xl border border-blue-800 bg-blue-950/30 p-4 text-blue-100">
                      <p className="font-bold">Reminder Draft</p>
                      <p className="mt-2">{appt.reminder_message}</p>
                    </div>
                  )}

                  {appt.meeting_link && (
                    <p className="mt-3 text-sm text-green-400">
                      Meeting: {appt.meeting_link}
                    </p>
                  )}

                  {appt.notes && (
                    <p className="mt-3 text-sm text-zinc-400">
                      {appt.notes}
                    </p>
                  )}
                </div>

                <AppointmentActions appointmentId={appt.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}