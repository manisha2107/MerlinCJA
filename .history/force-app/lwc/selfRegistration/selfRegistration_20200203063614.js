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

    @api accountId;

    // this object have record information
    @track accRecord = {
        FirstName : FIRST_NAME_FIELD,
        LastName : LAST_NAME_FIELD,
        Industry : Industry_FIELD,
        Phone : Phone_FIELD,
        Type : Type_FIELD,
        RecordTypeId : '0126g000000zIHRAA2',
        PersonEmail : EMAIL_FIELD
    };


    handleNameChange(event) {
        this.accRecord.FirstName = event.target.value;
        window.console.log('FirstName ==> '+this.accRecord.FirstName);
    }

    handleLastNameChange(event) {
        this.accRecord.LastName = event.target.value;
        window.console.log('LastName ==> '+this.accRecord.LastName);
    }

    handlePhoneChange(event) {
        this.accRecord.Phone = event.target.value;
        window.console.log('Phone ==> '+this.accRecord.Phone);
    }

    handleTypeChange(event) {
        this.accRecord.Type = event.target.value;
        window.console.log('Type ==> '+this.accRecord.Type);
    }

    handleIndustryChange(event) {
        this.accRecord.Industry = event.target.value;
        window.console.log('Industry ==> '+this.accRecord.Industry);
    }

    handleEmailChange(event) {
        this.accRecord.PersonEmail = event.target.value;
        window.console.log('PersonEmail ==> '+this.accRecord.PersonEmail);
    }


    handleSave() {
        saveAccount({objAcc: this.accRecord})
        .then(result => {
            // Clear the user enter values
            this.accRecord = {};

            this.accountId = result.Id;
            window.console.log('result ===> '+this.accountId);
            

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
        });
    }
}