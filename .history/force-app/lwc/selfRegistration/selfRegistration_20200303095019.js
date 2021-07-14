import { LightningElement, track, api} from 'lwc';

// Importing Apex Class method
import saveAccount from '@salesforce/apex/SelfRegisterController.saveAccountRecord';

// importing to show toast notifictions
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

// if you have Dynamic URL Use (window.location.href)
let testURL = window.location.href;

console.log(testURL);

let newURL = new URL(testURL).searchParams;

console.log('id ===> '+newURL.get('id'));
console.log('image ====> '+newURL.get('image'));


// importing Account fields
import FIRST_NAME_FIELD from '@salesforce/schema/Account.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Account.LastName';
import Phone_FIELD from '@salesforce/schema/Account.Phone';
import Industry_FIELD from '@salesforce/schema/Account.Industry';
import Type_FIELD from '@salesforce/schema/Account.Type';
import EMAIL_FIELD from '@salesforce/schema/Account.PersonEmail';

export default class CreateRecordInLWC extends LightningElement {
    @track error;
    @track accId = newURL.get('id');

    @api accountId;

    @track accRecord;

    handleNameChange(){

        
    }

    connectedCallback() {
        // initialize component

        getAccount()
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

            console.log('result ===> '+JSON.stringify(result));
            
            this.accRecord = result;

            console.log('Account Record ::' + this.accRecord);
            console.log('hidden account :: ' + this.accRecord.HiddenAccount__r.Name);
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

    }


    handleSave() {
        saveAccount({objAcc: this.accRecord , accId: this.accId})
        .then(result => {
            // Clear the user enter values
            this.accRecord = {};

            window.console.log('result ===> '+result);
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Account Created Successfully!!',
                variant: 'success'
            }),);
        })
        .catch(error => {
            this.error = error.message;
            window.console.log('Error ===>' + error.message);
        });
    }
}