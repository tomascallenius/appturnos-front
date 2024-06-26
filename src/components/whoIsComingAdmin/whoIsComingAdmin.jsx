import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import { Button, Box } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import noUserImg from "../../assets/icons/noUser.png";
import formatHour from "../../functions/formatHour";
import axios from "axios";
import "./whoIsComing.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingAdmin = () => {
  const { darkMode, refreshForWhoIsComing, setRefreshForWhoIsComing } =
    useContext(DarkModeContext);
  const [turns, setTurns] = useState([]);
  /*  turns contiene:
  {
    email: el email del cliente
    name: el name del cliente
    ini: el minuto de inicio de su turno
    fin: minuto final de su turno
    phone: su cel
    image: su imagen
  } */
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [workers, setWorkers] = useState([]);

  const date = new Date();
  const currentDay = date.getDate();

  useEffect(() => {}, []);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(
          `${VITE_BACKEND_URL}/users/getworkers`
        );
        const { data } = response;
        setWorkers(data);
      } catch (error) {
        console.error("Error al obtener workers.", error);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: selectedWorker }
        );
        const { data } = response;
        setCount(data);
        setSelectedDay(data[0]);
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    if (selectedWorker.length > 0) {
      fetchCount();
    }
    if (refreshForWhoIsComing == true) {
      setRefreshForWhoIsComing(false);
    }
  }, [selectedWorker, refreshForWhoIsComing]);

  useEffect(() => {
    const fetchTurns = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/whoiscoming`,
          { emailWorker: selectedWorker, month: numberMonth, day: numberDay }
        );
        const { data } = response;
        setTurns(data);
      } catch (error) {
        console.error("Error al obtener los dias cancelados.", error);
      }
    };
    //condicional de estado 0 de la app (undefined)
    if (selectedDay !== undefined) {
      fetchTurns();
    }
    if (refreshForWhoIsComing == true) {
      setRefreshForWhoIsComing(false);
    }
  }, [selectedDay, refreshForWhoIsComing]);

  const handleChangeDay = (element) => {
    setSelectedDay(element);
  };

  const handleChangeWorker = (email) => {
    setSelectedDay("");
    setSelectedWorker(email);
  };
  return (
    <div>
      <hr
        style={{
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      <Box
        className="box-container-ctfw"
        style={{
          overFlow: "scroll",
          marginBottom: "20px",
        }}
      >
        {/* **************** */}
        <Box
          style={{
            display: "flex",
            width: "100%",
            overflow: "scroll",
          }}
        >
          {workers.length > 0 &&
            workers.map((element, index) => {
              return (
                <Button
                  variant="contained"
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    backgroundColor:
                      selectedWorker == element.email && darkMode.on
                        ? "white"
                        : selectedWorker == element.email && !darkMode.on
                        ? "black"
                        : "",
                    color:
                      selectedWorker == element.email && darkMode.on
                        ? "black"
                        : "white",
                    margin: "5px",
                    minWidth: "180px",
                    overflow: "hidden",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                  }}
                  onClick={() => {
                    handleChangeWorker(element.email);
                  }}
                >
                  <h3 style={{ textTransform: "lowercase" }}>
                    {element.email}
                  </h3>
                  <h5
                    style={{
                      color:
                        selectedWorker == element.email && darkMode.on
                          ? "#a3a3a3"
                          : "#cccaca",
                    }}
                  >
                    {element.name}
                  </h5>
                </Button>
              );
            })}
        </Box>

        <Box
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "900px",
            overflow: "auto",
          }}
        >
          {count.length > 0 &&
            count.map((element, index) => {
              return (
                <Button
                  variant="contained"
                  key={index}
                  style={{
                    backgroundColor:
                      selectedDay == element && darkMode.on
                        ? "white"
                        : selectedDay == element && !darkMode.on
                        ? "black"
                        : "",
                    color:
                      selectedDay == element && darkMode.on ? "black" : "white",
                    margin: "5px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    handleChangeDay(element);
                  }}
                >
                  {index === 0 ? "HOY" : element}
                </Button>
              );
            })}
          {count.length < 1 && selectedWorker !== "" && (
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                color: darkMode.on ? "white" : darkMode.dark,
              }}
            >
              Todavía no hay dias
            </h2>
          )}
        </Box>
        <Box
          style={{ overflow: "scroll", maxHeight: "350px", marginTop: "20px" }}
        >
          {turns.length > 0 &&
            turns.map((element, index) => (
              <Box key={index}>
                {index === 0 && (
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        color: darkMode.on ? "white" : darkMode.dark,
                      }}
                    >
                      <h3 className="h-name-hic">Nombre</h3>
                      <hr />
                      <h3 className="h-time-hic">Horario</h3>
                      <hr />
                      <h3 className="h-phone-hic">Celular</h3>
                      <hr />
                      <h3 className="h-email-hic">Email</h3>
                    </Box>
                    <hr className="hr-hic" />
                  </Box>
                )}
                <Box
                  style={{
                    display: "flex",
                    color: darkMode.on ? "white" : darkMode.dark,
                  }}
                >
                  <Box
                    className="h-name-hic"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4>{element.name}</h4>
                    <img
                      src={element.image ? element.image : noUserImg}
                      alt="imagen de perfil"
                      style={{
                        width: "30px",
                        borderRadius: "50px",
                        backgroundColor: element.image
                          ? ""
                          : darkMode.on
                          ? "white"
                          : "",
                      }}
                    ></img>
                  </Box>
                  <hr />
                  <h4 className="h-time-hic">
                    {`${formatHour(element.ini)} - ${formatHour(element.fin)}`}
                  </h4>
                  <hr />
                  <Box
                    className={darkMode.on ? "h-phone-hic-dark" : "h-phone-hic"}
                  >
                    {element.phone ? (
                      <a
                        href={`whatsapp://send?phone=${element.phone}&text=Recuerda que tienes reserva en la barbería, revisa en la página, sección "Mis Turnos".e`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <button
                          className={
                            element.phone === "no requerido"
                              ? "btn-wsp-ctfw-false"
                              : "btn-wsp-ctfw"
                          }
                          style={{
                            fontFamily: "Jost, sans-serif",
                            fontWeight: "bold",
                            border: "none",
                            cursor: "pointer",
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h4>{element.phone}</h4>
                          {element.phone !== "no requerido" && (
                            <WhatsApp color="success" />
                          )}
                        </button>
                      </a>
                    ) : (
                      <h5>No disponible</h5>
                    )}
                  </Box>

                  <hr />
                  <h4 className="h-email-hic">{element.email}</h4>
                </Box>
                <hr className="hr-hic" />
              </Box>
            ))}
          {turns.length < 1 && selectedDay !== "" && (
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <h4 style={{ color: darkMode.on ? "white" : darkMode.dark }}>
                No tienes turnos para este día
              </h4>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default WhoIsComingAdmin;
