import React from 'react';
import styles from './Map.module.css';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
import SwipeableViews from "react-swipeable-views";
import Pricing  from "./Pricing.js";
import { Directions } from "./Directions";
import { Favourites } from "./Favourites";
import {useAuth} from "../auth";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Zoom from '@material-ui/core/Zoom';

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3} style={{ height: '304px' }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  // Tab functionality
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }


export function Home({menu, setMenu, onOriginChanged, onOriginLoad, setOrigin, origin, onDestinationChanged, onDestinationLoad, setDestination, destination, darkBackground, darkForeground, darkText, showWeather, selectedDate, setSelectedDate, setNewDirections, leaveArrive, setLeaveArrive, originError, destinationError, prediction, setPrediction, setRegister, setLogin}) {
    const [value, setValue] = React.useState(0);
    const [expand, setExpand] = React.useState(true);
    const theme = useTheme();
    const [logged] = useAuth();

    // Event handler for tabs
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    // Event handler for swipeable views
    const handleChangeIndex = (index) => {
      setValue(index);
    };

    const placeholder = () => {
      return
    }

    return (
      <div className={styles.homeContainer}>
      
      <Slide direction="up" in={menu==='Home'} mountOnEnter unmountOnExit>
      <div>
      {expand &&
      <Paper elevation={3} className={styles.homePaper} style={{backgroundColor: darkBackground}}>
      <AppBar position="static" color="primary">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Directions" {...a11yProps(0)} />
          <Tab label="Pricing" {...a11yProps(1)} />
          <Tab label="Favourites" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
        {/* Swipeable views allows mobile devices to swipe between tabs */}
        <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {/* First tab, contains location search boces and date/time picker */}
        <TabPanel value={value} index={0} dir={theme.direction} style={{height:"400px"}}>


        <Directions 
          onOriginChanged={onOriginChanged}
          onOriginLoad={onOriginLoad}
          origin={origin}
          setOrigin={setOrigin}
          darkBackground={darkBackground}
          darkForeground={darkForeground}
          darkText={darkText}
          originError={originError}
          onDestinationChanged={onDestinationChanged}
          onDestinationLoad={onDestinationLoad}
          destination={destination}
          setDestination={setDestination}
          destinationError={destinationError}
          leaveArrive={leaveArrive}
          setLeaveArrive={setLeaveArrive}
          setNewDirections={setNewDirections}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setMenu={setMenu}
          favouriteRoute={false}
          setFavouriteView={null}
          favouriteTitle={""}
          prediction={prediction}
          setPrediction={setPrediction}
        />

        </TabPanel>
        {/* Second tab, contains route dropdowns */}
        <TabPanel value={value} index={1} dir={theme.direction} style={{height:"400px"}}>


        <Box p={3} style={{ height: '304px', overflowY: 'scroll' }}>
        <Pricing
                logged={logged}
                darkBackground={darkBackground}
                darkForeground={darkForeground}
                darkText={darkText}
            />
          </Box>


        </TabPanel>
        {/* Third tab, contains miscellaneous features */}
        <TabPanel value={value} index={2} dir={theme.direction} style={{height:"400px"}}>




        {/* {<p style={{color: darkText}}>Sign in or register to create and view your favourite routes</p>} */}
        <Favourites
          onOriginChanged={onOriginChanged}
          onOriginLoad={onOriginLoad}
          origin={origin}
          setOrigin={setOrigin}
          darkBackground={darkBackground}
          darkForeground={darkForeground}
          darkText={darkText}
          originError={originError}
          onDestinationChanged={onDestinationChanged}
          onDestinationLoad={onDestinationLoad}
          destination={destination}
          setDestination={setDestination}
          destinationError={destinationError}
          leaveArrive={leaveArrive}
          setLeaveArrive={setLeaveArrive}
          setNewDirections={setNewDirections}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setMenu={setMenu}
          showWeather={showWeather}
          setRegister={setRegister}
          setLogin={setLogin}
        />



        </TabPanel>
      </SwipeableViews>
      </Paper>
      }
      <Button className={styles.homeHide} fullWidth={true} variant="contained" color="primary" onClick={() => {setExpand(!expand)}}>{expand && <Zoom in={expand}><ExpandMoreIcon/></Zoom>}{!expand && <Zoom in={!expand}><ExpandLessIcon/></Zoom>}</Button>
      </div>
      </Slide>
      </div>
    )
}