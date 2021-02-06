import React from 'react'
import {FlatList, TouchableOpacity, Text, View} from 'react-native'
import styles from './styles'
import { Ionicons } from '@expo/vector-icons'

const Row = props => (
    <View style={styles.savedLocations}>
        <TouchableOpacity onPress={() => props.onSelectLoc(props)}>
            <Text>{props.address}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trashCan} onPress={() => props.onDeleteLoc(props.place_id)} >
            <Ionicons name="trash" color="grey" size={28} />
        </TouchableOpacity>
    </View>
    
)

const FlatListLocations = props => (
    <FlatList renderItem={({item}) => <Row {...item} onSelectLoc={props.onSelectLoc} onDeleteLoc={props.onDeleteLoc}/>} data={props.locations} />
)
export default FlatListLocations