sap.ui.define([], function () {
  "use strict";

  return {
    setStatusText: function (sValue) {
      let i18n = this.getOwnerComponent().getModel("i18n");
      switch (sValue) {
        case "01":
          return i18n.getProperty("pending");
        case "02":
          return i18n.getProperty("onSystem");
        case "03":
          return i18n.getProperty("notOnSystem");

        default:
          break;
      }
    },
    setStatusIcon: function (sValue) {
      let i18n = this.getOwnerComponent().getModel("i18n");
      switch (sValue) {
        case "01":
          return i18n.getProperty("pendingIcon");
        case "02":
          return i18n.getProperty("onSystemIcon");
        case "03":
          return i18n.getProperty("notOnSystemIcon");

        default:
          break;
      }
    },
    setStatusState: function (sValue) {
      let i18n = this.getOwnerComponent().getModel("i18n");
      switch (sValue) {
        case "01":
          return i18n.getProperty("pendingState");
        case "02":
          return i18n.getProperty("onSystemState");
        case "03":
          return i18n.getProperty("notOnSystemState");

        default:
          break;
      }
    }
  };
});
