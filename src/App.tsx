import { Box } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-location";
import "./App.css";
import { AppRouter } from "./routes";

function App() {
  return (
    <AppRouter>
      <Box maxW={640} h="100%" m="0 auto">
        <Outlet />
      </Box>
    </AppRouter>
  );
}

export default App;
