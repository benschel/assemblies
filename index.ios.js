import React, { Component } from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    AsyncStorage
} from 'react-native';

import { extend } from 'underscore';

import Landing from './application/components/Landing';
import Dashboard from './application/components/Dashboard';
import Register from './application/components/accounts/Register';
import Login from './application/components/accounts/Login';
import RegisterConfirmation from './application/components/accounts/RegisterConfirmation';
import Loading from './application/components/shared/Loading';

import { Headers } from './application/fixtures';
import { API, DEV } from './application/config';

import { globals } from './application/styles';


class assemblies extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.state = {
            user: null,
            ready: false,
            initialRoute: 'Landing'
        };
    }

    componentDidMount() {
        this._loadLoginCredentials();
    }

    async _loadLoginCredentials() {
        try {
            let sid = await AsyncStorage.getItem('sid');
            if (DEV) { console.log('SID', sid); }

            if (sid) {
                this.fetchUser(sid);
            } else {
                this.ready();
            }
        } catch(err) {
            this.ready(err);
        }
    }

    ready(err) {
        this.setState({ ready: true });
    }

    fetchUser(sid) {
        fetch(`${API}/users/me`, {
            headers: extend(Headers, {'Set-Cookie': `sid=${sid}`})
        })
        .then(response => response.json())
        .then(user => this.setState({
            ready: true,
            initialRoute: 'Dashboard',
            user
        }))
        .catch(err => this.ready(err))
        .done();
    }

    logout() {
        this.nav.push({ name: 'Landing' });
    }

    updateUser(user) {
        this.setState({ user });
    }

    render() {
        if (!this.state.ready) {return <Loading />}

        return (
            <Navigator
                style={globals.flex}
                ref={(el) => this.nav = el}
                initialRoute={{ name: this.state.initialRoute }}
                renderScene={(route, navigator) => {
                    switch(route.name) {
                        case 'Landing':
                            return (
                                <Landing navigator={navigator} />
                            );
                        case 'Dashboard':
                            return (
                                <Dashboard 
                                    navigator={navigator}
                                    updateUser={this.updateUser}
                                    logout={this.logout}
                                    user={this.state.user}
                                />
                            );
                        case 'Register':
                            return (
                                <Register navigator={navigator} />
                            );
                        case 'RegisterConfirmation':
                            return (
                                <RegisterConfirmation
                                    {...route}
                                    updateUser={this.updateUser}
                                    navigator={navigator}
                                />
                            );
                        case 'Login':
                            return (
                                <Login 
                                    navigator={navigator}
                                    updateUser={this.updateUser} 
                                />
                            );
                        case 'RegisterConfirmation':
                            return (
                                <RegisterConfirmation
                                    {...route}
                                    updateUser={this.updateUser}
                                    navigator={navigator}
                                />
                            );
                    }
                }}
            />
        );
    }
}

AppRegistry.registerComponent('assemblies', () => assemblies);
