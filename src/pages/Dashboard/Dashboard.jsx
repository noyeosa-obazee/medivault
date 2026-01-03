import { useMed } from "../../context/MedContext";
import MedicineItem from "../Cabinet/MedicineItem"; // Reuse your card!
import { Link } from "react-router-dom";
import { isSameDay, getHours } from "date-fns";
import { Sun, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { state } = useMed();

  const getGreeting = () => {
    const hour = getHours(new Date());
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const scheduledMeds = state.meds.filter((m) => m.frequency !== "PRN");

  const totalDosesNeeded = scheduledMeds.reduce((acc, med) => {
    return (
      acc +
      (med.frequency === "Once Daily"
        ? 1
        : med.frequency === "Twice Daily"
        ? 2
        : med.frequency === "Thrice Daily"
        ? 3
        : 1)
    );
  }, 0);

  const todayLogs = state.logs.filter((log) =>
    isSameDay(new Date(log.timestamp), new Date())
  );

  const scheduledLogsTaken = todayLogs.filter((log) =>
    scheduledMeds.some((med) => med.id === log.drugId)
  ).length;

  const percent =
    totalDosesNeeded === 0
      ? 0
      : Math.round((scheduledLogsTaken / totalDosesNeeded) * 100);

  const getStatusMessage = () => {
    if (scheduledMeds.length === 0) return "Your cabinet is empty.";
    if (percent === 0) return "You haven't taken any meds yet.";
    if (percent === 100) return "All caught up! Great job. 🎉";
    return "You're making good progress!";
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroCard}>
        <div className={styles.greeting}>
          {getGreeting()} 👋
          {/* Remember to eventually add after getGreeting() state.user.name */}
        </div>
        <h2 className={styles.mainStatus}>{getStatusMessage()}</h2>

        {scheduledMeds.length > 0 && (
          <div>
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className={styles.progressText}>
              {scheduledLogsTaken} of {totalDosesNeeded} doses taken ({percent}
              %)
            </div>
          </div>
        )}
      </div>

      <h3 className={styles.sectionTitle}>
        <Calendar size={20} className="text-blue-600" />
        For Today
      </h3>

      {scheduledMeds.length === 0 ? (
        <div className={styles.emptyState}>
          <AlertCircle
            size={40}
            style={{ marginBottom: "1rem", opacity: 0.5 }}
          />
          <p>You have no scheduled medications.</p>
          <Link to="/cabinet" className={styles.link}>
            Go to Cabinet to add some
          </Link>
        </div>
      ) : (
        <div>
          {scheduledMeds.map((med) => (
            <MedicineItem key={med.id} med={med} />
          ))}
        </div>
      )}

      {state.meds.some((m) => m.frequency === "PRN") && (
        <>
          <h3 className={styles.sectionTitle} style={{ marginTop: "2rem" }}>
            <Sun size={20} color="#f59e0b" />
            As Needed (PRN)
          </h3>
          {state.meds
            .filter((m) => m.frequency === "PRN")
            .map((med) => (
              <MedicineItem key={med.id} med={med} />
            ))}
        </>
      )}
    </div>
  );
}
