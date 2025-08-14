import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/rtl.css';
import '@fontsource/noto-kufi-arabic/400.css';
import '@fontsource/noto-kufi-arabic/700.css';
import App from './App.jsx';
import AppProviders from './AppProviders.jsx';
import './i18n';


createRoot(document.getElementById('root')).render(
    <AppProviders>
        <App />
    </AppProviders>
);
