import { useState } from "react";
import { useMed } from "../../context/MedContext";
import {
  Trash2,
  Edit2,
  Check,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Pill,
} from "lucide-react";
import {
  isSameDay,
  format,
  subDays,
  parseISO,
  startOfDay,
  isBefore,
} from "date-fns";
import toast from "react-hot-toast";
import styles from "./Cabinet.module.css";

export default function MedicineItem({ med }) {
  const { state, dispatch } = useMed();

  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDayReport, setSelectedDayReport] = useState(null);

  const [editData, setEditData] = useState(med);

  const myLogs = state.logs.filter((log) => log.drugId === med.id);
  const getDoseCountForDay = (date) =>
    myLogs.filter((log) => isSameDay(new Date(log.timestamp), date)).length;
  const takenTodayCount = getDoseCountForDay(new Date());

  const getGoal = () => {
    if (med.frequency === "Twice Daily") return 2;
    if (med.frequency === "Daily") return 1;
    return 1;
  };
  const goal = getGoal();
  const isCompleteToday = med.frequency !== "PRN" && takenTodayCount >= goal;

  const handleTakeDose = (e) => {
    e.stopPropagation();
    if (isCompleteToday) return;
    dispatch({
      type: "LOG_DOSE",
      payload: {
        id: Date.now(),
        drugId: med.id,
        timestamp: new Date().toISOString(),
      },
    });
    toast.success(`Taken: ${med.name}`);
  };

  const handleSaveEdit = () => {
    dispatch({ type: "EDIT_MED", payload: editData });
    setIsEditing(false);
  };

  const renderHistoryDots = () => {
    const dots = [];
    const today = new Date();
    const startDate = med.dateAdded
      ? parseISO(med.dateAdded)
      : subDays(today, 30);

    for (let i = 6; i >= 0; i--) {
      const dayToCheck = subDays(today, i);

      if (isBefore(startOfDay(dayToCheck), startOfDay(startDate))) {
        dots.push(<div key={i} className={styles.dotPlaceholder} />);
        continue;
      }

      const count = getDoseCountForDay(dayToCheck);
      const isGoalMet = count >= goal;

      let dotClass = styles.dotRed;
      if (isGoalMet) dotClass = styles.dotGreen;
      if (med.frequency === "PRN")
        dotClass = count > 0 ? styles.dotGreen : styles.dotGray;

      dots.push(
        <div
          key={i}
          className={styles.historyDotGroup}
          onClick={() => showReport(dayToCheck, count, isGoalMet)}
        >
          <div
            className={`${styles.dot} ${dotClass} ${
              isSameDay(dayToCheck, today) ? styles.dotToday : ""
            }`}
          />
          <span className={styles.dotLabel}>{format(dayToCheck, "EEE")}</span>
        </div>
      );
    }
    return dots;
  };

  const showReport = (date, count, isGoalMet) => {
    const dateStr = format(date, "EEE, MMM do");
    let status = isGoalMet ? "Completed ✅" : "Missed ❌";
    if (med.frequency === "PRN") status = count > 0 ? "Taken" : "Not taken";
    setSelectedDayReport(`${dateStr}: ${count}/${goal} doses. ${status}`);
  };

  if (isEditing) {
    return (
      <div className={styles.drugItem}>
        <div className={styles.editForm}>
          <label className={styles.editLabel}>Edit Name</label>
          <input
            className={styles.input}
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />

          <div className={styles.row}>
            <div style={{ flex: 1 }}>
              <label className={styles.editLabel}>Dosage</label>
              <input
                className={styles.input}
                value={editData.dosage}
                onChange={(e) =>
                  setEditData({ ...editData, dosage: e.target.value })
                }
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className={styles.editLabel}>Frequency</label>
              <select
                className={styles.select}
                value={editData.frequency}
                onChange={(e) =>
                  setEditData({ ...editData, frequency: e.target.value })
                }
              >
                <option value="Daily">Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="PRN">PRN</option>
              </select>
            </div>
          </div>

          <div className={styles.editActions}>
            <button onClick={handleSaveEdit} className={styles.saveBtn}>
              <Check size={16} /> Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelBtn}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.drugItem} ${
        isCompleteToday ? styles.completeBg : ""
      }`}
    >
      <div
        className={styles.mainRow}
        onClick={() => setShowHistory(!showHistory)}
      >
        <div className={styles.infoGroup}>
          <div className={styles.iconCircle}>
            <Pill
              size={20}
              className={isCompleteToday ? styles.iconGreen : styles.iconBlue}
            />
          </div>
          <div>
            <div className={styles.headerRow}>
              <h4 className={styles.drugName}>{med.name}</h4>
              {isCompleteToday && <span className={styles.badge}>Done</span>}
            </div>
            <div className={styles.subText}>
              {med.dosage} • {med.frequency}
            </div>
          </div>
        </div>

        <div className={styles.chevronWrapper}>
          {showHistory ? (
            <ChevronUp size={20} color="#999" />
          ) : (
            <ChevronDown size={20} color="#999" />
          )}
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.progressArea}>
          {med.frequency === "Twice Daily" && (
            <span className={styles.progressLabel}>
              Today: {takenTodayCount}/2
            </span>
          )}
        </div>

        <div className={styles.buttonsRight}>
          {!isCompleteToday && (
            <button className={styles.takeBtn} onClick={handleTakeDose}>
              <Check size={14} /> Take Dose
            </button>
          )}

          <button
            className={styles.iconBtn}
            onClick={() => setIsEditing(true)}
            title="Edit Medicine"
          >
            <Edit2 size={18} />
          </button>

          <button
            className={styles.iconBtn}
            style={{ color: "#ef4444" }}
            onClick={() => dispatch({ type: "DELETE_MED", payload: med.id })}
            title="Delete Medicine"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {showHistory && (
        <div className={styles.historySection}>
          <div className={styles.divider} />

          <div className={styles.historyHeader}>
            <Clock size={14} />
            <span>Last 7 Days History</span>
          </div>

          <div className={styles.dotsContainer}>{renderHistoryDots()}</div>

          <div className={styles.reportBox}>
            {selectedDayReport ? (
              <span className={styles.reportText}>{selectedDayReport}</span>
            ) : (
              <span className={styles.hintText}>
                <Info size={14} style={{ marginRight: 4 }} />
                Tap a dot to see daily report
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
