/**
 * Created by noah on 11/29/16.
 */

/**
 *
 * @param log
 * @param {string[]} score_write_permissions
 * @param {string[]} group_permissions
 * @param {*} ac
 * @constructor
 */
export function Account(log, score_write_permissions, group_permissions, ac) {
    this.score_write_permissions = score_write_permissions;
    this.group_permissions = group_permissions;
    this.ac = ac;
}