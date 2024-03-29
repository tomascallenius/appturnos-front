import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import "../login/login-logout.css";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      className="btn-loginout-login"
      variant="contained"
      style={{
        borderRadius: "50px",
        boxShadow: "0px 10px 17px 0px rgba(0,0,0,0.75)",
        fontFamily: "Jost, sans-serif",
        fontSize: "22px",
      }}
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Salir
    </Button>
  );
};

export default LogoutButton;
