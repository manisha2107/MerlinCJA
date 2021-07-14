import { LightningElement,api,track } from 'lwc';

import getPayerDetails from '@salesforce/apex/PersonInformation.getAccountRecord';
//import createInvoiceRec from '@salesforce/apex/CheckoutProcess.createInvoice';
//import getInvoice from '@salesforce/apex/CheckoutProcess.getInvoice';
//import createCharge from '@salesforce/apex/CheckoutProcess.getcreateCharge';
import getChargeResponse from '@salesforce/apex/CheckoutProcess.getChargeResponse';

import updatepolicy from '@salesforce/apex/getAllExtenedReportPeriod.updatePolicyRecord';
import { NavigationMixin } from 'lightning/navigation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';




export default class InvoicePayment extends LightningElement {

     //Variables from Parent Component
     @track contactName; @api invAmount; @api policyId; @api accountId; @api invNotes; @api payerFirstname; @api payerLastname;

     //Variables from Child Component
     @track currency; @track card; @track cvv;  @track expiryyear; @track expirymonth; @track payerAcc; @track error; @api payerEmail;
     @track cardHolderName; @api fullName; @api invoiceNumber;
     @api invDate; @api invId; @track total; @track customername;
     @api erprecId;

     @api invoiceobjcja; @api ppdtoUpdate = []; @api oppTocreate = []; @api policytoUpdate = []; @api brokerageId;

     @api childcompname = 'InvoicePayment';
     @api childcompdescription = 'the payment of invoice has been marked as paid';

     @api childcompnameerror = 'Invoice Payment Error';
     @api childcomperrorDesc = 'the payment of invoice has been failed';



     @api fullnametest; @track loaded = false;
    

    fieldchangehandler(event) {
    
        console.log('Field Change' + event.target.label + 'Field Value::' + event.target.value);
        if(event.target.label === 'Card Holder Name'){

            this.cardHolderName = event.target.value;
            console.log('cardHolderName  ' + cardHolderName);

        }
        else if(event.target.label === 'Currency'){

            this.currency = event.target.value;
            console.log('Currency  ' + currency);


        }
        else if(event.target.label === 'Card Number'){

            this.card = event.target.value;
            console.log('card  ' + card);

        }
        else if(event.target.label === 'Expiration Month (mm)'){

            this.expirymonth = event.target.value;
            console.log('expirymonth  ' + expirymonth);


        }
        else if(event.target.label === 'Expiration Year (yyyy)'){

            this.expiryyear = event.target.value;
            console.log('expiryyear  ' + expiryyear);

        }
        else if(event.target.label === 'CVV (3 or 4 digits):'){

            this.cvv = event.target.value;
            console.log('cvv  ' + cvv);

        }
        else{

            console.log('Event Label::' + event.target.value);
        }

        
    }

     get options() {
          return [
              { label: '01', value: '01' },
              { label: '02', value: '02' },
              { label: '03', value: '03'},
              { label: '04', value: '04' },
              { label: '05', value: '05' },
              { label: '06', value: '06'},
              { label: '07', value: '07' },
              { label: '08', value: '08' },
              { label: '09', value: '09'},
              { label: '10', value: '10' },
              { label: '11', value: '11' },
              { label: '12', value: '12'}
          ];
      
      }

      
     get paymentcurrency() {
        return [
            { label: 'CAD', value: 'CAD' },
            { label: 'USD', value: 'USD' }
        ];
    
    }


         
    handlePay(){
        if(this.checkIfError()) {

     //   createCharge({amount:this.invAmount,holderName:this.cardHolderName,card:this.card,cvv:this.cvv,year:this.expiryyear,month:this.expirymonth,curr:this.currency,description:this.invNotes,notes:this.invNotes,invoiceId:this.invId,email:this.payerEmail})
     console.log('Invoice Object Details ==> ' + JSON.stringify(this.invoiceobjcja));
     console.log('opportunity Object Details ==> ' + JSON.stringify(this.oppTocreate));
     console.log('ppd Object Details ==> ' + JSON.stringify(this.ppdtoUpdate));
     console.log('policy Object Details ==> ' + JSON.stringify(this.policytoUpdate));

     this.loaded = true;
     getChargeResponse({amount:this.invAmount,
                        holderName:this.cardHolderName,
                        card:this.card,
                        cvv:this.cvv,
                        year:this.expiryyear,
                        month:this.expirymonth,
                        curr:this.currency,
                        email:this.payerEmail,
                        brokerageAccId:this.brokerageId,
                        invoiceobjectFromLWC:this.invoiceobjcja,
                        OpportunityObjFromLWC:this.oppTocreate,
                        ppdtoExpire:this.ppdtoUpdate,
                        policiestoUpdate:this.policytoUpdate

                        })


     .then(result => {
            
            console.log('result ===> '+ JSON.stringify(result));
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Payment Made Successfully!!',
                variant: 'success'
            }),);

            if(result){
                const evt= new CustomEvent('paymentevent', {detail:{childcompname:this.childcompname,childcomperrorDesc:this.childcompdescription}});
                this.dispatchEvent(evt);            

            }
            

        })
        .catch(error => {
            this.error = error.message;
            console.log('Error while creating the STRIPE charge ===>' + JSON.stringify(this.error));
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!',
                message: error.message,
                variant: 'error'
                
            }),);

            const evt= new CustomEvent('paymenterrorevent', {detail:{childcompnameerror:this.childcompnameerror,childcomperrorDesc:this.childcomperrorDesc}});
            this.dispatchEvent(evt);     
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


}