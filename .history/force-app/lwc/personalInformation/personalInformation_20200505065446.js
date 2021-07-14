import { LightningElement, track,api } from 'lwc';

// Importing Apex Class method

import getAccount from '@salesforce/apex/PersonInformation.getAccountRecord';
import saveAccountRecord from '@salesforce/apex/PersonInformation.saveAccountRecord';

import {ShowToastEvent} from 'lightning/platformShowToastEvent';




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

    @track error;

    @api accountId;


    @track accRecord;
    // // this object have record information
    // @track accRecord = {
    //     // FirstName : FIRST_NAME_FIELD,
    //     // LastName : LAST_NAME_FIELD,
    //     // Industry : Industry_FIELD,
    //     // Phone : Phone_FIELD,
    //     // Type : Type_FIELD,
    //     // RecordTypeId : '0126g000000zIHRAA2',
    //     // PersonEmail : EMAIL_FIELD
    // };


    handleNameChange(event) {
    
        
        if(event.target.label === 'Enter First Name'){

            this.accRecord.FirstName = event.target.value;

        }
        else if(event.target.label === 'Enter Last Name'){

            this.accRecord.LastName = event.target.value;

        }
        else if(event.target.label === 'Mailing Street'){

            this.accRecord.MailingStreet = event.target.value;

        }
        else if(event.target.label === 'Enter Mailing Street'){

            this.accRecord.MailingStreet = event.target.value;

        }
        else if(event.target.label === 'Enter Mailing City'){

            this.accRecord.MailingStreet = event.target.value;

        }
        else if(event.target.label === 'Enter Mailing State'){

            this.accRecord.MailingState = event.target.value;

        }
        else if(event.target.label === 'Enter Mailing PostalCode'){

            this.accRecord.MailingPostalCode = event.target.value;

        }
        else if(event.target.label === 'Enter Mailing Country'){

            this.accRecord.MailingCountry = event.target.value;

        }
        else if(event.target.label === 'Enter Email Address'){

            this.accRecord.PersonEmail = event.target.value;

        }
        else{

            console.log('Event Label::' + event.target.value);
        }

        
    }


    connectedCallback() {
        // initialize component

        getAccount()
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

            //console.log('result ===> '+JSON.stringify(result));
            
            this.accRecord = result;

            console.log('Account Record ::' + this.accRecord);
            //console.log('hidden account :: ' + this.accRecord.HiddenAccount__r.Name);
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

    }

 
    
    handleSave() {

        console.log('Account Record::' +this.accRecord );
        
        
        saveAccountRecord({acc: this.accRecord})
        .then(result => {
            // Clear the user enter values
            

            window.console.log('result ===> '+result);
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Account Updated Successfully!!',
                variant: 'success'
            }),);

                const evt= new CustomEvent('myfirstevent', {detail:{childcompname:this.childcompname,childcompdescription:this.childcompdescription}});
                this.dispatchEvent(evt);
            
        })
        .catch(error => {
            this.error = error.message;
            window.console.log('Error ===>' + error.message);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: error.message,
                variant: 'error'
            }),);
        });
    }


}