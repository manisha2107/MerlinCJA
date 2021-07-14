/**
 * Class Name: Personal Informatino (JS)
 * Description : JS Class to gather account's Personal Information and dispatch to Parent Navigation onsave
 * Author : Ahad Farooque, Maaz Hasnein, Mohammed Ali & Manisha Kumari
 * Date: 6th April 2020
 * Last Modified By: Manisha Kumari
 * Last Modified Date: 12/02/2021
 */

import { LightningElement, track, api } from 'lwc';

// Importing Apex Class method
import saveAccountRecord from '@salesforce/apex/PersonInformation.saveAccountRecord';

// Import Toast Event
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


// Default Method of the component
export default class CreateRecordInLWC extends LightningElement {

  
    @api childcompname = 'Name of comp is personalInformation';
    @api childcompdescription = 'Description of personalInformation';


    //running user Record/Person Record
    @track accRecord;


    // Intialize Province Information
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

    /**
     * Method will be called from parent navigation to process account information
     * 
     */ 
    @api childFunction(accountRecord) {
        console.log("Child LWC Component method invoked");
        console.log('Connected Call from Child Method');

        this.accRecord = accountRecord;
        console.log('Account Record From Parent Navigation' + JSON.stringify(this.accRecord));
    }

    /**
     * 
     * Method to assign value to account variables on change on event 
     */

    get maskNumber(){
        console.log('maskNumber')

        let phone = this.accRecord.Phone 
        if(phone.length ==10 ){
            
            this.accRecord.Phone = '('+phone.substring(0, 4) + ') - '+ phone.substring(4, 7)+' - '+phone.substring(7,10)
        }
        else if( phone.length ==11){
            this.accRecord.Phone = '('+phone.substring(0, 4) + ') - '+ phone.substring(4, 7)+ ' - '+phone.substring(7,11)
        }
    }

    handleFieldChange(event) {

        console.log('Field Change' + event.target.label + 'Field Value::' + event.target.value);
        if (event.target.placeholder === 'Enter First Name') {

            this.accRecord.FirstName = event.target.value;
            console.log(' EVENT OCCURED ' + this.accRecord.FirstName)


        }
        else if (event.target.placeholder === 'Enter Last Name') {

            this.accRecord.LastName = event.target.value;
            console.log(' EVENT OCCURED ' + this.accRecord.LastName)



        }
        else if (event.target.placeholder === 'Enter Billing Street') {

            this.accRecord.BillingStreet = event.target.value;
            console.log(' EVENT OCCURED ' + this.accRecord.BillingStreet)


        }

        else if (event.target.placeholder === 'Enter Billing City') {

            this.accRecord.BillingCity = event.target.value;
            console.log(' EVENT OCCURED ' + this.accRecord.BillingCity)


        }
        else if (event.target.placeholder === 'Enter Billing Province') {

            this.accRecord.BillingState = event.target.value;
            console.log(' EVENT OCCURED ' + this.accRecord.BillingState)



        }
        else if (event.target.placeholder === 'Enter Billing PostalCode') {

            // this.accRecord.BillingPostalCode = event.target.value;
            // console.log(' EVENT OCCURED ' + this.accRecord.BillingPostalCode)

            this.accRecord.BillingPostalCode = event.detail.value;
            // Adding an space after 3rd charter is space is already doesn' exist.
            if(event.detail.value.length > 3 && /\s/.test(event.detail.value) == false){
                event.target.value = event.target.value.replace(/^(.{3})(.*)$/, "$1 $2");
            }



        }
        else if (event.target.placeholder === 'Enter Billing Country') {

            this.accRecord.BillingCountry = event.target.value;
            console.log(' EVENT OCCURED ' + this.accRecord.BillingCountry)



        }
        else if (event.target.placeholder === 'Enter Biling Street') {
            this.accRecord.BillingStreet = event.target.value;
            console.log(' EVENT OCCURED ' + this.accRecord.BillingStreet)
        }
        else if (event.target.placeholder === 'Enter Suite Number') {

            this.accRecord.Suit__c = event.target.value;


        }
        else if (event.target.placeholder === 'Enter Email Address') {

            this.accRecord.PersonEmail = event.target.value;


        }
        else if (event.target.placeholder === 'Enter your Phone Number In This Format xxx-xxx-xxxx') {
            // console.log('Phone number running ' + this.accRecord.Phone)
            // console.log('event.target.value ' +event.target.value)
            // this.accRecord.Phone = ''
            
                
            //         this.accRecord.Phone = event.target.value;
                
            
            
            // console.log("Account phone number::"+this.accRecord.Phone +' '+event.target.value)
            const x = event.target.value.replace(/\D+/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            event.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}` + (x[3] ? `-${x[3]}` : ``);
            this.accRecord.Phone = !x[2] ? x[1] : `${x[1]}${x[2]}` + (x[3] ? `${x[3]}` : ``);
            console.log("PHONE NUMBER::"+this.accRecord.Phone)
        }

        else {

            console.log('Event Label::' + event.target.value);
        }



    }


    // get formatPhoneNumber() {
        
    //     var cleaned = ('' + this.accRecord.Phone).replace(/\D/g, '')
    //     console.log('cleaned = '+cleaned)
    //     var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    //     if (match) {
    //         console.log('daata -->'+'(' + match[1] + ') ' + match[2] + '-' + match[3])
    //       return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    //     }
    //     return null
    //   }
//===============================================
    // get showPhone(){
    //     let number =this.accRecord.Phone

    //     if(number.length == 3){
    //         number = number +'-'
    //         console.log(number.length)
    //     }
    //     if(number.length == 7){
    //         number = number +'-'
    //         console.log(number.length)
    //     }
    //     console.log("LENGTH "+number.length)
    //     return number
    // }

    handleSave() {


        if(this.checkIfError()){

        console.log('Account Record::' + JSON.stringify(this.accRecord));
        console.log('License of Account::' + this.accRecord.Type_of_License_Holder__c);


        let AccAddressUpdate = {
            Id: this.accRecord.Id,
            FirstName: this.accRecord.FirstName,
            LastName: this.accRecord.LastName,
            BillingStreet: this.accRecord.BillingStreet,
            Suit__c: this.accRecord.Suit__c,
            BillingPostalCode: this.accRecord.BillingPostalCode,
            BillingCountry: this.accRecord.BillingCountry,
            BillingCity: this.accRecord.BillingCity,
            BillingState: this.accRecord.BillingState,
            Application_Current_Stage__c: this.accRecord.Application_Current_Stage__c,
            Phone: this.accRecord.Phone
        }

        console.log('AccAddUpdate::' + JSON.stringify(AccAddressUpdate))

        saveAccountRecord({ acc: AccAddressUpdate })
            .then(result => {
                // Clear the user enter values

                window.console.log('result ===> ' + result);

                console.log('Dispatch the component::');

                const evt = new CustomEvent('myfirstevent', { detail: { childcompname: this.childcompname, childcompdescription: this.childcompdescription } });
                this.dispatchEvent(evt);


                // Show success messsage
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Your information has been saved successfully',
                    variant: 'success'
                }));


            })
            .catch(error => {
                console.log(JSON.stringify(error));
                window.console.log('Error ===>' + error.message);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error'
                }));
            });

        }
    }


    checkIfError(){
        var areAllValid = true;
        var inputs = this.template.querySelectorAll('.invvalidation');
        inputs.forEach(input => {
            if(!input.checkValidity()){
                input.reportValidity();
                areAllValid = false;

            }
            });
       
            return areAllValid;

    }


    get showSubmitButton() {
        if (
            this.accRecord.BillingStreet
            && this.accRecord.FirstName
            && this.accRecord.LastName
            && this.accRecord.BillingPostalCode


        ) {
            return true
        }
        return false
    }
}