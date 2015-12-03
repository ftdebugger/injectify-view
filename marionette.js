module.exports = {
    instance: null,

    /**
     * @deprecated
     * @returns {Marionette}
     */
    getInstance: function () {
        return this.instance;
    },

    /**
     * @deprecated
     * @param {Marionette} instance
     */
    setInstance: function (instance) {
        this.instance = instance;
    }
};
