import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Box } from "@chakra-ui/react";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <Box p={4} display="flex" alignItems="left" justifyContent="left">
      <nav>
        <Button colorScheme="purple" onClick={handleHomeClick}>
          Home
        </Button>
      </nav>
    </Box>
  );
};
