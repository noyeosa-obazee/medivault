import { Outlet, NavLink } from "react-router-dom";
import styles from "./Layout.module.css";
import { Stethoscope } from "lucide-react";

const Layout = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>
          MediVault <Stethoscope size={24} />
        </h2>
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
