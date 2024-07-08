sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/TextArea",
    "sap/ui/unified/DateRange"
], function (Controller, MessageToast, JSONModel, Dialog, Button, Label, TextArea, DateRange) {
    "use strict";

    return Controller.extend("lms.controller.View2", {
        onInit: function () {
            var oLeaveData = this._loadLeaveData();
            var oLeaveModel = new JSONModel(oLeaveData);
            this.getView().setModel(oLeaveModel, "leaveModel");

            var oHolidayData = {
                holidays: [
                    { date: "Mon, 17 Jun 24", description: "RH-Id-ul-Zuha/Bakrid/Id-ul-Ad'ha. RH can be applied 3 working days in advance." },
                    { date: "Sat, 22 Jun 24", description: "RH-Saint Guru Kabir Jayanti. RH can be applied 3 working days in advance." },
                    { date: "Wed, 17 Jul 24", description: "RH-Muharram. RH can be applied 3 working days in advance." },
                    { date: "Thu, 15 Aug 24", description: "CH-Independence Day" },
                    { date: "Mon, 19 Aug 24", description: "RH-Raksha Bandhan. RH can be applied 3 working days in advance." },
                    { date: "Mon, 26 Aug 24", description: "RH-Janmashtami. RH can be applied 3 working days in advance." },
                    { date: "Mon, 16 Sep 24", description: "RH-Id-E-Milad. RH can be applied 3 working days in advance." },
                    { date: "Wed, 02 Oct 24", description: "CH-Mahatma Gandhi Birthday" },
                    { date: "Fri, 11 Oct 24", description: "RH-Maha Navami. RH can be applied 3 working days in advance." },
                    { date: "Sat, 12 Oct 24", description: "CH-Dussehra" },
                    { date: "Thu, 31 Oct 24", description: "CH-Diwali" },
                    { date: "Fri, 01 Nov 24", description: "RH-Govardhan Puja. RH can be applied 3 working days in advance." },
                    { date: "Sun, 03 Nov 24", description: "RH-Bhai Dooj. RH can be applied 3 working days in advance." },
                    { date: "Thu, 07 Nov 24", description: "RH-Chatt Puja. RH can be applied 3 working days in advance." },
                    { date: "Fri, 15 Nov 24", description: "RH-Guru Nanak's Birthday/Kartik Purnima. RH can be applied 3 working days in advance." },
                    { date: "Wed, 25 Dec 24", description: "RH-Christmas Day. RH can be applied 3 working days in advance." }
                ]
            };
            var oHolidayModel = new JSONModel(oHolidayData);
            this.getView().setModel(oHolidayModel, "holidayModel");

            this._highlightSavedLeaveDates(oLeaveData.leave.dates);
        },

        onApplyPress: function () {
            var oCalendar = this.byId("leaveCalendar");
            var aSelectedDates = oCalendar.getSelectedDates();
            
            if (aSelectedDates.length > 0) {
                if (!this._oDialog) {
                    this._oDialog = new Dialog({
                        title: "Leave Reason",
                        content: [
                            new Label({ text: "Reason for Leave", labelFor: "leaveReason" }),
                            new TextArea("leaveReason", {
                                width: "100%",
                                placeholder: "Enter your reason here"
                            })
                        ],
                        beginButton: new Button({
                            text: "Submit",
                            press: function () {
                                var sReason = sap.ui.getCore().byId("leaveReason").getValue();
                                if (sReason) {
                                    this._saveLeaveData(aSelectedDates, sReason);
                                    this._oDialog.close();
                                } else {
                                    MessageToast.show("Please enter a reason");
                                }
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this._oDialog.close();
                            }.bind(this)
                        })
                    });
                    this.getView().addDependent(this._oDialog);
                }
                this._oDialog.open();
            } else {
                MessageToast.show("Please select a date");
            }
        },

        _saveLeaveData: function (aSelectedDates, sReason) {
            var oLeaveModel = this.getView().getModel("leaveModel");
            var oLeaveData = oLeaveModel.getData();

            var aDates = aSelectedDates.map(function (oDateRange) {
                return {
                    startDate: new Date(oDateRange.getStartDate()),
                    endDate: oDateRange.getEndDate() ? new Date(oDateRange.getEndDate()) : null
                };
            });

            oLeaveData.leave.dates.push(...aDates);
            oLeaveData.leave.reason = sReason;

            oLeaveModel.setData(oLeaveData);

            this._highlightLeaveDates(aDates);
            this._saveToLocalStorage(oLeaveData);

            MessageToast.show("Leave applied successfully");
        },

        _highlightLeaveDates: function (aDates) {
            var oCalendar = this.byId("leaveCalendar");
            aDates.forEach(function (oDate) {
                var oDateRange = new DateRange({ startDate: oDate.startDate });
                oCalendar.addSelectedDate(oDateRange);
            });
        },

        _saveToLocalStorage: function (oLeaveData) {
            localStorage.setItem("leaveData", JSON.stringify(oLeaveData));
        },

        _loadLeaveData: function () {
            var sLeaveData = localStorage.getItem("leaveData");
            if (sLeaveData) {
                return JSON.parse(sLeaveData);
            } else {
                return {
                    leave: {
                        dates: [],
                        reason: ""
                    }
                };
            }
        },

        _highlightSavedLeaveDates: function (aDates) {
            var oCalendar = this.byId("leaveCalendar");
            aDates.forEach(function (oDate) {
                var oDateRange = new DateRange({ startDate: new Date(oDate.startDate) });
                oCalendar.addSelectedDate(oDateRange);
            });
        }
    });
});
