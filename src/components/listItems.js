import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {Trans} from "react-i18next";

const MainListItems = () => {

    return (
        <div>
            <ListSubheader inset>General</ListSubheader>
            <ListItem button onClick={() => window.location.href = '/'}>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary={
                    <Trans i18nKey="title">
                        Dashboard
                    </Trans>}
                />
            </ListItem>
            <ListItem button onClick={() => window.location.href = '/settings'}>
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary={
                    <Trans i18nKey="settings">
                        Settings
                    </Trans>
                }
                />
            </ListItem>
            <ListItem button onClick={() => {
                localStorage.clear();
                window.location.reload();
            }}>
                <ListItemIcon>
                    <ExitToAppIcon/>
                </ListItemIcon>
                <ListItemText primary={
                    <Trans i18nKey="logout">
                        Log out
                    </Trans>
                }/>
            </ListItem>

        </div>
    )
};

export default MainListItems