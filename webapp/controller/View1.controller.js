sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, MessageToast) {
        "use strict";

        return Controller.extend("demo.pocui5classicrest.controller.View1", {
            onInit: function () {

            },
            onPost: function(){

                var oJSONData = {
                    "IV_SINGLE" : this.byId("sgvalue").getValue(),
                    "IW_STRUCTURE" : {
                        "FIELD01" : this.byId("stvalue01").getValue(),
                        "FIELD02" : this.byId("stvalue02").getValue()
                    },
                    "IT_TABLE" : []
                };

                var oListItems = this.byId("table").getItems();
    
                oListItems.forEach( (oListItem, iIndex) => {
                    
                    var oCells = oListItem.getCells();
    
                    oJSONData.IT_TABLE.push({
                        "FIELD01":oCells[0].getValue(),
                        "FIELD02":oCells[1].getValue()
                    });
    
                });

                this._ajaxPost("/sap/bc/zpocui5test02/ZFM_POC_UI5", oJSONData,
                function(oData){
                    MessageBox.success(JSON.stringify(oData));
                },
                function(oData){
                    MessageBox.error(JSON.stringify(oData));
                });

            },

            _ajaxPost: function(vUrl, oJSONData, 
                fSuccess, fError){

                var myPathWithoutFile = "";

                if (window.location.href.indexOf("hana.ondemand") != -1) {
                    const myPath = window.location.pathname;
                    myPathWithoutFile = myPath.substring(0, myPath.lastIndexOf('/'));
                }

                jQuery.ajax({
                    url:myPathWithoutFile+vUrl,
                    data:JSON.stringify(oJSONData),
                    dataType:"json",
                    type:"post",
                    headers:{
                        "Accept":"application/json",
                        "Content-Type":"application/json"
                    },
                    success: function(oData){
                        fSuccess(oData);
                    },
                    error: function(oData){
                        fError(oData);
                    }
                });

            },

            onAddItem: function(){
                var oTable = this.byId("table");
                oTable.addItem(new sap.m.ColumnListItem({cells: [	new sap.m.Input(), 
                                                                    new sap.m.Input()
                                                                ]
                                                        }));
            },
    
            onToggleDelete: function(oEvent){
    
                var oTable = this.byId("table"),
                oButton = oEvent.getSource();
    
                if(oTable.getMode()===sap.m.ListMode.None){ 
                    oTable.setMode(sap.m.ListMode.Delete);
                    oButton.setText("Disable Delete Mode"); 
                }
                else{
                    oTable.setMode(sap.m.ListMode.None);
                    oButton.setText("Enable Delete Mode"); 
                }
    
            },
    
            onDelete: function(oE){
                var oTable = this.byId("table");
                oTable.removeItem(oE.getParameters().listItem);
            },

            onScanSuccess: function(oEvent) {

                var vScanText = oEvent.getParameter("text");

                if (vScanText) {

                    this.byId("sgvalue").setValue(oEvent.getParameter("text"));

                    this._ajaxPost("/sap/bc/zpocui5test02/ZFM_POC_UI5_BARCODE", 
                    {
                        "IV_BARCODE":vScanText
                    },
                    function(oData){
                        debugger;
                        this.byId("bcCount").setText(oData.ev_count);
                        MessageBox.success(oData.ev_message);
                    }.bind(this),
                    function(oData){
                        MessageBox.error(JSON.stringify(oData));
                    }.bind(this));

                }

			}

        });
    });
