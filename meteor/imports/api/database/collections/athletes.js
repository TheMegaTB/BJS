import {COMPETITION_TYPES} from "../../logic/competition_type";
import {Athlete} from "../../logic/athlete";
import {Log} from "../../log";
import {Crypto} from "../../crypto/crypto";
import {ContestCollection} from "./collection";
import {Account} from "../../logic/account";
import {DBInterface} from "../db_access";

export function initAthletes() {
    Meteor.COLLECTIONS.Athletes = new ContestCollection('Athletes', function (name, handle) {
        Meteor.publish(name, function () {
            return handle.find({});
        });
    });

    Meteor.COLLECTIONS.Athletes.createMockData = function () {
        const log = new Log();
        const ct = COMPETITION_TYPES[0].object;
        const groupAccount = new Account('Q#z', ['Q#z'], [], Crypto.generateAC('1234', 'chilli'));
        const serverAccount = new Account('Admin', ['Q#z'], ['st_long_jump', 'st_ball_200', 'st_endurance_1000', 'st_endurance_3000', 'st_sprint_100'], Crypto.generateAC('passwort', 'pepper'));
        this.handle.insert(new Athlete(log, 'Hans', 'Müller', 2000, true, 'Q#z', '0', ct.maxAge, ct).encryptForDatabase(groupAccount, serverAccount));
        this.handle.insert(new Athlete(log, 'Klaus', 'Schmidt', 1999, true, 'Q#z', '0', ct.maxAge, ct).encryptForDatabase(groupAccount, serverAccount));
        this.handle.insert(new Athlete(log, 'Herbert', 'Gronewoldt', 1989, true, 'Q#z', '0', ct.maxAge, ct).encryptForDatabase(groupAccount, serverAccount));

        // add example measurement
        const p = DBInterface.getAthletesOfAccounts(log, [groupAccount], false)[0];
        p.addMeasurement(log, 'st_long_jump', [7.33], groupAccount, serverAccount);
        p.addMeasurement(log, 'st_ball_200', [70], groupAccount, serverAccount);
        p.addMeasurement(log, 'st_endurance_1000', [160], groupAccount, serverAccount);
        p.addMeasurement(log, 'st_endurance_3000', [640], groupAccount, serverAccount);
        p.addMeasurement(log, 'st_sprint_100', [10], groupAccount, serverAccount);
        console.log(p);
        console.log(log.getAsString());
    };
}