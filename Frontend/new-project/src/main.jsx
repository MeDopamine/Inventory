import * as React from 'react'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
// import { PrimeReactProvider } from 'primereact/context';
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import './index.css'

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";           
import 'primeicons/primeicons.css';

        

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <PrimeReactProvider>
        <CSSReset />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PrimeReactProvider>
    </ChakraProvider>
  </React.StrictMode>,
)