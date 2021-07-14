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



// importing Account fields
import FIRST_NAME_FIELD from '@salesforce/schema/Account.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Account.LastName';
import Phone_FIELD from '@salesforce/schema/Account.Phone';
import EMAIL_FIELD from '@salesforce/schema/Account.PersonEmail';
//import USERNAME_FIELD from '@salesforce/schema/Account.Username__c';

export default class CreateRecordInLWC extends LightningElement {
    @track error;
    @track accId = newURL.get('id');

    @api accountId;



    // this object have record information
    @track accRecord = {
        FirstName : FIRST_NAME_FIELD,
        LastName : LAST_NAME_FIELD,
        Phone : Phone_FIELD,
        RecordTypeId : '0126g000000zIHRAA2',
        PersonEmail : EMAIL_FIELD,
        // Username : ''
    };


    onChangeUserName(){


        // console.log('Username::' + this.accRecord.Username);
        // console.log(JSON.stringify(this.accRecord.Username));
        // //console.log('Username::' + this.accRecord.PersonEmail);
    }


    handleSave() {

        // console.log('Username::' + this.USERNAME_FIELD);
        console.log('Account Record::' + JSON.stringify(this.accRecord ));
        console.log('Account Record::' +JSON.stringify(this.accRecord.FirstName) );
        console.log('Account Record::' +JSON.stringify(this.accRecord.LastName) );


        console.log('Account Record::' + this.accRecord );
        console.log('Account Record::' +this.accRecord.FirstName );
        console.log('Account Record::' +this.accRecord.LastName );


        // console.log('Account Record::' +this.accRecord.Username );
        
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