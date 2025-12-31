import { useState } from "react";
import { useMed } from "../../context/MedContext";
import { PlusCircle, Loader2, AlertTriangle } from "lucide-react";
import MedicineItem from "./MedicineItem";
import styles from "./Cabinet.module.css";
import toast from "react-hot-toast";
import { checkSafety } from "../../utils/interactionEngine";

export default function Cabinet() {
  const { state, dispatch, generateId } = useMed();
  const [isChecking, setIsChecking] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Daily",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showWarningToast = (drugName, warningMessage, onConfirm) => {
    toast(
      (t) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "300px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#b91c1c",
              fontWeight: "bold",
            }}
          >
            <AlertTriangle size={20} />
            <span>Interaction Alert!</span>
          </div>

          <div
            style={{ fontSize: "0.9rem", color: "#374151", lineHeight: "1.4" }}
          >
            Adding <strong>{drugName}</strong> caused a conflict:
            <div
              style={{
                marginTop: "5px",
                padding: "8px",
                background: "#fff",
                borderRadius: "4px",
                border: "1px solid #fee2e2",
                fontSize: "0.8rem",
                color: "#7f1d1d",
              }}
            >
              "{warningMessage}"
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #d1d5db",
                background: "white",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                toast.dismiss(t.id);
              }}
              style={{
                flex: 1,
                padding: "8px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Add Anyway
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      toast.error("Please fill in all fields");
      return;
    }

    const newDrug = {
      id: generateId(),
      ...formData,
      dateAdded: new Date().toISOString(),
    };

    setIsChecking(true);
    const result = await checkSafety(formData.name, state.meds);
    setIsChecking(false);

    if (result.safe) {
      dispatch({ type: "ADD_MED", payload: newDrug });
      toast.success(
        result.unknown
          ? "Added (Safety Check Unavailable)"
          : "Medicine Added (Safe) ✅"
      );
      setFormData({ name: "", dosage: "", frequency: "Daily" });
    } else {
      showWarningToast(formData.name, result.warning, () => {
        dispatch({ type: "ADD_MED", payload: newDrug });
        toast.success("Added despite warning ⚠️");
        setFormData({ name: "", dosage: "", frequency: "Daily" });
      });
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Add Medication</h2>

      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="med-name">
            Medicine Name
          </label>
          <input
            id="med-name"
            className={styles.input}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Paracetamol"
            autoComplete="off"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="dosage">
            Dosage
          </label>
          <input
            id="dosage"
            className={styles.input}
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g. 500mg or 2 Tablets"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="frequency">
            Frequency
          </label>
          <select
            id="frequency"
            className={styles.select}
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
          >
            <option value="Daily">Once Daily</option>
            <option value="Twice Daily">Twice Daily</option>
            <option value="Thrice Daily">Thrice Daily</option>

            <option value="PRN">As Needed</option>
          </select>
        </div>

        <button type="submit" className={styles.button}>
          {isChecking ? (
            <>
              <Loader2
                size={20}
                className={styles.spin}
                style={{
                  marginRight: "8px",
                }}
              />
              Checking Safety...
            </>
          ) : (
            <>
              <PlusCircle size={20} style={{ marginRight: "8px" }} />
              Add to Cabinet
            </>
          )}
        </button>
      </form>

      <h3>My Cabinet ({state.meds.length})</h3>
      <div className={styles.card}>
        {state.meds.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No meds yet.</p>
        ) : (
          state.meds.map((med) => <MedicineItem key={med.id} med={med} />)
        )}
      </div>
    </div>
  );
}
