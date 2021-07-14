import { LightningElement, track } from 'lwc';

import {ShowToastEvent} from 'lightning/platformShowToastEvent';


import UpdatePolicyRecord from '@salesforce/apex/UpdatePolicy.UpdatePolicyRecord';



export default class PaymentCollection2 extends LightningElement {

    invoiceNumber = "INV-001"
    @track error;
    @track payment = "Yes";
    @track paymentdescription = "the payment has been received"

  /*
  
    handlePayment() {
        UpdatePolicyRecord()
        .then(result => {
          console.log('conga triggered successfuly')
            }) 
            
            .catch(error => {
                this.error = 'Error Handling the request';
                console.log('Error Handling the request')   
            })  
    }
*/

handlePayment() {

        UpdatePolicyRecord()
        .then(result => {
         //   console.log('conga triggered successfuly')
    
            this.dispatchEvent(new ShowToastEvent({title: 'Payment Received!', message: 'Your Policy Documents have been emailed to you. Thank you for your purchase.',
            variant: 'success' }),); 


            const evt= new CustomEvent('paymentevent', {detail:{payment:this.payment,paymentdescription:this.paymentdescription}});
            this.dispatchEvent(evt);
            console.log('Event is dispatched');

        })
        .catch(error => {
            this.error = 'Error Handling the request';
         console.log('Error Handling the request');  
              
        });
    }
    

}