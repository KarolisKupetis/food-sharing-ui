import React, {useLayoutEffect, useState} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Grid} from "@material-ui/core";
import Header from "./Header";
import PublicationList from "./PublicationList";
import {makeStyles} from "@material-ui/styles";
import FormPublication from "./components/PublicationForm/FormPublication";
import SignIn from "./components/Login"
import SignUp from "./components/SignUp";
import {UserContext} from "./UserContext";
import UserLocationContext from "./UserLocationContext";
import PublicationInfo from "./components/PublicationInfo";
import MyPublications from "./MyPublications";

const useStyles = makeStyles(() => ({
    typographyStyles: {
        marginBottom: 75
    },
}));
const App = () => {
    const classes = useStyles();
    const [value, setValue] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [location, setLocation] = useState({});
    const [locLoaded, setLocLoaded] = useState(false);

    useLayoutEffect(() => {

        seeIfLoggedIn();

    }, []);

    async function seeIfLoggedIn() {
        const url = "http://localhost:8080/auth";
        const response = await fetch(url, {credentials: 'include'});
        const data = await response.json();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                getPosition(position);
            });
        }

        if (data.id !== 0) {
            setValue({id: data.id});
        } else {
            setValue({id: null});
        }

        setLoaded(true);
    }

    function getValue() {
        return value.id;
    }

    function getPosition(position) {
        setLocation({lng: position.coords.longitude, lat: position.coords.latitude});
        setLocLoaded(true);
    }

    function getRender() {
        return (
            <Grid container direction="column">
                <Grid item className={classes.typographyStyles}>
                    <Header/>
                </Grid>
                <Grid item container>
                    <Grid item xs={false} sm={2}/>
                    <Grid item xs={12} sm={8}>
                        <Switch>
                            <Route exact path="/" component={PublicationList}/>
                            <Route exact path="/publications/" render={() => <PublicationList id={getValue()}/>}/>
                            <Route exact path="/publication/:id" component={PublicationInfo}/>
                            <Route exact path="/publications/post" component={FormPublication}/>
                            <Route exact path="/publications/personal" component={MyPublications}/>
                            <Route exact path="/login" component={SignIn}/>
                            <Route exact path="/signup" component={SignUp}/>
                        </Switch>
                    </Grid>
                    <Grid item xs={false} sm={2}/>
                </Grid>
            </Grid>
        )
    }

    return (
        <UserContext.Provider value={{value, setValue}}>
            <UserLocationContext.Provider value={{location, setLocation}}>
                {(loaded && locLoaded) ? getRender() : <div> Loading </div>}
            </UserLocationContext.Provider>
        </UserContext.Provider>
    )
};

export default App;