import { Outlet, NavLink } from "react-router-dom";
import { useMed } from "../../context/MedContext";
import toast from "react-hot-toast";
import styles from "./Layout.module.css";
import { Stethoscope, LogOut } from "lucide-react";

const Layout = () => {
  const { dispatch } = useMed();
  const handleLogout = () => {
    toast(
      (t) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>Log out now?</span>
          <button
            onClick={() => {
              dispatch({ type: "LOGOUT" });
              toast.dismiss(t.id);
              toast.success("Logged out safely");
            }}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: "#e5e7eb",
              border: "none",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      ),
      { duration: 4000 }
    );
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h2>MediVault</h2>
          <Stethoscope size={24} className={styles.brandIcon} />
        </div>

        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Log Out"
        >
          <span>Log Out</span>
          <LogOut size={20} />
        </button>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <nav className={styles.nav}>
        <CustomLink to="/" label="Today" icon="📅" />
        <CustomLink to="/cabinet" label="Cabinet" icon="💊" />
        <CustomLink to="/vitals" label="Stats" icon="📈" />
      </nav>
    </div>
  );
};

const CustomLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${styles.navLink} ${isActive ? styles.activeLink : ""}`
    }
  >
    <span style={{ fontSize: "1.5rem" }}>{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default Layout;
