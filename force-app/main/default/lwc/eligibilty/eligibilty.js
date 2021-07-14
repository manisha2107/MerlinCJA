/**
 * Class Name: Eligibility / License (JS)
 * Description : JS Class gather license details
 * Author : Ahad Farooque, Maaz Hasnein, Mohammed Ali & Manisha Kumari
 * Date: 6th April 2020
 * Last Modified By: Manisha Kumari
 * Last Modified Date: 12/02/2021
 */


import { LightningElement, track, api } from 'lwc';

// Importing Apex Methods

import GetAccLicenses from '@salesforce/apex/GetAccLicenses.GetAccLicenses';
import ProgramQuestions from '@salesforce/apex/GetAccLicenses.ProgramQuestions';
import UpdateBusinessLicense from '@salesforce/apex/GetAccLicenses.UpdateBusinessLicense'
import InsertProgramApplication from '@salesforce/apex/GetAccLicenses.InsertProgramApplication'
import ProgramApplication from '@salesforce/schema/Program_Application__c';
import getPickListAccounts from '@salesforce/apex/GetAccLicenses.getPickListAccounts';
import CreateAccConRelation from '@salesforce/apex/GetAccLicenses.CreateAccConRelation';
import getAccConRelation from '@salesforce/apex/GetAccLicenses.getAccConRelation';

// Default Method of the Class
export default class Eligibilty extends LightningElement {


    // Variable to store business licenses    

    @track businesslicenses
    @track parentData
    // Variable to store selected licenses and role
    @track selectedLicense
    @track roleSelected
    @track accRecord;

    // Store Previous License
    @track LicenseFromParent

    // Map to store license and get splitlicense array
    @track mapOfLicenseWithSplitLicense = new Map() // We Will store License and get splitlicense array

    // Variable to show file error if not uploaded
    @track showFileError = false

    // Variable to store array of eligibility table
    @track EligiblityTable = []

    // Variable to store all program questions
    @track allProgramQuestions

    // Variable to see if it's loaded
    @track Loaded = false

    
    // Store splitLicenses
    @track SplitLicenses

    @track ProvincesSelected = []
    // Array to define list of license table

    @track tableResponsive="TabRes"
    //used in making table responsive using dynamic css



    @track TotalIncomeTableNotFilled=false
    
    @track columns = [

        { label: 'Licenses Type', fieldName: 'LicensesTypeSplit' },
        { label: 'Total Annual Earning', fieldName: 'TotalAnnualEarning' },
        { label: 'Percentage Of Total Income', fieldName: 'PercentageOfTotalIncome' },

    ];

    // Variable to store province

    get Province() {
        return [
            { label: 'Alberta', value: 'Alberta' },
            { label: 'British Columbia', value: 'British Columbia' },
            { label: 'Manitoba', value: 'Manitoba' },
            { label: 'New Brunswick', value: 'New Brunswick' },
            { label: 'Newfoundland and Labrador', value: 'Newfoundland and Labrador' },
            { label: 'Ontario', value: 'Ontario' },
            { label: 'Northwest Territories', value: 'Northwest Territories' },
            { label: 'Nunavut', value: 'Nunavut' },
            { label: 'Nova Scotia', value: 'Nova Scotia' },
            { label: 'Prince Edward Island', value: 'Prince Edward Island' },
            { label: 'Quebec', value: 'Quebec' },
            { label: 'Saskatchewan', value: 'Saskatchewan' },
            { label: 'Yukon', value: 'Yukon' }
        ];
    }

    // Variable to store list of license Types and Map of License

    @track listOfLicnseTypes
    @track mapOfLicense = new Map()


    /**
     * ChildFunction will be called from Parent Navigation
     * It is get accountRecord and Split License Table
     * Get Corporation Licenses of Sponsored Program
     */

    // @api childFunction(accountRecord, splitlicenses) {


    //     console.log('Eligibility  running')
    //     console.log('splitlicenses in Eligibi' + JSON.stringify(splitlicenses))
    //     //console.log('parentdata ====> ' + parentdata)
    //     //this.parentData = parentdata

    //     this.accRecord = accountRecord;


    //    try {
    //     this.selectedLicense = accountRecord.Applicable_License__r.Licenses_Type__c
    //     this.LicenseFromParent = accountRecord.Applicable_License__r.Licenses_Type__c
    //     this.roleSelected = accountRecord.Applicable_License__r.Role__c
    //    } catch (error) {
    //        console.log('yo')
    //    }


    //     this.setMapofSplitLicenses(splitlicenses);
    //     this.getSponsoredAccLicenses();

    //     console.log('Data from parent==>>' + JSON.stringify(this.accRecord))
    //     console.log('this Split Licenses' + JSON.stringify(this.SplitLicenses))
    //     console.log('Role FROM PARENT' + this.roleSelected)





    // }

    @api childFunction(parentdata,splitlicenses){
        console.log('Buisness License Running')
        console.log('Data from Parent ==> '+JSON.stringify(parentdata))
        console.log('Table Data From parent ==> '+JSON.stringify(splitlicenses))
        

        /**
         * splitlicenses will have:
         *  1- Percentage_Of_Total_Income__c  40
         *  2- Total_Annual_Earning__c  9000
         *  3- Provincial_Jurisdiction__c   ("Manitoba,New Brunswick,Newfoundland and Labrador")
         *  4- Name  ("Licensed Life Insurance and/or Accident and Sickness Insurance Agent (LLQP)")
         * 
         * 
         * ParentData will be 
         *  1- role  ("Licensed Advisor")
         *  2- License ("Licensed Life Insurance and/or Accident and Sickness Insurance Agent (LLQP)")
         *  3- accRecord 
         * eg=> {
                "role":"Licensed Advisor",
                "License":"Licensed Life Insurance and/or Accident and Sickness Insurance Agent (LLQP)",
                "accRecord":{
                    "Id":"001f000001dHYiUAAW",
                    "Name":"Maaz Hasnain",
                    "PersonContactID__c":"003f000001WePgKAAV",
                    "Application_Current_Stage__c":"Personal Information",
                    "HiddenAccount__c":"001f000001XEywRAAT",
                    "FirstName":"Maaz",
                    "LastName":"Hasnain",
                    "Brokerage_Account__c":"001f000001XTBsNAAX",
                    "Broker_Contact__c":"003f000001TxwLpAAJ",
                    "Applicable_License__c":"0cEf00000004C93EAE",
                    "BillingCity":"Toronto",
                    "Suit__c":"23",
                    "BillingCountry":"Canada",
                    "BillingState":"Ontario",
                    "BillingStreet":"654 Joseph Street",
                    "BillingPostalCode":"NFP 098",
                    "Phone":"+1(23322249)",
                    "PersonEmail":"maaz@cloudjunction.cloud",
                    "Assigned_License__c":"0cEf00000004C93EAE",
                    "HiddenAccount__r":{
                        "Name":"Mackie Financial Services Inc.",
                        "OwnerId":"0056g000002jWvgAAE",
                        "Id":"001f000001XEywRAAT"
                    },
                    "Brokerage_Account__r":{
                        "Name":"BFL CANADA Risk & Insurance Services Inc.",
                        "Id":"001f000001XTBsNAAX"
                    },
                    "Broker_Contact__r":{
                        "Name":"Andrea Falcioni-Drew",
                        "Id":"003f000001TxwLpAAJ"
                    },
                    "Applicable_License__r":{
                        "Role__c":"Licensed Advisor",
                        "Licenses_Type__c":"Licensed Life Insurance and/or Accident and Sickness Insurance Agent (LLQP)",
                        "Id":"0cEf00000004C93EAE"
                    }
                }
                }
         * 
         */
        try {
            this.parentData = parentdata
            this.accRecord = parentdata
            this.selectedLicense = parentdata.Applicable_License__r.Licenses_Type__c
            this.LicenseFromParent = parentdata.Applicable_License__r.Licenses_Type__c
            this.roleSelected = parentdata.Applicable_License__r.Role__c
        } catch (error) {
            console.log('error in ELIGIBILITY while assigning values from parent' + error)
        }

        if(splitlicenses){
            this.SplitLicenses =splitlicenses
            console.log('splitlicenses in Eligibi2' +JSON.stringify(this.SplitLicenses))
            console.log("SPLIT LICENSESSSSS:::>>1"+JSON.stringify(splitlicenses))
                for(let i=0; i<splitlicenses.length;i++){        
                    console.log('IN LOOOP to populate map ' , splitlicenses , ' length ' + splitlicenses.length)
                    if(!this.mapOfLicenseWithSplitLicense.has(splitlicenses[i].Name)){
                       this.mapOfLicenseWithSplitLicense.set(splitlicenses[i].Name,{
                          'LicensesTypeSplit': splitlicenses[i].Name.replaceAll(';','\n'),
                          'TotalAnnualEarning':splitlicenses[i].Total_Annual_Earning__c,
                          'PercentageOfTotalIncome':splitlicenses[i].Percentage_Of_Total_Income__c+"%",
                          'Id':i
                    })
                    }
                //    this.SplitedPercentage =this.SplitLicenses[i].PercentageOfTotalIncome.split('%')
                //    this.SplitedPercentage =this.SplitLicenses[i].PercentageOfTotalIncome[0]
                    console.log("TESTT 1"+JSON.stringify(this.mapOfLicenseWithSplitLicense.get(splitlicenses[i].Name)))
                 }
                 try {
                    this.ProvincesSelected = splitlicenses[0].Provincial_Jurisdiction__c.split(';')
                    
                 } catch (error) {
                    this.ProvincesSelected = []
                 }
                 console.log('ProvincesSelected === ' +this.ProvincesSelected )
        console.log('this.ProvincesSelected from parent ' +this.ProvincesSelected)
        }


        // If We dont already have licenses we will query from database
        // otherwise we will just show the previous licenses
        console.log('parentdata.accRecord ', JSON.stringify(this.parentData))
        if(!this.businesslicenses){
            GetAccLicenses({accountId: this.parentData.HiddenAccount__c})
            .then(Businessresult =>{
                try {
                    this.businesslicenses = Businessresult;
                    console.log('this.businesslicenses ' + JSON.stringify(this.businesslicenses))
                    this.AssignTypeOfLicences(Businessresult);
                } catch (error) {
                    console.log('ERROR in Getting acc license ' + error)
                }
            })
                .catch(BusinessError => {
                console.log('BusinessResult is null' + BusinessError);
            })
        }
        else{
            this.AssignTypeOfLicences(this.businesslicenses);
        }
        

    }//End of ChildFunction
     
    /**
     * set Map of Split Licenses from the data retrieved from Parent Navigation
     * 
     */

    setMapofSplitLicenses(splitlicenses) {

        if (splitlicenses) {
            this.SplitLicenses = splitlicenses
            console.log('splitlicenses in Eligibi2' + JSON.stringify(this.SplitLicenses))
            console.log("SPLIT LICENSESSSSS:::>>1" + JSON.stringify(splitlicenses))

            for (let i = 0; i < splitlicenses.length; i++) {

                console.log('IN LOOOP to populate map ', splitlicenses, ' length' + splitlicenses.length)
                if (!this.mapOfLicenseWithSplitLicense.has(splitlicenses[i].Name)) {
                    this.mapOfLicenseWithSplitLicense.set(splitlicenses[i].Name, {
                        'LicensesTypeSplit': splitlicenses[i].Name.replaceAll(';', '\n'),
                        'TotalAnnualEarning': splitlicenses[i].Total_Annual_Earning__c,
                        'PercentageOfTotalIncome': splitlicenses[i].Percentage_Of_Total_Income__c+"%",
                        'Id': i
                    })
                }
                console.log("TESTT 1" + JSON.stringify(this.mapOfLicenseWithSplitLicense.get(splitlicenses[i].Name)))
                //this.SplitLicenses.push(this.mapOfLicenseWithSplitLicense.get(splitlicenses[i].Name))
            }

            try {
                let arr= []
                let temp
                temp = splitlicenses[0].Provincial_Jurisdiction__c.split(';')
                console.log('TEMP ' + temp)
                for(let i=0; i <temp.length; i++){
                    arr.push(temp[i])
                }
                this.ProvincesSelected = arr
                console.log('ProvincesSelected === ' + this.ProvincesSelected)

            } catch (error) {
                this.ProvincesSelected = []
            }
            console.log('this.ProvincesSelected from parent ' + this.ProvincesSelected)
        }
    }


    /**
     * Method to call apex method to retrieve corporation licenses
     * 
     */

    getSponsoredAccLicenses() {

        GetAccLicenses({ accountId: this.accRecord.HiddenAccount__c })
            .then(Businessresult => {
                this.businesslicenses = Businessresult;
                console.log('this.businesslicenses ' + JSON.stringify(this.businesslicenses))

                this.AssignTypeOfLicences(Businessresult);

            })
            .catch(BusinessError => {
                console.log('BusinessResult is null' + BusinessError);
            })
    }

    /**
     * Method to assign type of licenses
     * 
     */

    // AssignTypeOfLicences(Businessresult) {

    //     console.log('Making a list for licenses.  ' + JSON.stringify(Businessresult));

    //     let mapOfLicense = new Map();

    //     let tempMapOfLicense = new Map();
    //     let listOfLicenses = []
    //     for (let i = 0; i < Businessresult.length; i++) {
    //         mapOfLicense.set(
    //             Businessresult[i].Licenses_Type__c + ' - ' + Businessresult[i].Role__c,
    //             Businessresult[i].Id
    //         )
    //         tempMapOfLicense.set(
    //             Businessresult[i].Licenses_Type__c,
    //             Businessresult[i].Id
    //         )
    //     }
    //     var mapIter = tempMapOfLicense.keys();
    //     console.log(' LicenseFromParent ' + this.LicenseFromParent)
    //     for (let i = 0; i < tempMapOfLicense.size; i++) {
    //         let val = mapIter.next().value
    //         if (this.LicenseFromParent == val) {
    //             var tempVal = {
    //                 label: val.replaceAll(';', '\n'),
    //                 value: val,
    //                 checked: true
    //             }
    //         }
    //         else {
    //             var tempVal = {
    //                 label: val.replaceAll(';', '\n'),
    //                 value: val,
    //                 checked: false
    //             }
    //         }
    //         listOfLicenses.push(tempVal)
    //     }
    //     this.Loaded = true
    //     this.mapOfLicense = mapOfLicense;
    //     this.listOfLicnseTypes = listOfLicenses

    //     console.log('listOfLicenses ' + JSON.stringify(this.listOfLicnseTypes))
    //     console.log(this.mapOfLicense)
    //     if (this.roleSelected) {
    //         console.log('PARENT ROLE --> ' + this.roleSelected)
    //         let e = { target: { value: this.selectedLicense } }
    //         console.log('E mock' + JSON.stringify(e))
    //         this.onChangeOfLicense(e)
    //     }

    // }
    AssignTypeOfLicences(Businessresult){

        console.log('Making a list for licenses.  '+JSON.stringify(Businessresult));
        
        let mapOfLicense= new Map();
        
        let tempMapOfLicense= new Map();
        let listOfLicenses =[]
        for(let i=0 ; i<Businessresult.length ; i++){
            mapOfLicense.set(
                Businessresult[i].Licenses_Type__c +' - '+ Businessresult[i].Role__c, 
                Businessresult[i].Id
            )
            tempMapOfLicense.set(
                Businessresult[i].Licenses_Type__c , 
                Businessresult[i].Id
            )
        }
        var mapIter = tempMapOfLicense.keys();
        console.log(' LicenseFromParent '+this.LicenseFromParent)
        for(let i=0; i <tempMapOfLicense.size;i++ ){
            let val = mapIter.next().value
            if(this.LicenseFromParent ==val){
                var tempVal = {
                    label:val.replaceAll(';','\n'),
                    value:val,
                    checked:true
                }
            }
            else{
                var tempVal = {
                    label:val.replaceAll(';','\n'),
                    value:val,
                    checked:false
                }
            }
            listOfLicenses.push(tempVal)
        }
        this.Loaded = true
        this.mapOfLicense= mapOfLicense;
        this.listOfLicnseTypes = listOfLicenses
        
        console.log('listOfLicenses ' + JSON.stringify(this.listOfLicnseTypes))
        console.log(this.mapOfLicense)
        if(this.roleSelected){
            console.log('PARENT ROLE --> ' +this.roleSelected)
            let e = {target:{value:this.selectedLicense, source: 'ParentNav'}}
            console.log('E mock' + JSON.stringify(e))
            this.onChangeOfLicense(e)
        }
        
        }//end of AssignTypeOfLicences
 
        
    @track listOfRoles
    @track showFileQuestion = true
    onChangeOfLicense(e) {
        console.log('License selected ' + e.target.value)
        this.selectedLicense = e.target.value
        console.log('this.selectedLicense  in selected license ' + this.selectedLicense )
        this.showQuestions = false
   
        console.log('this.parentData is ' +JSON.stringify(this.parentData))
        try{
            if(this.selectedLicense == this.parentData.Applicable_License__r.Licenses_Type__c){
                this.roleSelected = this.parentData.Applicable_License__r.Role__c
            }
            else{
                this.roleSelected = ''
            }
        }
        catch(e){
            this.roleSelected = ''
        }
        console.log('Role selected ' + this.roleSelected)

        for (let i = 0; i < this.listOfLicnseTypes.length; i++) {
            if (this.selectedLicense == this.listOfLicnseTypes[i].value) {
                this.listOfLicnseTypes[i].checked = true
               
            }
            else {
                this.listOfLicnseTypes[i].checked = false
            }
        }
        console.log('this.listOfLicnseTypes  ' +this.listOfLicnseTypes)
        //   this.roleSelected = null
        this.showQuestions = false
        this.SplitLicenses = []
        // this.roleSelected = ''
        // console.log('Selected license ==> ' + this.selectedLicense)
        let roles = []
        let arrayToIterate = this.businesslicenses

        console.log('arrayToIterate ' + arrayToIterate)
        for (let i = 0; i < arrayToIterate.length; i++) {

            if (arrayToIterate[i].Licenses_Type__c == this.selectedLicense) {
                //    console.log('arrayToIterate[i] matches selected license' + arrayToIterate[i].Licenses_Type__c)
                if (this.roleSelected == '' || this.roleSelected == null || this.roleSelected == undefined) {
                    var roleOpt = {
                        label: arrayToIterate[i].Role__c,
                        value: arrayToIterate[i].Role__c,
                        checked: false
                    }
                }
                else {
                    if (this.roleSelected == arrayToIterate[i].Role__c) {

                        var roleOpt = {
                            label: arrayToIterate[i].Role__c,
                            value: arrayToIterate[i].Role__c,
                            checked: true
                        }
                    }
                    else {
                        var roleOpt = {
                            label: arrayToIterate[i].Role__c,
                            value: arrayToIterate[i].Role__c,
                            checked: false
                        }
                    }
                }
                roles.push(roleOpt)
            }
        }

        this.listOfRoles = roles;
        

        
        console.log('List of Roles ' +this.listOfRoles)
        if (this.roleSelected) {
            let e = { target: { value: this.roleSelected } }
            console.log('ROLE SELECTED CALLED FROM LICENSE FUNCTION')
            this.roleSelectedFunction(e)
        }
        else{
            this.splitLicenseFunction(this.SplitLicenses)
        }
    }



    get ansoptions() {
        return [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
        ];
    }

    @track showQuestions = true


    
    roleSelectedFunction(e) {
        this.roleSelected = e.target.value
        this.questionsAnswered = []

        console.log('Selected Role roleSelectedFunction: ' + e.target.value)
        console.log('Selected LICENSE roleSelectedFunction: ' + e.target.value)
        console.log('PPARENT LICENSE WAS ' + this.LicenseFromParent)
        console.log('VALUE FROM MAP ' + this.mapOfLicense.get(this.selectedLicense + ' - ' + this.roleSelected))
        this.showFileQuestion = true

        let splitLicenseCheck
        console.log('Hidden Account Id == ' + this.accRecord.HiddenAccount__c)
        if (e.target.value == 'Licensed Assistant') {
            try {
                if(this.accRecord.Applicable_License__r.Role__c && this.accRecord.Applicable_License__r.Role__c =='Licensed Assistant'){
                    console.log('In if of Try this.accRecord.role && this.accRecord.role ==Licensed Assistant')
                    this.showQuestions = false
                    this.showFileQuestion = false
                    console.log('this.allProgramQuestions ' +this.allProgramQuestions)
                }
                else{
                    console.log('In Else of Try this.accRecord.role && this.accRecord.role ==Licensed Assistant')
                    this.showQuestions = true
                    this.showFileQuestion = false
                    console.log('this.allProgramQuestions ' +this.allProgramQuestions)
                }
            } catch (error) {
                    console.log('In Catch this.accRecord.role && this.accRecord.role ==Licensed Assistant')
                    this.showQuestions = true
                    this.showFileQuestion = false
                    console.log('this.allProgramQuestions ' + JSON.stringify(error))
                
            }
            
            //QUERY DATA IF ITS NOT THERE 

            if (!this.allProgramQuestions && this.showQuestions) {
                ProgramQuestions({ accountId: this.accRecord.HiddenAccount__c, Type: this.selectedLicense })
                    .then(QuestionResult => {
                        this.allProgramQuestions = QuestionResult;
                        console.log('All Program Questions are : ' + JSON.stringify(this.allProgramQuestions));
                    })
                    .catch(QuestionResultError => {
                        console.log('Question Result Error  ' + QuestionResultError);
                    })
            }
            else{
                console.log('ALREADY HAVE QUESTION')
            }

        }
        else if (e.target.value == 'Licensed Advisor' ) {
            console.log('in else if Licensed Advisor ')
            try {
                
                if(this.accRecord.Applicable_License__r.Role__c && this.accRecord.Applicable_License__r.Role__c == 'Licensed Advisor'){
                    console.log('in else if of try this.accRecord.role && this.accRecord.role == Licensed Advisor')
                    this.showFileQuestion = false
                    this.showQuestions = false
                }
                else{
                    console.log('in else  of try this.accRecord.role && this.accRecord.role == Licensed Advisor')
                    
                    this.showFileQuestion = true
                    this.showQuestions = false
                }               
            } catch (error) {
                console.log('in catch this.accRecord.role && this.accRecord.role == Licensed Advisor')
                    
                this.showFileQuestion = true
                this.showQuestions = false
            }
        }

        
        this.splitLicenseFunction(this.SplitLicenses)


    }

    splitLicenseFunction(splitLicenseCheck={}){
        console.log('splitLicenseCheck ' + splitLicenseCheck)
        if (splitLicenseCheck == null || splitLicenseCheck == undefined || splitLicenseCheck == '') {
            console.log('POPULATING SplitLicenses')
            let tempVar = this.selectedLicense.split(';')
            console.log('tempVar is ' + tempVar)
            this.SplitLicenses = []
            for (let i = 0; i < tempVar.length; i++) {
                console.log(this.mapOfLicenseWithSplitLicense.has(tempVar[i]))
                if (!this.mapOfLicenseWithSplitLicense.has(tempVar[i])) {
                    console.log('tempVar[i] is ' + i + ' ' + tempVar[i])
                    this.mapOfLicenseWithSplitLicense.set(tempVar[i], {
                        'LicensesTypeSplit': tempVar[i].replaceAll(';', '\n'),
                        'TotalAnnualEarning': '',
                        'PercentageOfTotalIncome': '',
                        'Id': i

                    })
                    console.log(this.mapOfLicenseWithSplitLicense.get(tempVar[i]))
                }
                this.SplitLicenses.push(this.mapOfLicenseWithSplitLicense.get(tempVar[i]))


            }
            //Eligiliblity table MAAZ  10/feb/2021

            this.EligiblityTable = [

                {
                    label: 'Licenses Type',
                    fieldName: 'LicensesTypeSplit',
                    type: 'text',
                    maxColumnWidth: '500px',
                    sortable: true,
                },
                {
                    label: 'Total Annual Earning',
                    fieldName: 'TotalAnnualEarning',
                    type: 'currency',
                    sortable: true,
                    editable: true
                },
                {
                    label: 'Percentage Of Total Income',
                    fieldName: 'PercentageOfTotalIncome',
                    type: 'percent',
                    editable: true,
                    sortable: true
                }
            ];
            console.log("table for elig::>>" + JSON.stringify(this.SplitLicenses))
            //Eligiliblity table MAAZ  10/feb/2021




        }
    }
    @track TableRow
    // Handle save for eleig data table: MAAZ 9/2/2021
    handleSave(e) {
        console.log("Hello world:: " + JSON.stringify(e.detail.draftValues))
        this.TableRow = e.detail.draftValues

        for (let i = 0; i < this.TableRow.length; i++) {

            console.log("TABLE ROW:: " + JSON.stringify(this.TableRow))
            let row = this.TableRow[i].id.split('-')
            console.log("TABLE ROW DASHHHH:: " + JSON.stringify(row))
            row = row[1]
            console.log("TABLE ID OF ELIG===>> " + row)
            if (e.detail.draftValues[i].TotalAnnualEarning) {
                this.SplitLicenses[row].TotalAnnualEarning = e.detail.draftValues[i].TotalAnnualEarning
                console.log('Final Total Anual Earnings are:: ' + JSON.stringify(this.SplitLicenses[row].TotalAnnualEarning))

            }
            if (e.detail.draftValues[i].PercentageOfTotalIncome) {
                this.SplitLicenses[row].PercentageOfTotalIncome = e.detail.draftValues[i].PercentageOfTotalIncome
                console.log('Final Percentage Total Incomes are:: ' + JSON.stringify(this.SplitLicenses[row].PercentageOfTotalIncome))

            }

        }


    }
    // Handle save for eleig data table: MAAZ 9/2/2021


    @track questionsAnswered = []

    /*
    [
        {
            "questionId":"a0Yf00000048iPEEAY",
            "ansByUser":"Yes",
            "correctAns":"Yes"
        },
        {
            "questionId":"a0Yf00000048iPJEAY",
            "ansByUser":"Yes",
            "correctAns":"Yes"
        },
        {
            "questionId":"a0Yf00000048iPOEAY",
            "ansByUser":"Yes",
            "correctAns":"Yes"
        },
        {
            "questionId":"a0Yf00000048iPTEAY",
            "ansByUser":"Yes",
            "correctAns":"Yes"
        }
        ]
    */
    @track mapOfQuestionsAndAnswers = new Map()
    ansSelected(e) {

        console.log('ANS SELECTED ')
        try {
            let variable = e.target.id.split('-')
            let inserted = true
            console.log(variable)
            for (let i = 0; i < this.questionsAnswered.length; i++) {
                if (this.questionsAnswered[i].questionId == variable[0]) {
                    this.questionsAnswered[i] = {
                        questionId: variable[0],
                        ansByUser: e.target.value,
                        correctAns: this.getCorrectAns(variable[0])
                    }
                    inserted = false
                }
            }
            console.log('questionsAnswered Array before insert ==> ' + JSON.stringify(this.questionsAnswered))


            if (inserted) {
                this.questionsAnswered.push({
                    questionId: variable[0],
                    ansByUser: e.target.value,
                    correctAns: this.getCorrectAns(variable[0])
                })
            }
            console.log('questionsAnswered Array after insert ==> ' + JSON.stringify(this.questionsAnswered))


        } catch (error) {
            console.log('error on ans selected ' + JSON.stringify(error))
        }

        console.log('Map value ==> ' + this.mapOfQuestionsAndAnswers.get(variable[0]))
        console.log('Questions and answer array--> ' + JSON.stringify(this.questionsAnswered))

    }

    getUploadButBoolean(event) {

        this.HasUploded = event.detail.uploadcomp
        console.log('CHILD COMPONENT VALUES::::' + JSON.stringify(this.HasUploded))

    }

    //Takes in the Id of program question then
    //iterates over the Program questions 
    //and returns the correct answer
    getCorrectAns(id) {
        console.log('Id recieved in getCorrectAns is--> ' + id)
        let temp = this.allProgramQuestions
        // console.log(' getCorrectAns temp == ' +JSON.stringify(temp))
        for (let i = 0; i < temp.length; i++) {

            if (temp[i].Id == id) {

                return temp[i].Correct_Answer__c
            }
        }
    }


    @track fileUpload
    licensedAdvisor(e) {
        if (e.target.value == 'Yes') {
            this.fileUpload = true
        }
        else {
            this.fileUpload = false
        }
        console.log('Show file upload?/ ' + this.fileUpload)
    }






    TotalAnnualEarningFUNC(event) {
        // console.log('ANUAL EARNING')
        let idRec = event.target.dataset.id;
        console.log('id=== ' + idRec)
        // if(event.target.value=="" || this.SplitLicenses[idRec]==""){
        //     this.TotalIncomeTableNotFilled=true
        //     console.log("TABLE ERROR::"+ this.TotalIncomeTableNotFilled)
        // }
        
        let ValueRec = event.target.value
        console.log('ANUAL EARNING')
        
        var res = idRec.split("-");
        console.log('ValueRec ' + ValueRec)

        this.SplitLicenses[idRec].TotalAnnualEarning = ValueRec
        console.log('TotalAnnualEarning     Id=====>' + idRec)
        console.log('TotalAnnualEarning   Value=====>' + ValueRec)
        console.log('row Data == > ' + JSON.stringify(this.SplitLicenses[idRec]))
        console.log('Provinces ' + JSON.stringify(this.ProvincesSelected))
    }

    PercentageOfTotalIncomeFUNC(event) {
        console.log("EVENT HAS CALLED:: "+event.target.value)
         ValueRec = event.target.value
        ValueRec= ValueRec.split("%")
        ValueRec=ValueRec[0]
        console.log("EVENT HAS CALLED PREVIOUS:: "+ValueRec)
        this.ValueRecEvent=ValueRec[0]
        console.log('PERCENTAGE ::>>>'+this.ValueRecEvent)
       
        let idRec = event.target.dataset.id;
        if (ValueRec > 100) {
            console.log('add ERROR')
        }
        console.log('id=== ' + idRec)
        var res = idRec.split("-");
        console.log('PercentageOfTotalIncome     Id=====>' + res[0])
        console.log('PercentageOfTotalIncome   Value=====>' + ValueRec)
        this.SplitLicenses[res[0]].PercentageOfTotalIncome = ValueRec
        console.log('row Data == > ' + JSON.stringify(this.SplitLicenses[res[0]]))
        console.log('Provinces ' + JSON.stringify(this.ProvincesSelected))

        event.target.value+"%"
    }
     OnBlurOfPercentageIncome(event){
         
        console.log("EVENT HAS CALLED BLUR:: "+event.target.value)
        let ValueRec = event.target.value
        ValueRec= ValueRec.split("%")
        ValueRec=ValueRec[0]
        console.log("EVENT HAS CALLED PREVIOUS BLUR:: "+ValueRec)
        this.ValueRecEvent=ValueRec[0]
        console.log('PERCENTAGE ::>>>'+this.ValueRecEvent)
       
        let idRec = event.target.dataset.id;
        if (ValueRec > 100) {
            console.log('add ERROR BLUR')
        }
        console.log('id=== ' + idRec)
        var res = idRec.split("-");
        console.log('PercentageOfTotalIncome BLUR    Id=====>' + res[0])
        console.log('PercentageOfTotalIncome   Value=====>' + ValueRec)
        this.SplitLicenses[res[0]].PercentageOfTotalIncome = ValueRec
        this.SplitLicenses[res[0]].PercentageOfTotalIncome.split("%")
        this.SplitLicenses[res[0]].PercentageOfTotalIncome= this.SplitLicenses[res[0]].PercentageOfTotalIncome+"%"
        event.target.value=this.SplitLicenses[res[0]].PercentageOfTotalIncome
        console.log("ON BLURR RUNNING BLUR::"+event.target.value)
    }


    
    HandleMultiPicklistValChange(e) {
        this.ProvincesSelected = e.detail.value;
        console.log('PROVINCES ' + this.ProvincesSelected)
        this.ProvincesSelected.replaceAll(',', ';')
        // let idRec = e.target.id

        // var res = idRec.split("-");
        // this.SplitLicenses[res[0]].ProvincialJurisdictions = this.ProvincesSelected
        // console.log('Provinces: ' +this.ProvincesSelected )

    }


    getProvinces(arrayOfProvinces) {
        let provinces = '';
        // [a,b,c,d] > a;b;c;d
        console.log('Provinces recieved' + arrayOfProvinces)
        for (let i = 0; i < arrayOfProvinces.length; i++) {
            provinces = provinces + arrayOfProvinces[i]
            if (i < arrayOfProvinces.length - 1) {
                provinces = provinces + ';'
            }
        }
        console.log('returns ' + provinces)
        return provinces
    }
    // SaveTableData(){
    //     if(this.checkIfError()){

    //     console.log('SAVE DATA RUNNING')
    //     let BusinessLicensArray = []

    //     //Program Application Insert Values



    //     for(let i =0; i < this.SplitLicenses.length;i++){
    //         console.log('loop for SPLIT LICENSES')
    //         console.log(' LICENSE ID ' +this.mapOfLicense.get(this.selectedLicense+' - '+this.roleSelected ))
    //         BusinessLicensArray.push({
    //             AccountId: this.parentData.accRecord.Id,
    //             Percentage_Of_Total_Income__c : this.SplitLicenses[i].PercentageOfTotalIncome,
    //             Total_Annual_Earning__c: this.SplitLicenses[i].TotalAnnualEarning,
    //             // Provincial_Jurisdiction__c :  this.getProvinces() ,
    //             Name : this.SplitLicenses[i].LicensesTypeSplit,
    //             Role__c:this.roleSelected,
    //             EID__c: this.roleSelected +'-'+ this.SplitLicenses[i].LicensesTypeSplit
    //         })
    //     }

    //     console.log('LiscenseValueToBeEdit ' + JSON.stringify(BusinessLicensArray))


    //     let quesArray = []
    //     let ansByUser = []
    //     let correctAns = []
    //     let Status= 'Approved'
    //     if(this.questionsAnswered){
    //         for(let i =0; i < this.questionsAnswered.length ;i++){
    //             quesArray[i] = this.questionsAnswered[i].questionId
    //             ansByUser[i] = this.questionsAnswered[i].ansByUser
    //             correctAns[i]=this.questionsAnswered[i].correctAns
    //             if(ansByUser[i] != correctAns[i]){
    //                 Status ='Approved with condition'
    //             }
    //         }
    //     }
    //     console.log('quesArray ' +quesArray)
    //     let TempObj = ProgramApplication
    //     TempObj = {
    //         NameField: this.parentData.accRecord.Name +' ' + this.roleSelected,
    //         // Brokerage_Account__c: this.parentData.accRecord.Brokerage_Account__c,
    //         // Broker_Contact__c: this.parentData.accRecord.Broker_Contact__c,
    //         // Status__c: Status,
    //         // Account__c: this.parentData.accRecord.Id,

    //     }

    //     // const recordInput = {
    //     //     apiName: ProgramApplication.objectApiName,
    //     //     fields: {
    //     //         [NameField.fieldApiName] : 'ACME',
    //     //         [RecordType.fieldApiName]:'012f0000000foonAAA'
    //     //     }
    //     // };
    //     console.log('Ans by userv '+ansByUser)
    //     console.log('corr ans '+correctAns)
    //     let qualify = true
    //     for(let i =0;i<ansByUser.length; i++ ){
    //         if(ansByUser[i] !=correctAns[i]){
    //             qualify=false;
    //         }
    //     }
    //     console.log('QUALIFIED? ' + qualify)
    //     let ApplicableLicense = this.mapOfLicense.get(this.selectedLicense+' - '+this.roleSelected )
    //     let AssignedLicense = this.mapOfLicense.get(this.selectedLicense+' - '+this.roleSelected )

    //     if(!qualify){
    //         AssignedLicense = this.mapOfLicense.get(this.selectedLicense+' - '+'Licensed Advisor' )
    //     }
    //     console.log('Assigned license is ==> '+AssignedLicense)
    //     console.log('Applicable license is ==> '+ApplicableLicense)


    //     UpdateBusinessLicense({
    //         BusinessLicensArray:BusinessLicensArray ,
    //         Id:this.parentData.accRecord.Id, 
    //         ApplicableLicense, 
    //         AssignedLicense})
    //     .then(result=>{
    //         console.log('Results From BUSINESS LICENSE '+result)
    //     }).catch(error=> {
    //         console.log(JSON.stringify(error))
    //     })

    //     // let recordInput = {
    //     //     apiName: 'Program_Application__c',

    //     //     fields: {
    //     //         Name: 'Universal Containers'
    //     //     }
    //     //  }
    //     // createRecord(recordInput)
    //     //     .then(result => {
    //     //         // code to execute if create operation is successful
    //     //         console.log('Program application created ' + result)
    //     //     })
    //     //     .catch(error => {
    //     //         // code to execute if create operation is not successful
    //     //         console.log('Error in creating ProgApp ' + JSON.stringify(error))
    //     //     });
    //     if(quesArray.length >0){

    //     InsertProgramApplication({
    //         Name: this.parentData.accRecord.Name +' ' + this.roleSelected,
    //         BrokerageAccount: this.parentData.accRecord.Brokerage_Account__c,
    //         Broker: this.parentData.accRecord.Broker_Contact__c,
    //         Status: Status,
    //         Account: this.parentData.accRecord.Id,
    //         quesArray:quesArray,
    //         ansByUser:ansByUser,
    //         correctAns:correctAns,
    //         Business_License__c:AssignedLicense,

    //         // obj:recordInput

    //     }).then(result=>{
    //         console.log('INSERT PROGRAM APPLICATION RESULTS ' +result)
    //     }).catch(error =>{
    //         console.log('Error PROGRAM APPLICATION RESULTS ' + JSON.stringify(error))
    //     })

    //     }
    //     this.parentData.accRecord.Applicable_License__c = ApplicableLicense
    //     this.parentData.accRecord.Assigned_License__c = AssignedLicense

    //     const evt= new CustomEvent('mysecondevent', {detail:{childcompname:'Suspended',childcompdescription:this.childcompdescription, role: this.roleSelected, account:this.parentData.accRecord ,SelectedLicence: this.selectedLicense,splitlicenses:this.SplitLicenses }});
    //     this.dispatchEvent(evt);
    //     }

    // }
    //New Code for Upload button conditions--===============


    queryTerm;
    queryTerm2;

    @track pills = []
    @track pills2 = []

    handleItemRemove(e) {
        let index = e.detail.item.indexTerm;
        let index2 = e.detail.index
        console.log('index is' + JSON.stringify(index))
        console.log('index2 is' + JSON.stringify(index2))
        //console.log('PILL LIST was' + JSON.stringify(this.pills))



        try {
            if(this.queryTerm ){
                console.log('qryTerm was' + JSON.stringify(this.queryTerm))
                var temp = this.queryTerm
                this.queryTerm = []
                console.log('qryTerm was' + JSON.stringify(temp))
    
                console.log('----')
                console.log('----')
                console.log('----')
                console.log('Before ' + JSON.stringify(temp[index]))
    
                temp[index].show = true
                console.log('After ' + JSON.stringify(temp[index]))
    
    
                this.queryTerm = temp
                console.log('qryTerm is' + JSON.stringify(this.queryTerm))
                this.pills.splice(index2, 1)
            }
            else{
                console.log('in ELSE OF REMOVE ITEM FROM PILL ' +index)
                this.pills.splice(index2, 1)
            }
        } catch (error) {
            console.log('error  ' +JSON.stringify(error))
        }

        
        console.log('PILL LIST is' + JSON.stringify(this.pills))
        // var temp = this.pills.splice(index, 1);
        // console.log(JSON.stringify(temp))
        // this.pills = []
        // this.items = temp;
    }


    @track prefilledPills2 = false
    get getPills2(){
        console.log('getPills2 FUNCTION RUNNING')
        if(!this.prefilledPills2){
            this.prefilledPills2=true
            getAccConRelation({ContactId:this.accRecord.PersonContactId ,type:'Insurance Company'})
            .then(result=>{
                if(result.length>0){
                    console.log('getPills2 function ' + JSON.stringify(result))
                    for(let rowId =0;rowId<result.length;rowId++ ){
                        this.pills2.push({
                            label: result[rowId].Account.Name,
                            indexTerm: rowId,
                            AccountId: result[rowId].AccountId,
                            ContactId: this.accRecord.PersonContactId
                
                        })
                    }
                }
            })
            .catch(error=>{ 
                console.log('Error ' + JSON.stringify(error))
            })
        }

        return this.pills2
    }



    @track prefilledPills = false
    get getPills(){
        console.log('getPills FUNCTION RUNNING')
        if(!this.prefilledPills){
            this.prefilledPills=true
            getAccConRelation({ContactId:this.accRecord.PersonContactId,type: 'Investment Company' })
            .then(result=>{
                if(result.length>0){
                    console.log('getPills function ' + JSON.stringify(result))
                    for(let rowId =0;rowId<result.length;rowId++ ){
                        this.pills.push({
                            label: result[rowId].Account.Name,
                            indexTerm: rowId,
                            AccountId: result[rowId].AccountId,
                            ContactId: this.accRecord.PersonContactId
                
                        })
                    }
                }
            })
            .catch(error=>{ 
                console.log('Error ' + JSON.stringify(error))
            })
        }

        return this.pills
    }
    makePill(e) {

        const rowId = e.target.dataset.id;

        console.log('Row Id == ' + rowId)

        // console.log('Name = > ' + this.queryTerm[rowId].label)
        console.log('Name  = > ' + this.queryTerm[rowId].label + 'Id '+ this.queryTerm[rowId].ID)


        this.pills.push({
            label: this.queryTerm[rowId].label,
            indexTerm: this.queryTerm[rowId].index,
            AccountId: this.queryTerm[rowId].ID,
            ContactId: this.accRecord.PersonContactId

        })
        this.queryTerm[rowId].show = false
        let tempArray = this.queryTerm
        this.queryTerm = []
        this.queryTerm = tempArray



        // }

    }


    handleItemRemove2(e) {
        let index = e.detail.item.indexTerm;
        let index2 = e.detail.index
        console.log('index is' + JSON.stringify(index))
        console.log('PILL LIST was' + JSON.stringify(this.pills2))

        if(this.queryTerm2){
            console.log('qryTerm was' + JSON.stringify(this.queryTerm2))
            var temp = this.queryTerm2
            this.queryTerm2 = []
            console.log('qryTerm was' + JSON.stringify(temp))

            console.log('----')
            console.log('----')
            console.log('----')
            console.log('Before ' + JSON.stringify(temp[index]))

            temp[index].show = true
            console.log('After ' + JSON.stringify(temp[index]))


            this.queryTerm2 = temp
            console.log('qryTerm is' + JSON.stringify(this.queryTerm))
        }

        
        this.pills2.splice(index2, 1)
        console.log('PILL LIST is' + JSON.stringify(this.pills2))
        // var temp = this.pills.splice(index, 1);
        // console.log(JSON.stringify(temp))
        // this.pills = []
        // this.items = temp;
    }
    makePill2(e) {

        const rowId = e.target.dataset.id;

        console.log('Row Id 2 == ' + rowId)

        console.log('Name 2 = > ' + this.queryTerm2[rowId].label + 'Id '+ this.queryTerm2[rowId].ID)


        this.pills2.push({
            label: this.queryTerm2[rowId].label,
            indexTerm: this.queryTerm2[rowId].index,
            AccountId: this.queryTerm2[rowId].ID,
            ContactId: this.accRecord.PersonContactId
        })
        this.queryTerm2[rowId].show = false
        let tempArray = this.queryTerm2
        this.queryTerm2 = []
        this.queryTerm2 = tempArray



        // }

    }
    @track accountNames = []
    @track accountNames2 = []
    @track showInsurerValues = false//This boolean is used to hide and show insurer picklist values
    @track showBrokerValues =false//This boolean is used to hide and show broker picklist values
    
    handleKeyUp2(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {

            let tempPills = []
            console.log('Pills Length ' + this.pills.length)
            for(let i =0; i < this.pills.length; i++){
                tempPills.push(this.pills[i].AccountId)
            }
            console.log('tempPills is '+tempPills)
            getPickListAccounts({ AccountName: evt.target.value ,DevName:'Brokerage',NotIn:tempPills})
                .then(result => {
                    if (result) {
                        console.log('Result ==> ' + JSON.stringify(result))
                        let array = []
                        for (let i = 0; i < result.length; i++) {
                            this.accountNames.push(result[i].Name)
                            array.push({
                                label: result[i].Name,
                                ID:result[i].Id,
                                index: i,
                                show: true
                            })
                        }

                        this.queryTerm = array
                        this.showBrokerValues = true
                    }
                })
                .catch(error => {
                    console.log('ERROR in getting PICKLIST VALUES' + JSON.stringify(error))
                })
        }
    }

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            console.log('Pills Length ' + this.pills2.length)
            let tempPills = []
            for(let i =0; i < this.pills2.length; i++){
                tempPills.push(this.pills2[i].AccountId)
            }
            console.log('tempPills is '+tempPills)
            getPickListAccounts({ AccountName: evt.target.value ,DevName:'Insurer',NotIn:tempPills})
                .then(result => {
                    if (result) {
                        console.log('Result ==> ' + JSON.stringify(result))
                        let array = []
                        for (let i = 0; i < result.length; i++) {
                            this.accountNames2.push(result[i].Name)
                            array.push({
                                label: result[i].Name,
                                ID:result[i].Id,
                                index: i,
                                show: true
                            })
                        }

                        this.queryTerm2 = array
                    }
                })
                .catch(error => {
                    console.log('ERROR in getting PICKLIST VALUES' + JSON.stringify(error))
                })
        }
    }
    SaveTableData() {
        //((this.fileUpload== true && this.HasUploded== true)||(this.fileUpload== false))&&
        
        
        if (this.checkIfError()) {
            // this.showFileError=false
            // let Names=[]
            // let ContactId = []
            let AccountContactRel = []
            for(let i =0; i < this.pills.length; i++){
                // Names.push(this.pills.label)
                console.log('PILLS '+ JSON.stringify(this.pills[i]))
                AccountContactRel.push({AccountId:this.pills[i].AccountId, ContactId: this.accRecord.PersonContactId, FinServ__SourceSystemId__c:this.pills2[i].AccountId+this.accRecord.PersonContactId})
            }

            for(let i =0; i < this.pills2.length; i++){
                console.log('PILLS '+ JSON.stringify(this.pills2[i]))

                // Names.push(this.pills2.label)
                AccountContactRel.push({AccountId:this.pills2[i].AccountId, ContactId: this.accRecord.PersonContactId, FinServ__SourceSystemId__c:this.pills2[i].AccountId+this.accRecord.PersonContactId  })
            }
            
            CreateAccConRelation({AccountContactRel})
            .then(

                result=>{
                    console.log('result length ' +result.length);
                    console.log('AccountIds => ' + AccountContactRel);
                    console.log('RESULT from CreateAccConRelation ' + result);
                }
            )
            .catch(
                err=>console.log('ERROR ' +JSON.stringify(err))
            )

            // Handle save for eleig data table: MAAZ 9/2/2021

            // console.log("Hello world:: "+JSON.stringify(e.detail.draftValues))
            // this.saveDraftValues= e.detail.draftValues

            // for(let i=0; i<this.saveDraftValues.length; i++)
            // {
            //    console.log("TABLE ROW:: "+JSON.stringify(this.saveDraftValues))
            //    let row= this.saveDraftValues[i].id.split('-')
            //    console.log("TABLE ROW DASHHHH:: "+JSON.stringify(row))
            //    row= row[1]
            //    console.log("TABLE ID OF ELIG===>> "+row)

            //    this.SplitLicenses[row].TotalAnnualEarning= e.detail.draftValues[i].TotalAnnualEarning
            //    console.log('Final Total Anual Earnings are:: '+JSON.stringify(this.SplitLicenses[row].TotalAnnualEarning))

            //    this.SplitLicenses[row].PercentageOfTotalIncome= e.detail.draftValues[i].PercentageOfTotalIncome
            //    console.log('Final Percentage Total Incomes are:: '+JSON.stringify(this.SplitLicenses[row].PercentageOfTotalIncome))

            // }


            // Handle save for eleig data table: MAAZ 9/2/2021




            console.log('SAVE DATA RUNNING')
            let BusinessLicensArray = []

            //Program Application Insert Values



            for (let i = 0; i < this.SplitLicenses.length; i++) {
                console.log('loop for SPLIT LICENSES')
                console.log(' LICENSE ID ' + this.mapOfLicense.get(this.selectedLicense + ' - ' + this.roleSelected))
                BusinessLicensArray.push({
                    AccountId: this.accRecord.Id,
                    Percentage_Of_Total_Income__c: this.SplitLicenses[i].PercentageOfTotalIncome,
                    Total_Annual_Earning__c: this.SplitLicenses[i].TotalAnnualEarning,
                    Provincial_Jurisdiction__c: this.ProvincesSelected,
                    Name: this.SplitLicenses[i].LicensesTypeSplit,
                    Role__c: this.roleSelected,
                    EID__c: this.roleSelected + '-' + this.SplitLicenses[i].LicensesTypeSplit
                })
            }

            console.log('LiscenseValueToBeEdit ' + JSON.stringify(BusinessLicensArray))


            let quesArray = []
            let ansByUser = []
            let correctAns = []
            let Status = 'Approved'
            if (this.questionsAnswered) {
                for (let i = 0; i < this.questionsAnswered.length; i++) {
                    quesArray[i] = this.questionsAnswered[i].questionId
                    ansByUser[i] = this.questionsAnswered[i].ansByUser
                    correctAns[i] = this.questionsAnswered[i].correctAns
                    if (ansByUser[i] != correctAns[i]) {
                        Status = 'Approved with condition'
                    }
                }
            }
            console.log('quesArray ' + quesArray)
            let TempObj = ProgramApplication
            TempObj = {
                NameField: this.accRecord.Name + ' ' + this.roleSelected,
                // Brokerage_Account__c: this.parentData.accRecord.Brokerage_Account__c,
                // Broker_Contact__c: this.parentData.accRecord.Broker_Contact__c,
                // Status__c: Status,
                // Account__c: this.parentData.accRecord.Id,

            }

            // const recordInput = {
            //     apiName: ProgramApplication.objectApiName,
            //     fields: {
            //         [NameField.fieldApiName] : 'ACME',
            //         [RecordType.fieldApiName]:'012f0000000foonAAA'
            //     }
            // };
            console.log('Ans by userv ' + ansByUser)
            console.log('corr ans ' + correctAns)
            let qualify = true
            for (let i = 0; i < ansByUser.length; i++) {
                if (ansByUser[i] != correctAns[i]) {
                    qualify = false;
                }
            }
            console.log('QUALIFIED? ' + qualify)
            let ApplicableLicense = this.mapOfLicense.get(this.selectedLicense + ' - ' + this.roleSelected)
            let AssignedLicense = this.mapOfLicense.get(this.selectedLicense + ' - ' + this.roleSelected)
            console.log('Selected License::' + this.mapOfLicense.get(this.selectedLicense + ' - ' + this.roleSelected));

            console.log('Selected License::' + this.selectedLicense);

            if (!qualify) {
                AssignedLicense = this.mapOfLicense.get(this.selectedLicense + ' - ' + 'Licensed Advisor')
            }
            console.log('Assigned license is ==> ' + AssignedLicense)
            console.log('Applicable license is ==> ' + ApplicableLicense)

            //let InsuranceList = this.retrieveInsuranceData();

            //console.log('List of Insurance Companies::' + JSON.stringify(InsuranceList));


            UpdateBusinessLicense({
                BusinessLicensArray: BusinessLicensArray,
                Id: this.accRecord.Id,
                ApplicableLicense,
                AssignedLicense,
                //InsuranceList: InsuranceList
            })
                .then(result => {
                    console.log('Results From BUSINESS LICENSE ' + result)


                    if (quesArray.length > 0) {

                        InsertProgramApplication({
                            Name: this.accRecord.Name + ' ' + this.roleSelected,
                            BrokerageAccount: this.accRecord.Brokerage_Account__c,
                            Broker: this.accRecord.Broker_Contact__c,
                            Status: Status,
                            Account: this.accRecord.Id,
                            quesArray: quesArray,
                            ansByUser: ansByUser,
                            correctAns: correctAns,
                            Business_License__c: AssignedLicense,

                            // obj:recordInput

                        }).then(result => {
                            console.log('INSERT PROGRAM APPLICATION RESULTS ' + result)
                        }).catch(error => {
                            console.log('Error PROGRAM APPLICATION RESULTS ' + JSON.stringify(error))
                        })

                    }

                    console.log('Update License Information::');

                    this.accRecord.Applicable_License__c = ApplicableLicense
                    this.accRecord.Assigned_License__c = AssignedLicense

                    console.log('Redirect to the Parent Navigation::' + JSON.stringify(this.parentData));


                    // Get Investment Dealers and Insurance Companies Data




                    const evt = new CustomEvent('mysecondevent', { detail: { childcompname: 'Suspended', childcompdescription: this.childcompdescription, role: this.roleSelected, account: this.accRecord, SelectedLicence: this.selectedLicense, splitlicenses: this.SplitLicenses } });
                    this.dispatchEvent(evt);


                }).catch(error => {
                    console.log(JSON.stringify(error))
                })
        }
    }

    get getCheckForInsurer() {

        if (this.selectedLicense.includes('IROC')) {
            return true
        }
        else {
            return false
        }
    }

    get getCheckForBroker() {
        if (this.selectedLicense.includes('LLQP')) {
            return true
        }
        return false
    }

    
    goBack(e) {
        console.log('GO BACK')
        const evt = new CustomEvent('myfirstevent', { detail: { childcompname: 'Suspended', childcompdescription: this.childcompdescription, role: this.roleSelected, account: this.accRecord, SelectedLicence: this.selectedLicense, splitlicenses: this.SplitLicenses } });
        this.dispatchEvent(evt);
    }

    checkIfError() {
        var areAllValid = true;
        var inputs = this.template.querySelectorAll('.invvalidation');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                areAllValid = false;

            }
        });

        return areAllValid;

    }
}