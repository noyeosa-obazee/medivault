import { Activity, Heart, Scale, Thermometer } from "lucide-react";
import VitalCard from "./VitalCard";
import styles from "./Vitals.module.css";

const VITAL_TYPES = [
  {
    key: "bp",
    label: "Blood Pressure",
    unit: "mmHg",
    icon: Activity,
    color: "#2563eb",
  },
  {
    key: "hr",
    label: "Heart Rate",
    unit: "bpm",
    icon: Heart,
    color: "#e11d48",
  },
  { key: "weight", label: "Weight", unit: "kg", icon: Scale, color: "#059669" },
  {
    key: "temp",
    label: "Temperature",
    unit: "°C",
    icon: Thermometer,
    color: "#d97706",
  },
];

export default function Vitals() {
  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>My Vitals</h2>
      <div className={styles.grid}>
        {VITAL_TYPES.map((type) => (
          <VitalCard key={type.key} typeConfig={type} />
        ))}
      </div>
    </div>
  );
}
