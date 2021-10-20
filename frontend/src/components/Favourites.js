import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import styles from './Map.module.css';
import { Directions } from "./Directions";
import Zoom from '@material-ui/core/Zoom';
import dayjs from 'dayjs';
import {authFetch, useAuth, logout} from "../auth";
import CircularProgress from "@material-ui/core/CircularProgress";

export function Favourites({origin, darkBackground, darkForeground, darkText, destination, leaveArrive, setLeaveArrive, setMenu, showWeather, setNewDirections, setOrigin, setDestination, originError, destinationError, setSelectedDate, setRegister, setLogin}) {
    const [loading, setLoading] = React.useState(false);
    const [favourites, setFavourites] = React.useState([]);
    const [favouriteView, setFavouriteView] = React.useState(true);
    const [selectedTime, setSelectedTime] = React.useState(dayjs());
    const [favouriteId, setFavouriteId] = React.useState("")
    const [favouriteTitle, setFavouriteTitle] = React.useState("")
    const [favouriteOrigin, setFavouriteOrigin] = React.useState('');
    const [favouriteDestination, setFavouriteDestination] = React.useState('');
    const [favouriteOriginError, setFavouriteOriginError] = React.useState("");
    const [favouriteDestinationError, setFavouriteDestinationError] = React.useState("");
    const [favouriteOriginBox, setFavouriteOriginBox] = React.useState('');
    const [favouriteDestinationBox, setFavouriteDestinationBox] = React.useState('');
    const [newFavouriteDirections, setNewFavouriteDirections] = React.useState(true);
    const [editingFavourite, setEditingFavourite] = React.useState(null);

    const [logged] = useAuth();

    const fetchFavourites = async () => {
        await setLoading(true);
        authFetch(
            process.env.REACT_APP_API_URL + '/user/favourites'
        ).then(data => {
            if (data) {
                if (data.status === 401) {
                    logout();
                } else if (data.status === 200) {
                    data.json().then(result => {
                        setFavourites(result.favourites);
                    });
                }
            }
        }).catch(error => {
            console.error("error:", error);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect( () => {
        if(logged) {
          fetchFavourites();
        }
    },[logged])

    const mapBounds = {
        north: 54.345804,
        south: 52.345804,
        east: -5.26031,
        west: -7.26031,
      };

      // Next 4 functions are for the places search boxes
  const onFavouriteOriginChanged = () => {
    try {
      const lat = favouriteOriginBox.getPlaces()[0].geometry.location.lat();
      const lng = favouriteOriginBox.getPlaces()[0].geometry.location.lng();
      if (favouriteOriginBox.getPlaces().length > 1) {
        setFavouriteOriginError("Destination must be a single address");
      }
      else if (favouriteOriginBox.getPlaces()[0].formatted_address === destination) {
        setFavouriteOriginError("Origin cannot be the same as destination");
      }
      else if ((mapBounds.south <= lat && lat <= mapBounds.north) && (mapBounds.west <= lng && lng <= mapBounds.east)) {
        if (favouriteOriginBox.getPlaces()[0].formatted_address !== destination) {
          setFavouriteDestinationError("");
        }
        setFavouriteOrigin(favouriteOriginBox.getPlaces()[0].formatted_address);
        setFavouriteOriginError("");
      }
      else {
        // setOrigin("");
        // setOriginBox("");
        setFavouriteOriginError("Origin must be close to Dublin");
      }
    }
    catch {
      // setOrigin("");
      // setOriginBox("");
      setFavouriteOriginError("Enter a valid Origin");
    }
    setNewFavouriteDirections(true);
  };

  const onFavouriteDestinationChanged = () => {
    try {
      const lat = favouriteDestinationBox.getPlaces()[0].geometry.location.lat();
      const lng = favouriteDestinationBox.getPlaces()[0].geometry.location.lng();
      if (favouriteDestinationBox.getPlaces().length > 1) {
        setFavouriteDestinationError("Destination must be a single address");
      }
      else if (favouriteDestinationBox.getPlaces()[0].formatted_address === origin) {
        setFavouriteDestinationError("Destination cannot be the same as origin");
      }
      else if ((mapBounds.south <= lat && lat <= mapBounds.north) && (mapBounds.west <= lng && lng <= mapBounds.east)) {
        if (favouriteDestinationBox.getPlaces()[0].formatted_address !== origin) {
          setFavouriteOriginError("");
        }
        setFavouriteDestination(favouriteDestinationBox.getPlaces()[0].formatted_address);
        setFavouriteDestinationError("");
      }
      else {
        // setDestination("");
        // setDestinationBox("");
        setFavouriteDestinationError("Destination must be close to Dublin");
      }
    }
    catch {
      // setDestination("");
      // setDestinationBox("");
      setFavouriteDestinationError("Enter a valid destination");
    }
    setNewFavouriteDirections(true);
  }

  const onFavouriteOriginLoad = ref => {
    setFavouriteOriginBox(ref);
  };
  const onFavouriteDestinationLoad = ref => {
    setFavouriteDestinationBox(ref);
  };

    const createFavourite = () => {
        return (
            setFavouriteView(false)
        )
    }

    const editFavourite = (index) => {
      const editing = favourites.filter((indexFavourite, favourite) => index === indexFavourite);
      setFavouriteId(editing[0].id);
      setFavouriteTitle(editing[0].title);
      setFavouriteOrigin(editing[0].origin);
      setFavouriteDestination(editing[0].destination);
      let date = new Date();
      date.setHours(Number(dayjs(editing[0].time, "HH:mm:ss").format("HH")));
      date.setMinutes(Number(dayjs(editing[0].time, "HH:mm:ss").format("mm")));
      date = dayjs(date);
      setSelectedTime(date);
      setEditingFavourite(editing[0]);
        return (
            setFavouriteView(false)
        )
    }

    const saveFavourite = async () => {
        if(favouriteId) {
            authFetch(
                process.env.REACT_APP_API_URL + '/user/favourites/' + favouriteId,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: favouriteTitle,
                        origin: favouriteOrigin,
                        destination: favouriteDestination,
                        time: selectedTime.format("HH:mm")
                    })
                }
            ).then(data => {
                if (data) {
                    if (data.status === 401) {
                        logout();
                    } else if (data.status === 200) {
                        const updateFavourites = favourites.map(f => {
                            if (f.id === favouriteId) {
                                return {
                                    id: favouriteId,
                                    title: favouriteTitle,
                                    origin: favouriteOrigin,
                                    destination: favouriteDestination,
                                    time: selectedTime
                                };
                            }
                            return f;
                        });
                        setFavourites(updateFavourites);
                        setFavouriteId("");
                        setFavouriteTitle("");
                        setFavouriteOrigin("");
                        setFavouriteDestination("");
                        setSelectedTime(new Date());
                        setEditingFavourite("");
                    }
                }
            }).catch(error => {
                console.error("error:", error);
            });
        } else {
            authFetch(
                process.env.REACT_APP_API_URL + '/user/favourites',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: favouriteTitle,
                        origin: favouriteOrigin,
                        destination: favouriteDestination,
                        time: selectedTime.format("HH:mm")
                    })
                }
            ).then(data => {
                if (data) {
                    if (data.status === 401) {
                        logout();
                    } else if (data.status === 201) {
                        setFavourites([...favourites, {
                            title: favouriteTitle,
                            origin: favouriteOrigin,
                            destination: favouriteDestination,
                            time: selectedTime
                        }]);
                        setFavouriteId("");
                        setFavouriteTitle("");
                        setFavouriteOrigin("");
                        setFavouriteDestination("");
                        setSelectedTime(new Date());
                        setEditingFavourite("");
                    }
                }
            }).catch(error => {
                console.error("error:", error);
            });
        }
    }

    const deleteFavourite = (index) => {
        const favourite = favourites.find((indexFavourite) => index === indexFavourite);
        authFetch(
            process.env.REACT_APP_API_URL + '/user/favourites/' + favourite.id,
            {
                method: "DELETE"
            }
        ).then(data => {
            if (data) {
                if (data.status === 401) {
                    logout();
                } else if (data.status === 200) {
                    setFavourites(favourites.filter((indexFavourite) => index !== indexFavourite))
                }
            }
        }).catch(error => {
            console.error("error:", error);
        });
    }

    const getFavouriteDescription = (favourite) => {
      const description = "From " + favourite.origin + " to "  + favourite.destination + " at " + dayjs(favourite.time, "HH:mm:ss").format("HH:mm");
      return (
        description
      )
    }

    const selectFavourite = (favourite) => {
      const date = new Date();
      date.setHours(Number(dayjs(favourite.time, "HH:mm:ss").format("HH")));
      date.setMinutes(Number(dayjs(favourite.time, "HH:mm:ss").format("mm")));
      setSelectedDate(date);
      setLeaveArrive("Arrive:");
      setOrigin(favourite.origin);
      setDestination(favourite.destination);
      setMenu('Results');
      setNewDirections(false);
    }

    const handleTitleChange = (event) => {
      setFavouriteTitle(event.target.value);
    }

    return (
        <React.Fragment>
            {logged ?
                (loading ?
                    <div style={{padding: '15px 0'}}>
                        <CircularProgress />
                        <div>
                            <p style={{color: darkText, marginTop: '8px'}}>
                                Retrieving favourites...
                            </p>
                        </div>
                    </div>
                    : <div>
            <Zoom in={!favouriteView} mountOnEnter unmountOnExit>
                <Directions 
                    onOriginChanged={onFavouriteOriginChanged}
                    onOriginLoad={onFavouriteOriginLoad}
                    origin={favouriteOrigin}
                    originError={favouriteOriginError}
                    onDestinationChanged={onFavouriteDestinationChanged}
                    onDestinationLoad={onFavouriteDestinationLoad}
                    destination={favouriteDestination}
                    destinationError={favouriteDestinationError}
                    darkBackground={darkBackground}
                    darkForeground={darkForeground}
                    darkText={darkText}
                    leaveArrive={leaveArrive}
                    setLeaveArrive={setLeaveArrive}
                    setNewDirections={setNewFavouriteDirections}
                    selectedDate={selectedTime}
                    setSelectedDate={setSelectedTime}
                    setMenu={setMenu}
                    showWeather={showWeather}
                    favouriteRoute={true}
                    saveFavourite={saveFavourite}
                    setFavouriteView={setFavouriteView}
                    favouriteTitle={favouriteTitle}
                    handleTitleChange={handleTitleChange}
                />
            </Zoom>
            
            {favouriteView &&
                <Grid container spacing={0}>
                {(!favourites || favourites.length < 10) &&
                <Grid item xs={12}>
                    <Tooltip title="Create favourite" aria-label="Create favourite" style={{marginTop: "-10px", marginBottom: "20px"}}>
                        <Fab color="primary" aria-label="menu" onClick={() => createFavourite()}>
                            <AddIcon/>
                        </Fab>
                    </Tooltip>
                </Grid>
                }
                {(favourites && favourites.length >= 10) &&
                <Grid item xs={12}>
                <Paper className={styles.darkForeground} style={{backgroundColor: darkForeground, padding: "2px 4px",marginTop: "-10px", marginBottom: "20px"}}>
                <p style={{color: darkText}}>You have reached the max number of favourites. Delete a favourite to free up space.</p>
                </Paper>
                </Grid>
                }
                <Grid item xs={12}>
                <div style={{marginTop: "-10px", height: "250px", overflowY: "scroll"}}>
                    {(!favourites || favourites.length === 0) ?
                        <p style={{color: darkText}}>Create a favourite route to see it here</p> :
                        <div>{
                            favourites.map((favourite, index) => (
                                <Paper key={favourite.id} className={styles.darkForeground} style={{
                                    backgroundColor: darkForeground,
                                    padding: "2px 4px",
                                    marginTop: "10px",
                                    marginBottom: "10px"
                                }}>
                                    <Grid container spacing={0}>
                                        <Grid item md={10} xs={8}>
                                            <Button
                                                fullWidth={true}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => selectFavourite(favourite)}>
                                                <Typography>{favourite.title}</Typography>
                                            </Button>
                                        </Grid>
                                        <Grid item md={1} xs={2}>
                                            <Tooltip title="Edit favourite" aria-label="Edit favourite">
                                                <Fab color="primary" size="small" aria-label="edit"
                                                     className={styles.editDeleteIcons}
                                                     onClick={() => editFavourite(favourite)}>
                                                    <EditIcon/>
                                                </Fab>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item md={1} xs={2}>
                                            <Tooltip title="Delete favourite" aria-label="Delete favourite">
                                                <Fab color="secondary" size="small" aria-label="delete"
                                                     className={styles.editDeleteIcons} onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this favourite?')) deleteFavourite(favourite)
                                                }}>
                                                    <DeleteIcon/>
                                                </Fab>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={0}>
                                        <Grid item xs={10}>
                                            <p style={{color: darkText}}>{getFavouriteDescription(favourite)}</p>
                                        </Grid>
                                        <Grid item xs={2}></Grid>
                                    </Grid>
                                </Paper>
                            ))
                        }</div>}
                </div>
                </Grid>
                </Grid>
            }
            </div>) :
            <div>
                <Typography>An account is required, please login or sign up!</Typography>
                <div style={{ margin: '16px 0'}}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setLogin(true)}>
                        <Typography>Login</Typography>
                    </Button>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setRegister(true)}>
                        <Typography>Create an account</Typography>
                    </Button>
                </div>
            </div>}
        </React.Fragment>
    )
}