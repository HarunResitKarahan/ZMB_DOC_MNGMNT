sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createJsonModel: function () {
                let today = new Date();
                var oModel = new JSONModel({
                    busy: true,
                    today: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
                    todayJS: today,
                    documentTreeTableBusy: false,
                    documentTypeSearchHelpSet: this._filterInputDocumentTypeSearchHelpData(),
                    documentStatusSearchHelpSet: this._filterInputDocumentStatusSearchHelpData(),
                    filterInputValues: this._filterInputValues(),
                    filterInputConfigurations: this._filterInputConfigurations(),
                    dialogEditCreateVariables: this._dialogEditCreateVariables(),
                    filesSetCount: undefined,
                    filesSet: [],
                    filesSetForDocumentNameFilter: [],
                    modelFolderListSet: [],
                    modelListSet: []
                });
                return oModel;
            },
            _dialogEditCreateVariables: function () {
                return {
                    deleteButtonEnabled: false,
                    editButtonEnabled: false,
                    unselectButtonEnabled: false,
                    addFilePathDialogValues: {
                        mode: 'C',
                        gptTypeSelectedKey: undefined,
                        gptTypeSelectedItem: undefined,
                        folderPathValue: undefined,
                        folderPathValueState: "None"
                    }
                }
            },
            _filterInputValues: function () {
                return {
                    documentName: "",
                    documentType: "",
                    documentExtension: ""
                }
            },
            _filterInputConfigurations: function () {
                return {
                    secondFilterBarVisibility: true
                }
            },
            _filterInputDocumentStatusSearchHelpData: function () {
                return [
                    // {
                    //     key: "1",
                    //     value: "Sisteme Taşınıyor",
                    //     iconSrc: 'sap-icon://in-progress'
                    // },
                    {
                        key: "true",
                        value: "Sistemde Mevcut",
                        iconSrc: "sap-icon://message-success"
                    },
                    {
                        key: "false",
                        value: "Sisteme Taşınmadı",
                        iconSrc: 'sap-icon://message-error'
                    },
                ]
            },
            _filterInputDocumentTypeSearchHelpData: function () {
                return [
                    {
                        key: "1",
                        value: ".doc"
                    },
                    {
                        key: "2",
                        value: ".docx"
                    },
                    {
                        key: "3",
                        value: ".pdf"
                    },
                    {
                        key: "4",
                        value: ".txt"
                    },
                    {
                        key: "5",
                        value: ".rtf"
                    },
                    {
                        key: "6",
                        value: ".pptx"
                    },
                    {
                        key: "7",
                        value: ".xls"
                    },
                    {
                        key: "8",
                        value: ".xlsx"
                    },
                    {
                        key: "9",
                        value: ".csv"
                    },
                ]
            },
            _filesSet: function () {
                return [
                    {
                        key: "1",
                        fileName: "HR Folder 1",
                        iconSrc: 'sap-icon://open-folder',
                        uploadedBy: "HAKARAHAN",
                        nodes: [{
                            key: "2",
                            fileName: "HR Alt Folder 1",
                            iconSrc: 'sap-icon://open-folder',
                            fileType: ".xls",
                            uploadedBy: "HAKARAHAN",
                            nodes: [
                                {
                                    key: "2",
                                    fileName: "HR Alt Document 1-1",
                                    iconSrc: 'sap-icon://excel-attachment',
                                    fileType: ".xls",
                                    uploadedBy: "HAKARAHAN",
                                    status: '01'
                                }
                            ],
                            status: '01'
                        }, {
                            key: "2",
                            fileName: "HR Alt Document 1",
                            iconSrc: 'sap-icon://excel-attachment',
                            fileType: ".xls",
                            uploadedBy: "HAKARAHAN",
                            status: '01'
                        }]
                    },
                    {
                        key: "2",
                        fileName: "HR Folder 2",
                        iconSrc: 'sap-icon://open-folder',
                        uploadedBy: "HAKARAHAN",
                        nodes: [{
                            key: "2",
                            fileName: "HR Alt Folder 2",
                            iconSrc: 'sap-icon://open-folder',
                            uploadedBy: "HAKARAHAN",
                            nodes: [
                                {
                                    key: "2",
                                    fileName: "HR Alt Document 2-2",
                                    iconSrc: 'sap-icon://excel-attachment',
                                    fileType: ".xls",
                                    uploadedBy: "HAKARAHAN",
                                    status: '02'
                                }
                            ]
                        }, {
                            key: "2",
                            fileName: "HR Alt Document 2",
                            iconSrc: 'sap-icon://excel-attachment',
                            fileType: ".xls",
                            uploadedBy: "HAKARAHAN",
                            status: '03'
                        }]
                    },
                    {
                        key: "3",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '03'
                    },
                    {
                        key: "4",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '03'
                    },
                    {
                        key: "5",
                        fileName: "HR Document 1",
                        iconSrc: 'sap-icon://pdf-attachment',
                        fileType: ".pdf",
                        uploadedBy: "HAKARAHAN",
                        status: '03'
                    },
                    {
                        key: "6",
                        fileName: "HR Document 2",
                        iconSrc: 'sap-icon://excel-attachment',
                        fileType: ".xls",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "7",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "8",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    }, {
                        key: "9",
                        fileName: "HR Document 1",
                        iconSrc: 'sap-icon://pdf-attachment',
                        fileType: ".pdf",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "10",
                        fileName: "HR Document 2",
                        iconSrc: 'sap-icon://excel-attachment',
                        fileType: ".xls",
                        uploadedBy: "HAKARAHAN",
                        status: '01'
                    },
                    {
                        key: "11",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '01'
                    },
                    {
                        key: "12",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '01'
                    }, {
                        key: "13",
                        fileName: "HR Document 1",
                        iconSrc: 'sap-icon://pdf-attachment',
                        fileType: ".pdf",
                        uploadedBy: "HAKARAHAN",
                        status: '01'
                    },
                    {
                        key: "14",
                        fileName: "HR Document 2",
                        iconSrc: 'sap-icon://excel-attachment',
                        fileType: ".xls",
                        uploadedBy: "HAKARAHAN",
                        status: '01'
                    },
                    {
                        key: "15",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '01'
                    },
                    {
                        key: "16",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    }, {
                        key: "17",
                        fileName: "HR Document 1",
                        iconSrc: 'sap-icon://pdf-attachment',
                        fileType: ".pdf",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "18",
                        fileName: "HR Document 2",
                        iconSrc: 'sap-icon://excel-attachment',
                        fileType: ".xls",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "19",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "20",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    }, {
                        key: "21",
                        fileName: "HR Document 1",
                        iconSrc: 'sap-icon://pdf-attachment',
                        fileType: ".pdf",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "22",
                        fileName: "HR Document 2",
                        iconSrc: 'sap-icon://excel-attachment',
                        fileType: ".xls",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "23",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "24",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    }, {
                        key: "25",
                        fileName: "HR Document 1",
                        iconSrc: 'sap-icon://pdf-attachment',
                        fileType: ".pdf",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "26",
                        fileName: "HR Document 2",
                        iconSrc: 'sap-icon://excel-attachment',
                        fileType: ".xls",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "27",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "28",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    }, {
                        key: "29",
                        fileName: "HR Document 1",
                        iconSrc: 'sap-icon://pdf-attachment',
                        fileType: ".pdf",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "30",
                        fileName: "HR Document 2",
                        iconSrc: 'sap-icon://excel-attachment',
                        fileType: ".xls",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "31",
                        fileName: "HR Document 3",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                    {
                        key: "32",
                        fileName: "HR Document 4",
                        iconSrc: 'sap-icon://doc-attachment',
                        fileType: ".doc",
                        uploadedBy: "HAKARAHAN",
                        status: '02'
                    },
                ]
            }

        };
    });