import { Button } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { WhatsApp } from "@mui/icons-material";
import "./whoIsComingWorker.css";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WhoIsComingWorker = ({ user }) => {
  const [turns, setTurns] = useState([]);
  const [count, setCount] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  const date = new Date();
  const currentDay = date.getDate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/countworker`,
          { emailWorker: user.email }
        );
        const { data } = response;
        setCount(data);
      } catch (error) {
        console.error("Error al obtener el count.", error);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const fetchTurns = async () => {
      const [numberDay, numberMonth] = selectedDay.split("/").map(Number);
      try {
        const response = await axios.post(
          `${VITE_BACKEND_URL}/workdays/whoiscoming`,
          { emailWorker: user.email, month: numberMonth, day: numberDay }
        );
        const { data } = response;
        console.log(data)
        setTurns(data);
      } catch (error) {
        console.error("Error al obtener los dias cancelados.", error);
      }
    };
    if (selectedDay.length > 0) {
      fetchTurns();
    }
  }, [selectedDay]);

  const handleChangeDay = (element) => {
    setSelectedDay(element);
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
                  sx={{
                    backgroundColor: selectedDay == element ? "black" : "",
                    margin: "5px",
                    fontFamily: "Jost, sans-serif",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    handleChangeDay(element);
                  }}
                >
                  {element}
                </Button>
              );
            })}
        </Box>
      </Box>
      <Box
        className="box-container-ctfw"
        sx={{
          width: "100%",
          overFlow: "scroll",
        }}
      >
        <Box style={{ overflow: "scroll", maxHeight: "350px" }}>
          {turns.length > 0 &&
            turns.map((element, index) => (
              <Box key={index}>
                {index === 0 && (
                  <Box>
                    <Box style={{ display: "flex" }}>
                      <h3 className="h-email-ctfw">Email</h3>
                      <hr />
                      <h3 className="h-whocancelled-ctfw">Nombre</h3>
                      <hr />
                      <h3 className="h-phone-ctfw">Celular</h3>
                      <hr />
                      <h3 className="h-day-ctfw">Día</h3>
                    </Box>
                    <hr className="hr-ctfw" />
                  </Box>
                )}
                <Box style={{ display: "flex" }}>
                  <h4 className="h-email-ctfw">{element.email}</h4>
                  <hr />
                  <h4 className="h-whocancelled-ctfw">
                    {element.name}
                  </h4>
                  <hr />
                  <Box className="h-phone-ctfw">
                    <a
                      href={`whatsapp://send?phone=${element.phone}&text=Hola , quiero contactarte`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
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
                  </Box>

                  <hr />
                  <img src={element.image} alt={element.image} style={{width:"30px", borderRadius:"200px"}}></img>
                </Box>
                <hr className="hr-ctfw" />
              </Box>
            ))}
        </Box>
      </Box>
    </div>
  );
};

export default WhoIsComingWorker;
