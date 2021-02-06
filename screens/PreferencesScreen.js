import React from 'react'
import { Text, View, Button, Switch } from 'react-native';
import Slider from '@react-native-community/slider'
import {connect} from 'react-redux'

import {boolChange, sliderChange, resetPrefs} from '../redux/actions'
import styles from '../styles'

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const MySlider = props => (<Slider
                    style={{width: 200, height: 40}}
                    step={props.step || 1}
                    minimumValue={props.min}
                    maximumValue={props.max}
                    value={props.value}
                    onValueChange={props.valueChange}
                    disabled={!props.allowed}
                    minimumTrackTintColor="darkseagreen"
                    thumbTintColor="forestgreen"
                />)

class PreferencesScreen extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.switches}>
                    <View style={styles.sideBySide}>
                        <Text style={styles.bigFont}>Allow Mountains</Text>
                        <Switch 
                            onValueChange={() => this.props.boolChange('mountains')}
                            value={this.props.mountains}
                            thumbColor="forestgreen"
                            trackColor={{
                                false: 'lightgrey ',
                                true: "darkseagreen"
                            }}    
                        /> 
                    </View>
                    <View style={styles.sideBySide}>
                        <Text style={styles.bigFont}>Allow Beaches</Text>
                        <Switch 
                            onValueChange={() => this.props.boolChange('beaches')}
                            value={this.props.beaches}
                            thumbColor="forestgreen"
                            trackColor={{
                                false: 'lightgrey ',
                                true: "darkseagreen"
                            }} 
                        /> 
                    </View>
                    <View style={styles.sideBySide}>
                        <Text style={styles.bigFont}>Allow Cities</Text>
                        <Switch 
                            onValueChange={() => this.props.boolChange('cities')}
                            value={this.props.cities}
                            thumbColor="forestgreen"
                            trackColor={{
                                false: 'lightgrey ',
                                true: "darkseagreen"
                            }} 
                        />  
                    </View>
                </View>

                <Text style={styles.bigFont}>Minimum altitude for mountains:</Text>
                <View style={styles.sideBySide}>
                    <MySlider min={500} max={5000}
                        allowed={this.props.mountains} 
                        value={this.props.mountainLimit} 
                        valueChange={data => this.props.sliderChange({type: 'mountainLimit', data: data})} 
                    /> 
                    <Text style={styles.bigFont}>{this.props.mountainLimit} m</Text>
                </View>
                
                <Text style={styles.bigFont}>Maximum altitude for beaches:</Text>
                <View style={styles.sideBySide}>
                    <MySlider min={0} max={500} 
                        allowed={this.props.beaches}
                        value={this.props.beachLimit} 
                        valueChange={data => this.props.sliderChange({type: 'beachLimit', data: data})} 
                    />
                    <Text style={styles.bigFont}>{this.props.beachLimit} m</Text>
                </View>
                                
                <Text style={styles.bigFont}>Minimum population for cities:</Text>
                <View style={styles.sideBySide}>
                    <MySlider min={15000} max={1000000}
                        allowed={this.props.cities} 
                        value={this.props.cityLimit} 
                        valueChange={data => this.props.sliderChange({type: 'cityLimit', data: data})}
                        step={100} 
                    />
                    <Text style={styles.bigFont}>{numberWithCommas(this.props.cityLimit)} people</Text>
                </View>
                
                <View style={styles.sideBySide}>
                    <View style={styles.marginFive}>
                        <Button color="forestgreen" style={styles.button} title="Back to spinning" onPress={() => this.props.navigation.navigate("Spin the globe!")} />
                    </View>
                    <View style={styles.marginFive}>
                        <Button color="gray" style={styles.button} title='Reset to default' onPress={() => this.props.resetPrefs()} />  
                    </View>
                </View>
                              
            </View>
        )
    }
}

const mapStateToProps = state => ({
    mountains: state.preferences.mountains,
    beaches: state.preferences.beaches,
    cities: state.preferences.cities,
    mountainLimit: state.preferences.mountainLimit,
    beachLimit: state.preferences.beachLimit,
    cityLimit: state.preferences.cityLimit
 })

export default connect(mapStateToProps, {boolChange, sliderChange, resetPrefs})(PreferencesScreen)