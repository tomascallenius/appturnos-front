import { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "../../App";
import tinycolor from "tinycolor2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import loreal from "../../assets/images/l_oreal.png";
import gama from "../../assets/images/gama.png";
import silkey from "../../assets/images/silkey.png";
import babyliss from "../../assets/images/babyliss.png";
import pantene from "../../assets/images/pantene.png";
import { Box } from "@mui/material";
import "./footer.css";

const Footer = () => {
  const { darkMode } = useContext(DarkModeContext);
  const [colorRGB, setColorRGB] = useState("");

  useEffect(() => {
    // Función para convertir el color a formato RGB
    const convertToRGB = (color) => {
      // Lógica para convertir el color a formato RGB
      // Puedes utilizar bibliotecas como 'tinycolor2' para esto
      const rgbColor = tinycolor(color).toRgb();
      // Retorna el valor transformado
      return rgbColor;
    };
    let color;
    if (darkMode.on) {
      color = convertToRGB(darkMode.light);
      setColorRGB(color);
    } else {
      color = convertToRGB(darkMode.dark);
      setColorRGB(color);
    }
  }, [darkMode]);

  // Configuración del carrusel
  const settings = {
    infinite: true,
    speed: 1200,
    slidesToShow: 4,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "100%",
        width: "100%",
        height: "250px",
        overflow: "hidden",
        zIndex: 1000,
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100px",
          width: "100%",
          maxWidth: "900px",
          pointerEvents: "none",
        }}
      >
        {/* Degradado a la izquierda */}
        <div
          style={{
            zIndex: 1000,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "100px", // Ancho de la sombra
            height: "100px",
            background: `linear-gradient(to left, rgba(255,255,255,0), rgba(255,255,255,1))`,
          }}
        ></div>

        {/* Carrusel */}
        <Slider {...settings}>
          <div
            style={{
              display: "flex",
              width: "20%",
            }}
          >
            <img
              className="img-carousel-footer"
              src={loreal}
              alt="Imagen 1"
              style={{
                height: "100px",
                objectFit: "contain",
                margin: "0 auto",
                /*   filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              */
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              className="img-carousel-footer"
              src={gama}
              alt="Imagen 2"
              style={{
                height: "100px",
                objectFit: "contain",
                margin: "0 auto",
                /*   filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              */
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              className="img-carousel-footer"
              src={pantene}
              alt="Imagen 3"
              style={{
                height: "100px",
                objectFit: "cover",
                margin: "0 auto",
                /*  filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              */
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              className="img-carousel-footer"
              src={silkey}
              alt="Imagen 4"
              style={{
                height: "100px",
                objectFit: "cover",
                margin: "0 auto",
                /*    filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              */
              }}
            />
          </div>
          <div style={{ display: "flex", width: "20%" }}>
            <img
              className="img-carousel-footer"
              src={babyliss}
              alt="Imagen 5"
              style={{
                height: "100px",
                objectFit: "contain",
                margin: "0 auto",
                /*    filter: darkMode.on
                  ? "none"
                  : "drop-shadow(0px 5px 15px rgba(255, 255, 255, 1))",
              */
              }}
            />
          </div>
          {/* Agrega más elementos según sea necesario */}
        </Slider>
        {/* Degradado a la derecha */}
        <div
          style={{
            zIndex: 1000,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "100px", // Ancho de la sombra
            height: "100px",
            background: `linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))`,
          }}
        ></div>
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          alignItems: "end",
          width: "100%",
          height: "100px",
          padding: "15px",
        }}
      >
        <h4>Olavarria, Bs As, Argentina</h4>
        <h4>Todos los derechos reservados @2024 </h4>
      </Box>
    </div>
  );
};

export default Footer;
