module.exports = {
    instance: null,

    /**
     * @deprecated
     * @returns {Marionette}
     */
    getInstance: function () {
        console.warn('This method is deprecated. Please remove it from you code');
        return this.instance;
    },

    /**
     * @deprecated
     * @param {Marionette} instance
     */
    setInstance: function (instance) {
        console.warn('This method is deprecated. Please remove it from you code');
        this.instance = instance;
    }
};
