import React, { Component } from 'react';
import { TabBarIOS } from 'react-native';
import { TabBarItemIOS } from 'react-native-vector-icons/Ionicons';

import { Headers } from '../fixtures';
import { API } from '../config';

import ActivityView from './activity/ActivityView';
import MessagesView from './messages/MessagesView';
import ProfileView from './profile/ProfileView';
import CalendarView from './calendar/CalendarView';
import GroupsView from './groups/GroupsView';


class Dashboard extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.state = {
            selectedTab: 'Activity'
        };
    }

    logout() {
        fetch(`${API}/users/logout`, { method: 'POST', headers: Headers })
        .then(response => response)
        .then(data => this.props.logout())
        .catch(err => {})
        .done();
    }

    render() {
        let { user } = this.props;

        return (
            <TabBarIOS>
                <TabBarItemIOS
                    title='Activity'
                    selected={this.state.selectedTab === 'Activity'}
                    iconName='ios-pulse'
                    onPress={() => this.setState({ selectedTab: 'Activity' })}
                >
                    <ActivityView currentUser={user} />
                </TabBarItemIOS>
                <TabBarItemIOS
                    title='Groups'
                    selected={this.state.selectedTab === 'Groups'}
                    iconName='ios-people'
                    onPress={() => this.setState({ selectedTab: 'Groups' })}
                >
                    <GroupsView currentUser={user} />
                </TabBarItemIOS>
                <TabBarItemIOS
                    title='Calendar'
                    selected={this.state.selectedTab === 'Calendar'}
                    iconName='ios-calendar'
                    onPress={() => this.setState({ selectedTab: 'Calendar' })}
                >
                    <CalendarView currentUser={user} />
                </TabBarItemIOS>
                <TabBarItemIOS
                    title='Messages'
                    selected={this.state.selectedTab === 'Messages'}
                    iconName='ios-chatboxes'
                    onPress={() => this.setState({ selectedTab: 'Messages' })}
                >
                    <MessagesView currentUser={user} />
                </TabBarItemIOS>
                <TabBarItemIOS
                    title='Profile'
                    selected={this.state.selectedTab === 'Profile'}
                    iconName='ios-person'
                    onPress={() => this.setState({ selectedTab: 'Profile' })}
                >
                    <ProfileView currentUser={user} logout={this.logout} updateUser={this.props.updateUser} />
                </TabBarItemIOS>
            </TabBarIOS>
        );
    }
}

export default Dashboard;
