import { useEffect, useState, createContext } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Nav from "./components/nav/nav";
import Home from "./components/home/home";
import Turns from "./components/turns/turns";
import Admin from "./components/admin/admin";
import Worker from "./components/worker/worker";
import NotFound from "./components/pageNotFound/pageNotFound";
import AlertModal from "./components/interfazMUI/alertModal";
import axios from "axios";
import "./App.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const DarkModeContext = createContext();

function App() {
  const { user } = useAuth0();
  const location = useLocation();
  const [userData, setUserData] = useState(1);
  const [colors, setColors] = useState("");
  const [homeImages, setHomeImages] = useState(1); //images del home
  /* estados locales para el contexto global */
  const [moveDown, setMoveDown] = useState(false);
  const [refreshForWhoIsComing, setRefreshForWhoIsComing] = useState(false);
  const [redirectToMyServices, setRedirectToMyServices] = useState(false);
  const [alertDelete, setAlertDelete] = useState(false);
  const [validateAlert, setValidateAlert] = useState(false);
  const [validateAlertTurns, setValidateAlertTurns] = useState(false);
  const [validateAlertTurnsWorker, setValidateAlertTurnsWorker] = useState(false);
  const [refreshUser, setRefreshUser] = useState(false);
  const [refreshWhenCancelTurn, setRefreshWhenCancelTurn] = useState(false);
  const [refreshPersonalization, setRefreshPersonalization] = useState(false);
  const [disableButtonMyTurns, setDisableButtonMyTurns] = useState(false);
  const [clientName, setClientName] = useState("");
  const [showAlert, setShowAlert] = useState({});
  const [darkMode, setDarkMode] = useState({
    dark: "#252627",
    light: colors,
    on: false,
  });

  /* función para el dark mode */
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => ({
      ...prevMode,
      on: !prevMode.on,
    }));
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/personalization`);
        const { data } = response;
        setHomeImages(data.allImages);
        setColors(data.allColors[0]);
      } catch (error) {
        console.error("Error al obtener los datos de personalizacion:", error);
        alert("Error al obtener los datos de personalizacion");
      }
    };

    fetchImages();
  }, [refreshPersonalization]);

  useEffect(() => {
    // Actualizar el estado del modo oscuro después de obtener el color
    setDarkMode((prevMode) => ({
      ...prevMode,
      light: colors,
    }));
  }, [colors]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user === undefined) {
        setUserAuth(true);
      }
    }, 8000);

    return () => {
      // Limpia el timeout si el componente se desmonta antes de que se complete
      clearTimeout(timeoutId);
    };
  }, [user]);

  useEffect(() => {
    const postUser = async () => {
      let sendUser;
      if (user) {
        sendUser = {
          name: user.name,
          email: user.email,
          image: user.picture,
        };
        try {
          const response = await axios.post(
            `${VITE_BACKEND_URL}/users/create`,
            sendUser
          );
          setUserData(response.data);
          setRefreshUser(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    postUser(user);
  }, [user, refreshUser]);

  // Lee la configuración del modo desde localStorage al cargar la página
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedMode) {
      setDarkMode(savedMode);
    }
  }, []);
  // Almacena la configuración del modo en localStorage para persistencia
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSetMoveDown = (e) => {
    if (Object.keys(showAlert).length > 0) {
      // Obtenemos el elemento clickeado
      const clickedElement = e.target;

      // Obtenemos el contenedor de la alerta
      const alertContainer = document.querySelector(".alert-container");

      // Verificamos si el elemento clickeado es descendiente de la alerta
      if (!alertContainer.contains(clickedElement)) {
        // Si el clic no proviene de dentro de la alerta, cerramos la alerta
        setMoveDown(true);
        setDisableButtonMyTurns(false);
      }
    }
  };

  return (
    <DarkModeContext.Provider
      value={{
        clientName, //estado para cuando el worker agenda un turno para un cliente
        setClientName,
        moveDown,
        setMoveDown,
        darkMode,
        toggleDarkMode,
        showAlert,
        setShowAlert,
        redirectToMyServices,
        setRedirectToMyServices,
        alertDelete,
        setAlertDelete,
        validateAlert,
        setValidateAlert,
        validateAlertTurns,
        setValidateAlertTurns,
        validateAlertTurnsWorker,
        setValidateAlertTurnsWorker,
        refreshPersonalization,
        setRefreshPersonalization,
        refreshForWhoIsComing,
        setRefreshForWhoIsComing,
        userData,
        refreshWhenCancelTurn,
        setRefreshWhenCancelTurn,
        disableButtonMyTurns,
        setDisableButtonMyTurns,
      }}
    >
      <div style={{ position: "relative" }} onClick={handleSetMoveDown}>
        {location.pathname !== "/requestDenied401" && (
          <Nav user={userData} homeImages={homeImages} />
        )}
        <Routes>
          <Route
            path="/"
            element={<Home user={userData} homeImages={homeImages} />}
          />
          <Route path="/turns" element={<Turns user={userData} />} />
          <Route
            path="/admin"
            element={<Admin userData={userData}  />}
          />
          <Route
            path="/worker"
            element={<Worker userData={userData} />}
          />
          <Route
            path="/requestDenied401"
            element={<NotFound user={userData} />}
          />
        </Routes>
        {Object.keys(showAlert).length > 0 && (
          <AlertModal
            userData={userData}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            setRedirectToMyServices={setRedirectToMyServices}
            setAlertDelete={setAlertDelete}
            setValidateAlert={setValidateAlert}
            setValidateAlertTurns={setValidateAlertTurns}
            setValidateAlertTurnsWorker={setValidateAlertTurnsWorker}
            setRefreshUser={setRefreshUser}
          />
        )}
        {/* este y el de abajo son las cortinas de back drop de la alerta, entrada-salida */}
        {Object.keys(showAlert).length > 0 && !moveDown && (
          <div
            className="div-bg-alert"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: "10000",
            }}
          ></div>
        )}
        {moveDown && (
          <div
            className="div-bg-alert-down"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              zIndex: "10000",
            }}
          ></div>
        )}
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;
