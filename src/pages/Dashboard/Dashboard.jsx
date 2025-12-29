import { useMed } from "../../context/MedContext.jsx";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { state } = useMed();

  return (
    <div>
      <h2 className={styles.welcome}>Hello, {state.user.name} 👋</h2>
      <div className={styles.emptyState}>
        {state.meds.length === 0 ? (
          <p>Your timeline is empty. Go to the Cabinet to add drugs!</p>
        ) : (
          <p>You have {state.meds.length} active medications.</p>
        )}
      </div>
    </div>
  );
}
