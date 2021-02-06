import React from 'react'
import {connect} from 'react-redux'
import { Text, View, Button } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import {locationDetails} from '../api'
import {newLocation, deleteLoc} from '../redux/actions'
import styles from '../styles';
import {mapsKey} from '../apikeys'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'

import {numberWithCommas} from './PreferencesScreen'

class LocationDetailsScreen extends React.Component {
    state = {...this.props.route.params.initState,
        triedLocation: false,
        gotLocation: false,
        dirErr: false,
    }

    directionError = () => {
        this.setState({dirErr: true})
    }

    getUserLocation = async () => {
        this.setState({triedLocation: true})
        let {status} = await Permissions.askAsync(Permissions.LOCATION)
        if (status === 'granted') {
            let location
            try {
                location = await Location.getCurrentPositionAsync({})
                this.setState({gotLocation: true, userLat: location.coords.latitude, userLong: location.coords.longitude})
            } catch (e) {
                console.log(e.message)
            } 
        }
        
    }

    getLocationDetails = async () => {
        try {
            const result = await locationDetails(this.props.route.params.initState.place_id)
            this.setState(prevState => ({
                ...prevState,
                ...result,
                loaded: true
            }))
            if (typeof(result.photos) !== 'undefined') {
                /*console.log('hello')
                const pics =  await Promise.all(result.photos.map(getPhotos))
                console.log(pics)
                this.setState(prevState => ({
                ...prevState,
                photos: pics,
                loaded: true,
            }))*/
            } else {
                this.setState(prevState => ({
                    ...prevState,
                    photos: false
                }))
            }
        }
            
        catch (error) {
            this.setState(prevState => ({
                ...prevState,
                error: error.message})
            )}    
        
    }
    componentDidMount() {
        if (!this.state.loaded) {
            this.getLocationDetails()
        }
        
    }
    changeSavedStatus = (callback, arg) => {
        this.setState(prevState => ({
            ...prevState,
            saved: !prevState.saved
        }), () => callback(arg))
    }
    render() {
        let pics = null
        let mymarker = null
        if (this.state.loaded) {
            //pics = <Image source={{"uri": this.state.photos[0]}} style={{width: 400, height: 400}} />
            mymarker = (<Marker
                coordinate={{latitude: this.state.location.latitude, longitude: this.state.location.longitude}}
                title={this.state.address}
            />)
        }
        let myButton = null
        if (this.state.saved) {
            myButton = <Button color="forestgreen" style={styles.button} title="Delete from saved locations" onPress={() => this.changeSavedStatus(this.props.deleteLoc, this.state.place_id)}/>
        } else {
            myButton = <Button color="forestgreen" style={styles.button} title="Save location" onPress={() => this.changeSavedStatus(this.props.newLocation, this.state)}/>
        }

        let city = null
        if (this.state.nearbyCity) {
            city = <Text style={styles.bigFont}>Nearby city: {this.state.nearbyCity}, population: {numberWithCommas(this.state.population)}</Text>
        }

        let loc = null
        let directions = null
        if (!this.state.triedLocation) {
            loc = <View style={styles.marginFive}><Button style={styles.button} color='forestgreen' title="Find route to location" onPress={() => this.getUserLocation()} /></View>
        } else if (!this.state.gotLocation) {
            loc = <Text style={styles.error}>Could not get your location</Text>
        } else if (this.state.dirErr) {
            loc = <Text style={styles.error}>No land route available between you and the location</Text>
        } else {
            loc = <Text style={styles.bigFont}>Route shown on map</Text>
            directions = <MapViewDirections 
                            origin={{latitude: this.state.userLat, longitude: this.state.userLong}} 
                            destination={{latitude: this.state.location.latitude, longitude: this.state.location.longitude}}
                            apikey={mapsKey}
                            strokeColor='red'
                            strokeWidth={5}
                            onError={() => this.directionError()}
                        />    
        }
        return (
            <View style={styles.detailsContainer}>
                <View style={styles.smallDetails}>
                    <Text style={styles.error}>{this.state.error}</Text>
                    <Text style={styles.bigFont}>Address: {this.state.address}</Text>
                    <Text style={styles.bigFont}>Elevation: {this.state.alt} m</Text>
                    {city}
                </View>
                
                <View style={styles.smallMap}>
                    <MapView provider={PROVIDER_GOOGLE}
                        initialRegion={{
                        latitude: 0,
                        longitude: 8.396657,
                        latitudeDelta: 180,
                        longitudeDelta: 180,
                    }} region ={{
                        latitude: this.state.location.latitude,
                        longitude: this.state.location.longitude,
                        latitudeDelta: 5,
                        longitudeDelta: 5
                    }}style={styles.flex}>
                        {mymarker}
                        {directions}
                    </MapView>
                </View>

                <View style={styles.bigDetails}>
                    {pics}
                    {loc}
                    <View style={styles.sideBySide}>
                        <View style={styles.marginFive}>
                            {myButton}
                        </View>
                        <View style={styles.marginFive}>
                            <Button title="Back to spinning" color='grey' onPress={() => this.props.navigation.navigate("Spin the globe!")} />
                        </View>                       
                    </View>
                    
                </View>
            </View>
        )
    }
}

export default connect(null, {newLocation, deleteLoc})(LocationDetailsScreen)