import { useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import { LanguageContext } from './Context/LanguageProvider';
import Routing from './Routing/Routing';

function App() {
  const { language } = useContext(LanguageContext);
  return (
      <div dir={language}>
        <RouterProvider router={Routing}></RouterProvider>
      </div>
  )
}

export default App;
