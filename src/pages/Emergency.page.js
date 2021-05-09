import React, {useEffect, useState} from 'react';
import axios from "axios";
import {endpoint} from '../config'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import {
    Card,
    CardActions,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";

import {Trans} from "react-i18next";


import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";


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

const OutlinedCard = ({ emergency, emergencies, setEmergencies }) => {

    const classes = useStyles();
    const [appliedStatus, setAppliedStatus] = useState();
    const [brigades, setBrigades] = useState([]);
    const [selectedBrigade, setSelectedBrigade] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };


    const showLabel = () => {
        setTimeout(() => {
            setAppliedStatus(undefined)
        }, 1500)
    }

    const findBrigade = async (id) => {
        localStorage.setItem("emergency", id);
        try{
            const { data } = await axios.get(`${endpoint}/Brigades`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            setBrigades(data)
            setShowModal(true)
        } catch (e){
            console.log(e)
        }
    }

    const applyBrigadeChanges = async () => {
        const selectedEmergency = parseInt(localStorage.getItem('emergency'));

        try{
            await axios.post(`${endpoint}/EmergencyCalls/brigade/?callId=${selectedEmergency}&brigadeId=${selectedBrigade}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            setEmergencies(emergencies.filter(emergency => emergency.id !== selectedEmergency))
            setAppliedStatus(200)
            showLabel();
        } catch (e){
            setAppliedStatus(500)
            showLabel();
        }

        setShowModal(false)

    }

    return (
        <Card className={classes.root} variant="outlined">

            { brigades &&  <Dialog open={showModal} onClose={() => setShowModal(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <Trans i18nKey={"selectEmergency"}>
                        Select brigade
                    </Trans>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Trans i18nKey={"selectSubtitle"}>
                            For updating emergency select a brigade
                        </Trans>
                    </DialogContentText>

                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Brigade</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            onChange={event => setSelectedBrigade(event.target.value)}
                        >
                            { brigades && brigades.map(br => <MenuItem value={br.id}>{br.title}</MenuItem>) }

                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)} color="primary">
                        <Trans i18nKey={"cancel"}>Cancel</Trans>
                    </Button>
                    <Button onClick={() => applyBrigadeChanges()} color="primary">
                        <Trans i18nKey={"save"}>Save</Trans>
                    </Button>
                </DialogActions>
            </Dialog> }

            <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        <Trans i18nKey={"type"}>Type: </Trans>  Emergency
                    </Typography>
                    <Typography variant="h5" component="h2">
                        <Trans i18nKey={"name"}>Name: </Trans>  {emergency.victim.name}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        <Trans i18nKey={"diagnostics"}>Diagnostics: </Trans>  {emergency.diagnostics}
                    </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={() => findBrigade(emergency.id) }>
                    <Trans i18nKey={"addBrigade"}>Add brigade</Trans>
                </Button>
            </CardActions>

            { appliedStatus && <Alert severity={appliedStatus === 200 ? "success" : "error"}>{appliedStatus === 200 ? "Done" : "Error"}</Alert> }
        </Card>
    );
};

const EmergencyPage = () => {
    const classes = useStyles();
    const [emergencies, setEmergencies] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async() => {
            try{

                const { data } = await axios.get(`${endpoint}/EmergencyCalls`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                })
                setEmergencies(data)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    useEffect(() => {
        const parseDataWithInterval = async () => {
            setLoading(true)
            return new Promise((resolve, reject) =>{
                console.log('fetching with interval')
                axios.get(`${endpoint}/EmergencyCalls`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    })
                    .then(res => {
                        console.log(res.data);
                        resolve(res.data);
                    })
                    .catch(err => reject(err))
                }
            )
        }

        const interval = setInterval(() => {

            parseDataWithInterval()
                .then(emergencies => setEmergencies(emergencies))
                .catch(err => console.log(err))

            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }, 30000);

        return () => clearInterval(interval);

    }, [])


    return (
        <Grid
            container
            spacing={1}
            direction="row"
            justify="flex-start"
            alignItems="flex-start" >
            <Grid item xs={12}>
                <h1><Trans i18nKey={"hTitle"}>Emergencies page</Trans></h1>
            </Grid>
            <Grid container
                  spacing={2}
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  xs={8}>

                {
                    emergencies && emergencies.map((emergency, index) => {
                        return <Grid key={index} item xs={4} md={4} lg={4}>
                            <OutlinedCard emergency={emergency} emergencies={emergencies} setEmergencies={setEmergencies} />
                        </Grid>
                    })
                }
                {
                    (!emergencies || !emergencies.length) && <Grid item xs={12} md={12} lg={12}><h2><Trans i18nKey={"noEmergencies"}>No emergencies</Trans></h2></Grid>
                }
            </Grid>

            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress color="inherit" />
            </Backdrop>

        </Grid>
    )
};

export default EmergencyPage;
