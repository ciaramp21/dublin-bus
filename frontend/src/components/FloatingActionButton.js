import React from 'react';
import Fab from '@material-ui/core/Fab';
import MenuIcon from '@material-ui/icons/Menu';
import styles from './Map.module.css';
import Tooltip from '@material-ui/core/Tooltip';
import Drawer from '@material-ui/core/Drawer';
import {List} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InputIcon from '@material-ui/icons/Input';
import {useAuth, logout} from "../auth";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

export function FloatingActionButton({menu, setMenu, setLogin, setRegister, settings, setSettings, darkBackground, darkForeground, darkText}) {
    const [state, setState] = React.useState({
        left: false
    })
    const [logged] = useAuth();
    // Event handler for when clicking on home/profile/settings/etc.
    const handleListClick = (page) => {
        setMenu(page);
    }
    // Popout drawer to the left
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({...state, [anchor]: open});
    }

    const handleChange = (event) => {
        setSettings({ ...settings, [event.target.name]: event.target.checked });
    };

    return (
        <div className={styles.menuButton}>
            {/* Menu action button and tooltip */}
            <Tooltip title="Menu" aria-label="menu">
                <Fab color="primary" aria-label="menu" onClick={toggleDrawer('left', true)}>
                    <MenuIcon/>
                </Fab>
            </Tooltip>
            {/* Popout drawer */}
            <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
                <div className={styles.drawer}
                     role="presentation"
                     onClick={toggleDrawer('left', false)}
                     onKeyDown={toggleDrawer('left', false)}
                >
                    {/* Items in drawer */}
                    <List>
                        <ListItem
                            button
                            key={'Home'}
                            onClick={() => handleListClick('Home')}
                            selected={menu === 'Home'}
                        >
                            <ListItemIcon>
                                <HomeIcon style={{paddingRight: '30'}}/>
                                <ListItemText primary={'Home'}/>
                            </ListItemIcon>
                        </ListItem>
                        {logged ? (
                            <div>
                                <ListItem
                                    button
                                    key={'Profile'}
                                    onClick={() => handleListClick('Profile')}
                                    selected={menu === 'Profile'}
                                >
                                    <ListItemIcon>
                                        <AccountCircleIcon style={{paddingRight: '30'}}/>
                                        <ListItemText primary={'Profile'}/>
                                    </ListItemIcon>
                                </ListItem>
                                <ListItem
                                    button
                                    key={'Logout'}
                                    onClick={() => {
                                        logout();
                                        setMenu("Home")
                                    }}
                                    selected={menu === 'Logout'}
                                >
                                    <ListItemIcon>
                                        <ExitToAppIcon style={{paddingRight: '30'}}/>
                                        <ListItemText primary={'Logout'}/>
                                    </ListItemIcon>
                                </ListItem>
                                
                                <Divider />

                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={settings.showStops}
                                        onChange={handleChange}
                                        name="showStops"
                                        color="primary"
                                    />
                                    }
                                    label="Display Stops"
                                />
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={settings.darkMode}
                                        onChange={handleChange}
                                        name="darkMode"
                                        color="primary"
                                    />
                                    }
                                    label="Toggle Dark Mode"
                                />
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={settings.showLeap}
                                        onChange={handleChange}
                                        name="showLeap"
                                        color="primary"
                                    />
                                    }
                                    label="Display Leap"
                                />
                            </div>
                        ) : (
                            <div>
                                <ListItem
                                    button
                                    key={'Login'}
                                    onClick={() => setLogin(true)}
                                    selected={menu === 'Login'}
                                >
                                    <ListItemIcon>
                                        <InputIcon style={{paddingRight: '30'}}/>
                                        <ListItemText primary={'Login'}/>
                                    </ListItemIcon>
                                </ListItem>
                                <ListItem
                                    button
                                    key={'Register'}
                                    onClick={() => setRegister(true)}
                                    selected={menu === 'Register'}
                                >
                                    <ListItemIcon>
                                        <PersonAddIcon style={{paddingRight: '30'}}/>
                                        <ListItemText primary={'Register'}/>
                                    </ListItemIcon>
                                </ListItem>
                            </div>
                        )}
                    </List>
                </div>
            </Drawer>
        </div>
    )
}