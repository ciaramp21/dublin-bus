import React, { useEffect } from 'react';
import styles from './Map.module.css';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Zoom from '@material-ui/core/Zoom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';
import { Scrollbars } from 'react-custom-scrollbars';
import dayjs from 'dayjs';
import Alert from "@material-ui/lab/Alert";
import Button from '@material-ui/core/Button';

export function Results({menu, setMenu, callbackResponse, weather, settings, leaveArrive, walkingCallbackResponse, walking, setWalking, selectedDate, prediction}) {
    const [expand, setExpand] = React.useState(false);
    const [showResults, setShowResults] = React.useState(true);
    const [response, setResponse] = React.useState(null);
    const [walkingResponse, setWalkingResponse] = React.useState(null);
    const [walkingConditions, setWalkingConditions] = React.useState([])

    useEffect(() => {
        setResponse(callbackResponse ? callbackResponse.routes[0].legs[0] : null);
        // console.log("response", callbackResponse ? callbackResponse.routes[0].legs[0] : null);
    }, [callbackResponse, prediction, menu]);

    useEffect(() => {
        const goodWeather = ["01d", "01n", "02d", "02n", "03d", "03n", "04d", "04n"];
        setWalkingResponse(walkingCallbackResponse ? walkingCallbackResponse.routes[0].legs[0] : null);
        // console.log("walkingResponse", walkingCallbackResponse ? walkingCallbackResponse.routes[0].legs[0] : null);
        setWalkingConditions(walkingCallbackResponse ? [walkingCallbackResponse.routes[0].legs[0].distance.value < 2000, weather.feels_like > 10, goodWeather.includes(weather.icon)] : [null]);
    }, [walkingCallbackResponse, menu, weather]);


    const departureStop = (step) => {
        if ("transit" in step) {
            const line = step.transit.line.short_name;
            const depart = step.transit.departure_stop.name;
            const arrive = step.transit.arrival_stop.name;
            return (
                "(Route " + line + ": get off at " + arrive + ")"
            )
        }
        else {
            return null
        }
    }

    const getStepsHeight = (steps) => {
        if (steps.length < 3) {
            return steps.length*60;
        } else {
            return 3*60;
        }
    }

    const displayPredictedTime = () => {
        const steps = [...response.steps];
        const stepDuration = steps.reduce((total, s) => {
            return total + s.duration.value;
        }, 0);
        const totalDuration = response.duration.value;
        const dwellTime = totalDuration - stepDuration;

        if (prediction && prediction.length > 0) {
            const predictionDuration = steps.reduce((total, s) => {
                const predictionStep = prediction.find(p => p && s.travel_mode === 'TRANSIT' && s.transit.line.short_name === p.route);
                if (predictionStep) {
                    console.log('Our prediction: ' + Math.round(predictionStep.duration / 60) + ' vs Google prediction: ' + Math.round(s.duration.value / 60));
                    return total + predictionStep.duration;
                }
                return total + s.duration.value;
            }, dwellTime);

            console.log('Google prediction: ' + Math.round(totalDuration / 60));
            console.log('Our prediction: ' + Math.round(predictionDuration / 60));

            if (leaveArrive === "Leave:") {
                const predictionArrival = dayjs(selectedDate).add(predictionDuration, 'seconds').format("HH:mma");
                return "arrival time: " + predictionArrival + " (Duration: " +  Math.round(predictionDuration / 60) + " minutes)";
            } else {
                const predictionDeparture = dayjs(selectedDate).subtract(predictionDuration, 'seconds').format("HH:mma");
                return "departure time: " + predictionDeparture + " (Duration: " + Math.round(predictionDuration / 60) + " minutes)";
            }
        } else {
            if ("arrival_time" in response && "departure_time" in response) {
                return (
                    (leaveArrive === "Leave:" ? "arrival" : "departure") + " time: " + (leaveArrive === "Leave:" ? response.arrival_time.text : response.departure_time.text) + " (" + response.duration.text + ")"
                )
            } else {
                return (
                    "Duration: " + response.duration.text
                )
            }
        }
    }

    return (
        <div className={styles.directionsPaperContainer}>
        <React.Fragment>
        {(!walkingConditions.includes(false) && walking === null && response !== null && walkingResponse !== null && prediction !== null && showResults) &&
        <Slide direction="up" in={menu==='Results'} mountOnEnter unmountOnExit>
            <Paper elevation={3} className={styles.stepTitlePaper} style={{backgroundColor: "#002984"}}>
            <Grid container spacing={0}>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={8}>
                <p className={styles.directionsText}><b>The weather looks nice and it's not too far ({response.distance.text}), perhaps consider walking?</b></p>
                {weather && settings.showWeather &&
                        <img src={'http://openweathermap.org/img/wn/' + weather.icon + '.png'} alt="weather icon" />
                    }  
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <Fab color="primary" aria-label="back" className={styles.walkOrBusBackButton} onClick={() => {
                        setMenu("Home");
                        setWalking(null);
                        }}>
                        <ArrowBackIcon />
                    </Fab>
                </Grid>
                <Grid item xs={4}>
                    <Fab size="large" color="primary" aria-label="menu" style={{marginTop: "5px"}} onClick={() => {
                        setWalking(false);
                        }}>
                    <Zoom in={callbackResponse !== null} mountOnEnter unmountOnExit>
                        <DirectionsBusIcon />
                    </Zoom>
                    </Fab>
                    <p className={styles.directionsText}><i>{response.duration.text}</i></p>
                </Grid>
                <Grid item xs={4}>
                    <Fab size="large" color="primary" aria-label="menu" style={{marginTop: "5px"}} onClick={() => {
                        setWalking(true);
                        }}>
                    <Zoom in={callbackResponse !== null} mountOnEnter unmountOnExit>
                        <DirectionsWalkIcon />
                    </Zoom>
                    </Fab>
                    <p className={styles.directionsText}><i>{walkingResponse.duration.text}</i></p>
                </Grid>
                <Grid item xs={2}>
                </Grid>
                </Grid>
            </Paper>
            </Slide>
            }



            {((walkingConditions.includes(false) && response !== null && walkingResponse !== null && prediction !== null) || (walking !== null && response !== null && walkingResponse !== null && prediction !== null)) && (showResults) && (
            <React.Fragment>
            <Zoom in={expand} mountOnEnter unmountOnExit>
            <div className={styles.stepsFade}></div>
            </Zoom>

            {expand && walking !== true &&
            <div className={styles.stepsContainer}>
            <Scrollbars style={{ height: getStepsHeight(response.steps) }}>
            {response.steps.map((step) => (
                        <Zoom key={step.instructions} in={menu==='Results'} mountOnEnter unmountOnExit>
            <Paper elevation={3} className={styles.stepPaper} style={{backgroundColor: "#757de8"}}>
                <p className={styles.directionsText}> {step.instructions} {departureStop(step)}</p>
            </Paper>
            </Zoom>))}
            </Scrollbars>
            </div>
            }

            {expand && walking === true &&
            <div className={styles.stepsContainer}>
            <Scrollbars style={{ height: getStepsHeight(walkingResponse.steps) }}>
            {walkingResponse.steps.map((step) => (
                        <Zoom key={step.instructions} in={menu==='Results'} mountOnEnter unmountOnExit>
            <Paper elevation={3} className={styles.stepPaper} style={{backgroundColor: "#757de8"}}>
                <p><div className={styles.walkingDirectionsText} dangerouslySetInnerHTML={{__html: step.instructions}} /></p>
            </Paper>
            </Zoom>))}
            </Scrollbars>
            </div>
            }

            <Slide direction="up" in={menu==='Results'} mountOnEnter unmountOnExit>
            <Paper elevation={3} className={styles.stepTitlePaper} style={{backgroundColor: "#002984"}}>
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <Fab color="primary" aria-label="back" className={styles.resultsBackButton} onClick={() => {
                        setMenu("Home");
                        setWalking(null);
                        }}>
                        <ArrowBackIcon />
                    </Fab>
                </Grid>
                <Grid item xs={8}>
                    <Fab size="small" color="primary" aria-label="menu" style={{marginTop: "5px"}} onClick={() => setExpand(!expand)}>
                    {!expand &&
                    <Zoom in={!expand} mountOnEnter unmountOnExit>
                        <ExpandLessIcon />
                    </Zoom>
                    }
                    {expand && 
                    <Zoom in={expand} mountOnEnter unmountOnExit>
                        <ExpandMoreIcon />
                    </Zoom>
                    }
                    </Fab>
                    {!walking && <div style={{marginTop: '16px'}}>
                        {(prediction && prediction.length > 0) ?
                            (response.steps.filter(s => s.travel_mode === 'TRANSIT').length === prediction.length) ?
                                <Alert severity="info"
                                       style={{justifyContent: 'center'}}>Predicted using our model</Alert>
                                : <Alert severity="info"
                                         style={{justifyContent: 'center'}}>Predicted using a hybrid of our model and Google Maps</Alert>
                            : <Alert severity="info"
                                     style={{justifyContent: 'center'}}>Predicted using Google Maps</Alert>}
                    </div>}
                    <p className={styles.directionsText}><b>To {response.end_address} ({response.distance.text})</b></p>
                    {(walking === false || walking === null) &&
                    <p className={styles.directionsText}><i>Predicted {displayPredictedTime()}</i></p>
                    }
                    {walking === true &&
                        <p className={styles.directionsText}><i>Walking Distance: {walkingResponse.distance.text} ({walkingResponse.duration.text})</i></p>
                    }
                    {weather && settings.showWeather &&
                        <img src={'http://openweathermap.org/img/wn/' + weather.icon + '.png'} alt="Weather Icon"/>
                    }
                </Grid>
                <Grid item xs={2}>
                </Grid>
                </Grid>
            </Paper>
            </Slide>

            </React.Fragment>
            )}
            {(callbackResponse === null || prediction === null) && (showResults) && (
                <div className={styles.directionsPaperContainer}>
                <Paper elevation={3} className={styles.stepTitlePaper} style={{backgroundColor: "#002984", padding: "5px"}}>
                <Grid container spacing={0}>
                <Grid item xs={2}>
                <Fab color="primary" aria-label="back" className={styles.resultsBackButton} onClick={() => {
                        setMenu("Home");
                        setWalking(null);
                        }}>
                        <ArrowBackIcon />
                    </Fab>
                </Grid>
                <Grid item xs={8}>
                <p className={styles.directionsText}>Creating Route...</p>
                </Grid>
                <Grid item xs={2}>                    
                </Grid>
                </Grid>
                </Paper>
                </div>
            )}
        {callbackResponse !== null && prediction !== null && <Button className={styles.homeHide} fullWidth={true} variant="contained" color="primary" onClick={() => {setShowResults(!showResults)}}>{showResults && <Zoom in={showResults}><ExpandMoreIcon/></Zoom>}{!showResults && <Zoom in={!showResults}><ExpandLessIcon/></Zoom>}</Button>}
        </React.Fragment>
        </div>
    )
}