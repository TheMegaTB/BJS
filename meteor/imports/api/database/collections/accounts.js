import {Account} from "../../logic/account";
import {Crypto} from "../../crypto/crypto";
import {ContestCollection} from "./collection";


export function initAccounts() {
    Meteor.COLLECTIONS.Accounts = new ContestCollection('Accounts', function (name, handle) {
        handle.deny({
            insert() {
                return true;
            },
            update() {
                return true;
            },
            remove() {
                return true;
            },
        });

        Meteor.publish(name, function () {
            return handle.find({}, {
                fields: {
                    'ac.privHash': false
                }
            });
        });
    });

    Meteor.COLLECTIONS.Accounts.createMockData = function () {
        this.handle.insert(new Account('Urkunden', [], [''], Crypto.generateAC('150612', 'pepper'), true));
        this.handle.insert(new Account('Admin', [], ['st_sprint_50', 'st_sprint_75', 'st_sprint_100_el', 'st_long_jump', 'st_rounders', 'st_ball_200'], Crypto.generateAC('000000', 'pepper'), true));


        this.handle.insert(new Account('Sprint', [], ['st_sprint_50', 'st_sprint_75', 'st_sprint_100_el'], Crypto.generateAC('999004', 'pepper')));
        this.handle.insert(new Account('Ausdauerlauf', [], ['st_endurance_800', 'st_endurance_1000', 'st_endurance_2000', 'st_endurance_3000'], Crypto.generateAC('938795', 'pepper')));
        this.handle.insert(new Account('Weitsprung', [], ['st_long_jump'], Crypto.generateAC('174641', 'pepper')));
        this.handle.insert(new Account('Hochsprung', [], ['st_high_jump'], Crypto.generateAC('560520', 'pepper')));
        this.handle.insert(new Account('Wurf', [], ['st_rounders', 'st_ball_200', 'st_ball_with_throwing_strap_1'], Crypto.generateAC('785487', 'pepper')));
        this.handle.insert(new Account('Kugelstoßen', [], ['st_shot_put_3', 'st_shot_put_4', 'st_shot_put_5', 'st_shot_put_6', 'st_shot_put_7.26'], Crypto.generateAC('598824', 'pepper')));


        this.handle.insert(new Account('VIa', ['VIa'], [], Crypto.generateAC('177029', 'chilli')));
        this.handle.insert(new Account('VIb', ['VIb'], [], Crypto.generateAC('300052', 'chilli')));
        this.handle.insert(new Account('Va', ['Va'], [], Crypto.generateAC('674054', 'chilli')));
        this.handle.insert(new Account('Vb', ['Vb'], [], Crypto.generateAC('265309', 'chilli')));
        this.handle.insert(new Account('IVa', ['IVa'], [], Crypto.generateAC('771735', 'chilli')));
        this.handle.insert(new Account('IVb', ['IVb'], [], Crypto.generateAC('165640', 'chilli')));
        this.handle.insert(new Account('UIIIa', ['UIIIa'], [], Crypto.generateAC('986092', 'chilli')));
        this.handle.insert(new Account('UIIIb', ['UIIIb'], [], Crypto.generateAC('394824', 'chilli')));
        this.handle.insert(new Account('OIIIa', ['OIIIa'], [], Crypto.generateAC('514403', 'chilli')));
        this.handle.insert(new Account('OIIIb', ['OIIIb'], [], Crypto.generateAC('742976', 'chilli')));
    };
}