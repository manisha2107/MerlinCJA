import { LightningElement , track, api} from 'lwc';


import getPOlst from '@salesforce/apex/CoverageChoice.getPOlst';
import getMapOfQP from '@salesforce/apex/CoverageChoice.getMapOfQP';


export default class CreateCommunityUser extends LightningElement {


    @track error;
    @api accountId;
    @track poList;
    
    connectedCallback() {
        // initialize component

        getPOlst()
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

            console.log('result ===> '+JSON.stringify(result));
            
            this.poList = result;

            console.log('Account Record ::' + this.poList);
            
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

    }



}