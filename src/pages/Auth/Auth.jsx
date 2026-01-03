import { useState } from "react";
import { useMed } from "../../context/MedContext";
import { Lock, User, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

export default function Auth() {
  const { dispatch } = useMed();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    try {
      if (isLogin) {
        dispatch({ type: "LOGIN", payload: formData });
        toast.success(`Welcome back, ${formData.name}!`);
      } else {
        dispatch({ type: "REGISTER", payload: formData });
        toast.success("Account created successfully!");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoCircle}>
            <Lock size={28} color="#2563eb" />
          </div>
          <h1 className={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className={styles.subtitle}>
            {isLogin
              ? "Enter your details to access your cabinet."
              : "Start your health journey today."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <User size={18} className={styles.icon} />
            <input
              type="text"
              placeholder="Username"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.icon} />
            <input
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Sign Up"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            className={styles.linkBtn}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
