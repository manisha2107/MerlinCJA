// ELIGIBILITY IMPORTS


// import { LightningElement, track, api, wire } from 'lwc';

// import getPQuestions from '@salesforce/apex/EligibilityTest.getAllQuestions';

// import saveCustomerResponse from '@salesforce/apex/EligibilityTest.saveCustomerResponse';

// import getProgramApplication from '@salesforce/apex/EligibilityTest.getProgramApplication';






// ADVISORS IMPORTS

import { LightningElement, track, api } from 'lwc';


import getAccount from '@salesforce/apex/PersonInformation.getAccountRecord';
import GetAccLicenses from '@salesforce/apex/GetAccLicenses.GetAccLicenses';
import ProgramQuestions from '@salesforce/apex/GetAccLicenses.ProgramQuestions';
import GetBusinessLicense from '@salesforce/apex/GetAccLicenses.GetBusinessLicense';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';


import UpdateLicenseFields from '@salesforce/apex/GetAccLicenses.UpdateLicenseFields';
export default class EligibilityTest extends LightningElement {


    //varibales for licences 
    @track ListOftypeofLicenses;
    @api SelectedLicence;
    @api Role;
    //varaiable for business role
    @track ListOfRoles;
    @track ProgramQuestionsWithAns;

    @track SelectedLicenseRecordId;

    @track AllPgrmQues;
    @track QuestionsforSelectedLicense;

    @track RoleTrue;
    @track discountQuestion;

    @track CheckNewLic;
    @track IsLicensedAdvisor;
    @track IsNewlyLicensesAdvisorAnswer;
    @track discountQuestion;

    @track AssHardCodeQues
    @track AssistantRoleAns

    @track SplitBusinessLicense
    @track ArrayOfSelectedLis
    @track MapOfLicense = new Map()

    @track MapOfQuestionsAndAnswers = new Map()
    @track AnswersByUser = new Map()
    @track countOfCorrect = 0
    
    @track Applicable

    @api parentdata;
    // @track recordId = accRecord.Id
    @track columns = [

        { label: 'Licenses Type Split', fieldName: 'LicensesTypeSplit' },
        { label: 'Total Annual Earning', fieldName: 'TotalAnnualEarning', editable: true, type: 'currency', typeAttributes: { currencyCode: 'USD' } },
        { label: 'Percentage Of Total Income', fieldName: 'PercentageOfTotalIncome', editable: true, type: 'percentage' },
        { label: 'Provincial Jurisdiction', fieldName: 'ProvincialJurisdictions', editable: true }
    ];

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


    get ansoptions() {
        return [
            { label: 'None', value: 'None' },
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
        ];
    }

    @api childcompname = 'Name of comp is Advisor License';
    @api childcompdescription = 'Description of Advisor License';


    @api childFunction() {
        console.log('Eligibility  running')
        console.log('Data Recieved from Parent....')
        console.log('Data Recieved from Parent....')
        console.log('Data Recieved from Parent....')
        console.log('Data Recieved from Parent....')

        console.log('....')
        console.log('....')
        console.log('....')
        console.log('....')
        console.log('....')

        console.log('Role From Parent ' + JSON.stringify(this.parentdata))
        this.Role = this.parentdata.role
        this.SelectedLicence = this.parentdata.License
        console.log('data from parent ==> ' + this.Role)
        console.log('data from parent ==> ' + this.SelectedLicence)

        // console.log('Role From Parent '+ parentdata.role)


        // console.log('accountId::' + accountId);
        getAccount()
            .then(result => {

                console.log('Method has called');
                // Clear the user enter values
                //this.accRecord = {};
                if (result) {

                    console.log('result ===> ' + JSON.stringify(result));

                    this.accRecord = result;

                    console.log('Account Record ::' + JSON.stringify(this.accRecord));
                    console.log('hidden account :: ' + this.accRecord.HiddenAccount__c);

                    //call busines licenses list class
                    GetAccLicenses({ accountId: this.accRecord.HiddenAccount__c })
                        .then(Businessresult => {
                            this.ListBusLicenses = Businessresult;
                            //console.log('Account Record ::' + JSON.stringify(this.accRecord.HiddenAccount__c));
                            console.log('list of B licenses : ' + JSON.stringify(this.ListBusLicenses));


                            console.log('Business Licenses Length : ' + this.ListBusLicenses.length);


                            //calling of assigning method 
                            this.AssignTypeOfLicences(Businessresult);
                            console.log(' list of selected licenses: :' + JSON.stringify(this.ListOftypeofLicenses));


                        })
                        .catch(BusinessError => {
                            console.log('BusinessResult is null' + BusinessError);
                        })

                    ProgramQuestions({ accountId: this.accRecord.HiddenAccount__c })
                        .then(QuestionResult => {
                            this.AllPgrmQues = QuestionResult;
                            console.log('All Program Questions are : ' + JSON.stringify(this.AllPgrmQues));



                        })
                }

                else {

                    console.log('Result is null' + result);
                }
            })
            .catch(error => {
                //this.error = error.message;
                console.log('Error in Personal Information Screen ===>' + JSON.stringify(error));
            });

    }
    //assign type of licences array from businesslicenses list
    AssignTypeOfLicences(businessListfromchild) {

        console.log('assign method:::' + JSON.stringify(businessListfromchild));
        console.log('List of Business lIcenses' + JSON.stringify(this.ListBusLicenses));

        let mapOfLicense = new Map();
        let listOfLicenses = [];
        for (let i = 0; i < businessListfromchild.length; i++) {
            console.log("Assign type of licencse list : : " + JSON.stringify(businessListfromchild[i]) + "" + JSON.stringify(this.ListOftypeofLicenses));
            mapOfLicense.set(
                businessListfromchild[i].Licenses_Type__c,
                businessListfromchild[i].Id
            )

            let retunvalue = this.CheckDuplicate(businessListfromchild[i].Licenses_Type__c, listOfLicenses);
            console.log('returend value fom duplicate method : ' + retunvalue);
            if (retunvalue == businessListfromchild[i].Licenses_Type__c) {
                console.log('value matches : ');
                listOfLicenses.push({
                    'label': businessListfromchild[i].Licenses_Type__c,
                    'value': businessListfromchild[i].Licenses_Type__c
                })

                console.log('List of Licenses::' + JSON.stringify(listOfLicenses));

                // console.log('label : ' + JSON.stringify(this.ListOftypeofLicenses));
            }

        }

        this.MapOfLicense = mapOfLicense;

        this.ListOftypeofLicenses = listOfLicenses;

    }

    RoleSelected(event) {

        console.log('role selected running::::');
        this.IsLicensedAdvisor = false;
        console.log('THE ROLE IFFF IS TRUEE: ' + this.IsLicensedAdvisor);
        this.Role = event.target.value;
        for (let i = 0; i < this.ListBusLicenses.length; i++) {
            if (this.ListBusLicenses[i].Licenses_Type__c == this.SelectedLicense && this.ListBusLicenses[i].Role__c == this.Role) {
                console.log('Assignment : : ' + JSON.stringify(this.ListBusLicenses[i]));
                this.SelectedLicenseRecordId = this.ListBusLicenses[i].Id;
                this.RoleTrue = true;
                //console.log('selected role is::' + JSON.stringify(SelectedLicenseRecordId));
                console.log('Newly_License_Check__c is:: ' + JSON.stringify(this.ListBusLicenses[i].Newly_License_Check__c));
                this.CheckNewLic = this.ListBusLicenses[i].Newly_License_Check__c;
                //console.log('THE ROLE NEW IS TRUEEE: '+ JSON.stringify(Newly_License_Check__c));
                console.log('THE ROLE NEW IS TRUEEE: ' + JSON.stringify(this.CheckNewLic));
                if (this.CheckNewLic == true) {
                    console.log('THE ROLE IFFF IS TRUEE: ' + JSON.stringify(this.CheckNewLic));
                    this.IsLicensedAdvisor = true;
                }
            }

        }
        console.log('selected role is::' + this.SelectedLicenseRecordId);

        this.LicensesQuestions();

        console.log('selected questions are---::' + JSON.stringify(this.QuestionsforSelectedLicense));
    }
    

    //call on change method for questions display
    CallQuestions(event) {


        console.log('CALL QUETION RUNNING')


        //print the Id from the questions

        let Id = event.target.id

        //print the value from the questions
        let value = event.target.value

        //Javascript appends some garbage value after '-' so we are splitting it from -
        var res = Id.split("-");

        //id --> 12345
        //id---> 
        //res--> [12345,126,w]

        let Id2 = res[0]
        //Id = 12345-126-w 
        console.log("Question ID ===>>>" + Id)

        //Id2 = 12345
        console.log("Question ID2 ===>>>" + Id2)


        console.log("Question Value " + value)
        // console.log(JSON.stringify(this.QuestionsforSelectedLicense))

        //Check if the question exists in the map
        if (this.AnswersByUser.has(Id2)) {
            //This means the user is changing his answer so we change the answer map.
            this.AnswersByUser.set(Id2, value)

            if (value == this.MapOfQuestionsAndAnswers.get(Id2)) {
                this.countOfCorrect++
            }
            else {
                this.countOfCorrect--
            }
        }
        else {
            this.AnswersByUser.set(Id2, value)

            if (value == this.MapOfQuestionsAndAnswers.get(Id2)) {
                this.countOfCorrect++
            }

        }

        console.log('correct answers ' + this.countOfCorrect)
        console.log('FINAL SIZE OF MAP OF ANSWERS = ' + this.AnswersByUser.size)

        var get_entries = this.AnswersByUser.entries();
        let ArrayOfQAs = []
        for (var ele of get_entries) {
            console.log(ele);
            ArrayOfQAs.push({ Question: ele[0], AnsByUser: ele[1], CorrectAns: this.MapOfQuestionsAndAnswers.get(ele[0]) })
            console.log('ProgramQuestionsWithAns' + JSON.stringify(ArrayOfQAs))
        }
        this.ProgramQuestionsWithAns = ArrayOfQAs

    }


    //check duplicate from the list of licenses
    CheckDuplicate(businesslicense, listOfLicenses) {

        console.log('Check Duplicate Method::' + businesslicense);
        console.log('Check Duplicate Method::' + listOfLicenses);

        if (listOfLicenses != '') {

            console.log('List is not null');

            for (let j = 0; j < listOfLicenses.length; j++) {
                console.log("types of licenses are : " + listOfLicenses[j] + listOfLicenses[j].value);
                if (listOfLicenses[j].value == businesslicense) {
                    console.log("value already exsisted in list : " + listOfLicenses[j] + listOfLicenses[j].value);
                    return undefined; // From For Loop

                }

            }

        }
        console.log("return from duplicate fun : " + businesslicense);
        return businesslicense;

    }



    onChangeOfLicense(event) {
        console.log('on change method has called::');
        this.SelectedLicense = event.target.value;
        console.log('change method has called::' + JSON.stringify(this.ListBusLicenses));

        console.log('CHANGE OF LICENSE:: License selected ' + this.SelectedLicense)


        console.log('CHANGE OF LICENSE::  Id selected ' + this.accRecord.Id)


        // Nullify the list of role
        let ArrayListOfRoles = [];
        let ArrayOfSPlitLicenses = [];
        let listOfRoleAndId = []

        for (let i = 0; i < this.ListBusLicenses.length; i++) {

            console.log("list of businesslicenses: : " + JSON.stringify(this.ListBusLicenses));

            // IIROC == IIROC
            if (this.SelectedLicense == this.ListBusLicenses[i].Licenses_Type__c) {
                console.log("business licenses matches to selected licenses: : " + this.SelectedLicense);


                ArrayListOfRoles.push({
                    'label': this.ListBusLicenses[i].Role__c,
                    'value': this.ListBusLicenses[i].Role__c
                })

                listOfRoleAndId.push({ ID: this.ListBusLicenses[i].Id, Role: this.ListBusLicenses[i].Role__c })


                console.log('List of roles::' + JSON.stringify(ArrayListOfRoles));


            }
        }
        this.Applicable = listOfRoleAndId
        console.log('APPLICABLE ==> ' + this.Applicable + JSON.stringify(this.Applicable))


        //assigning to split business licenses
        this.SplitBusinessLicense = this.SelectedLicense.split(';');



        for (let i = 0; i < this.SplitBusinessLicense.length; i++) {
            console.log("Split  : " + this.SplitBusinessLicense[i]);
            ArrayOfSPlitLicenses.push({
                'LicensesTypeSplit': this.SplitBusinessLicense[i],
                'TotalAnnualEarning': '60',
                'PercentageOfTotalIncome': '20',

                'id': 'row-' + i

            })
        }

        console.log('Array Split Licenses::' + JSON.stringify(ArrayOfSPlitLicenses));
        //this.columns = await fetchDataHelper({ amountOfRecords: 100 });
        this.ArrayOfSelectedLis = ArrayOfSPlitLicenses;
        console.log('Array Split Licenses::' + JSON.stringify(this.ArrayOfSelectedLis));




        this.ListOfRoles = ArrayListOfRoles;
        console.log('updated list of roles::' + JSON.stringify(this.ListOfRoles));



    }



    LicensesQuestions() {

        let quesSelected = []
        console.log('function called---::' + JSON.stringify(this.AllPgrmQues));
        for (let k = 0; k < this.AllPgrmQues.length; k++) {
            console.log('for called---::' + JSON.stringify(this.AllPgrmQues[k]));
            if (this.AllPgrmQues[k].Business_License__c == this.SelectedLicenseRecordId) {
                console.log('before push--::' + JSON.stringify(this.QuestionsforSelectedLicense));
                quesSelected.push(this.AllPgrmQues[k]);
                console.log('selected questions are---::' + JSON.stringify(quesSelected));
            }
        }

        this.QuestionsforSelectedLicense = quesSelected;
        // making a map of questions and their correct answers
        var QuestionsMap = new Map();
        for (let i = 0; i < this.QuestionsforSelectedLicense.length; i++) {
            QuestionsMap.set(this.QuestionsforSelectedLicense[i].Id, this.QuestionsforSelectedLicense[i].Correct_Answer__c);
            console.log('Question ID ;;;> ' + this.QuestionsforSelectedLicense[i].Id)
            console.log("Questions Answer map ====> " + QuestionsMap.get(this.QuestionsforSelectedLicense[i].Question__c))
        }
        console.log('QuestionMap (js) ' + JSON.stringify(QuestionsMap))
        this.MapOfQuestionsAndAnswers = QuestionsMap


        console.log('all the selected ques are ---::' + JSON.stringify(this.QuestionsforSelectedLicense));

    }





    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.accRecord.Id
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }

    // get acceptedFormats(){

    //     return [".pdf","docx"];
    // }
    OnchangeNewlyAssistantyAns(event) {
        if (event.target.value = "Yes") {
            this.AssHardCodeQues = true;
        }
        this.AssistantRoleAns = event.target.value;
    }

    //checking the the questions for lisences


    // handleClick(){
    //     const {base64, filename, recordId} = this.fileData
    //     uploadFile({ base64, filename, recordId }).then(result=>{
    //         this.fileData = null
    //         let title = `${filename} uploaded successfully!!`
    //         this.toast(title)
    //     })
    // }
    // toast(title){
    //     const toastEvent = new ShowToastEvent({
    //         title, 
    //         variant:"success"
    //     })
    //     this.dispatchEvent(toastEvent)
    // }




    @track TableMap = new Map()
    TotalAnnualEarning(event) {
        let ValueRec = event.target.value
        let idRec = event.target.id
        var res = idRec.split("-");
        console.log('TotalAnnualEarning     Id=====>' + res[1])
        console.log('TotalAnnualEarning   Value=====>' + ValueRec)
        console.log('row Data == > ' + JSON.stringify(this.ArrayOfSelectedLis[res[1]]))
        console.log('Provinces ' + JSON.stringify(this.ProvincesSelected))
        this.ArrayOfSelectedLis[res[1]].TotalAnnualEarning = ValueRec
        // TableMap.set(res[1],{Name:this.ArrayOfSelectedLis[res[1]].LicensesTypeSplit ,PercentageOfTotalIncome: this.ArrayOfSelectedLis[res[1]].PercentageOfTotalIncome,TotalAnnualEarning: this.ArrayOfSelectedLis[res[1]].TotalAnnualEarning, Provinces: this.ProvincesSelected})



    }
    @track ProvincesSelected
    HandleMultiPicklistValChange(e) {
        this.ProvincesSelected = e.detail.value;
        let idRec = e.target.id
        var res = idRec.split("-");
        // TableMap.set(res[1],{Name:this.ArrayOfSelectedLis[res[1]].LicensesTypeSplit ,PercentageOfTotalIncome: this.ArrayOfSelectedLis[res[1]].PercentageOfTotalIncome,TotalAnnualEarning: this.ArrayOfSelectedLis[res[1]].TotalAnnualEarning, Provinces: this.ProvincesSelected})
        this.ArrayOfSelectedLis[res[1]].ProvincialJurisdictions = this.ProvincesSelected
    }

    PercentageOfTotalIncome(event) {
        let ValueRec = event.target.value
        let idRec = event.target.id
        var res = idRec.split("-");
        console.log('PercentageOfTotalIncome     Id=====>' + res[1])
        console.log('PercentageOfTotalIncome   Value=====>' + ValueRec)
        console.log('row Data == > ' + JSON.stringify(this.ArrayOfSelectedLis[res[1]]))
        console.log('Provinces ' + JSON.stringify(this.ProvincesSelected))
        this.ArrayOfSelectedLis[res[1]].PercentageOfTotalIncome = ValueRec

    }

    // get acceptedFormats() {
    //     return ['.pdf', '.png','.jpg','.jpeg'];
    // }

    // handleUploadFinishedFile(event) {
    //     console.log('ID in CHILD'+ this.recordId)
    //     let strFileNames = '';
    //     // Get the list of uploaded files
    //     const uploadedFiles = event.detail.files;

    //     for(let i = 0; i < uploadedFiles.length; i++) {
    //         strFileNames += uploadedFiles[i].name + ', ';
    //     }
    //     this.dispatchEvent(
    //         new ShowToastEvent({
    //             title: 'Success!!',
    //             message: strFileNames + ' Files uploaded Successfully!!!',
    //             variant: 'success',
    //         }),
    //     );
    // }


    SaveTableData() {
        let LiscenseValueToBeEdit = this.ArrayOfSelectedLis

        let TableTotalAnualEarning = []
        let TablePerOfTotalIncome = []
        let TableProvincialJurisdiction = []
        let TableLicenseName = []


        for (let i = 0; i < LiscenseValueToBeEdit.length; i++) {
            console.log('Map of Licenses::' + JSON.stringify(this.MapOfLicense.get(this.ArrayOfSelectedLis[i].LicensesTypeSplit)));
            // TableLicenseName[i]=  this.MapOfLicense.get(this.ArrayOfSelectedLis[i].LicensesTypeSplit)

            TableLicenseName[i] = this.ArrayOfSelectedLis[i].LicensesTypeSplit
            if (LiscenseValueToBeEdit[i].TotalAnnualEarning) {
                TableTotalAnualEarning[i] = LiscenseValueToBeEdit[i].TotalAnnualEarning
            }
            else {
                TableTotalAnualEarning[i] = this.ArrayOfSelectedLis[i].TotalAnnualEarning
            }

            if (LiscenseValueToBeEdit[i].PercentageOfTotalIncome) {
                TablePerOfTotalIncome[i] = LiscenseValueToBeEdit[i].PercentageOfTotalIncome
            }
            else {
                TablePerOfTotalIncome[i] = this.ArrayOfSelectedLis[i].PercentageOfTotalIncome
            }

            if (LiscenseValueToBeEdit[i].ProvincialJurisdictions) {
                let array = LiscenseValueToBeEdit[i].ProvincialJurisdictions;
                let province = ''
                for (let i = 0; i < array.length; i++) {
                    province = province + array[i]
                    if (i < array.length - 1) {
                        province = province + ';'
                    }
                }
                console.log('PROVINCES:::::> ' + province)
                TableProvincialJurisdiction[i] = province
            }
            else {
                TableProvincialJurisdiction[i] = this.ArrayOfSelectedLis[i].ProvincialJurisdictions
            }

        }
        console.log('Event TableLicenseName::' + JSON.stringify(TableLicenseName));
        console.log('Event TableTotalAnualEarning::' + JSON.stringify(TableTotalAnualEarning));
        console.log('Event TablePerOfTotalIncome::' + JSON.stringify(TablePerOfTotalIncome));
        console.log('Event TableProvincialJurisdiction::' + JSON.stringify(TableProvincialJurisdiction));


        console.log('Event variable::' + JSON.stringify(LiscenseValueToBeEdit));
        console.log('ACCOUNT RECORD ===>' + JSON.stringify(this.accRecord))



        console.log('Selected License==> ' + this.SelectedLicense)

        console.log('SELECTED LICENSE RECORD ID==>' + this.SelectedLicenseRecordId)

        console.log('ROLE SELECTED: ' + this.Role)
        console.log(' List Bus Licenses===>>' + JSON.stringify(this.ListBusLicenses))


        //console.log('Event value::'+JSON.stringify(event));


        console.log('APPLICABLE LICENSE AND ROLE ---> ' + JSON.stringify(this.Applicable))
        console.log('Size of Questions ===> ' + this.MapOfQuestionsAndAnswers.size)
        console.log('Correct Ans ===> ' + this.countOfCorrect)


        let RoleMap = new Map()


        for (let i = 0; i < this.Applicable.length; i++) {
            RoleMap.set(this.Applicable[i].Role, this.Applicable[i].ID)
            console.log('Id for  ' + this.Applicable[i].Role + ' is ' + RoleMap.get(this.Applicable[i].Role))
        }
        var get_entries = RoleMap.entries();
        for (var ele of get_entries)
            console.log(ele);

        let roleToSendAssigned;
        let roleToSendApplicable;

        roleToSendApplicable = RoleMap.get(this.Role)
        roleToSendAssigned = RoleMap.get("Licensed Advisor")
        if (this.Role == 'Licensed Assistant') {

            if (this.MapOfQuestionsAndAnswers.size == this.countOfCorrect) {
                roleToSendAssigned = RoleMap.get(this.Role)
            }

        }


        console.log('ROLE ASSIGNED::::::> ' + roleToSendAssigned)

        console.log('ROLE APPLICABLE::::::> ' + roleToSendApplicable)


        let ProgramApplication_Name = this.accRecord.Name + ' ' + this.Role
        let ProgramApplication_Status = 'Approved'
        let ProgramApplication_BrokerageAcc = this.accRecord.Brokerage_Account__c
        let ProgramApplication_BrokerageCon = this.accRecord.Broker_Contact__c
        let role = this.Role
        if (this.ProgramQuestionsWithAns) {

            console.log(JSON.stringify(this.ProgramQuestionsWithAns))
            let Questions = []
            let CorrectAns = []
            let UserAns = []
            let PQUESANS = this.ProgramQuestionsWithAns
            for (let i = 0; i < PQUESANS.length; i++) {
                Questions[i] = (PQUESANS[i].Question)
                CorrectAns[i] = (PQUESANS[i].CorrectAns)
                UserAns[i] = (PQUESANS[i].AnsByUser)
            }
            console.log('QUESTION::::> ' + Questions)
            console.log('CorrectAns::::> ' + CorrectAns)
            console.log('UserAns::::> ' + UserAns)
        }

        console.log('data being saved')
        UpdateLicenseFields({
            Licenses: TableLicenseName,
            Province: TableProvincialJurisdiction,
            PercentageTotalIncome: TablePerOfTotalIncome,
            totalAnualEarning: TableTotalAnualEarning,
            ID: this.accRecord.Id,
            ApplicableLicense: roleToSendApplicable,
            AssignedLicense: roleToSendAssigned,
            ProgramApplication_Name: ProgramApplication_Name,
            ProgramApplication_Status: ProgramApplication_Status,
            ProgramApplication_BrokerageAcc: ProgramApplication_BrokerageAcc,
            ProgramApplication_BrokerageCon: ProgramApplication_BrokerageCon,
            Questions: Questions,
            CorrectAns: CorrectAns,
            UserAns: UserAns,
            Role: role
        }).then(
            console.log('Submitted.')
        ).catch(
            console.log('Error')
        )

        const evt = new CustomEvent('mysecondevent', { detail: { childcompname: 'Suspended', childcompdescription: this.childcompdescription, role: role, account: this.accRecord, SelectedLicence: SelectedLicence } });
        this.dispatchEvent(evt);
    }
}