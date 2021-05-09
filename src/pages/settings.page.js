import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {endpoint} from '../config'
import axios from "axios";
import Alert from "@material-ui/lab/Alert";
import {Trans} from "react-i18next";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        padding: '15px',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(0),
        width: '100%',
    },
}));

const SettingsPage = () => {
    const classes = useStyles();
    const [changeEmail, setChangeEmail] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const [changedEmail, setChangedEmail] = useState('')
    const [emailSuccess, setEmailSuccess] = useState(null)

    const [changedPassword, setChangedPassword] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState(null)

    const showLabel = () => {
        setTimeout(() => {
            setEmailSuccess(null)
        }, 1500)
    }

    const showLabel2 = () => {
        setTimeout(() => {
            setPasswordSuccess(null)
        }, 1500)
    }

    const applyEmailChange = async () => {

        const userId = parseInt(localStorage.getItem("id"));

        try{
            await axios.patch(`${endpoint}/Users/email`, {
                id: userId,
                email: changedEmail
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            localStorage.setItem("email", changedEmail)
            setEmailSuccess(true)
        } catch (e){
            console.log(e)
            setEmailSuccess(false)
        }

        setChangeEmail(false);
        showLabel();
    }

    const applyPasswordChange = async () => {
        const userId = parseInt(localStorage.getItem("id"));

        try{
            await axios.patch(`${endpoint}/Users/password`, {
                id: userId,
                password: changedPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            setPasswordSuccess(true)
        } catch (e){
            console.log(e)
            setPasswordSuccess(false)
        }

        setChangePassword(false);
        showLabel2();
    }

    return (
        <Grid
            container
            spacing={1}
            direction="row"
            justify="flex-start"
            alignItems="flex-start" >
            <Grid item xs={12}>

                <Dialog open={changeEmail} onClose={() => setChangeEmail(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        <Trans i18nKey={"changeEmail"}>Update email</Trans>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Trans i18nKey={"updateHint"}>For updating email enter a new one</Trans>
                        </DialogContentText>

                        <TextField
                            className={classes.formControl}
                            id="outlined-basic"
                            label="Update email"
                            variant="outlined"
                            defaultValue={localStorage.getItem("email")}
                            onChange={event => setChangedEmail(event.target.value)}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setChangeEmail(false)} color="primary">
                            <Trans i18nKey={"cancel"}>Cancel</Trans>
                        </Button>
                        <Button onClick={() => applyEmailChange()} color="primary">
                            <Trans i18nKey={"save"}>Save</Trans>
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={changePassword} onClose={() => setChangePassword(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        <Trans i18nKey={"changePassword"}>Update password</Trans>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Trans i18nKey={"updatePass"}>
                                For updating password enter a new one
                            </Trans>
                        </DialogContentText>

                        <TextField
                            className={classes.formControl}
                            id="outlined-basic"
                            label="Update password"
                            variant="outlined"
                            defaultValue={""}
                            onChange={event => setChangedPassword(event.target.value)}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setChangePassword(false)} color="primary">
                            <Trans i18nKey={"cancel"}>Cancel</Trans>
                        </Button>
                        <Button onClick={() => applyPasswordChange()} color="primary">
                            <Trans i18nKey={"save"}>Save</Trans>
                        </Button>
                    </DialogActions>
                </Dialog>


                <h1>
                    <Trans i18nKey={"settingsTitle"}>
                        Settings page
                    </Trans>
                </h1>
                <CardActions>
                    <Button variant="contained" color="primary" onClick={() => setChangeEmail(true) }>
                        <Trans i18nKey={"changeEmail"}>Change email</Trans>
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => setChangePassword(true)}>
                        <Trans i18nKey={"changePassword"}>Change password</Trans>
                    </Button>
                </CardActions>


                    { (emailSuccess === true || emailSuccess === false) &&
                        <Alert severity={emailSuccess === true ? "success" : "error"}>
                            {emailSuccess === true ? "Email updated" : "Updating email error"}
                        </Alert>
                    }



                    { (passwordSuccess === true || passwordSuccess === false) &&
                        <Alert severity={passwordSuccess === true ? "success" : "error"}>
                            {passwordSuccess === true ? "password updated" : "password updated error"}
                        </Alert>
                    }


            </Grid>
        </Grid>
    )
}

export default SettingsPage;