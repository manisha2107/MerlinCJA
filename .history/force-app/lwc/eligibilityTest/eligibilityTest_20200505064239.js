import { LightningElement, track, api, wire } from 'lwc';

import getPQuestions from '@salesforce/apex/EligibilityTest.getAllQuestions';

export default class EligibilityTest extends LightningElement {


@track error;

@api accountId;


@track accRecord;

@wire(getPQuestions) listofPQues;




    connectedCallback() {
        // initialize component

        getPQuestions()
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};

            console.log('Program Questions page called');

            if(result){

            console.log('result ===> '+JSON.stringify(result));
            
            this.accRecord = result;

            console.log('Variable Result ===> '+JSON.stringify( this.accRecord));

//            console.log('Account Record ::' + this.accRecord);
           
             }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

    }

        

    selectionChangeHandler(event) {
		this.dispatchEvent(new CustomEvent('selected', {
            detail: event.target.value
		}));
	}


}