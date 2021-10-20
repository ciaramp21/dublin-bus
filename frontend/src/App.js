import './App.css';

import React from 'react';
import MapContainer from './components/MapContainer';
import { FloatingActionButton } from './components/FloatingActionButton';
import UserRegister from './components/UserRegister'
import UserSignIn from "./components/UserSignIn";
import '@fontsource/roboto';

function App() {
    const [menu, setMenu] = React.useState('Home');
    const [login, setLogin] = React.useState(false);
    const [register, setRegister] = React.useState(false);
    const [settings, setSettings] = React.useState({
        showStops: false,
        darkMode: false,
        showLeap: false,
        showWeather: true,
      });
      const darkBackground = settings.darkMode ? "#424242" : "";
      const darkForeground = settings.darkMode ? "#616161" : "";
      const darkText = settings.darkMode ? "#ffffff" : "";

    return (
        <div className="App">

            <MapContainer menu={menu} setMenu={setMenu} settings={settings} setSettings={setSettings} setRegister={setRegister} setLogin={setLogin} darkBackground={darkBackground} darkForeground={darkForeground} darkText={darkText}/>
            <FloatingActionButton menu={menu} setMenu={setMenu} setLogin={setLogin} setRegister={setRegister} settings={settings} setSettings={setSettings} darkBackground={darkBackground} darkForeground={darkForeground} darkText={darkText}/>
            <UserRegister show={register} setRegister={setRegister} setLogin={setLogin}/>
            <UserSignIn show={login} setLogin={setLogin}/>
        </div>
    );
}

export default App;
