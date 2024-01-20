import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Input, MenuItem, Select } from "@mui/material";
import formatHour from "../../functions/formatHour";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import IosSwitch from "../interfazMUI/iosSwitch";
import { useMediaQueryHook } from "../interfazMUI/useMediaQuery";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyServices = ({
  workerData,
  email,
  refresh,
  setRefresh,
  setPendingServices,
}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputService, setInputService] = useState("");
  const [timeEdit, setTimeEdit] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const { xs, sm, md, lg, xl } = useMediaQueryHook();
  const [serviceStatus, setServiceStatus] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [auxState, setAuxState] = useState([]);

  const timeArray = [
    0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
    255, 270,
  ];

  useEffect(() => {
    if (workerData && Object.keys(workerData).length > 0) {
      setTimeEdit(workerData);
    }
  }, [workerData]);
  useEffect(() => {
    let objNewServicies = {};
    if (services && services.length > 0) {
      for (const prop in workerData) {
        if (services.includes(prop)) {
          if (workerData[prop].duration === null) {
            objNewServicies[prop] = true;
          } else if (workerData[prop].duration === 0) {
            objNewServicies[prop] = false;
          } else {
            objNewServicies[prop] = true;
          }
        }
      }
    }
    if (!showEdit) {
      setServiceStatus(objNewServicies);
    }
  }, [services, workerData, showEdit]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_URL}/services/`);
        const { data } = response;
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
        alert("Error al obtener los servicios");
      }
    };
    fetchServices();
  }, []);

 useEffect(() => {
   // Verificar si hay alguna propiedad con duration en null
   const hasNullDuration = Object.values(timeEdit).some(
     (service) => service.duration === null
   );
   // Establecer el estado de pendingServices
   setPendingServices(hasNullDuration);
 }, [timeEdit]);

  useEffect(() => {
    if (serviceStatus[auxState[0]] && auxState !== false) {
      setTimeEdit((prevState) => ({
        ...prevState,
        [auxState[0]]: {
          ...prevState[auxState[0]],
          duration: null,
        },
      }));
    } else if (!serviceStatus[auxState[0]] && auxState !== false) {
      setTimeEdit((prevState) => ({
        ...prevState,
        [auxState[0]]: {
          ...prevState[auxState[0]],
          duration: 0,
        },
      }));
    }
  }, [auxState]);

  const handleKeyDown = (e) => {
    // Manejar el evento cuando se presiona Enter
    if (e.keyCode === 13) {
      e.preventDefault(); // Evitar que se agregue un salto de línea en el Input
    }
  };

  const handleServiceStatus = (element) => {
    setServiceStatus((prevState) => {
      let newState = { ...prevState };
      newState[element] = !newState[element];
      return newState;
    });
    setAuxState([element, !serviceStatus[element]]);
  };

  const handleSelectChange = (event, element) => {
    const value = event.target.value;
    setTimeEdit((prevState) => ({
      ...prevState,
      [element]: {
        ...prevState[element],
        duration: value,
      },
    }));
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  const handleCancel = () => {
    setShowEdit(false);
    setTimeEdit(workerData);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/users/update`, {
        email: email,
        newServicesDuration: timeEdit,
      });
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error al actulizar los servicios", error);
      alert("Error al actulizar los servicios");
    }
    setShowEdit(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <hr
        style={{
          width: "100%",
          marginBottom: "15px",
          border: "none",
          height: "2px",
          backgroundColor: "#2196f3",
        }}
      />
      {/* box input search */}
      <Box
        style={{
          width: "100%",
          maxWidth: "500px",
          marginBottom: "15px",
        }}
      >
        <Input
          type="text"
          value={inputService}
          placeholder="Buscar un servicio"
          onChange={(e) => {
            setInputService(e.target.value), setSearchValue(e.target.value);
          }}
          onKeyDown={handleKeyDown} // Manejar el evento onKeyDown
          style={{
            fontFamily: "Jost, sans-serif",
            fontSize: "20px",
            width: "100%",
          }}
        />
      </Box>
      {/* box servicios/selects */}
      <Box
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {services && services.length > 0 ? (
          services
            .filter((service) =>
              service.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((element, index) => (
              <Box
                style={{
                  width: "100%",
                  display: sm ? "" : "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: sm ? "5px" : "10px",
                }}
                key={index}
              >
                <h3>{element}</h3>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: sm ? "100%" : "50%",
                  }}
                >
                  {/* //// IOSSwicth //// */}
                  <IosSwitch
                    index={index}
                    element={element}
                    timeEdit={timeEdit}
                    showEdit={showEdit}
                    serviceStatus={serviceStatus}
                    setServiceStatus={setServiceStatus}
                    handleServiceStatus={handleServiceStatus}
                  />

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {timeEdit[element].duration === null && serviceStatus && (
                      <h3 style={{ color: "red" }}>Pendiente</h3>
                    )}
                    {timeEdit[element].duration == 0 ? (
                      <h3 style={{ marginRight: "40px" }}>-----</h3>
                    ) : (
                      <Select
                        sx={{
                          height: "40px",
                          width: "100px",
                          marginLeft: "10px",
                        }}
                        disabled={showEdit ? false : true}
                        value={
                          timeEdit[element].duration === null
                            ? 0
                            : timeEdit[element].duration
                        }
                        onChange={(event) => handleSelectChange(event, element)}
                      >
                        {timeArray.map((minute, index) => (
                          <MenuItem
                            key={index}
                            value={minute}
                            disabled={minute === 0 ? true : false}
                          >
                            {minute === 0 ? "..." : formatHour(minute)}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Box>
                </Box>
                {sm && <hr style={{ marginTop: "5px" }} />}
              </Box>
            ))
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingTop: "15px",
            }}
          >
            <h2>
              {loading ? "Cargando servicios" : "No hay servicios todavía"}
            </h2>
          </Box>
        )}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        {showEdit === false && (
          <Button onClick={handleEdit}>
            <BorderColorIcon />
          </Button>
        )}
        {showEdit === true && (
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleCancel}
              variant="outlined"
              style={{ borderRadius: "50px", border: "2px solid " }}
            >
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Volver</h4>
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              <h4 style={{ fontFamily: "Jost, sans-serif" }}>Guardar</h4>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};
export default MyServices;
