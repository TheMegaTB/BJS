export {Log};

/**
 * A logging object to save errors, warnings and other messages for the user.
 * @public
 * @constructor
 */
function Log() {
    this.messages = [];
    this.log_enabled = true;
}

/**
 * Returns a global log object
 * @returns {Log}
 */
Log.getLogObject = function () {
    if (!Meteor.logObject) Meteor.logObject = new Log();
    return Meteor.logObject;
};

Log.prototype = {

    /**
     * Adds a new error.
     * @public
     * @param message {string} Content of the message.
     */
    error: function (message) {
        this.custom(2, message);
    },
    err: function (message) {
        this.error(message);
    },

    /**
     * Adds a new warning.
     * @public
     * @param message {string} Content of the message.
     */
    warning: function (message) {
        this.custom(1, message);
    },
    warn: function (message) {
        this.warning(message);
    },

    /**
     * Adds a new info message.
     * @public
     * @param message {string} Content of the message.
     */
    info: function (message) {
        this.custom(0, message);
    },

    /**
     * Adds a new message with a custom level.
     * @public
     * @param level {number} Custom log-level to use for the message.
     * @param message {string} Content of the message.
     */
    custom: function (level, message) {
        if (this.log_enabled) {
            this.messages.push({
                level: level,
                message: message,
                timestamp: new Date()
            });
        }
    },

    /**
     * Merge another Log objects messages to this.messages.
     * @public
     * @param other {Log} Other Log object this should be merged onto.
     */
    merge: function (other) {
        this.messages = this.messages.concat(other.messages);
    },

    /**
     * Enables all logs.
     * @public
     */
    enable: function () {
        this.log_enabled = true;
    },

    /**
     * Disables all logs.
     * @public
     */
    disable: function () {
        this.log_enabled = false;
    },

    /**
     * Clears the messages buffer.
     * @public
     */
    clear: function () {
        this.messages = [];
    },

    /**
     * Returns the highest level
     * @returns {number}
     */
    getHighestLevel: function () {
        let logLevel = 0;
        for (let msg in this.messages) {
            if (!this.messages.hasOwnProperty(msg)) continue;
            if (this.messages[msg].level > logLevel) logLevel = this.messages[msg].level;
        }
        return logLevel;
    },

    /**
     * Returns the message with the highest level
     * @returns {{level: number, message: string}}
     */
    getHighestLevelMessage: function () {
        let message = {level: 0, message: ""};
        for (let msg in this.messages) {
            if (!this.messages.hasOwnProperty(msg)) continue;
            if (this.messages[msg].level > message.level) message = this.messages[msg];
        }
        return message;
    },

    /**
     * Returns the most recently logged message
     * @returns {*}
     */
    getLastMessage: function () {
        if (this.messages.length == 0) return undefined;
        return this.messages[this.messages.length - 1];
    },

    /**
     * Returns all messages as strings.
     * @public
     * @returns {string[]}
     */
    getAsString: function () {
        return _.map(this.messages, function (message) {
            return message.timestamp.toLocaleString() + ' [' + message.level + ']: ' + message.message;
        });
    },

    /**
     * Returns all messages with the given level as strings.
     * @public
     * @param level {integer} Log level the returned messages should have.
     * @returns {string[]}
     */
    getAsStringWithLevel: function (level) {
        return _.map(_.where(this.messages, {level: level}), function (message) {
            return message.timestamp.toLocaleString() + ' [' + message.level + ']: ' + message.message;
        });
    },

    /**
     * Returns all messages with the given or higher level as strings.
     * @public
     * @param level {integer} Least log level the returned messages should have.
     * @returns {string[]}
     */
    getAsStringWithMinLevel: function (level) {
        return _.map(_.filter(this.messages, function (message) {
            return message.level >= level;
        }), function (message) {
            return message.timestamp.toLocaleString() + ' [' + message.level + ']: ' + message.message;
        });
    }
};