import { LightningElement } from 'lwc';

import createPolicy from '@salesforce/apex/createRenewalOpportunity.createPolicy';

export default class CreateOppFromCC extends LightningElement {



    connectedCallback() {
        // initialize component

        let policy={
          Account__c:'001f000001PUu92AAD',
          Name:'Test Policy',
          Status__c :'Approved',
          RecordTypeId:'01If0000000Ktml'


        }

        console.log('Policy to be send::' + JSON.stringify(policy));


        createPolicy({policy:policy})
        .then(result => {
         
            console.log('Policy Created');

            if(result){

                console.log('result ===> '+JSON.stringify(result));
            
            }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + JSON.stringify(error));
        });


      

    }

}