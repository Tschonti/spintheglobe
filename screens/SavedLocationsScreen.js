import React from 'react'
import { View, Button } from 'react-native';
import {connect} from 'react-redux'

import {clearLocs, deleteLoc} from '../redux/actions'
import styles from '../styles'
import FlatListLocations from '../FlatListLocations'

class LocationDetailsScreen extends React.Component {

    onSelectLoc = location => {
        this.props.navigation.navigate('Location details', {initState: {
                                                        address: location.address,
                                                        location: location.location,
                                                        photos: location.photos,
                                                        url: location.url,
                                                        place_id: location.place_id,
                                                        key: location.place_id,
                                                        alt: location.alt,
                                                        nearbyCity: location.nearbyCity,
                                                        population: location.population,
                                                        loaded: true,
                                                        saved: true}})
    }

    onDeleteLoc = place_id => {
        this.props.deleteLoc(place_id)
    }

    render() {
        return (
            <View style={styles.savedContainer}>
                <FlatListLocations locations={this.props.savedLocations} onSelectLoc={this.onSelectLoc} onDeleteLoc={this.onDeleteLoc} />
                <Button color="forestgreen" style={styles.button} title="Clear all locations" onPress={() => this.props.clearLocs()} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    savedLocations: state.locations,
})

export default connect(mapStateToProps, {clearLocs, deleteLoc})(LocationDetailsScreen)