import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import useOutsideClick from "../hooks/useOutsideClick";
import { UserContext } from "@context/userContext";
import MenuIcon from "@mui/icons-material/Menu";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import GridViewSharpIcon from "@mui/icons-material/GridViewSharp";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import HelpIcon from "@mui/icons-material/Help";
import { IconButton, Typography, Avatar, Stack, Box } from "@mui/material";
import CustomNavLink from "./CustomNavLink";

function Sidebar({ isOpen, setIsOpen }) {
  const ref = useRef();
  const { user } = useContext(UserContext);
  const [profileUrl, setProfileUrl] = useState(null);

  useOutsideClick(ref, () => setIsOpen(false));

  useEffect(() => {
    if (user.profileImg) {
      setProfileUrl(user.profileImg.url);
    } else {
      setProfileUrl(null);
    }
  }, [user]);

  return (
    <>
      <Stack
        component="aside"
        ref={ref}
        className={isOpen ? "sidebar opened" : "sidebar"}
      >
        <Box sx={{ m: "0 0 15px 5px" }}>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            sx={{
              display: {
                xs: "none",
                sm: "flex",
                md: "flex",
                color: "#fff",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <CustomNavLink
          to={"/profile"}
          className={"userInfo"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          {profileUrl ? (
            <IconButton sx={{ padding: "2px" }}>
              <img src={profileUrl} alt="profile picture" />
            </IconButton>
          ) : (
            <IconButton sx={{ padding: "2px" }}>
              <Avatar
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: "tags.medium.main",
                  color: "black.light",
                }}
              >
                {user.name[0]}
              </Avatar>
            </IconButton>
          )}
          <Typography
            variant="body1"
            component="span"
            sx={{
              fontWeight: "700",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            {user.name}
          </Typography>
        </CustomNavLink>
        <CustomNavLink to={"/dashboard"} isOpen={isOpen} setIsOpen={setIsOpen}>
          {({ isActive }) => (
            <>
              {isActive ? <GridViewSharpIcon /> : <GridViewOutlinedIcon />}
              <Typography variant="body1" component="span">
                Dashboard
              </Typography>
            </>
          )}
        </CustomNavLink>

        <CustomNavLink to={"/about"} isOpen={isOpen} setIsOpen={setIsOpen}>
          {({ isActive }) => (
            <>
              {isActive ? <HelpIcon /> : <HelpOutlineOutlinedIcon />}
              <Typography variant="body1" component="span">
                About
              </Typography>
            </>
          )}
        </CustomNavLink>
      </Stack>
    </>
  );
}

export default Sidebar;
