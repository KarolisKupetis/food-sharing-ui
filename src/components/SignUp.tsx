import React, {useContext, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import {Redirect} from 'react-router-dom';

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const {value, setValue} = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [number, setNumber] = useState([]);

    async function onSubmit(e) {
        e.preventDefault();

        const response = await fetch('http://localhost:8080/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({email: email, password: password, fullName: name + " " + surname, number: number})
        });

        const data = await response.json();

        if (data.status == 422 || data.status == 409) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Elektronins pastas jau naudojamas',
            });

        } else {
            Swal.fire({
                icon: 'success',
                title: 'Uzregistruota',
            });

            setValue({id: data.id});
        }
    }

    const renderRedirect = () => {
        if (value.id) {
            return <Redirect to='/publications'/>
        }
    };

    function handleChange(event) {
        if (event.target.name === "email") {
            setEmail(event.target.value);
        } else if (event.target.name === "password") {
            setPassword(event.target.value);
        } else if (event.target.name === "firstName") {
            setName(event.target.value);
        } else if (event.target.name === "lastName") {
            setSurname(event.target.value);
        } else if (event.target.name === "number") {
            setNumber(event.target.value);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            {value.id && (renderRedirect())}
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registruotis
                </Typography>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Vardas"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Pavardė"
                                name="lastName"
                                autoComplete="lname"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Elektroninio pašto adresas"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Slaptažodis"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                name="number"
                                label="Telefono numeris"
                                id="number"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Registruotis
                    </Button>
                </form>
            </div>
        </Container>
    );
}