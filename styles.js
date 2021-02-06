import { StyleSheet } from 'react-native'
import Constants from 'expo-constants'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: Constants.statusBarHeight,
    },
    sideBySide: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5
    },
    savedLocations: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      flex: 1,
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: 'lightgrey'
    },
    button: {
      margin: 5,
    },
    trashCan: {
      
    },
    error: {
      color: 'red',
    },
    switches: {
      marginBottom: 25
    },
    bigFont: {
      fontSize: 16
    },
    savedContainer: {
      flex: 1,
      paddingTop: Constants.statusBarHeight,
      paddingHorizontal: 10,
      paddingBottom: 10
    },
    detailsContainer: {
      flex: 1,
      padding: 10,
    },
    bottomButton: {
      alignItems: 'center',
      margin: 5
    },
    flex: {
      flex: 1
    },
    smallDetails: {
      flex: 1,
    },
    bigDetails: {
      flex: 3,
    },
    smallMap: {
      flex: 4
    },
    marginFive: {
      margin: 5
    }
  });

export default styles