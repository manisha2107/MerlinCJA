import { LightningElement, track, api, wire} from 'lwc';

// Importing Apex Class method
import saveAccount from '@salesforce/apex/SelfRegisterController.saveAccountRecord';
import getContactLists  from '@salesforce/apex/SelfRegisterController.getContactList';
import CurrentAccStatus from '@salesforce/apex/SelfRegisterController.CurrentAccStatus';

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


export default class SelfRegistration extends LightningElement {
    @track error;
    @track accId = newURL.get('id');
    //@track AccStatus;




    @api accountId;

    // this object have record information
    
        @track FirstName ;
        @track LastName;
        @track Phone ;
        @track PersonEmail;
        @track username;

        @track AccStatus;
    
    //conected call back to check acc status
    connectedCallback(){
        CurrentAccStatus({objAcc: this.accId})
        .then(result=>{
           this.AccStatus= result;
       //     result = this.AccStatus;
            console.log('result ===> '+ this.AccStatus);
            
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleNameChange(event) {
        this.FirstName = event.target.value;
        window.console.log('FirstName ==> '+this.FirstName);
        window.console.log('Account Id ==>' + this.accId);
    }

    handleLastNameChange(event) {
        this.LastName = event.target.value;
        window.console.log('LastName ==> '+this.LastName);
    }

    handlePhoneChange(event) {
        this.Phone = event.target.value;
        window.console.log('Phone ==> '+this.Phone);
    }

    handleUsernameChange(event) {
        this.Username = event.target.value;
        window.console.log('Username ==> '+ this.Username);
    }


    handleEmailChange(event) {
        this.PersonEmail = event.target.value;
        window.console.log('PersonEmail ==> '+this.PersonEmail);
        
    }

  
    @track contacts;
    @track error;

    // @wire(getContactList)
    // wiredContacts({ error, data }) {
    //     if (data) {
    //         this.contacts = data;
    //         this.error = undefined;
    //         console.log('Data' +data );
    //     } else if (error) {
    //         this.error = error;
    //         this.contacts = undefined;
    //     }
    // }
    handleSave() {

        console.log('Account Record::' +this.accId );
        console.log('Account Record::' +this.FirstName );
        console.log('Account Record::' +this.Username );

        console.log('Account Record::' +this.PersonEmail );
            

        getContactLists({Email : this.PersonEmail})
        .then(result=>{
            console.log('result ===> '+result);
            if(!result){
                saveAccount( {firstname:this.FirstName, lastname : this.LastName, email : this.PersonEmail, username: this.PeronEmail, phone: this.Phone , accId: this.accId})
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
                    console.log(error)
                    this.error = error.message;
                    window.console.log('Error ===>' + JSON.stringify(error.message));
                });

            }
            else{
                console.log('Email Already Exists')
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Failed!!',
                    message: 'Email Already Exists!',
                    variant: 'error'
                }),);
            }
        })
        .catch(error => {
            console.log(error)
            // this.error = error.message;
            // window.console.log('Error ===>' + JSON.stringify(error.message));
        });

        
        
    }

    // handleSave() {
    //     getContactLists({Email : this.PersonEmail})
    //     .then(result=>{
    //         console.log('result ===> '+result);
    //     })
        
    // }

}