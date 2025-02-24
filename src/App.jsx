import React, { useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import { LanguageContext } from './ecommerce/Context/LanguageProvider';
import Routing from './ecommerce/Routing/Routing';
function App() {

  const { language } = useContext(LanguageContext);
  return (

      <div dir={language}>
        <RouterProvider router={Routing}></RouterProvider>
      </div>
  )
}

export default App;
