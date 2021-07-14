import { LightningElement,track,api } from 'lwc';

import getUserAccount from '@salesforce/apex/PersonInformation.getAccountRecord';
import getBusinessAccountPolicy from '@salesforce/apex/PersonInformation.getBusinessAccountPolicy';
import GetFirmAcc from '@salesforce/apex/PersonInformation.GetFirmAccount';
import saveAddress from '@salesforce/apex/PersonInformation.saveAccountRecord';
import updateFirmAddress from '@salesforce/apex/PersonInformation.updateFirmAddress';
import { NavigationMixin } from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';




export default class ChangeAccountAddress extends LightningElement {


    @track isLoading = false;
    @api   accountId;
    @track accRecord;
    @track policyRec;
    @track personcontactId;
    @track businessAccountRec;


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

    handleStreetChange(event){
        this.accRecord.PersonMailingStreet = event.target.value;
        console.log('street change' + accRecord.PersonMailingStreet);
     }
     handleCityChange(event){
        this.accRecord.PersonMailingCity = event.target.value;
     }
     handleCountryChange(event){
        this.accRecord.PersonMailingCountry = event.target.value;
     }
     handleStateChange(event){
        this.accRecord.PersonMailingState = event.target.value;
     }
     handlePostalCodeChange(event){
        this.accRecord.PersonMailingPostalCode = event.target.value;
     }



     handleBAStreetChange(event){
        this.businessAccountRec.ShippingStreet = event.target.value;
        console.log('business street change' + businessAccountRec.ShippingStreet);

     }
     handleBACityChange(event){
        this.businessAccountRec.ShippingCity = event.target.value;
     }
     handleBACountryChange(event){
        this.businessAccountRec.ShippingCountry = event.target.value;
     }
     handleBAStateChange(event){
        this.businessAccountRec.ShippingState = event.target.value;
     }
     handleBAPostalCodeChange(event){
        this.businessAccountRec.ShippingPostalCode = event.target.value;
     }

    

     connectedCallback() {

        getUserAccount()
        .then(result => {
         
            if(result){ 
            this.accRecord = result;
            
            GetFirmAcc({personaccId:this.accRecord.Id})
            .then(result => {
             
                if(result){
                console.log('result ===> '+JSON.stringify(result));        
                this.businessAccountRec =  result;
                console.log('business acc Record ::' + this.businessAccountRec.Name);
    
            }
                
            })
            .catch(error => {
                //this.error = error.message;
                console.log('Error ===>' + error);
            });

        } 
        else{

            console.log('Result is null' + result);
        }

        }) 
        .catch(error => {
            console.log('Error ===>' + error);
        });
    }


    handleAccSave() {
        if(this.checkIfError()) {

        saveAddress({acc:this.accRecord})
        .then(result => {
            if(result){  
          
        this.dispatchEvent(new ShowToastEvent({
        title: 'Success',
        message: 'Your Address has been Updated Successfully.',
        variant: 'success'     
  
    }),
        );
    
    }
})
  
        .catch(error => {
            this.error = error.message;

            window.console.log('Error while person account is saved ===>' + error.message);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: error.message,
                variant: 'error'
            }),);
        });
    
    }
}

    handleBusinessAccountSave(){
        if(this.checkIfErrorinBusinessAddress()) {

        updateFirmAddress({acc: this.businessAccountRec})
        .then(result => {
            if(result){  
          
        this.dispatchEvent(new ShowToastEvent({
        title: 'Success',
        message: 'Your Business Account Address has been Updated Successfully.',
        variant: 'success'     
  
    }),
        );
    
    }
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


    checkIfError(){
        var areAllValid = true;
        var inputs = this.template.querySelectorAll('.acc');
        inputs.forEach(input => {
            if(!input.checkValidity()){
                input.reportValidity();
                areAllValid = false;

            }
            });
       
            return areAllValid;

    }

    checkIfErrorinBusinessAddress(){
        var areAllValid = true;
        var inputs = this.template.querySelectorAll('.bacc');
        inputs.forEach(input => {
            if(!input.checkValidity()){
                input.reportValidity();
                areAllValid = false;

            }
            });
       
            return areAllValid;

    }

}