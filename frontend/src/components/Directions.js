import React from 'react';
import styles from './Map.module.css';
import { PlacesSearch } from "./PlacesSearch";
import { LeaveArriveButton } from './LeaveArriveButton';
import DayJsUtils from '@date-io/dayjs';
import { DateTimePicker, TimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

export function Directions({onOriginChanged, onOriginLoad, origin, darkBackground, darkForeground, darkText, originError, onDestinationChanged, onDestinationLoad, destination, destinationError, leaveArrive, setLeaveArrive, setNewDirections, selectedDate, setSelectedDate, setMenu, favouriteRoute, saveFavourite, setFavouriteView, favouriteTitle, handleTitleChange, setPrediction}) {
  const useStyles = makeStyles((theme) => ({
    searchPaper: {
      padding: '2px 4px',
      marginTop: '-10px',
      marginBottom: '20px',
      alignItems: 'center',
      width: "80%",
      marginLeft: "10%",
      zIndex: 2,
    },
    standaloneSearchBox: {
      // marginLeft: theme.spacing(1),
      flex: 1,
      position: "absolute",
      width: "100%",
      margin: "auto",
      height: "auto",
    },
    input: {
      // marginLeft: theme.spacing(1),
      flex: 1,
      width: "100%",
      margin: "auto",
      height: "auto",
    },
    inputTextColor:{
      // color:'#002984'
  }
  }));

const classes = useStyles();  
  
  return (
        <React.Fragment>
        {favouriteRoute &&
          <TextField
          className={classes.input}
          value={favouriteTitle}
          onChange={handleTitleChange}
          variant="outlined"
          placeholder={favouriteTitle ? favouriteTitle : "Enter a title"}
          error={favouriteTitle.length > 25}
          label={favouriteTitle.length > 25 ? "Title cannot be more than 25 characters" : ""}
//           variant="outlined"
          inputProps={{ 'aria-label': 'search google maps', style: {color: darkText} }}
        />
        }
        <PlacesSearch 
        onPlacesChanged={onOriginChanged} 
        onPlacesLoad={onOriginLoad} 
        place={origin} 
        search={"Origin Search"}
        label={"Origin"}
        darkBackground={darkBackground}
        darkForeground={darkForeground}
        darkText={darkText}
        error={originError}
        style={{marginTop: '10px'}}
        />
        <PlacesSearch 
        onPlacesChanged={onDestinationChanged} 
        onPlacesLoad={onDestinationLoad} 
        place={destination} 
        search={"Destination Search"}
        label={"Destination"}
        darkBackground={darkBackground}
        darkForeground={darkForeground}
        darkText={darkText}
        error={destinationError}
        style={{marginTop: '10px'}}
        />

        <Grid container spacing={1} alignItems="center" className={styles.dateAndButtonContainer} style={{marginTop: "10px", marginBottom: "10px"}}>
          
          {!favouriteRoute && 

//         <Paper className={styles.datePickerContainer} style={{backgroundColor: darkForeground}}>
          <Grid item xs={12} md={2}>
          <LeaveArriveButton leaveArrive={leaveArrive} setLeaveArrive={setLeaveArrive} setNewDirections={setNewDirections} origin={origin} destination={destination} originError={originError} destinationError={destinationError}/>
          </Grid>
          }
        <Grid item xs={12} md={favouriteRoute ? 12 : 10}>
          {favouriteRoute &&
          <MuiPickersUtilsProvider utils={DayJsUtils}>
            <TimePicker
                className={styles.datePicker}
                value={selectedDate}
                onChange={setSelectedDate}
                label="Select a Time to Arrive At"
                inputVariant="outlined"
                inputProps={{ style: {color: darkText} }}
                InputLabelProps={{
                  style: { color: darkText },
                }}
            />
          </MuiPickersUtilsProvider>
          }
          {!favouriteRoute &&
          <MuiPickersUtilsProvider utils={DayJsUtils}>
            <DateTimePicker
                className={styles.datePicker}
                value={selectedDate}
                disablePast
                maxDate={new Date().setDate(new Date().getDate()+1)}
                onChange={setSelectedDate}
                label="Select a Date and Time"
                inputVariant="outlined"
                showTodayButton
                inputProps={{ style: {color: darkText} }}
                InputLabelProps={{
                  style: { color: darkText },
                }}
            />
          </MuiPickersUtilsProvider>
          }
        </Grid>
        </Grid>

        {origin !== "" && destination !== "" && originError === "" && destinationError === "" &&
        !favouriteRoute && 
          <Button
          className={styles.submitButton}
          variant="contained" 
          color="primary"
          size="large"
          fullWidth
          onClick={() => {
            setMenu('Results');
            setNewDirections(false);
            setPrediction(null);
          }}>
            Submit 
          </Button>
        }
        {((origin === "" || destination === "") || (originError !== "" || destinationError !== "")) && 
        !favouriteRoute &&
          <Button
          className={styles.submitButton}
          variant="contained" 
          color="primary"
          size="large"
          fullWidth
          disabled
          > 
            Submit 
          </Button>
        }

        {origin !== "" && destination !== "" && originError === "" && destinationError === "" && favouriteTitle.length <= 25 &&
        favouriteRoute && 
          <Button
          className={styles.favouriteSubmitButton}
          variant="contained" 
          color="primary"
          onClick={() => {
            saveFavourite(favouriteTitle ? favouriteTitle : "Unnamed Route", origin, destination, selectedDate);
            setNewDirections(false);
            setFavouriteView(true);
          }}>
            Submit 
          </Button>
        }
        {(((origin === "" || destination === "") || (originError !== "" || destinationError !== "")) || favouriteTitle.length > 25 ) && 
        favouriteRoute &&
          <Button
          className={styles.favouriteSubmitButton}
          variant="contained" 
          color="primary"
          disabled
          > 
            Submit 
          </Button>
        }
        </React.Fragment>
    )
}