import React, { useContext } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "@/assets/logo.png";
import { AuthContext } from "@context/authContext.jsx";
import { IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

function Navbar() {
  const { logOutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {!["/signup", "/login", "/"].includes(location.pathname) && (
        <Box
          sx={{
            bgcolor: "black.main",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "50px",
            padding: "5px 20px",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <img
              src={logo}
              alt="todo logo"
              width="90"
              onClick={() => navigate("/")}
            />
          </Box>

          <IconButton onClick={logOutUser}>
            <LogoutIcon
              sx={{
                color: "#fff",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            />
          </IconButton>
        </Box>
      )}
    </>
  );
}

export default Navbar;
