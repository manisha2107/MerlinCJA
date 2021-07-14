import { LightningElement, track } from 'lwc';
import CanadaLife from '@salesforce/resourceUrl/CanadaLife';
import getPLogoLink from '@salesforce/apex/DynamicHeader.getPLogoLink';
import getAccount from '@salesforce/apex/DynamicHeader.getAccount';

export default class ImageDisplay extends LightningElement {

    
    @track imageUrl = CanadaLife;
    @track account;
   

    connectedCallback(){
        // initialize component

        getPLogoLink()
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

            console.log('result ===> '+ result);
            
            //this.accRecord = '/customerportal/resource/1580890381000/' + result;
            this.account =  result;
            console.log('Account Record ::' + this.account);

            //this.imageUrl = this.accRecord;
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

        getAccount( {accountId:this.account.Id} )
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

            console.log('result ===> '+ result);
            
            //this.accRecord = '/customerportal/resource/1580890381000/' + result;
            this.imageUrl =  result;
            console.log('Account Record ::' + this.imageUrl);

            //this.imageUrl = this.accRecord;
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

    }

}