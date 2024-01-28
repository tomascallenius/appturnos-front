import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import CustomCalendarTurns from "../customCalendar/customCalendarTurns";
import ShowTurns from "../showTurns/showTurns";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";
import { Box, Button } from "@mui/material";
import calendar from "../../assets/images/calendar2.png";
import defaultServiceImg from "../../assets/images/default-img-services.jpg";
import "./turns.css";
import AlertModal from "../interfazMUI/alertModal";
import formatHour from "../../functions/formatHour";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Turns = ({ user }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [days, setDays] = useState([]);
  const [services, setServices] = useState([]);
  const [dayIsSelected, setDayIsSelected] = useState([]);
  const [serviceSelected, setServiceSelected] = useState("");
  const [showTurns, setShowTurns] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(false);
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [showAlert, setShowAlert] = useState({});
  const [detailTurn, setDetailTurn] = useState({});
  const [validateAlert, setValidateAlert] = useState(false);

  useEffect(() => {
    if (validateAlert === true) {
      submit();
      setValidateAlert(false);
    }
  }, [validateAlert]);

  const submit = async () => {
    const {
      dayIsSelected,
      serviceSelected,
      selectedTime,
      workerEmail,
      userEmail,
    } = detailTurn;

    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/workdays/turn`, {
        date: dayIsSelected,
        emailWorker: workerEmail,
        selectedTime,
        serviceSelected,
        user: userEmail,
      });
      const { data } = response;
      // Recuperar datos existentes del localStorage
      const existingTurns =
        JSON.parse(localStorage.getItem("turnServices")) || [];
      // Agregar nuevo dato a la lista
      existingTurns.push(serviceSelected);
      // Guardar en el localStorage
      localStorage.setItem("turnServices", JSON.stringify(existingTurns));
      setDetailTurn({});
      setShowAlert({
        isOpen: true,
        message: `Su turno ha sido agendado exitosamente!`,
        type: "success",
        button1: {
          text: "",
          action: "",
        },
        buttonClose: {
          text: "aceptar",
        },
        alertNumber: 2,
      });
    } catch (error) {
      console.error("Error al tomar turno submit:", error);
    }
  };

  useEffect(() => {
    setDayIsSelected([]);
  }, [serviceSelected]);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/byservices`,
          { servicesForTurns: serviceSelected }
        );
        const { data } = response;
        setDays(data);
      } catch (error) {
        console.error("Error al obtener los dias:", error);
      }
    };
    if (serviceSelected.length > 0) {
      fetchDays();
    }
  }, [serviceSelected]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services/`);
        const { data } = response;
        setServices(data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (element) => {
    setServiceSelected(element[0]);
    setSelectedImg(element[1]);
  };
console.log(serviceSelected);
  useEffect(() => {
    if (Object.keys(detailTurn).length > 0) {
      setShowAlert({
        isOpen: true,
        message: `Turno para ${detailTurn.serviceSelected} el dia ${
          detailTurn.dayIsSelected[0]
        }/${detailTurn.dayIsSelected[1]} a las ${formatHour(
          detailTurn.selectedTime
        )}`,
        type: "warning",
        button1: {
          text: "confirmar turno",
          action: "handleActionProp",
        },
        buttonClose: {
          text: "cancelar",
        },
        alertNumber: 1,
      });
    }
  }, [detailTurn]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: darkMode.on ? darkMode.dark : darkMode.light,
        zIndex: "0",
        // paddingTop: sm ? "70px" : "70px",
        height: "100vh",
      }}
    >
      <div //container
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "900px", //revisar maxWidth
        }}
      >
        <Box
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "grid",
              marginTop: "100px",
              gridTemplateColumns: sm
                ? "1fr 1fr"
                : md
                ? "1fr 1fr 1fr 1fr"
                : "1fr 1fr 1fr 1fr 1fr",
              gap: "3px",
              height: "30vh",
              maxHeight: "500px",
              overflow: "auto",
              borderBottom: "3px solid #134772",
              alignItems: "center",
              justifyItems: "center",
              // justifyContent: "center",
            }}
          >
            {services.map((element, index) => (
              <Box sx={{ marginTop: "1px" }} key={index}>
                <Button
                  variant={
                    element[0] === serviceSelected ? "contained" : "outlined"
                  }
                  className={
                    element[0] === serviceSelected
                      ? "btn-services-selected"
                      : "btn-services"
                  }
                  style={{
                    wordWrap: "break-word",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    width: element[0] === serviceSelected ? "170px" : "160px",
                    borderRadius: "7px",
                    border: "none",
                    fontFamily: "Jost, sans-serif",
                    fontSize: "15px",
                    height: "45px",
                    letterSpacing: "1.5px",
                    color: "white",
                    textTransform: "lowercase",
                    backgroundColor:
                      element[0] === serviceSelected ? "#134772" : "#2196F3",
                    transition: "0.3s",
                    boxShadow:
                      element[0] === serviceSelected
                        ? "0px 10px 14px 0px rgba(0, 0, 0, 0.75)"
                        : "0px 5px 14px -5px rgba(0, 0, 0, 0.75)",
                    zIndex: "30",
                  }}
                  onClick={() => handleSelectService(element)}
                >
                  {element[0]}
                </Button>
              </Box>
            ))}
          </Box>
          <Box>
            <img
              src={selectedImg ? selectedImg : defaultServiceImg}
              alt="img servicio"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderBottom: "3px solid #134772",

                zIndex: "1",
              }}
            />
          </Box>
          <Box
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "red",
              position: "absolute",
              top: "0",
              zIndex: "10",
              background:
                "linear-gradient(180deg, rgba(255,0,0,0) 70%, rgba(0,0,0,0.64) 100%)",
            }}
          ></Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignSelf: "center",
            width: "95%",
          }}
        >
          <Box
            sx={{
              marginTop: "30px",
              width: "100%",
              maxWidth: "900px",
              height: "50vh",
            }}
          >
            {serviceSelected.length > 0 ? (
              <CustomCalendarTurns
                sm={sm}
                amountOfDays={27}
                dayIsSelected={dayIsSelected}
                setDayIsSelected={setDayIsSelected}
                serviceSelected={serviceSelected}
                days={days}
                setIsOpen={setIsOpen}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <img
                  src={calendar}
                  style={{
                    filter: " grayscale(100%)",
                    width: sm ? "250px" : "300px",
                    height: sm ? "250px" : "300px",
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
        {dayIsSelected.length > 0 && (
          <ShowTurns
            dayIsSelected={dayIsSelected}
            setDayIsSelected={setDayIsSelected}
            serviceSelected={serviceSelected}
            user={user}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            detailTurn={detailTurn}
            setDetailTurn={setDetailTurn}
          />
        )}
      </div>
      {showAlert.alertNumber === 1 && (
        <AlertModal
          showAlert={showAlert}
          setShowAlert={setShowAlert}
          handleActionProp={setValidateAlert}
        />
      )}
      {showAlert.alertNumber === 2 && (
        <AlertModal showAlert={showAlert} setShowAlert={setShowAlert} />
      )}
    </div>
  );
};

export default Turns;
