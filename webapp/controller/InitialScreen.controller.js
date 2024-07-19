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
    "sap/m/MessageBox",
    "sap/m/MessageToast",
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
    Token,
    MessageBox,
    MessageToast
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
          this.editCreateFilePathMode = "C";
          this.lastSelectedItemsTable = undefined;
          //oFilePathMultiInput.addValidator(this._filePathValidator.bind(this));
        },

        _onRouteMatched: function () {
          this._getPersonelInfos().then(() => {
            this._fetchFiles();
          })
        },
        _getPersonelInfos: function () {
          let that = this;
          return new Promise((resolve, reject) => {
            let oModel = this.getOwnerComponent().getModel(),
              sPath = "/getPersonalInfoSet(Pernr='')";

            oModel.read(sPath, {
              success: (oData, oResponse) => {
                console.log(oData);
                resolve();
              },
              error: (oError) => {
                // console.log(oError);
                reject(oError);
              },
            });
          })
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
              this._clearAddFilePathDialogValues();
              try {
                if (this.lastSelectedItemsTable !== undefined) {
                  this.lastSelectedItemsTable.clearSelection();
                }
              } catch (error) {

              }
              return;
            }

          } catch (error) {
            console.log(error)
          }
          try {
            this._oDialog.close();
            this._oDialog.destroy();
            this._oDialog = undefined;
            this._clearAddFilePathDialogValues();
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
          var aRows = this.getModel("jsonModel").getData().filesSetForDocumentNameFilter;
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
                  oColumnDocumentName,
                  oColumnDocumentFolderPath;
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
                    let i18n = this.getOwnerComponent().getModel("i18n")
                    oTable.setModel(this.getModel("jsonModel"));

                    // For Desktop and tabled the default table is sap.ui.table.Table
                    if (oTable.bindRows) {
                      // Bind rows to the ODataModel and add columns
                      oTable.bindAggregation("rows", {
                        path: "/filesSetForDocumentNameFilter",
                        events: {
                          dataReceived: function () {
                            oDialog.update();
                          },
                        },
                      });
                      oColumnDocumentCode = new UIColumn({
                        width: "auto",
                        label: new Label({ text: i18n.getProperty("documentNo") }),
                        template: new Text({
                          wrapping: false,
                          text: `{FileId}`,
                        }),
                      });
                      oColumnDocumentName = new UIColumn({
                        label: new Label({ text: i18n.getProperty("document-name") }),
                        template: new Text({
                          wrapping: false,
                          text: `{FileName}`,
                        }),
                      });
                      oColumnDocumentFolderPath = new UIColumn({
                        label: new Label({ text: i18n.getProperty("folderPath") }),
                        template: new Text({
                          wrapping: false,
                          text: `{FileParentFolderPath}`,
                        }),
                      });
                      oTable.addColumn(oColumnDocumentCode);
                      oTable.addColumn(oColumnDocumentName);
                      oTable.addColumn(oColumnDocumentFolderPath);
                    }

                    // For Mobile the default table is sap.m.Table
                    if (oTable.bindItems) {
                      // Bind items to the ODataModel and add columns
                      oTable.bindAggregation("items", {
                        path: "/filesSetForDocumentNameFilter",
                        template: new ColumnListItem({
                          cells: [
                            new Label({ text: "{FileId}" }),
                            new Label({ text: "{FileName}" }),
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
                  path: "FileName",
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
              ],
              false
            );
            oBinding.filter([oFilter]);
            table.expandToLevel(999);
          } else {
            oBinding.filter([oFilter]);
            table.collapseAll();
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
        onEditCreateFilePathAddFileFolderPathChange: function (oEvent) {
          let oSource = oEvent.getSource(),
            oText = oSource.getValue(),
            i18n = this.getOwnerComponent().getModel("i18n");
          if (!this.isValidFilePath(oText)) {
            oSource.setValueState("Warning");
            oSource.setValueStateText(i18n.getProperty("filterBarFilePathStateText"));
          } else {
            oSource.setValueState("None");
            oSource.setValueStateText("");
          }
        },
        onAddFilePathSavePress: function (oEvent) {
          let [allComboBoxSources, allInputSources] = this._getDialogEditCreateAddFilePathFormElements();
          let aInputs = [...allComboBoxSources, ...allInputSources],
            bValidationError = false,
            that = this;

          aInputs.forEach(function (oInput) {
            bValidationError = that._validateInput(oInput) || bValidationError;
          }, this);
          if (!bValidationError) {
            this._createNewFilePath();
          }
        },
        _createNewFilePath: function () {
          let that = this;
          return new Promise((resolve, reject) => {
            var sPath = "/modelFolderListSet",
              i18n = this.getOwnerComponent().getModel("i18n"),
              jsonModel = that.getModel("jsonModel");
            let oEntry = {
              Zgptid: jsonModel.getProperty("/dialogEditCreateVariables/addFilePathDialogValues/gptTypeSelectedKey"),
              ZfolderPath: jsonModel.getProperty("/dialogEditCreateVariables/addFilePathDialogValues/folderPathValue"),
              Mode: this.editCreateFilePathMode
            }
            if (this.editCreateFilePathMode === 'U') {
              oEntry.Kytno = this.selectedEditCreateRowData.Kytno
            }
            that
              .getOwnerComponent()
              .getModel()
              .create(sPath, oEntry, {
                success: function (oData, oResponse) {
                  if (oResponse.statusText === "Created") {
                    MessageBox.success(i18n.getProperty("successful"), {
                      onClose: function (sAction) {
                        that._fetchFilePaths();
                        that._clearAddFilePathDialogValues();
                        that._closeDialog();
                      },
                    });
                  } else {
                    MessageBox.error(i18n.getProperty("creationFailed"));
                  }
                  resolve();
                },
                error: function (oResponse) {
                  console.error(oResponse);
                  reject(oResponse); // Reject the promise
                },
              });
          });
        },
        onEditCreateFilePathDeleteFilePath: function () {
          let i18n = this.getOwnerComponent().getModel("i18n"),
            that = this;
          MessageBox.warning(`${this.selectedEditCreateRowData.Kytno} ${i18n.getProperty("deleteConfirmationSuffix")}`, {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction) {
              if (sAction === "OK") {
                that._deleteSelectedFilePath();
              }
            }
          });
        },
        _deleteSelectedFilePath: function () {
          let that = this;
          return new Promise((resolve, reject) => {
            var sPath = "/modelFolderListSet",
              i18n = this.getOwnerComponent().getModel("i18n"),
              jsonModel = that.getModel("jsonModel");
            that
              .getOwnerComponent()
              .getModel()
              .remove(that.sEditCreateTableDeletePath, {
                success: function (oData, oResponse) {
                  if (oResponse.statusCode === "204") {
                    MessageBox.success(i18n.getProperty("successfullyDeleted"), {
                      onClose: function (sAction) {
                        that._fetchFilePaths();
                      },
                    });
                  } else {
                    MessageBox.error(i18n.getProperty("failedToDelete"));
                  }
                  resolve();
                },
                error: function (oResponse) {
                  // console.log(oResponse);
                  reject(oResponse); // Reject the promise
                },
              });
          });
        },
        _clearAddFilePathDialogValues: function () {
          this.getModel("jsonModel").setProperty("/dialogEditCreateVariables", models._dialogEditCreateVariables())
        },
        _validateSingleInput: function (oEvent) {
          let oSource = oEvent.getSource(),
            bValidationError = false;

          bValidationError = this._validateInput(oSource) || bValidationError;
        },
        _getDialogEditCreateAddFilePathFormElements: function () {
          let returnArry = [],
            allComboBoxSources = [],
            allInputSources = [],
            that = this;
          let source = that.getView().getControlsByFieldGroupId("dialogEditCreateAddFilePathForm");
          let comboBoxSource = source.filter((elmnt) => elmnt.isA("sap.m.ComboBox"));
          let inputSource = source.filter((elmnt) => elmnt.isA("sap.m.Input"));
          allComboBoxSources = [...allComboBoxSources, ...comboBoxSource];
          allInputSources = [...allInputSources, ...inputSource];
          return [allComboBoxSources, allInputSources];
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
          let that = this;
          this.getView().byId("idDocumentTreeTable").setBusy(true);
          return new Promise((resolve, reject) => {
            var jsonModel = that.getModel("jsonModel"),
              oModel = that.getOwnerComponent().getModel(),
              FileName = jsonModel.getProperty("/filterInputValues/documentName"),
              FileType = jsonModel.getProperty("/filterInputValues/documentType"),
              FileIsSync = jsonModel.getProperty("/filterInputValues/documentExtension"),
              sPath = "/filesSet";
              // sPath = oModel.createKey("/filesSet", {
              //   FileId: "",
              //   FileName: FileName,
              //   FileType: FileType,
              //   FileIsSync: false,
              // });
              if (FileIsSync === "true") {
                FileIsSync = 'X'
              }
              if (FileIsSync === "false") {
                FileIsSync = 'Y'
              }
              oModel.read(sPath, {
                filters: [
                  new Filter("FileName", FilterOperator.EQ, FileName), 
                  new Filter("FileType", FilterOperator.EQ, FileType),
                  new Filter("FileIsSync", FilterOperator.EQ, FileIsSync)
                ],
                success: function (oData, oResponse) {
                  jsonModel.setProperty("/filterInputConfigurations/secondFilterBarVisibility", true);
                  jsonModel.setProperty("/filesSet", that._createFolderStructure(oData.results));
                  jsonModel.setProperty("/filesSetForDocumentNameFilter", oData.results);
                  jsonModel.setProperty("/filesSetCount", oData.results.length);
                  that.getView().byId("idDocumentTreeTable").expandToLevel(999);
                  that.getView().byId("idDocumentTreeTable").getColumns()[0].autoResize();
                  that.getView().byId("idDocumentTreeTable").setBusy(false);
                  resolve();
                },
                error: function (oResponse) {
                  // console.log(oResponse);
                  reject(oResponse); // Reject the promise
                },
              });
          });
        },
        _createFolder: function (path) {
          if (!this.fileMap[path]) {
            const parts = path.split('\\');
            const fileName = parts.pop();
            const parentPath = parts.join('\\');

            this.fileMap[path] = {
              key: path,
              fileName: fileName,
              iconSrc: 'sap-icon://open-folder',
              nodes: [],
              status: '01'
            };

            // Recursively create parent folders
            if (parentPath) {
              const parentFolder = this._createFolder(parentPath);
              // parentFolder.nodes.push(this.fileMap[path]);
              if (parentFolder) {
                parentFolder.nodes.unshift(this.fileMap[path]);
              }
            }
          }
          return this.fileMap[path];
        },
        _createFolderStructure: function (files) {
          this.fileMap = {};
          files.forEach(file => {
            const parentPath = file.FileParentFolderPath;
            const parentFolder = this._createFolder(parentPath);

            const fileNode = {
              key: file.FileId,
              fileName: file.FileName,
              iconSrc: formatter.setFileIcon(file.FileType),
              fileType: file.FileType,
              uploadedBy: file.uploadedBy,
              status: file.FileIsSync === 'X' ? '02' : '03',
              isEjected: file.FileIsEjected
            };

            parentFolder.nodes.push(fileNode);
          });

          // Return the top-level folders
          const topFolders = Object.values(this.fileMap).filter(folder => !folder.key.includes('\\'));
          return topFolders;
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
                  // console.log(oResponse);
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
                  // console.log(oResponse);
                  reject(oResponse); // Reject the promise
                },
              });
          });
        },
        onExcludeCheckBoxSelect: function (oEvent) {
          let oSource = oEvent.getSource(),
            oSelected = oSource.getSelected(),
            oModel = this.getModel(),
            i18n = this.getOwnerComponent().getModel("i18n"),
            sPath = '/setIsEjectedSet',
            dataPath = oEvent.getSource().getParent().getBindingContext("jsonModel"),
            rowData = dataPath.getObject(),
            oEntry = {
              FileId: rowData.key,
              IsEjected: oSelected
            },
            that = this;

          oModel.create(sPath, oEntry, {
            success: function (oData, oResponse) {
              MessageToast.show(i18n.getProperty("fileEjectedSetStatusSuccess"), { duration: 1000 })
            },
            error: function (oResponse) {
              // console.log(oResponse);
              MessageToast.show(i18n.getProperty("fileEjectedSetStatusFail"), { duration: 1000 })
            },
          });
        },
        _editCreateFilePathEditSelectedRow: function (oEvent) {
          let jsonModel = this.getModel("jsonModel");
          this.editCreateFilePathMode = "U";
          jsonModel.setProperty("/dialogEditCreateVariables/addFilePathDialogValues/mode", "U")
          jsonModel.setProperty("/dialogEditCreateVariables/addFilePathDialogValues/gptTypeSelectedKey", this.selectedEditCreateRowData.Zgptid)
          jsonModel.setProperty("/dialogEditCreateVariables/addFilePathDialogValues/folderPathValue", this.selectedEditCreateRowData.ZfolderPath)
          this._openDialogOnADialog('dialogEditCreateFilePath', 'addFilePath');
        },
        _unselectAll: function (oEvent) {
          let oTable = oEvent.getSource().getParent().getParent();
          oTable.clearSelection();
        },
        onEditCreateTableSelectionChange: function (oEvent) {
          let oSource = oEvent.getSource(),
            jsonModel = this.getModel("jsonModel"),
            oItemIndex = oSource.getSelectedIndex();
          this.lastSelectedItemsTable = oSource;
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

        },
        onDownloadFileButtonPress: function (oEvent) {
          let dataPath = oEvent.getSource().getParent().getBindingContext("jsonModel"),
            oView = this.getView(),
            oModel = this.getModel(),
            oServicePath = oModel.sServiceUrl,
            oButton = oEvent.getSource(),
            rowData = dataPath.getObject(),
            sPath = `/getFileSet(FileId='${rowData.key}')/$value`,
            that = this;

          sap.m.URLHelper.redirect(oServicePath + sPath, false)
        }
      }
    );
  }
);
