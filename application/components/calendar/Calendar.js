import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    TouchableOpacity
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import { uniq, flatten, find, contains } from 'underscore';

import Loading from '../shared/Loading';

import {
    getSectionData,
    getRowData,
    sectionHeaderHasChanged,
    rowHasChanged
} from '../../utilities';

import Colors from '../../styles/colors';
import { globals } from '../../styles';
import { calendarStyles as styles } from '../../styles';

const EmptyList = ({ ready }) => {
    if (!ready) {return <Loading />}

    return (
        <View style={[globals.textContainer, styles.emptyText]}>
            <Text style={styles.h2}>
                No events scheduled. Explore groups in the groups tab or create your own to start an event.
            </Text>
        </View>
    );
};


class EventList extends Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.visitEvent = this.visitEvent.bind(this);
        this.state = {
            dataSource: this._loadData(props.events)
        };
    }

    _loadData(events) {
        let dataBlob = {};
        let dates = uniq(events.map(evt => new Date(evt.start).toLocaleDateString()));

        let sections = dates.map((date, id) => ({
            date: new Date(date),
            events: events.filter(event => new Date(event.start).toLocaleDateString() === date),
            id: id
        }));

        let sectionIDs = sections.map((section, id) => id);
        let rowIDs = sectionIDs.map(sectionID => sections[sectionID].events.map((e, id) => id));

        sections.forEach(section => {
            dataBlob[section.id] = section.date;
            section.events.forEach((event, rowID) => {
                dataBlob[`${section.id}:${rowID}`] = event;
            });
        });

        return new ListView.DataSource({
            getSectionData: getSectionData,
            getRowData: getRowData,
            rowHasChanged: rowHasChanged,
            sectionHeaderHasChanged: sectionHeaderHasChanged
        })
        .cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
    }

    visitEvent(event) {
        this.props.navigator.push({
            name: 'Event',
            event
        });
    }

    renderRow(event, sectionID, rowID) {
        let isGoing = contains(event.going, this.props.currentUser.id);

        return (
            <TouchableOpacity
                style={styles.row}
                onPress={() => this.visitEvent(event)}
            >
                <View style={globals.flex}>
                    <View style={styles.textContainer}>
                        <Text style={styles.h4}>
                            {event.name}
                        </Text>
                        <Text style={styles.h5}>
                            {event.going.length} going
                        </Text>

                        { isGoing && <Text style={[globals.primaryText, styles.h5]}><Icon name="ios-checkmark" color={Colors.brandSuccess} /> Yes</Text> }
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.dateText, globals.mh1]}>
                        {moment(event.start).format('h:mm a')}
                    </Text>
                    <Icon
                        style={styles.arrow}
                        name="ios-arrow-forward"
                        size={25}
                        color={Colors.bodyTextLight}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                    {moment(sectionData).format('dddd MMM Do')}
                </Text>
            </View>
        );
    }

    render() {
        return (
            <ListView
                enableEmptySectionHeaders={true}
                style={globals.flex}
                contentInset={{bottom: 49}}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSectionHeader={this.renderSectionHeader}
            />
        );
    }
};


class Calendar extends Component {
    render() {
        let { events, ready } = this.props;

        return (
            <View style={globals.flexContainer}>
                <NavigationBar
                    tintColor={Colors.brandPrimary}
                    title={{title: 'Calendar', tintColor: 'white'}}
                />
                { events && events.length ? <EventList {...this.props} /> : <EmptyList ready={ready} /> }
            </View>     
        );
    }
};

export default Calendar;

