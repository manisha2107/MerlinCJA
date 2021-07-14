import { LightningElement, track } from 'lwc';
import CanadaLife from '@salesforce/resourceUrl/CanadaLife';
import getPLogoLink from '@salesforce/apex/DynamicHeader.getPLogoLink';
import getSponsoredAccountLogo from '@salesforce/apex/DynamicHeader.getAccountlogo';
import getBrokerageAccountLogo from '@salesforce/apex/DynamicHeader.getAccountlogo';

export default class ImageDisplay extends LightningElement {

    
    @track imageUrl;
    @track account;
    @track brokerimageurl;
    @track merlinLogo;

    connectedCallback(){
        // initialize component
        
        getPLogoLink()

        //this return sponsored account details.
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result){

         //   console.log('result ===> '+ result);
            
            //this.accRecord = '/customerportal/resource/1580890381000/' + result;
            this.account =  result;
          //  console.log('Account Record ::' + this.account);

         //   console.log('Sponsored Company Record ::' + JSON.stringify(this.account.Id));

            // Get Image Url of Sponsored Company
          //  console.log('Brokerage Record ::' + JSON.stringify(this.account.Brokerage_Account__c));

            getBrokerageAccountLogo( {accountId:this.account.Brokerage_Account__c} )
            .then(result => {
             
                if(result){
                        
           //     console.log('result ===> '+ result);
                
                this.brokerimageurl =  result;
                console.log('Broker Image URL ::' + this.brokerimageurl);
    
            }
                
    
            })
            .catch(error => {
                //this.error = error.message;
                console.log('Error ===>' + error);
            });

            getSponsoredAccountLogo( {accountId:this.account.Id} )
            .then(result => {
             
                if(result){
                        
           //     console.log('result ===> '+ result);
                
                this.imageUrl =  result;
                console.log('Sponsored Company Image ::' + this.imageUrl);
    
            }
                
    
            })
            .catch(error => {
                console.log('Error ===>' + error);
            });

        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error ===>' + error);

        });

       
    }

}