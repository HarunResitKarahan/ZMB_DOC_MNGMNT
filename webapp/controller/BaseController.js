sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/m/library"],
  function (Controller, UIComponent, mobileLibrary) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return Controller.extend(
      "com.martur.zmbdocumentmanagment.controller.BaseController",
      {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
          return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
          return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        isValidFilePath: function (path) {
          const validPathCharsRegex = /^[^<>:"|?*\x00-\x1F]+$/;
          // Unix-like absolute path (starts with /) or relative path (no starting / but includes / somewhere)
          const unixPathRegex =
            /^(\/[^<>:"|?*\x00-\x1F]+)+(\/[^<>:"|?*\x00-\x1F]+)*\/?$/;

          // Windows absolute path (starts with drive letter and :\) or relative path (includes \ somewhere)
          // Allowing C:\ as a valid path
          const windowsPathRegex =
            /^[a-zA-Z]:\\(?:[^<>:"|?*\x00-\x1F\\]*(\\[^<>:"|?*\x00-\x1F\\]*)*)*$/;

          // Check if path is not empty and does not contain invalid characters
          //   if (!path || !validPathCharsRegex.test(path)) {
          //     return false;
          //   }
          return windowsPathRegex.test(path) || unixPathRegex.test(path);
        },
        _clearValidationValueState: function (inputId) {
          let oView = this.getView();
          oView.byId(inputId).setValueState("None");
        },
        _validateInput: function (oInput) {
          var sValueState = "None";
          var bValidationError = false;
          var oBinding = oInput.getBinding("value");
          var selectedKey = false;
          if (oBinding === undefined)
            oBinding = oInput.getBinding("selectedKey");

          try {
            try {
              selectedKey = oInput.getForceSelection() ? false : true;
            } catch (error) {
              selectedKey = false;
            }
            if (selectedKey) {
              oBinding.getType().validateValue(oInput.getSelectedKey());
            } else {
              oBinding.getType().validateValue(oInput.getValue());
            }
          } catch (oException) {
            // console.log(oException)
            // oInput.setValueStateText(oException.message)
            sValueState = "Error";
            bValidationError = true;
          }

          oInput.setValueState(sValueState);

          return bValidationError;
        },
      }
    );
  }
);
