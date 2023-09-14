import "./App.css";
import Chat from "./Chat";
import { ChakraBaseProvider, extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

import CurrentUserContextProvider from "./utils/context";

const { Button, Input } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
    Input,
    Text
  }
});

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <div className="App">
        <CurrentUserContextProvider>
          <Chat />
        </CurrentUserContextProvider>
      </div>
    </ChakraBaseProvider>
  );
}

export default App;
