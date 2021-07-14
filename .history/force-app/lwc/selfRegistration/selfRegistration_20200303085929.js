import { LightningElement, track, api} from 'lwc';

// Importing Apex Class method
import saveAccount from '@salesforce/apex/SelfRegisterController.saveAccountRecord';

// importing to show toast notifictions
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

// if you have Dynamic URL Use (window.location.href)
let testURL = window.location.href;

console.log(testURL);

let newURL = new URL(testURL).searchParams;

console.log('URL::' + newURL);

console.log('id ===> '+newURL.get('id'));
console.log('image ====> '+newURL.get('image'));


export default class CreateRecordInLWC extends LightningElement {
    @track error;
    @track accId = newURL.get('id');

    @api accountId;

    
    @track accRecord = {

        FirstName : '',
        LastName : '',
        PhoneNum : '',
        EmailAddress : '',
        UserName : ''
    };
  
    fname = 'Manisha';

    handleNameChange(event) {
        
        console.log('FirstName' + this.accRecord.FirstName);

    }

    handleSave() {

       
        console.log('First Name' + this.accRecord.FirstName);
        console.log('Last Name' + this.accRecord.LastName);
        console.log('Phone Number' +   this.accRecord.PhoneNum);
        console.log('Email Address' + this.accRecord.EmailAddress);
        console.log('Username' + this.accRecord.UserName);
        console.log(fname);
        
        saveAccount({firstName: this.accRecord.FirstName ,lastName : this.accRecord.LastName,  phone : this.accRecord.PhoneNum , email : this.accRecord.EmailAddress , userName: this.accRecord.UserName, accId: this.accId})
        .then(result => {
            // Clear the user enter values
            
            console.log('First Name' + this.accRecord.FirstName);
            console.log('Last Name' + this.accRecord.LastName);
            console.log('Phone Number' +   this.accRecord.PhoneNum);
            console.log('Email Address' + this.accRecord.EmailAddress);
            console.log('Username' + this.accRecord.UserName);

            window.console.log('result ===> '+result);
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Account Created Successfully , Please check your email to reset your password!!',
                variant: 'success'
            }),);
        })
        .catch(error => {
            this.error = error.message;
            window.console.log('Error ===>' + error.message);
        });
    }
}