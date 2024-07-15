sap.ui.define(
  [
    "./BaseController",
    "../model/formatter",
    "../model/models",
    "sap/ui/core/Fragment",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/type/String",
    "sap/ui/table/Column",
    "sap/ui/table/TreeTable",
    "sap/m/ColumnListItem",
    "sap/m/SearchField",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/Token",
  ],
  function (
    BaseController,
    formatter,
    models,
    Fragment,
    Label,
    Filter,
    FilterOperator,
    TypeString,
    UIColumn,
    UITree,
    ColumnListItem,
    SearchField,
    MColumn,
    Text,
    Token
  ) {
    "use strict";

    return BaseController.extend(
      "com.martur.zmbdocumentmanagment.controller.InitialScreen",
      {
        formatter: formatter,
        models: models,
        onInit: function () {
          var oRouter = this.getRouter();

          oRouter
            .getRoute("initialScreen")
            .attachMatched(this._onRouteMatched, this);

          var oFilePathMultiInput = this.getView().byId(
            "idFilterBarFilePathMultiInput"
          );
          this.selectedEditCreateRowData = undefined;
          this.sEditCreateTableDeletePath = undefined;
          //oFilePathMultiInput.addValidator(this._filePathValidator.bind(this));
        },

        _onRouteMatched: function () {
          let oModel = this.getOwnerComponent().getModel(),
            sPath = "/getPersonalInfoSet(Pernr='')";

          oModel.read(sPath, {
            success: (oData, oResponse) => {
              console.log(oData);
            },
            error: (oError) => {
              console.log(oError);
            },
          });
          this._fetchFiles();
        },
        _openDialog: function (dialogName) {
          if (!this._oDialog) {
            Fragment.load({
              name: `com.martur.zmbdocumentmanagment.fragment.${dialogName}`,
              controller: this,
            }).then(
              function (oDialog) {
                // connect dialog to the root view of this component (models, lifecycle)
                this.getView().addDependent(oDialog);
                oDialog.addStyleClass(
                  this.getOwnerComponent().getContentDensityClass()
                );
                this._oDialog = oDialog
                oDialog.open(oDialog);
              }.bind(this)
            );
          }
        },
        _openDialogOnADialog: function (dialogParentName, dialogName) {
          if (!this._oDialog2) {
            Fragment.load({
              name: `com.martur.zmbdocumentmanagment.fragment.${dialogParentName}.${dialogName}`,
              controller: this,
            }).then(
              function (oDialog) {
                // connect dialog to the root view of this component (models, lifecycle)
                this.getView().addDependent(oDialog);
                oDialog.addStyleClass(
                  this.getOwnerComponent().getContentDensityClass()
                );
                this._oDialog2 = oDialog
                oDialog.open(oDialog);
              }.bind(this)
            );
          }
        },
        _closeDialog: function () {
          try {
            if (this._oDialog2) {
              this._oDialog2.close();
              this._oDialog2.destroy();
              this._oDialog2 = undefined;
              return;
            }
            
          } catch (error) {
            console.log(error)
          }
          try {
            this._oDialog.close();
            this._oDialog.destroy();
            this._oDialog = undefined;
          } catch (error) {
            console.log(error)
          }
          try {
            this._oVHD.close();
            this._oVHD.destroy();
            this._oVHD = undefined;
          } catch (error) {
            console.log(error)
          }
        },
        _documentSortConfirm: function (oEvent) {
          this._closeDialog();
        },
        _openInputTableValueHelp: function (dialogName) {
          let that = this;
          this._oBasicSearchField = new SearchField();
          var aRows = this.getModel("jsonModel").getData().documentListSet;
          if (!this._oDialog) {
            Fragment.load({
              name: `com.martur.zmbdocumentmanagment.fragment.${dialogName}`,
              controller: this,
            }).then(
              function (oDialog) {
                // connect dialog to the root view of this component (models, lifecycle)
                this.getView().addDependent(oDialog);
                oDialog.addStyleClass(
                  this.getOwnerComponent().getContentDensityClass()
                );
                var oFilterBar = oDialog.getFilterBar(),
                  oColumnDocumentCode,
                  oColumnDocumentName;
                that._oVHD = oDialog;

                this.getView().addDependent(oDialog);

                // Set Basic Search for FilterBar
                oFilterBar.setFilterBarExpanded(false);
                oFilterBar.setBasicSearch(this._oBasicSearchField);

                // Trigger filter bar search when the basic search is fired
                this._oBasicSearchField.attachSearch(function () {
                  oFilterBar.search();
                });

                oDialog.getTableAsync().then(
                  function (oTable) {
                    oTable.setModel(this.getModel("jsonModel"));

                    // For Desktop and tabled the default table is sap.ui.table.Table
                    if (oTable.bindRows) {
                      // Bind rows to the ODataModel and add columns
                      oTable.bindAggregation("rows", {
                        path: "/documentListSet",
                        events: {
                          dataReceived: function () {
                            oDialog.update();
                          },
                        },
                      });
                      oColumnDocumentCode = new UIColumn({
                        width: "8rem",
                        label: new Label({ text: "Döküman No" }),
                        template: new Text({
                          wrapping: false,
                          text: `{key}`,
                        }),
                      });
                      oColumnDocumentName = new UIColumn({
                        label: new Label({ text: "Döküman Ad" }),
                        template: new Text({
                          wrapping: false,
                          text: `{fileName}`,
                        }),
                      });
                      oTable.addColumn(oColumnDocumentCode);
                      oTable.addColumn(oColumnDocumentName);
                    }

                    // For Mobile the default table is sap.m.Table
                    if (oTable.bindItems) {
                      // Bind items to the ODataModel and add columns
                      oTable.bindAggregation("items", {
                        path: "/documentListSet",
                        template: new ColumnListItem({
                          cells: [
                            new Label({ text: "{key}" }),
                            new Label({ text: "{fileName}" }),
                          ],
                        }),
                        events: {
                          dataReceived: function () {
                            oDialog.update();
                          },
                        },
                      });
                      oTable.addColumn(
                        new MColumn({ header: new Label({ text: "Dosya No" }) })
                      );
                      oTable.addColumn(
                        new MColumn({
                          header: new Label({ text: "Dosya Adı" }),
                        })
                      );
                    }
                    oDialog.update();
                  }.bind(this)
                );

                // oDialog.setTokens(this._oMultiInput.getTokens());
                oDialog.open();
              }.bind(this)
            );
          }
        },
        onDocumentNameValueHelpOkPress: function (oEvent) {
          var aTokens = oEvent.getParameter("tokens");
          if (aTokens.length > 0) {
            this.getModel("jsonModel").setProperty(
              "/filterInputValues/documentName",
              aTokens[0].getText()
            );
          }
          this._closeDialog();
        },
        onDocumentNameFilterBarSearch: function (oEvent) {
          var sSearchQuery = this._oBasicSearchField.getValue(),
            aSelectionSet = oEvent.getParameter("selectionSet");

          var aFilters =
            aSelectionSet &&
            aSelectionSet.reduce(function (aResult, oControl) {
              if (oControl.getValue()) {
                aResult.push(
                  new Filter({
                    path: oControl.getName(),
                    operator: FilterOperator.Contains,
                    value1: oControl.getValue(),
                  })
                );
              }

              return aResult;
            }, []);

          aFilters.push(
            new Filter({
              filters: [
                // new Filter({ path: "key", operator: FilterOperator.Contains, value1: sSearchQuery }),
                new Filter({
                  path: "fileName",
                  operator: FilterOperator.Contains,
                  value1: sSearchQuery,
                }),
              ],
              and: false,
            })
          );

          this._filterTable(
            new Filter({
              filters: aFilters,
              and: true,
            })
          );
        },
        _filterTable: function (oFilter) {
          var oVHD = this._oVHD;

          oVHD.getTableAsync().then(function (oTable) {
            if (oTable.bindRows) {
              oTable.getBinding("rows").filter(oFilter);
            }
            if (oTable.bindItems) {
              oTable.getBinding("items").filter(oFilter);
            }

            // This method must be called after binding update of the table.
            oVHD.update();
          });
        },
        onDialogEditCreateTableBasicSearch: function (oEvent) {
          let table = oEvent.oSource.getParent().getParent(),
            oBinding = table.getBinding("rows"),
            oFilter = [],
            inputValue = oEvent.getSource().getValue();
          if (inputValue !== "") {
            oFilter = new Filter(
              [
                new Filter("Kytno", FilterOperator.Contains, inputValue),
                new Filter("Zgptid", FilterOperator.Contains, inputValue),
                new Filter("ZfolderPath", FilterOperator.Contains, inputValue),
                // new Filter("Loekz", FilterOperator.Contains, inputValue),
                new Filter("Ernam", FilterOperator.Contains, inputValue),
                new Filter("Aenam", FilterOperator.Contains, inputValue),
              ],
              false
            );
            oBinding.filter([oFilter]);
          } else {
            oBinding.filter([oFilter]);
          }
        },
        onTreeTableBasicSearch: function (oEvent) {
          let table = this.getView().byId("idDocumentTreeTable"),
            oBinding = table.getBinding("rows"),
            oFilter = [],
            inputValue = oEvent.getSource().getValue();
          if (inputValue !== "") {
            oFilter = new Filter(
              [
                new Filter("fileName", FilterOperator.Contains, inputValue),
                new Filter("uploadedBy", FilterOperator.Contains, inputValue),
              ],
              false
            );
            oBinding.filter([oFilter]);
          } else {
            oBinding.filter([oFilter]);
          }
        },
        _filePathValidator: function (args) {
          var text = args.text,
            i18n = this.getOwnerComponent().getModel("i18n");

          if (!this.isValidFilePath(text)) {
            this.getView()
              .byId("idFilterBarFilePathMultiInput")
              .setValueState("Warning");
            this.getView()
              .byId("idFilterBarFilePathMultiInput")
              .setValueStateText(
                i18n.getProperty("filterBarFilePathStateText")
              );
            return;
          }
          this.getView()
            .byId("idFilterBarFilePathMultiInput")
            .setValueState("None");
          return new Token({ key: text, text: text });
        },
        onFilterBarFilePathMultiInputChange: function (oEvent) {
          let oTokens = oEvent.getSource().getTokens(),
            jsonModel = this.getModel("jsonModel");
          this.getView().byId("idDocumentTreeTable").setBusy(true);
          if (oEvent.getParameter("type") === "removed") {
            if (
              oEvent.getParameter("removedTokens").length === oTokens.length
            ) {
              jsonModel.setProperty(
                "/filterInputConfigurations/secondFilterBarVisibility",
                false
              );
              jsonModel.setProperty("/documentListSet", []);

              this.getView().byId("idDocumentTreeTable").setBusy(false);
            }
            return;
          }
          if (oTokens.length > 0) {
            jsonModel.setProperty(
              "/filterInputConfigurations/secondFilterBarVisibility",
              true
            );
            jsonModel.setProperty(
              "/documentListSet",
              models._documentsListSet()
            );
            this.getView().byId("idDocumentTreeTable").setBusy(false);
          }
        },
        _fetchFiles: function () {
          let jsonModel = this.getModel("jsonModel");
          jsonModel.setProperty(
            "/filterInputConfigurations/secondFilterBarVisibility",
            true
          );
          jsonModel.setProperty("/documentListSet", models._documentsListSet());
          this.getView().byId("idDocumentTreeTable").setBusy(false);
        },
        onEditCreateFilePathPress: function (oEvent) {
          this._fetchFilePaths().then(() => {
            this._openDialog("dialogEditCreateFilePath");
          });
        },
        _fetchFilePaths: function () {
          let that = this;
          return new Promise((resolve, reject) => {
            var sPath = "/modelFolderListSet",
              jsonModel = that.getModel("jsonModel");
            that
              .getOwnerComponent()
              .getModel()
              .read(sPath, {
                success: function (oData, oResponse) {
                  jsonModel.setProperty("/modelFolderListSet", oData.results);
                  resolve();
                },
                error: function (oResponse) {
                  console.log(oResponse);
                  reject(oResponse); // Reject the promise
                },
              });
          });
        },
        _fetchAIModelList: function () {
          let that = this;
          return new Promise((resolve, reject) => {
            var sPath = "/modelListSet",
              jsonModel = that.getModel("jsonModel");
            that
              .getOwnerComponent()
              .getModel()
              .read(sPath, {
                success: function (oData, oResponse) {
                  jsonModel.setProperty("/modelListSet", oData.results);
                  resolve();
                },
                error: function (oResponse) {
                  console.log(oResponse);
                  reject(oResponse); // Reject the promise
                },
              });
          });
        },
        _deleteSelectedRow: function (oEvent) {

        },
        _unselectAll: function (oEvent) {
          let oTable = oEvent.getSource().getParent().getParent();
          oTable.clearSelection();
        },
        onEditCreateTableSelectionChange: function (oEvent) {
          let oSource = oEvent.getSource(),
            jsonModel = this.getModel("jsonModel"),
            oItemIndex = oSource.getSelectedIndex();
          if (oItemIndex === -1) {
            this.selectedEditCreateRowData = undefined;
            this.sEditCreateTableDeletePath = undefined;
            jsonModel.setProperty("/dialogEditCreateVariables", models._dialogEditCreateVariables())
          } else {
            let oItem = oSource.getRows()[oItemIndex],
              oEntry = oItem.getBindingContext("jsonModel"),
              oModel = this.getView().getModel(),
              sObjects = oEntry.getObject();
            this.selectedEditCreateRowData = sObjects;
            let oData = this.selectedEditCreateRowData;
            this.sEditCreateTableDeletePath = oModel.createKey("/modelFolderListSet", oData);
            jsonModel.setProperty("/dialogEditCreateVariables/editButtonEnabled", true);
            jsonModel.setProperty("/dialogEditCreateVariables/deleteButtonEnabled", true);
            jsonModel.setProperty("/dialogEditCreateVariables/unselectButtonEnabled", true);
          }

        }
      }
    );
  }
);
