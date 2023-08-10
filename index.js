const fs = require("fs");
const csv = require("csv-parser")
const lodash = require("lodash")
const Table = require("cli-table")

const trainArray = []
let trainGroupByTrainNo = null
let trainNoKeys = null
let table = new Table({
    head: ["Train No", "Train Name", "SEQ", "Station Code", "Station Name", "Arrival time", "Departure Time", "Distance", "Source Station", "Source Station Name", "Destination Station", "Destination Station Name"]
})
let args = process.argv;

fs.createReadStream('Train.csv')
    .pipe(csv())
    .on('data', (row) => {
        trainArray.push(row);
    })
    .on('end', () => {
        trainGroupByTrainNo = lodash.groupBy(trainArray, 'Train No')
        trainNoKeys = Object.keys(trainGroupByTrainNo);
        switch (args[2]) {
            case '1':
                longestRoute()
                break;
            case '2':
                shortestRoute()
                break;
            case '3':
                getFewerStations()
                break;
            case '4':
                getMostStations()
                break;
            case '5':
                getTrainNumberAndNames()
                break;
            case '6':
                findTravelOptions(args[3], args[4])
                break;
            default:
                console.table("Invalid Choice.")
                break;
        }
    });


function longestRoute() {
    let maxRouteTrainDetails = null
    let maxRouteTrainDistance = -1
    for (const key of trainNoKeys) {
        for (const train of trainGroupByTrainNo[key])
            if (+train['Distance'] > maxRouteTrainDistance) {
                maxRouteTrainDistance = +train['Distance']
                maxRouteTrainDetails = train
            }
    }
    console.table(maxRouteTrainDetails)
}

function shortestRoute() {
    let minRouteDistance = Infinity
    let minRouteDistanceTrainDetails = null

    for (const key of trainNoKeys) {
        for (const train of trainGroupByTrainNo[key]) {
            if (+train['Distance'] < minRouteDistance && +train['Distance'] !== 0) {
                minRouteDistance = +train['Distance'];
                minRouteDistanceTrainDetails = train
            }
        }
    }
    let allTrainsWithMinimumRoute = []
    for (const key of trainNoKeys) {
        for (const train of trainGroupByTrainNo[key]) {
            if (+train['Distance'] === minRouteDistance) {
                allTrainsWithMinimumRoute.push(train)
            }
        }
    }
    console.table(allTrainsWithMinimumRoute)
}

function getFewerStations() {
    let trainWithFewerStationLength = Infinity
    let trainWithFewerStation = null
    for (const key of trainNoKeys) {
        if (+trainGroupByTrainNo[key].length < trainWithFewerStationLength) {
            trainWithFewerStationLength = +trainGroupByTrainNo[key].length;
            trainWithFewerStation = trainGroupByTrainNo[key][0]
        }
    }

    let allTrainsWithFewerStation = []
    for (const key of trainNoKeys) {
        if (+trainGroupByTrainNo[key].length === trainWithFewerStationLength) {
            allTrainsWithFewerStation.push(trainGroupByTrainNo[key][0])
        }
    }
    console.table(allTrainsWithFewerStation)
}

function getMostStations() {
    let trainWithMostStationLength = -1
    let trainWithMostStation = null

    for (const key of trainNoKeys) {
        if (+trainGroupByTrainNo[key].length > trainWithMostStationLength) {
            trainWithMostStationLength = +trainGroupByTrainNo[key].length;
            trainWithMostStation = trainGroupByTrainNo[key][0]
        }
    }

    let allTrainsWithMostStation = []
    for (const key of trainNoKeys) {
        if (+trainGroupByTrainNo[key].length === trainWithMostStationLength) {
            allTrainsWithMostStation.push(trainGroupByTrainNo[key][0])
        }
    }
    console.table(allTrainsWithMostStation)
}

function getTrainNumberAndNames() {
    let trainNumberAndName = []
    for (const key of trainNoKeys) {
        let train = {}
        train['Train No'] = trainGroupByTrainNo[key][0]['Train No']
        train['Train Name'] = trainGroupByTrainNo[key][0]['Train Name']
        trainNumberAndName.push(train)
    }
    console.table(trainNumberAndName)
}

function findTravelOptions(sourceCode, destinationCode) {
    let possibleTrains = []
    for (const key of trainNoKeys) {
        let sourceFlag = false
        let destinationFlag = false
        for (const train of trainGroupByTrainNo[key]) {
            if (train['Source Station'] === sourceCode) sourceFlag = !sourceFlag;
            if (train['Destination Station'] === destinationCode) destinationFlag = !destinationFlag;
            if (sourceFlag && destinationFlag) {
                possibleTrains.push(train)
                break;
            }
        }
    }
    console.table(possibleTrains)
}

