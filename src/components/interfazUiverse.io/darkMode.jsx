import { useContext } from "react";
import { DarkModeContext } from "../../App";
import "./darkMode.css";

const DarkMode = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  
  return (
    <div className={!darkMode.on ? "toggle-switch" : "toggle-switch-dark"}>
      <label className={!darkMode.on ? "switch-label" : "switch-label-dark"}>
        <input
          type="checkbox"
          className={!darkMode.on ? "checkbox" : "checkbox-dark"}
          onClick={toggleDarkMode}
        />
        <span className={!darkMode.on ? "slider" : "slider-dark"}></span>
      </label>
    </div>
  );
};
export default DarkMode;
