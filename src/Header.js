import React, {useContext} from "react";
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import AcUnitRoundedIcon from "@material-ui/icons/AcUnitRounded";
import {makeStyles} from "@material-ui/styles";
import {Link} from "react-router-dom";
import UserContext from "./UserContext";


const useStyles = makeStyles(() => ({
    typographyStyles: {
        flex: 1
    },

    withMargin: {
        marginRight: "50px",
        color: "white",
        textDecoration: "solid"
    }
}));

const Header = () => {
    const classes = useStyles();
    const {value, setValue} = useContext(UserContext);

    function login() {
        return (
            <Link to="/login" style={{textDecoration: 'none'}}>
                <Typography className={classes.withMargin}>
                    Prisijungti
                </Typography>
            </Link>
        )
    }

    async function logOutAction() {
        const url = "http://localhost:8080/auth/1";
        const response = await fetch(url, {credentials: 'include', method: 'DELETE'});

        setValue({id: null});
    }

    function logOut() {
        return (
            <Link to="/publications" style={{textDecoration: 'none'}} onClick={logOutAction}>
                <Typography className={classes.withMargin}>
                    Atsijungti
                </Typography>
            </Link>
        )
    }

    function register() {
        return (
            <Link to="/signup" style={{textDecoration: 'none'}}>
                <Typography className={classes.withMargin}>
                    Registruotis
                </Typography>
            </Link>
        )
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography className={classes.typographyStyles}>
                    Foodshare
                </Typography>
                <Link to="/publications" style={{textDecoration: 'none'}}>
                    <Typography className={classes.withMargin}>
                        Pagrindinis
                    </Typography>
                </Link>
                {value.id ? logOut() : login()}
                {value.id == null && register()}
                <AcUnitRoundedIcon/>
            </Toolbar>
        </AppBar>
    );
};

export default Header;