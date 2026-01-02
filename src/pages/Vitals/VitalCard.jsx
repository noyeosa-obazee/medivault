import { useState } from "react";
import { useMed } from "../../context/MedContext";
import { Plus, ChevronDown, ChevronUp, Clock, Pill } from "lucide-react";
import { format, subHours, isAfter, isBefore } from "date-fns";
import toast from "react-hot-toast";
import styles from "./Vitals.module.css";

export default function VitalCard({ typeConfig }) {
  const { state, dispatch, generateId } = useMed();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const history = state.vitals
    .filter((v) => v.type === typeConfig.label)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const latest = history[0];

  const getContextForReading = (vitalDateString) => {
    const vitalDate = new Date(vitalDateString);

    const windowStart = subHours(vitalDate, 4);

    const recentLogs = state.logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      return isAfter(logDate, windowStart) && isBefore(logDate, vitalDate);
    });

    if (recentLogs.length === 0) return null;

    const drugNames = recentLogs.map((log) => {
      const drug = state.meds.find((m) => m.id === log.drugId);
      return drug ? drug.name : "Unknown";
    });

    return [...new Set(drugNames)].join(", ");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue) return;

    const newEntry = {
      id: generateId(),
      type: typeConfig.label,
      value: inputValue,
      unit: typeConfig.unit,
      date: new Date().toISOString(),
    };

    dispatch({ type: "ADD_VITAL", payload: newEntry });
    toast.success("Saved!");
    setInputValue("");
    setIsEntering(false);
    setIsExpanded(true);
  };

  const canToggle = !isEntering && history.length > 0;

  return (
    <div className={styles.card}>
      <div
        className={styles.cardHeader}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <div
          className={styles.iconBox}
          style={{ backgroundColor: `${typeConfig.color}15` }}
        >
          <typeConfig.icon size={24} color={typeConfig.color} />
        </div>
        <div style={{ flexGrow: 1 }}>
          <span className={styles.cardLabel}>{typeConfig.label}</span>
        </div>

        {canToggle &&
          (isExpanded ? (
            <ChevronUp size={20} color="#999" />
          ) : (
            <ChevronDown size={20} color="#999" />
          ))}
      </div>

      {isEntering ? (
        <form onSubmit={handleSubmit} className={styles.miniForm}>
          <input
            autoFocus
            className={styles.input}
            placeholder={`e.g. ${typeConfig.key === "bp" ? "120/80" : "75"}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setIsEntering(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.displayArea}>
          {latest ? (
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.bigValue}>
                {latest.value}{" "}
                <span className={styles.unit}>{latest.unit}</span>
              </div>
              <div className={styles.dateLabel}>
                Latest: {format(new Date(latest.date), "MMM d, h:mm a")}
              </div>
            </div>
          ) : (
            <div className={styles.emptyText}>No data yet</div>
          )}

          <button
            className={styles.addBtn}
            onClick={() => {
              setIsEntering(true);
              setIsExpanded(false);
            }}
          >
            <Plus size={16} /> Log New
          </button>
        </div>
      )}

      {isExpanded && !isEntering && history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.divider} />
          <h4 className={styles.historyTitle}>Recent History</h4>

          <div className={styles.historyList}>
            {history.slice(0, 5).map((entry) => {
              const medsTaken = getContextForReading(entry.date);

              return (
                <div key={entry.id} className={styles.historyItem}>
                  <div>
                    <div className={styles.historyValue}>{entry.value}</div>
                    <div className={styles.historyDate}>
                      {format(new Date(entry.date), "MMM d, h:mm a")}
                    </div>
                  </div>

                  {medsTaken && (
                    <div className={styles.contextBadge}>
                      <Pill size={12} />
                      <span>After {medsTaken}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
