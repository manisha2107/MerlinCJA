import { LightningElement, track } from 'lwc';
//import CanadaLife from '@salesforce/resourceUrl/CanadaLife';
//import getPLogoLink from '@salesforce/apex/DynamicHeader.getPLogoLink';
import getPersonAccount from '@salesforce/apex/DynamicHeader.getAccount';

export default class asc extends LightningElement {
@track aId; @track accountImage;
    
   // @track imageUrl = CanadaLife;
    /*inputChange(e) {
        if (e.target.value)
            this.imageUrl = 'https://www.canadalife.com/content/dam/canadalife/logos/CanadaLife_E_TM.svg'
    }*/


    connectedCallback(){
        const param = 'id';
        //this.aId = this.getUrlParamValue(window.location.href, param);
        console.log('aId : ' + this.aId);
        getPersonAccount({accountId : this.aId})
        .then((result) => {

            if(result){

            console.log('result ===> '+ result);
            

            this.accountImage = result.imageUrl;
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);
        });

    }

}