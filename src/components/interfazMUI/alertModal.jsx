import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { Box, Button, Input } from "@mui/material";
import AlertSnackBar from "./alertSnackBar";
import Alert from "@mui/material/Alert";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./alertModal.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AlertModal = ({
  userData,
  showAlert,
  setShowAlert,
  setRedirectToMyServices,
  setAlertDelete,
  setValidateAlert,
  setValidateAlertTurns,
  setRefreshUser,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const [moveDown, setMoveDown] = useState(false);
  const { loginWithRedirect } = useAuth0();
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [showAlertSnack, setShowAlertSnack] = useState({});

  const handleKeyDown = (e) => {
    // Manejar el evento cuando se presiona Enter
    if (e.keyCode === 13) {
      e.preventDefault(); // Evitar que se agregue un salto de línea en el Input
      handleUpdatePhone();
    }
  };
  console.log(error);
  const handleSetPhoneState = async (value) => {
    // Expresión regular que solo permite números, "+", "(", ")" y "-"
    const allowedCharacters = /^[0-9+()-]*$/;

    // Verificar si el valor cumple con la expresión regular y no excede los 20 caracteres
    if (allowedCharacters.test(value) && value.length < 10) {
      setNewPhoneNumber(value);

      // Actualizar el estado solo si el valor cumple con las validaciones
      setError("Debe ser mayor a 10 caracteres");
    } else if (allowedCharacters.test(value) && value.length <= 20) {
      setError("valid");
      setNewPhoneNumber(value);
    }
  };

  const handleUpdatePhone = async () => {
    console.log("entre al update");
    if (error !== "valid") {
      setShowAlertSnack({
        message: error,
        type: "error",
      });
      setOpen(true);
    } else {
      try {
        if (newPhoneNumber !== "") {
          // Verifica si el nuevo servicio no está vacío
          await axios.put(`${VITE_BACKEND_URL}/users/update`, {
            email: userData.email,
            newPhoneNumber,
          });
          setOpen(true);
          setShowAlertSnack({
            message: "",
            type: "success",
          });
          setRefreshUser(true);
          setTimeout(() => {
            setMoveDown(true);
          }, 1200);
        }
      } catch (error) {
        console.error("Error al cambiar el numero de teléfono:", error);
        alert("Error al cambiar el numero de teléfono");
      }
    }
  };

  let handleActionProp;
  switch (showAlert.stateName) {
    case "redirectToMyServices":
      handleActionProp = setRedirectToMyServices;
      break;

    case "alertDelete":
      handleActionProp = setAlertDelete;
      break;

    case "validateAlert":
      handleActionProp = setValidateAlert;
      break;
    case "validateAlertTurns":
      handleActionProp = setValidateAlertTurns;
      break;

    default:
    // Código a ejecutar si ninguno de los casos anteriores se cumple
  }

  useEffect(() => {
    if (moveDown) {
      const timeoutId = setTimeout(() => {
        setShowAlert({});
        setMoveDown(false);
        // Remover la clase alert-open cuando se cierra el alerta
        document.body.classList.remove("alert-open");
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [moveDown]);

  useEffect(() => {
    // Agregar la clase alert-open cuando se monta el componente y el alerta está presente
    if (Object.keys(showAlert).length > 0) {
      document.body.classList.add("alert-open");
    } else {
      // Remover la clase alert-open cuando se desmonta el componente o el alerta se cierra
      document.body.classList.remove("alert-open");
    }
  }, [showAlert]);

  let action;
  let type = [];

  if (Object.keys(showAlert).length > 0) {
    if (showAlert.button1.action === "login") {
      action = loginWithRedirect;
    } else if (showAlert.button1.action === "handleActionProp") {
      action = () => {
        handleActionProp(true);
        setMoveDown(true);
      };
    } else if (showAlert.button1.action === "submit") {
      action = () => {
        handleUpdatePhone();
      };
    }
  }

  if (showAlert.type === "warning") {
    type = ["warning", "#ffe1ab", "#db9718"];
  } else if (showAlert.type === "success") {
    type = ["success", "#aaff97"];
  } else if (showAlert.type === "error") {
    type = ["error", "#fdb9b9", "#ff0000fa"];
  } else if (showAlert.type === "info") {
    type = ["info", "#ffffff", "#1282f2"];
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <AlertSnackBar
        showAlertSnack={showAlertSnack}
        setShowAlertSnack={setShowAlertSnack}
        open={open}
        setOpen={setOpen}
      />
      {Object.keys(showAlert).length > 0 && (
        <Alert
          className={`alert-container ${moveDown ? "exit" : ""}`}
          severity={type[0]}
          style={{
            backgroundColor: type[1],
            borderRadius: "10px",
            boxShadow: "0px 45px 22px -34px rgba(0, 0, 0, 0.57)",
            fontFamily: "Jost, sans-serif",
            border: `2px solid ${type[2]}`,
          }}
        >
          <h2 style={{ color: type[2] }}>{showAlert.message}</h2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "12px",
            }}
          >
            {/* ///// comienzo del area de botones para el alerta que pide el phone ///// */}
            {showAlert.buttonClose.text === "phone" && (
              <Box style={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  onClick={() => setMoveDown(true)}
                  style={{
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    marginRight: "18px",
                  }}
                >
                  cancelar
                </Button>
                <Input
                  type="tel"
                  value={newPhoneNumber}
                  placeholder="ej: 01149352 ..."
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleSetPhoneState(e.target.value)}
                  sx={{
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    fontSize: "15px",
                    height: "30px",
                    borderRadius: "4px",
                    bgcolor: darkMode.on ? "white" : "#d6d6d5",
                  }}
                />
              </Box>
            )}
            {/* ///// fin del area de botones para el alerta que pide el phone ///// */}
            {showAlert.buttonClose.text !== "" &&
              showAlert.buttonClose.text !== "phone" && (
                <Button
                  variant="outlined"
                  onClick={() => setMoveDown(true)}
                  style={{ fontFamily: "Jost, sans-serif", fontWeight: "bold" }}
                >
                  {showAlert.buttonClose.text}
                </Button>
              )}
            {showAlert.button1.text !== "" && (
              <Button
                disabled={
                  showAlert.buttonClose.text === "phone" && error !== "valid"
                    ? true
                    : false
                }
                variant="contained"
                onClick={() => action()}
                style={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: "bold",
                }}
              >
                {showAlert.button1.text}
              </Button>
            )}
          </Box>
        </Alert>
      )}
    </div>
  );
};

export default AlertModal;
