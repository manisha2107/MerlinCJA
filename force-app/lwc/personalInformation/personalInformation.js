import { LightningElement, track,api, wire } from 'lwc';

// Importing Apex Class method

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import LICENSE_FIELD from '@salesforce/schema/Account.Type_of_License_Holder__c';

import getAccount from '@salesforce/apex/PersonInformation.getAccountRecord';
import saveAccountRecord from '@salesforce/apex/PersonInformation.saveAccountRecord';
import GetAccLicenses from '@salesforce/apex/GetAccLicenses.GetAccLicenses';
import ProgramQuestions from '@salesforce/apex/GetAccLicenses.ProgramQuestions';

import {ShowToastEvent} from 'lightning/platformShowToastEvent';

// import pickList from './pickList.html';


// importing to show toast notifictions
//import {ShowToastEvent} from 'lightning/platformShowToastEvent';


// // importing Account fields
// import FIRST_NAME_FIELD from '@salesforce/schema/Account.FirstName';
// import LAST_NAME_FIELD from '@salesforce/schema/Account.LastName';
// import Phone_FIELD from '@salesforce/schema/Account.Phone';
// import Industry_FIELD from '@salesforce/schema/Account.Industry';
// import Type_FIELD from '@salesforce/schema/Account.Type';
// import EMAIL_FIELD from '@salesforce/schema/Account.PersonEmail';


export default class CreateRecordInLWC extends LightningElement {


    @api childcompname='Name of comp is personalInformation';
    @api childcompdescription='Description of personalInformation';

    //list of business license
    @track error;
    
    //variable to store user account detail
    @track accountId;
    //running user Record/Person Record
    @track accRecord;
    @track valuesChanged
    
    get options() {
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

    @api childFunction(){  
        console.log("Child LWC Component method invoked");  
        console.log('Connected Call from Child Method');
        
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

      

        

    handleFieldChange(event) {
    
        console.log('Field Change' + event.target.label + 'Field Value::' + event.target.value);
        if(event.target.label === 'Enter First Name'){

            this.accRecord.FirstName = event.target.value;
            this.valuesChanged =true;

        }
        else if(event.target.label === 'Enter Last Name'){

            this.accRecord.LastName = event.target.value;
            this.valuesChanged =true;


        }
        else if(event.target.label === 'Mailing Street'){

            this.accRecord.PersonMailingStreet = event.target.value;
            this.valuesChanged =true;

        }
        else if(event.target.label === 'Enter Mailing Street'){

            this.accRecord.PersonMailingStreet = event.target.value;
            this.valuesChanged =true;

        }
        else if(event.target.label === 'Enter Mailing City'){

            this.accRecord.PersonMailingCity = event.target.value;
            this.valuesChanged =true;

        }
        else if(event.target.label === 'Enter Mailing State'){

            this.accRecord.PersonMailingState = event.target.value;
            this.valuesChanged =true;

        }
        else if(event.target.label === 'Enter Mailing PostalCode'){

            this.accRecord.PersonMailingPostalCode = event.target.value;
            this.valuesChanged =true;

        }
        else if(event.target.label === 'Enter Mailing Country'){

            this.accRecord.PersonMailingCountry = event.target.value;
            this.valuesChanged =true;

        }
        else if(event.target.label === 'Enter Email Address'){

            this.accRecord.PersonEmail = event.target.value;
            this.valuesChanged =true;

        }
    
        else{

            console.log('Event Label::' + event.target.value);
        }
        

        
    }


    
    handleSave() {

        console.log('Account Record::' + JSON.stringify(this.accRecord) );
        console.log('License of Account::' + this.accRecord.Type_of_License_Holder__c);
        
      //  const evt= new CustomEvent('myfirstevent', {detail:{childcompname:this.childcompname,childcompdescription:this.childcompdescription}});
        //this.dispatchEvent(evt); 

        let AccAddressUpdate ={
            Id: this.accRecord.Id,
            FirstName: this.accRecord.FirstName,
            LastName: this.accRecord.LastName,
            PersonMailingStreet: this.accRecord.PersonMailingStreet,
            PersonMailingPostalCode: this.accRecord.PersonMailingPostalCode,
            PersonMailingCountry: this.accRecord.PersonMailingCountry,
            PersonMailingCity: this.accRecord.PersonMailingCity,
            PersonMailingState: this.accRecord.PersonMailingState
        }

         saveAccountRecord({acc: AccAddressUpdate})
        .then(result => {
            // Clear the user enter values
            

            
            window.console.log('result ===> '+result);

            console.log('Dispatch the component::');

            const evt= new CustomEvent('myfirstevent', {detail:{childcompname:this.childcompname,childcompdescription:this.childcompdescription}});
            this.dispatchEvent(evt);
            

            window.console.log('result ===> '+result);
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Account Updated Successfully!!',
                variant: 'success'
            }),);

                
        })
        .catch(error => {
            this.error = error.message;
            console.log(JSON.stringify(error));
            window.console.log('Error ===>' + error.message);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: error.message,
                variant: 'error'
            }),);
        });
    }


    
    get showSubmitButton(){
        if(
              this.accRecord.PersonMailingStreet 
            && this.accRecord.FirstName 
            && this.accRecord.LastName 
            
            
            && this.accRecord.PersonMailingPostalCode
         
      
            ){
                return true
        }
        return false
    }
}