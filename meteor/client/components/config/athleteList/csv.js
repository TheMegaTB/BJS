import {currentCompID} from "../config";
import {addRawAthlete} from "./dataInterface";
import {Server} from "../../../../imports/api/database/ServerInterface";
import {Athlete} from "../../../../imports/api/logic/athlete";
import {genUUID} from "../../../../imports/api/crypto/pwdgen";


const CurrentParsedFile = ReactiveVar(undefined);
const CurrentSelectedIndexes = ReactiveVar({
    firstName: 0,
    lastName: 0,
    ageGroup: 0,
    gender: 0,
    group: 0,
});
export const CurrentFileName = ReactiveVar("");

function findIndexByRegex(headerFields, regex) {
    return lodash.findIndex(headerFields, function (field) {
        const regexRes = field.match(regex);
        return regexRes !== null ? regexRes.length > 0 : false;
    });
}

function getCt() {
    const compID = currentCompID.get();
    return Server.contest.getType(compID);
}

function correlateHeaders(headerFields) {
    const headerIndices = {};

    headerIndices.firstName = findIndexByRegex(headerFields, /(vor|tauf|ruf|first|fore|given|christian)/gi);
    headerIndices.lastName = findIndexByRegex(headerFields, /(nach|eigen|familien|vater|last|sur|family)/gi);
    headerIndices.ageGroup = findIndexByRegex(headerFields, /(alter|geburt|jahr|generation|stufe|geb|age|year|birth|life)/gi);
    headerIndices.gender = findIndexByRegex(headerFields, /(geschlecht|gattung|sex|gender)/gi);
    headerIndices.group = findIndexByRegex(headerFields, /(gruppe|klasse|verband|gesell|team|verein|gemein|bund|mannschaft|group|col)/gi);

    CurrentSelectedIndexes.set(headerIndices);
}

function processCSVAthlete(dataset, fieldNames, indexes, ct) {
    const gender = dataset[fieldNames[indexes.gender]];
    return new Athlete(Meteor.config.log, dataset[fieldNames[indexes.firstName]], dataset[fieldNames[indexes.lastName]], parseInt(dataset[fieldNames[indexes.ageGroup]]), gender.match(/m/gi) !== null, dataset[fieldNames[indexes.group]], '0', ct.maxAge, ct, genUUID());
}

export function parseCSVFile(file) {
    CurrentFileName.set(file.name);
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            CurrentParsedFile.set(results);
            correlateHeaders(results.meta.fields);
        },
    });
}

function importDisabled() {
    return CurrentParsedFile.get() == undefined;
}


function importNext(file, dataID, indexes, ct) {
    if (!file.data.hasOwnProperty(dataID)) {
        Meteor.f7.hidePreloader();
        return;
    }
    const data = file.data[dataID];
    const athlete = processCSVAthlete(data, file.meta.fields, indexes, ct);
    addRawAthlete(athlete, false, true);
    setTimeout(function () {
        importNext(file, dataID + 1, indexes, ct);
    }, 10);
    document.getElementsByClassName('modal-title')[0].innerHTML = (dataID + 1) + "/" + file.data.length;
}


Template.csvImport.events({
    'change input[type=file]#csv-upload': function (event) {
        parseCSVFile(event.target.files[0]); //only one file is allowed
    },
    'change .csv-field-select': function (event) {
        const indexes = CurrentSelectedIndexes.get();
        indexes[event.target.dataset.fieldname] = event.target.selectedIndex;
        CurrentSelectedIndexes.set(indexes);
    },
    'click #import-button': function () {
        if (importDisabled()) return;

        const file = CurrentParsedFile.get();

        if (!file) return;

        const indexes = CurrentSelectedIndexes.get();
        const ct = getCt();

        Meteor.f7.showPreloader("Daten importieren");
        importNext(file, 0, indexes, ct);
        // for (let dataID in file.data) {
        //     if (!file.data.hasOwnProperty(dataID)) continue;
        //     const data = file.data[dataID];
        //     const athlete = processCSVAthlete(data, file.meta.fields, indexes, ct);
        //     addRawAthlete(athlete);
        // }
        Meteor.f7.closeModal(".popup-csv-import");
    }
});

Template.csvImport.helpers({
    'csvFieldNames': function () {
        const currentParsedFile = CurrentParsedFile.get();
        return currentParsedFile ? currentParsedFile.meta.fields : [];
    },
    'selectedIndexes': function () {
        return CurrentSelectedIndexes.get();
    },
    'fieldNameByIndex': function (index) {
        const currentParsedFile = CurrentParsedFile.get();
        return currentParsedFile ? currentParsedFile.meta.fields[index] : "";
    },
    'selectedString': function (index, requiredIndex) {
        return (index == requiredIndex) ? "selected" : ""
    },
    'getExample': function () {
        const file = CurrentParsedFile.get();
        const indexes = CurrentSelectedIndexes.get();
        if (!file || file.data.length == 0) return {};
        return processCSVAthlete(file.data[0], file.meta.fields, indexes, getCt());
    },
    'genderString': function (isMale) {
        return isMale ? "Männlich" : "Weiblich";
    },
    'importButtonDisabled': function () {
        return importDisabled();
    },
    'fileName': function () {
        const name = CurrentFileName.get();
        return name == "" ? "Keine Datei ausgewählt." : name;
    }
});