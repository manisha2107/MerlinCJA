import { LightningElement ,track, api} from 'lwc';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import LICENSE_FIELD from '@salesforce/schema/Account.Type_of_License_Holder__c';

import getAccount from '@salesforce/apex/PersonInformation.getAccountRecord';
import saveAccountRecord from '@salesforce/apex/PersonInformation.saveAccountRecord';
import GetAccLicenses from '@salesforce/apex/GetAccLicenses.GetAccLicenses';
import ProgramQuestions from '@salesforce/apex/GetAccLicenses.ProgramQuestions';

import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class AdvisorLicenses extends LightningElement {
        //varibales for licences 
        @track ListOftypeofLicenses;
        @track SelectedLicence; 
    
        //varaiable for business role
        @track ListOfRoles;
        @track SelectedRole;
    
        @track Role;
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
        @track MapOfLicense
    @api childcompname='Name of comp is Advisor License';
    @api childcompdescription='Description of Advisor License';

    @api accountId;

    @api childFunction(){
        console.log('Advisors running')
        console.log('accountId::' + accountId);
        getAccount()
        .then(result => {
            
            console.log('Method has called');
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

            console.log('result ===> '+JSON.stringify(result));
            
            this.accRecord = result;

            console.log('Account Record ::' + JSON.stringify(this.accRecord));
            console.log('hidden account :: ' + this.accRecord.HiddenAccount__c);

            //call busines licenses list class
            GetAccLicenses({accountId:this.accRecord.HiddenAccount__c})
                .then(Businessresult =>{
                    this.ListBusLicenses = Businessresult;
                    //console.log('Account Record ::' + JSON.stringify(this.accRecord.HiddenAccount__c));
                    console.log('list of B licenses : '+JSON.stringify(this.ListBusLicenses));
                    

                    console.log('Business Licenses Length : '+ this.ListBusLicenses.length);
                    

                    //calling of assigning method 
                    this.AssignTypeOfLicences(Businessresult);
                    console.log(' list of selected licenses: :'+JSON.stringify(this.ListOftypeofLicenses));

                    //initializing array
                    
                    //let LiscenseArray = [];
                    
                    //console.log('Array Elements are: :' + JSON.stringify(LiscenseArray));

                    //maping list of licenses into array
                    /*LiscenseArray = Businessresult.map(license =>({
                        License :license.Licenses_Type__c, Role :license.Role__c
                                    }))*/

                            
                    //console.log('Map Elements are: :' + JSON.stringify(LiscenseArray)); 
                })
                    .catch(BusinessError => {
                    console.log('BusinessResult is null' + BusinessError);
                })

                ProgramQuestions({accountId: this.accRecord.HiddenAccount__c})
                    .then(QuestionResult=>{
                        this.AllPgrmQues = QuestionResult;
                        console.log('All Program Questions are : '+JSON.stringify(this.AllPgrmQues));
                    })
            }
            
            else{

                console.log('Result is null' + result);
            }
        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error in Personal Information Screen ===>' + JSON.stringify(error));
        });
        
    }
//assign type of licences array from businesslicenses list
AssignTypeOfLicences(businessListfromchild){

    console.log('assign method:::'+JSON.stringify(businessListfromchild));
    console.log('List of Business lIcenses' + JSON.stringify(this.ListBusLicenses));

  let mapOfLicense= [];
    let listOfLicenses = [];
      for(let i=0 ; i<businessListfromchild.length ; i++){
          console.log("Assign type of licencse list : : " + JSON.stringify(businessListfromchild[i])+""+JSON.stringify(this.ListOftypeofLicenses));
          mapOfLicense.push({
              licenseName: businessListfromchild[i].Licenses_Type__c,
              id : businessListfromchild[i].Id
          })

          let retunvalue = this.CheckDuplicate(businessListfromchild[i].Licenses_Type__c , listOfLicenses);
          console.log('returend value fom duplicate method : ' + retunvalue);
              if(retunvalue==businessListfromchild[i].Licenses_Type__c){
                  console.log('value matches : ');
                  listOfLicenses.push({
                      'label': businessListfromchild[i].Licenses_Type__c,
                      'value': businessListfromchild[i].Licenses_Type__c
                  })

                  console.log('List of Licenses::' + JSON.stringify(listOfLicenses));
                  
                 // console.log('label : ' + JSON.stringify(this.ListOftypeofLicenses));
              }
          
      }

      this.MapOfLicense= mapOfLicense;

      this.ListOftypeofLicenses = listOfLicenses;

  }

  RoleSelected(event){

    console.log('role selected running::::');
    this.IsLicensedAdvisor=false;
    console.log('THE ROLE IFFF IS TRUEE: '+ this.IsLicensedAdvisor);
    this.Role= event.target.value;
    for(let i= 0 ; i <this.ListBusLicenses.length ; i++){
        if(this.ListBusLicenses[i].Licenses_Type__c==this.SelectedLicense && this.ListBusLicenses[i].Role__c == this.Role){
            console.log('Assignment : : '+ JSON.stringify(this.ListBusLicenses[i]));
            this.SelectedLicenseRecordId= this.ListBusLicenses[i].Id;
            this.RoleTrue = true;
           //console.log('selected role is::' + JSON.stringify(SelectedLicenseRecordId));
           console.log('Newly_License_Check__c is:: '+ JSON.stringify(this.ListBusLicenses[i].Newly_License_Check__c));
           this.CheckNewLic=this.ListBusLicenses[i].Newly_License_Check__c;
           //console.log('THE ROLE NEW IS TRUEEE: '+ JSON.stringify(Newly_License_Check__c));
           console.log('THE ROLE NEW IS TRUEEE: '+ JSON.stringify(this.CheckNewLic));
        if(this.CheckNewLic==true){
            console.log('THE ROLE IFFF IS TRUEE: '+ JSON.stringify(this.CheckNewLic));
            this.IsLicensedAdvisor=true;
        }
        }
        
    }
    console.log('selected role is::' + this.SelectedLicenseRecordId);

    this.LicensesQuestions();
    console.log('selected questions are---::' +  JSON.stringify(this.QuestionsforSelectedLicense));
}


        //call on change method for questions display
        CallQuestions(event){
            let check;
            
            console.log('on change of particular question::' +  event.target.id + " : "+event.target.value)
            for(let i=0; i<this.QuestionsforSelectedLicense.length; i++){
                console.log('CallQuestion :for:' + this.QuestionsforSelectedLicense[i].Id);
                if(event.target.id.includes(this.QuestionsforSelectedLicense[i].Id)){
                    console.log('CallQuestion if:' );
                    check=event.target.value;
                    console.log('check question:'+check);
                    this.QuestionsforSelectedLicense[i].ReponseField__c=check;
                    console.log('CallQuestion :if closed with redponse:' +this.QuestionsforSelectedLicense[i].ReponseField__c);

                }
                console.log('CallQuestion :if closed with redponse end:' +this.QuestionsforSelectedLicense[i].Correct_Answer__c);
            }
        }


    //check duplicate from the list of licenses
    CheckDuplicate(businesslicense,listOfLicenses){

        console.log('Check Duplicate Method::' + businesslicense);
        console.log('Check Duplicate Method::' + listOfLicenses);

        if(listOfLicenses!=''){

        console.log('List is not null');    

        for(let j=0; j<listOfLicenses.length; j++){
            console.log("types of licenses are : "+ listOfLicenses[j] + listOfLicenses[j].value);
                if(listOfLicenses[j].value == businesslicense ){
                    console.log("value already exsisted in list : "+ listOfLicenses[j] + listOfLicenses[j].value);
                     return undefined; // From For Loop
                
                }
           
           } 

        }
        console.log("return from duplicate fun : "+businesslicense );
         return businesslicense;
      
      }


    
onChangeOfLicense(event){
    console.log('on change method has called::' );
    this.SelectedLicense = event.target.value;
    console.log('change method has called::'+JSON.stringify(this.ListBusLicenses ));
    console.log('change::'+JSON.stringify(this.ListBusLicenses.Id));
    // Nullify the list of role
    let ArrayListOfRoles = [];
    let ArrayOfSPlitLicenses = [];
    
    
    for(let i=0 ; i<this.ListBusLicenses.length ; i++){
    
        console.log("list of businesslicenses: : "+JSON.stringify(this.ListBusLicenses));
     
         // IIROC == IIROC
         if(this.SelectedLicense == this.ListBusLicenses[i].Licenses_Type__c){
            console.log("business licenses matches to selected licenses: : "+this.SelectedLicense);
    
           
            ArrayListOfRoles.push({
                'label': this.ListBusLicenses[i].Role__c,
                'value': this.ListBusLicenses[i].Role__c
            })
            console.log('List of roles::' +JSON.stringify(ArrayListOfRoles));
            
    
        }
    }
    
    
    
    
             //assigning to split business licenses
             this.SplitBusinessLicense = this.SelectedLicense.split(';');
    
            
            
             for(let i=0; i<this.SplitBusinessLicense.length; i++){
                 console.log("Split  : "+this.SplitBusinessLicense[i]);
                 ArrayOfSPlitLicenses.push({
                    'LicensesTypeSplit': this.SplitBusinessLicense[i],
                    'TotalAnnualEarning':'60',
                    'PercentageOfTotalIncome':'20',
                    'ProvincialJurisdictions':[{value:'a', label:'a'},{value:'b',label:'b'}],
                    'id':'row-'+i
                    
                })
             }
             
            console.log('Array Split Licenses::' +JSON.stringify(ArrayOfSPlitLicenses));
            //this.columns = await fetchDataHelper({ amountOfRecords: 100 });
            this.ArrayOfSelectedLis = ArrayOfSPlitLicenses;
            console.log('Array Split Licenses::' +JSON.stringify(this.ArrayOfSelectedLis));
            
    
    
    
            this.ListOfRoles= ArrayListOfRoles;
            console.log('updated list of roles::' +JSON.stringify(this.ListOfRoles));
    
            
    
    }
    
    


    
TablehandleSave(event){
    let LiscenseValueToBeEdit =event.detail.draftValues

    let TableTotalAnualEarning =[]
    let TablePerOfTotalIncome =[]
    let TableProvincialJurisdiction =[]
    let TableLicenseName =[]

    console.log('Map of Licenses::' + JSON.stringify(this.MapOfLicense));
    for(let i=0; i<LiscenseValueToBeEdit.length;i++){
        TableLicenseName[i]=  this.ArrayOfSelectedLis[i].LicensesTypeSplit
        if(LiscenseValueToBeEdit[i].TotalAnnualEarning){
            TableTotalAnualEarning[i]= LiscenseValueToBeEdit[i].TotalAnnualEarning
        }
        else{
            TableTotalAnualEarning[i]= this.ArrayOfSelectedLis[i].TotalAnnualEarning
        }

        if(LiscenseValueToBeEdit[i].PercentageOfTotalIncome){
            TablePerOfTotalIncome[i]= LiscenseValueToBeEdit[i].PercentageOfTotalIncome
        }
        else{
            TablePerOfTotalIncome[i]= this.ArrayOfSelectedLis[i].PercentageOfTotalIncome
        }

        if(LiscenseValueToBeEdit[i].ProvincialJurisdictions){
            TableProvincialJurisdiction[i]= LiscenseValueToBeEdit[i].ProvincialJurisdictions
        }
        else{
            TableProvincialJurisdiction[i]= this.ArrayOfSelectedLis[i].ProvincialJurisdictions
        }

    }
    console.log('Event TableLicenseName::'+JSON.stringify(TableLicenseName));
    console.log('Event TableTotalAnualEarning::'+JSON.stringify(TableTotalAnualEarning));
    console.log('Event TablePerOfTotalIncome::'+JSON.stringify(TablePerOfTotalIncome));
    console.log('Event TableProvincialJurisdiction::'+JSON.stringify(TableProvincialJurisdiction));


    console.log('Event variable::'+JSON.stringify(LiscenseValueToBeEdit));
    //console.log('Event value::'+JSON.stringify(event));


    
    
}

get ansoptions() {
    return [
        {label: 'None', value: 'None'},
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
    ];
}


LicensesQuestions(){

    let quesSelected=[]
    console.log('function called---::' +  JSON.stringify(this.AllPgrmQues));
    for( let k=0; k<this.AllPgrmQues.length; k++){
        console.log('for called---::' +  JSON.stringify(this.AllPgrmQues[k]));
        if(this.AllPgrmQues[k].Business_License__c == this.SelectedLicenseRecordId){
            console.log('before push--::' +  JSON.stringify(this.QuestionsforSelectedLicense));
            quesSelected.push(this.AllPgrmQues[k]);
            console.log('selected questions are---::' + JSON.stringify(quesSelected));
        }
    }

    this.QuestionsforSelectedLicense=quesSelected;
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

    get acceptedFormats(){

        return [".pdf","docx"];
    }
    

      

        

        OnchangeNewlyAssistantyAns(event){
            if(event.target.value="Yes"){
                this.AssHardCodeQues=true;
            }
            this.AssistantRoleAns= event.target.value;
        }
        
        //checking the the questions for lisences
        

        handleClick(){
            const {base64, filename, recordId} = this.fileData
            uploadFile({ base64, filename, recordId }).then(result=>{
                this.fileData = null
                let title = `${filename} uploaded successfully!!`
                this.toast(title)
            })
        }
        toast(title){
            const toastEvent = new ShowToastEvent({
                title, 
                variant:"success"
            })
            this.dispatchEvent(toastEvent)
        }


}