import { LightningElement,track,api,wire } from 'lwc';
import getAccRec from '@salesforce/apex/PersonInformation.getAccountRecord';
import getPolicy from '@salesforce/apex/PersonInformation.getPolicy';
import getEndorsement from '@salesforce/apex/PersonInformation.getEndorsement';
import createInsurance from '@salesforce/apex/FirmInsurance.createFirmInsurance';
import updateFirmInsurance from '@salesforce/apex/FirmInsurance.updateFirmInsurance';

import createInvoice from '@salesforce/apex/CheckoutProcess.createInvoice';
import updateInvoice from '@salesforce/apex/CheckoutProcess.updateInvoice';

import GetFirmAccount from '@salesforce/apex/PersonInformation.GetFirmAccount';
import GetFirmPolicy from '@salesforce/apex/PersonInformation.GetFirmPolicy';

import { NavigationMixin } from 'lightning/navigation';


import POLICY_OBJECT from '@salesforce/schema/InsurancePolicy';
import isActive_FIELD from '@salesforce/schema/InsurancePolicy.isActive';
import Status_FIELD from '@salesforce/schema/InsurancePolicy.Status';

import {getRecord,updateRecord,generateRecordInputForUpdate,getFieldValue} from 'lightning/uiRecordApi';

import {CurrentPageReference} from 'lightning/navigation';


import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import createFirmAccount from '@salesforce/apex/PersonInformation.createFirmAccount';
import updateFirmAccount from '@salesforce/apex/PersonInformation.updateFirmAccount';

export default class FirmInsurance2 extends  NavigationMixin(LightningElement) {
    
    @track error;
    @track personAccountId;
    @track firmName;
    @track personaccount;
    @track accRecord;
    @track policyRec;
    @track firmRec;
    @track endorsementrec;
    @track todaydate;
    @track firmpolicyName;
    @track premiumPerMonth;
    @track firmPolicyRec;
    @track currency ='CAD';
    @track invoiceNotes = 'This invoice will be charged against the purchase of your Business Firm Policy';
    @track invoiceRec;
    @track contactfirstname;
    @track invoiceId;
    @track payeremail;
    @track firmPolicyId;
    @track firmaccexist;
    @track firminsuranceexist;
    @track PolicyStatus = 'Applied';
    @track firmStreet; @track firmCity; @track firmCountry; @track firmState; @track firmPostalCode;

    @track policyActivationStatus = true;

    @track Invoicelineitems1 = {apiName: "AcctSeed__Billing_Line__c"};
    
    @track InvoicelineitemsData = [];
    @track record;


    handleStreetChange(event){
        this.firmStreet = event.target.value;
    }
     handleCityChange(event){
        this.firmCity = event.target.value;
    }
     handleCountryChange(event){
        this.firmCountry = event.target.value;
    }
     handleStateChange(event){
        this.firmState = event.target.value;
    }
     handlePostalCodeChange(event){
        this.firmPostalCode = event.target.value;
    }

    handleFieldChange(event) {
    

            this.firmName = event.target.value;
            console.log('firm name'+this.firmName);
    }


    //Practice

    connectedCallback() {
        getAccRec()
        .then(result => {
            
            if(result){

            console.log('result ===> '+JSON.stringify(result));
            this.accRecord = result;
            this.contactfirstname = this.accRecord.Name;
            

            
            getPolicy()
            .then(result => {
             
                if(result){
                console.log('result ===> '+JSON.stringify(result));        
                this.policyRec =  result;

            GetFirmAccount({personaccId:this.accRecord.Id})
            .then(result => {      
             
                if(result){
                  //  this.firmRec = result;

                    console.log('get firm Account return value  ' + JSON.stringify(result));
                    this.firmName = result.Name;
                    this.firmStreet = result.ShippingStreet;
                    this.firmCity   = result.ShippingCity;
                    this.firmState  = result.ShippingState;
                    this.firmPostalCode = result.ShippingPostalCode;
                    this.firmCountry    = result.ShippingCountry;
                    this.firmaccexist = true;
                    console.log('firm name in if::: ' + this.firmName);
                    console.log('firm acc exist?::: ' + this.firmaccexist);

                }
            
                else{
            
                    console.log('No result from get Firm Account ' + JSON.stringify(result));
                    this.firmaccexist = false;
                    console.log('firm name in else::: ' + this.firmName);
                    console.log('firm acc exist?::: ' + this.firmaccexist);


            
                }
            
                })

                .catch(error => {
                    console.log('Error 1 ===>' + JSON.stringify(error));
                });
                        
    
            }
                
    
            })
            .catch(error => {
                //this.error = error.message;
                console.log('Error 2===>' + error);
            });
            }
            else{
                console.log('Result is null' + result);
            }
        })
        .catch(error => {
            console.log('Error 3===>' + JSON.stringify(error));
        });

    }


    //Practice















/*
    @api midtermfirminsurancefunction() {
        getAccRec()
        .then(result => {
            
            if(result){

            console.log('result ===> '+JSON.stringify(result));
            this.accRecord = result;
            this.contactfirstname = this.accRecord.Name;
       //     this.payeremail = accRecord.PersomEmail;

            

            
            getPolicy()
            .then(result => {
             
                if(result){
                console.log('result ===> '+JSON.stringify(result));        
                this.policyRec =  result;
                console.log('policy Record ::' + this.policyRec.ExpirationDate);
    
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
            //this.error = error.message;
            console.log('Error ===>' + JSON.stringify(error));
        });

    }

    */



    createFirmAccount() {
        if(this.checkIfError()) {

        if(this.firmaccexist == false){
        createFirmAccount({accName:this.firmName,Mailingst:this.firmStreet,Mailingcity:this.firmCity,Mailingstate:this.firmState,
                          Mailingpostalcode:this.firmPostalCode,Broker:this.accRecord.Broker_Contact__c,brokerage:this.accRecord.Brokerage_Account__c,firmOwner:this.accRecord.Id})
          .then(result => {
              if(result){
                console.log('result ===> '+JSON.stringify(result));        
                this.firmRec = result;
              console.log('shipping state  ' + this.firmRec.ShippingState);
       //       console.log('policy Rec.Quote__c  ' + this.policyRec.Quote__c);
       
       getEndorsement({quoteId:this.policyRec.Quote__c,province:this.firmRec.ShippingState})
          .then(result => {      
           if(result){
          console.log('endorsement detail ---' + JSON.stringify(result));
          this.endorsementrec = result;
          console.log('endoresement record' + this.endorsementrec.Name);

           this.template.querySelector('div.stepOne').classList.add('slds-hide');
          this.template.querySelector('div.stepTwo').classList.remove('slds-hide');
       
          var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          this.todaydate = date;
          console.log('Today date is ' + this.todaydate);



          this.firmpolicyName = this.firmRec.Name + ' - ' + 'Firm Policy' + ' - ' + this.accRecord.FirstName + ' ' + this.accRecord.LastName ; 
          console.log('Firm Policy Name' + this.firmpolicyName);

          console.log('Diff of Quote Expiry and Today ==>' + this.endorsementrec.Quote_Expiry_Date_Today_in_Months__c);
          console.log('Premium Per Month ==>' + this.endorsementrec.Premium_Per_Month__c);
          console.log('Number of Months * Premium Per Month ==>' + this.endorsementrec.Quote_Expiry_Date_Today_in_Months__c * this.endorsementrec.Premium_Per_Month__c);
          this.premiumPerMonth =  this.endorsementrec.Quote_Expiry_Date_Today_in_Months__c * this.endorsementrec.Premium_Per_Month__c;
          console.log('premium per month--->' + this.premiumPerMonth);
             
          }
      
          else{
      
              console.log('No result' + result);
      
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
        
              else{
      
                  console.log('Result is null' + result);
              }
              
          })
          .catch(error => {
              this.error = error.message;
              window.console.log('Error >' + error.message);
           
          });

      }
    }
        else{
    if(this.checkIfError()) {

    console.log('business account already exist');
    updateFirmAccount({accName:this.firmName,Mailingst:this.firmStreet,Mailingcity:this.firmCity,Mailingstate:this.firmState,
        Mailingpostalcode:this.firmPostalCode,Broker:this.accRecord.Broker_Contact__c,brokerage:this.accRecord.Brokerage_Account__c,personaccId:this.accRecord.Id})        
        
        .then(result => {
            if(result){
              console.log('result ===> '+JSON.stringify(result));        
              this.firmRec = result;
            console.log('shipping state  ' + this.firmRec.ShippingState);
     //       console.log('policy Rec.Quote__c  ' + this.policyRec.Quote__c);
     
     getEndorsement({quoteId:this.policyRec.Quote__c,province:this.firmRec.ShippingState})
        .then(result => {      
         if(result){
        console.log('endorsement detail ---' + JSON.stringify(result));
        this.endorsementrec = result;
        console.log('endoresement record' + this.endorsementrec.Name);

         this.template.querySelector('div.stepOne').classList.add('slds-hide');
        this.template.querySelector('div.stepTwo').classList.remove('slds-hide');
     
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        this.todaydate = date;
        console.log('Today date is ' + this.todaydate);



        this.firmpolicyName = this.firmRec.Name + ' - ' + 'Firm Policy' + ' - ' + this.accRecord.FirstName + ' ' + this.accRecord.LastName ; 
        console.log('Firm Policy Name' + this.firmpolicyName);

        console.log('Diff of Quote Expiry and Today ==>' + this.endorsementrec.Quote_Expiry_Date_Today_in_Months__c);
        console.log('Premium Per Month ==>' + this.endorsementrec.Premium_Per_Month__c);
        console.log('Number of Months * Premium Per Month ==>' + this.endorsementrec.Quote_Expiry_Date_Today_in_Months__c * this.endorsementrec.Premium_Per_Month__c);
        this.premiumPerMonth =  this.endorsementrec.Quote_Expiry_Date_Today_in_Months__c * this.endorsementrec.Premium_Per_Month__c;
        console.log('premium per month--->' + this.premiumPerMonth);
           
        }
    
        else{
    
            console.log('No result' + result);
    
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
      
            else{
    
                console.log('Result is null' + result);
            }
            
        })
        .catch(error => {
            this.error = error.message;
            window.console.log('Error >' + error.message);
         
        });
    
            
            }

            GetFirmPolicy({personaConId:this.accRecord.PersonContactID__c,personAccountId:this.accRecord.Id})
            .then(result => {      
             
                if(result){
               
                    console.log('get firm insurance return value  ' + JSON.stringify(result));
                    this.firminsuranceexist = true;
                    this.firmPolicyRec = result;
                    console.log('firm insurance exist?::: ' + this.firminsuranceexist);

           
                }
            
                else{
            
                    console.log('No result from get Firm Insurance ' + JSON.stringify(result));
                    this.firminsuranceexist = false;
                    console.log('firm insurance exist?::: ' + this.firminsuranceexist);


            
                }
            
                })

                .catch(error => {
                    console.log('Error 1 ===>' + JSON.stringify(error));
                });


    }
}

      handlePolicySave() {        
        if(this.firminsuranceexist == false){

        createInsurance({policyName:this.firmpolicyName,
                          quoteType:this.policyRec.Quote__r.Quote_Type__c,
                          insuredAccount:this.firmRec.Id,
                          policyHolder:this.policyRec.Policy_Holder__c,
                          broker:this.policyRec.Broker__c,
                          brokerage:this.policyRec.Brokerage__c,
                          contactId:this.accRecord.PersonContactID__c,
                          quoteId:this.policyRec.Quote__c,
                          opportunityId:this.policyRec.SourceOpportunityId,
                          premium:this.premiumPerMonth,
                          expiryDate:this.policyRec.Quote__r.Expiration_Date__c})

            
        .then(result => {
        if(result){
            console.log('result ===> '+JSON.stringify(result));        
            this.firmPolicyRec = result;
            this.invoiceNotes = 'Payment against the purchase of Firm Policy ' +  '"' + this.firmPolicyRec.Name + '"';
            this.firmPolicyId = this.firmPolicyRec.Id;

        this.Invoicelineitems1.AcctSeed__Billing__c = "";
        this.Invoicelineitems1.AcctSeed__Rate__c    = this.premiumPerMonth;
        this.Invoicelineitems1.AcctSeed__Hours_Units__c = 1;

        this.InvoicelineitemsData.push(this.Invoicelineitems1);
           
                     
            createInvoice({accid:this.firmPolicyRec.NameInsuredId,
                          accEmail:this.accRecord.PersonEmail,
                          policyId:this.firmPolicyRec.Id,
                          curr:this.currency,
                          invnotes:this.invoiceNotes,
                          LineItemsList:this.InvoicelineitemsData})
            .then(result => {      
            if(result){
            console.log('invoice detail ---' + JSON.stringify(result));
            this.invoiceRec = result;
            this.invoiceId = this.invoiceRec.Id;
            this.payeremail = this.accRecord.PersonEmail;
            console.log('invoice id ==> '+ this.invoiceId);
              
            this.template.querySelector('div.stepTwo').classList.add('slds-hide');
            this.template.querySelector('div.stepThree').classList.remove('slds-hide');                                 
                           
             }
                    
            else{
                    
            console.log('No result' + result);
                    
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
                      
        else{
                    
        console.log('Result is null' + result);
         }
                            
        })
        .catch(error => {
        this.error = error.message;
        window.console.log('Error >' + error.message);
        
        });
      }

      else{

        console.log('policy already exist, heres the record detail ====>' + JSON.stringify(this.firmPolicyRec));
        updateFirmInsurance({firmPolicyrecId:this.firmPolicyRec.Id,policyName:this.firmpolicyName,
            quoteType:this.policyRec.Quote__r.Quote_Type__c,
            insuredAccount:this.firmRec.Id,
            policyHolder:this.policyRec.Policy_Holder__c,
            broker:this.policyRec.Broker__c,
            brokerage:this.policyRec.Brokerage__c,
            contactId:this.accRecord.PersonContactID__c,
            quoteId:this.policyRec.Quote__c,
            opportunityId:this.policyRec.SourceOpportunityId,
            premium:this.premiumPerMonth,
            expiryDate:this.policyRec.Quote__r.Expiration_Date__c})


            .then(result => {
            if(result){
            console.log('result ===> '+JSON.stringify(result));        
            this.firmPolicyRec = result;
            this.invoiceNotes = 'Payment against the purchase of Firm Policy ' +  '"' + this.firmPolicyRec.Name + '"';
            this.firmPolicyId = this.firmPolicyRec.Id;

            this.Invoicelineitems1.AcctSeed__Billing__c = "";
            this.Invoicelineitems1.AcctSeed__Rate__c    = this.premiumPerMonth;
            this.Invoicelineitems1.Id = "";
            this.Invoicelineitems1.AcctSeed__Hours_Units__c = 1;

            this.InvoicelineitemsData.push(this.Invoicelineitems1);

       
            updateInvoice({accid:this.firmPolicyRec.NameInsuredId,
            accEmail:this.accRecord.PersonEmail,
            policyId:this.firmPolicyRec.Id,
            curr:this.currency,
            invnotes:this.invoiceNotes,
            LineItemsList:this.InvoicelineitemsData})
            
            .then(result => {      
            if(result){
            console.log('invoice detail ---' + JSON.stringify(result));
            this.invoiceRec = result;
            this.invoiceId = this.invoiceRec.Id;
            this.payeremail = this.accRecord.PersonEmail;
            console.log('invoice id ==> '+ this.invoiceId);

            this.template.querySelector('div.stepTwo').classList.add('slds-hide');
            this.template.querySelector('div.stepThree').classList.remove('slds-hide');                                 
             
            }
      
            else{
      
            console.log('No result' + result);
      
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
        
            else{
      
            console.log('Result is null' + result);
            }
              
            })
            .catch(error => {
            this.error = error.message;
            window.console.log('Error >' + error.message);

            });

            } 
    
        }
        
       
       

       handleUpdateAfterPayment(event){
        const childcompname=event.detail.childcompname;
        const childcompdescription=event.detail.childcompdescription;
       console.log('child event passed succesfuly from invoice to Firm Insurance Component');
       console.log('firm policy id ===> '  + this.firmPolicyId + ' firm Policy Status ===> ' + this.PolicyStatus);
        
    
    let record = {fields: {Id:this.firmPolicyId,Status:this.PolicyStatus},};
        updateRecord(record)
            // eslint-disable-next-line no-unused-vars
            .then(() => {
                 
                this.dispatchEvent(new ShowToastEvent({title: 'Success',message: 'Policy Record Is Updated',variant: 'success',}),);

                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        "recordId": this.firmPolicyId,
                        "objectApiName": "InsurancePolicy",
                        "actionName": "view"
                    },
                });
          
              
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({title: 'Error on data save',message: error.message.body,variant: 'error',}),
                );
            });

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


}