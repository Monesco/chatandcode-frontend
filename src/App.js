import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Chat from './components/Chat';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
