require("dotenv").config();
const got = require('got');

async function getJSON(url) {
    try {
        let response = await got(url, { json: true });
        return response.body;
    } catch (error) {
        console.log(error.response.body);
    }
}

module.exports = {
    getEDDBSysData: async (name) => {
        let response = await getJSON(`https://eddbapi.kodeblox.com/api/v4/systems?name=${name}`)
        return response.docs[0]
    },
    getEDDBStationData: async (systemIDList) => {
        let allStations = await getJSON("https://eddb.io/archive/v6/stations.json")
        let stations = []
        for (let station of allStations) {
            if (systemIDList.includes(station.system_id)) {
                stations.push(station)
            }
        }
        let systems = []
        for (let systemID of systemIDList) {
            let stationList = []
            for (let station of stations) {
                if (station.system_id === systemID) {
                    stationList.push(station)
                }
            }
            let system = {
                'eddb_id': systemID,
                'stations': stationList 
            }
            systems.push(system)
        }
        return systems;
    }
}