import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Copyright from '../components/CopyRight.component'
import {useHistory} from 'react-router-dom';
import axios from 'axios'
import {endpoint} from '../config'

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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const SignInPage = () => {
    const history = useHistory();

    const classes = useStyles();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [showError, setShowError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setShowBackdrop(true);

        try {
            const { data } = await axios.post(`${endpoint}/Users/authenticate`, {
                email: userEmail,
                password: userPassword
            });

            const {
                token,
                name,
                email,
                role,
                id
            } = data;

            localStorage.setItem("accessToken", token);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);
            localStorage.setItem("id", id);

            history.push('/');

        } catch (e){
            setShowError(true)
        }
        setShowBackdrop(false)
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={event => setUserEmail(event.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={event => setUserPassword(event.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>

                </form>
            </div>
            { showError && <Alert onClick={() => setShowError(null)} severity="error">Bad credentials!</Alert> }
            <Box mt={8}>
                <Copyright />
            </Box>
            <Backdrop className={classes.backdrop} open={showBackdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>

        </Container>
    )
}

export default SignInPage;