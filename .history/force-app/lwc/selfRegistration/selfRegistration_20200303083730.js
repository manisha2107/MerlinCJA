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

    @track FirstName = '';
    @track LastName = '';
    @track PhoneNum = '';
    @track EmailAddress = '';
    @track UserName = '';

    @track accRecord;
  


    handleSave() {

        console.log(this.firstName);
        console.log(this.lastName);
        console.log(this.PhoneNum);
        console.log(this.EmailAddress);
        console.log(this.UserName);
        
        saveAccount({firstName: this.FirstName ,lastName : this.LastName,  phone : this.PhoneNum , email : this.EmailAddress , userName: this.UserName, accId: this.accId})
        .then(result => {
            // Clear the user enter values
            

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