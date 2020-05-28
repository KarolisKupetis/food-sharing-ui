import React, {useContext, useState} from 'react';
import  { Redirect } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UserContext from "../UserContext";
import Swal from 'sweetalert2'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const url = "http://localhost:8080/auth FOR POST email has validation";

export default function SignIn() {
    const classes = useStyles();
    const {value, setValue} = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

   async function onSubmit(e) {
        e.preventDefault();

        const requestOptions ={
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password})
        };

       const response = await fetch('http://localhost:8080/auth', requestOptions);
       const data = await response.json();

       if (data.detail == "Failed Validation") {
           Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: 'Netinkamas slaptažodis arba elektronins paštas',
           });

       } else {
           Swal.fire({
               icon: 'success',
               text: 'Sėkmingai prisijungėte',
           });

           setValue({id: data.id});
           setRedirect(true);
       }
    }

    function handleChange(event) {
        if (event.target.name === "email") {
            setEmail(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    function getRender() {
        return (
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Prisijungimas
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Elektroninis pastas"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Slaptazodis"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Prisiminti mane"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Prisijungti
                    </Button>
                </form>
            </div>
        );
    }

    function redirectToDash() {
        if (redirect === true || value.id) {
            return <Redirect to='/publications' />
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            {redirect ? redirectToDash() : getRender()}
        </Container>
    );
}