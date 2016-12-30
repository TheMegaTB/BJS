import {Account} from "../../logic/account";
import {Crypto} from "../../crypto/crypto";
import {ContestCollection} from "./collection";


export function initAccounts() {
    Meteor.COLLECTIONS.Accounts = new ContestCollection('Accounts');

    Meteor.COLLECTIONS.Accounts.createMockData = function () {
        // for (let i = 0; i < 100; i++) {
        //     this.handle.insert(new Account(['Q#z' + i], [], Crypto.generateAC('1234' + i, 'pepper')));
        // }
        this.handle.insert(new Account(['Q#z'], [], Crypto.generateAC('1234', 'chilli')));
        this.handle.insert(new Account([], ['st_long_jump'], Crypto.generateAC('4321', 'pepper')));
        this.handle.insert(new Account(['Q#z'], ['st_ball_200', 'st_ball_200', 'st_endurance_1000', 'st_endurance_3000', 'st_sprint_100'], Crypto.generateAC('passwort', 'pepper')));
    };
}