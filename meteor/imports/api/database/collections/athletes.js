import {COMPETITION_TYPES} from "../../logic/competition_type";
import {Athlete} from "../../logic/athlete";
import {Log} from "../../log";
import {Crypto} from "../../crypto/crypto";
import {Collection} from "./collection";
import {Account} from "../../logic/account";

export let Athletes = new Collection('Athletes', true);

Athletes.createMockData = function () {
    const log = new Log();
    const ct = COMPETITION_TYPES[0].object;
    const groupAccount = new Account(['Q#z'], [], Crypto.generateAC('1234', 'pepper'));
    const serverAccount = new Account(['Q#z'], ['st_long_jump', 'st_ball_200', 'st_ball_200', 'st_endurance_1000', 'st_endurance_3000', 'st_sprint_100'], Crypto.generateAC('4321', 'pepper'));
    this.handle.insert(new Athlete(log, 'Hans', 'Müller', 2000, true, 'Q#z', '0', ct.maxAge, ct).encryptForDatabase(groupAccount, serverAccount));
    this.handle.insert(new Athlete(log, 'Klaus', 'Schmidt', 1999, true, 'Q#z', '0', ct.maxAge, ct).encryptForDatabase(groupAccount, serverAccount));
    this.handle.insert(new Athlete(log, 'Herbert', 'Gronewoldt', 1989, true, 'Q#z', '0', ct.maxAge, ct).encryptForDatabase(groupAccount, serverAccount));
};