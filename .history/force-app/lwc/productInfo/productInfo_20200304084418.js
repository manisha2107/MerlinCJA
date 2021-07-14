import { LightningElement , track, api} from 'lwc';


import getPOlst from '@salesforce/apex/CoverageChoice.getPOlst';


export default class CreateCommunityUser extends LightningElement {


    @track error;
    @api accountId;
    @track accRecord;
    
    connectedCallback() {
        // initialize component

        getAccount()
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

            console.log('result ===> '+JSON.stringify(result));
            
            this.accRecord = result;

            console.log('Account Record ::' + this.accRecord);
            console.log('hidden account :: ' + this.accRecord.HiddenAccount__r.Name);
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

    }



}