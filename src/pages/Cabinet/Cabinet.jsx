import { useState } from "react";
import { useMed } from "../../context/MedContext";
import { PlusCircle } from "lucide-react";
import MedicineItem from "./MedicineItem";
import styles from "./Cabinet.module.css";
import toast from "react-hot-toast";

export default function Cabinet() {
  const { state, dispatch, generateId } = useMed();

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Daily",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      toast.error("Please fill in all fields!");
      return;
    }
    const newDrug = {
      id: generateId(),
      ...formData,
      dateAdded: new Date().toISOString(),
    };
    dispatch({ type: "ADD_MED", payload: newDrug });
    toast.success("Medicine added to Cabinet! 💊");
    setFormData({ name: "", dosage: "", frequency: "Daily" });
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
          {/* <PlusCircle size={20} style={{ marginRight: "8px" }} /> */}
          Add to Cabinet
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
