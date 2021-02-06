import {mapsKey} from './apikeys'

const processResult = result => ({
    address: result.formatted_address,
    location: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
    },
    place_id: result.place_id
})

const preocessDetailsResult = result => ({
    address: result.formatted_address,
    location: {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
    },
    photos: result.photos,
    url: result.url,
    place_id: result.place_id,
})

export const findResultNumber  = async (lat, long) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${mapsKey}&latlng=${lat},${long}`)
        const result = await response.json()
        if (result.status !== "OK" && result.status !== "ZERO_RESULTS") {
            throw new Error(result.status)
        }
        return result.results.map(processResult)
    } catch (error) {
        throw new Error(error)
    }
    
}

export const extractAltitude = async (lat, long) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/elevation/json?key=${mapsKey}&locations=${lat},${long}`)
        const result = await response.json()
        if (result.status !== "OK") {
            throw new Error(result.status)
        }
        return Math.round(+result.results[0].elevation)
    } catch (error) {
        throw new Error(error)
    }

}

export const locationDetails = async place_id => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?key=${mapsKey}&place_id=${place_id}`)
        const result = await response.json()
        if (result.status !== "OK") {
            throw new Error(result.status)
        }
        return preocessDetailsResult(result.result)
    } catch (error) {
        throw new Error(error)
    }   
}

/*
export const getPhotos = async photo => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?key=${mapsKey}&photoreference=${photo.photo_reference}&maxwidth=400`)
       //const result = await response.json()
       //if (result.status !== "OK") {
        return response
    } catch (error) {
        throw new Error(error)
    }
}*/

export const getNearbyCities = async (lat, long) => {
    try {
        const response = await fetch(`http://getnearbycities.geobytes.com/GetNearbyCities?radius=100&latitude=${lat}&longitude=${long}`)
        const result = await response.json()
        return result
    } catch (error) {
        throw new Error(error)
    }

}

export const getPopulation = async city => {
    try {
        const response = await fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=worldcitiespop&q=${city[1]}`)
        const result = await response.json()
        let maxPop = 0
        for (let i = 0; i < result.records.length; i++) {
            let pop
            try {
                pop = +result.records[i].fields.population
            } catch (e) {
                pop = 0
            }
            if (pop > maxPop) {
                maxPop = pop
            }
        }
        return maxPop
    } catch (error) {
        throw new Error(error)
    }
}