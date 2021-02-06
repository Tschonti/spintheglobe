import React from 'react'
import {connect} from 'react-redux'
import { Text, View, Button, } from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'

import {findResultNumber, extractAltitude, getNearbyCities, getPopulation} from "../api"
import styles from '../styles';

class RandomLocationScreen extends React.Component {

    state = {
        location: {
            latitude: 0,
            longitude: 8.396657,
        },
        delta: 180,
        place_id: '',
        address: '',
        spun: false,
        spinning: false,
        stopSpinning: false,
        error: '',
        alt: 0,   
    }

    mapLong = 8.396657

    movemap = () => {
        let newLong = this.mapLong + 50
        if (newLong > 180) {
            newLong -= 360
        }
        this.mapLong = newLong
        this.map.animateToRegion({
            latitude: 0,
            longitude: newLong,
            latitudeDelta: 180,
            longitudeDelta: 180,
        }, 50)
    }

    startSpin = () => {
        this.interval = setInterval(this.movemap, 50)
    }

    componentDidUpdate() {
        if (!this.state.spinning && this.state.stopSpinning) {
            clearInterval(this.interval)
            this.map.animateToRegion({
                latitude: this.state.location.latitude,
                longitude: this.state.location.longitude,
                latitudeDelta: 90,
                longitudeDelta: 90,
            }, 500)
            this.setState({stopSpinning: false})
        }
    }

    searchLocation = async () => {
        let succsessful = false
        let latitude = 0
        let longitude = 0
        let results = []
        this.setState({spinning: true, stopSpinning: true}, this.startSpin)
        while (!succsessful) {   
            latitude = Math.round((Math.random()*180 - 90)*1000000) / 1000000
            longitude =  Math.round((Math.random()*360 - 180)*1000000) / 1000000
    
            if (latitude < -56 || latitude > 75) {
                continue
            }
            try {
                results = await findResultNumber(latitude, longitude)
            } catch (error) {
                this.setState(prevState => ({
                    ...prevState,
                    spinning: false,
                    error: error.message,
                }))
                return
            }
            if (results) {
                try {
                    let alt = await extractAltitude(latitude, longitude)
                    if (alt && alt > 0) {
                        if ((this.props.mountains && this.props.beaches && this.props.cities) || (!this.props.mountains && !this.props.beaches && !this.props.cities)) {
                            succsessful = true;
                            this.setState(prevState => ({
                                ...prevState,
                                ...results[0],
                                delta: 90,
                                spun: true,
                                spinning: false,
                                nearbyCity: '',
                                population: 0,
                                alt: alt}))
                        } else {
                            let mountainOk = false
                            let beachOk = false
                            let cityOk = false

                            let nearbyCity = ''
                            let pop = 0
                            
                            if (this.props.mountainLimit <= alt) {
                                mountainOk = true
                            } 
                            if (this.props.beachLimit >= alt) {
                                beachOk = true
                            } 
                            if (this.props.cities) {
                                const nearbyCities = await getNearbyCities(latitude, longitude)
                                if (nearbyCities[0].length > 0) {
                                    const nearbyCityPop = await Promise.all(nearbyCities.map(getPopulation))
                                    for (let i = 0; i < nearbyCityPop.length; i++) {
                                        if (nearbyCityPop[i] >= this.props.cityLimit) {
                                            cityOk = true
                                            nearbyCity = nearbyCities[i][1]
                                            pop = nearbyCityPop[i]
                                            break
                                        }
                                    }
                                }
                            }
                            if (this.props.mountains && !mountainOk || this.props.beaches && !beachOk || this.props.cities && !cityOk) {
                                continue
                            } else {
                                succsessful = true;
                                this.setState(prevState => ({
                                    ...prevState,
                                    ...results[0],
                                    delta: 90,
                                    spun: true,
                                    spinning: false,
                                    nearbyCity: nearbyCity,
                                    population: pop,
                                    alt: alt}))
                            }
                        }
                        
                    }  
                } catch (error) {
                    this.setState(prevState => ({
                        ...prevState,
                        spinning: false,
                        error: error.message,
                    }))
                    return 
                }            
            }            
        }
    }

    render() {
        let mymarker = null
        if (this.state.spun && !this.state.spinning) {
            mymarker = (<Marker
                coordinate={{latitude: this.state.location.latitude, longitude: this.state.location.longitude}}
                title={this.state.address}
            />)
        } 
        let error = null
        if (this.state.error !== '') {
            error = <Text style={styles.error}>{this.state.error}</Text>
        }
        return (
            <View style={{flex: 1}}>
                <View style={styles.sideBySide}>
                    <View style={styles.marginFive}>
                        <Button disabled={this.state.spinning} color="forestgreen" style={styles.button} onPress={this.searchLocation} title="SPIN THE GLOBE!" />
                    </View>
                    <View style={styles.marginFive}>
                        <Button disabled={this.state.spinning} color='grey' style={styles.button} onPress={() => this.props.navigation.navigate('Preferences')} title="Preferences" />
                    </View>                          
                </View>
                    {error}
                <MapView provider={PROVIDER_GOOGLE}
                    initialRegion={{
                    latitude: 0,
                    longitude: 8.396657,
                    latitudeDelta: 180,
                    longitudeDelta: 180,
                }} style={styles.flex} ref={ref => {this.map = ref}}>
                    {mymarker}
                </MapView>
                <View style={styles.bottomButton}>
                    <Button color='forestgreen' style={styles.button} disabled={!this.state.spun || this.state.spinning} onPress={() => this.props.navigation.navigate('Location details', {
                            initState: {error: '',
                                loaded: false,
                                address: '',
                                location: this.state.location,
                                photos: [],
                                url: '',
                                key: this.state.place_id,
                                place_id: this.state.place_id,
                                saved: false,
                                alt: this.state.alt,
                                nearbyCity: this.state.nearbyCity,
                                population: this.state.population }
                            })} title='Location details'/>
                </View>
            </View>
        )
    }
}

const mapStatetoProps = state => ({
    mountains: state.preferences.mountains,
    beaches: state.preferences.beaches,
    cities: state.preferences.cities,
    mountainLimit: state.preferences.mountainLimit,
    beachLimit: state.preferences.beachLimit,
    cityLimit: state.preferences.cityLimit
})
export default connect(mapStatetoProps)(RandomLocationScreen)
