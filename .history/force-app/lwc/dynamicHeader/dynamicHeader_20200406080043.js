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
            // Sponsored Company Result and Brokerage Account Id
            this.account =  result;
            console.log('Account Record ::' + this.account);

            //this.imageUrl = this.accRecord;
               
            // Get Image Url of Sponsored Company
            getAccount( {accountId:this.account.Id} )
            .then(result => {
                // Clear the user enter values
                //this.accRecord = {};
                if(result){
    
                console.log('result ===> '+ result);
                
                //this.accRecord = '/customerportal/resource/1580890381000/' + result;
                this.imageUrl =  result;
                console.log('Account Record ::' + this.imageUrl);

                //  Call third method for Brokerage Account 
    
            // Get Image Url of Sponsored Company
                getAccount( {accountId:this.account.Brokerage_Account__c} )
                .then(result => {
                    // Clear the user enter values
                    //this.accRecord = {};
                    if(result){

                    console.log('result ===> '+ result);
                    
                    //this.accRecord = '/customerportal/resource/1580890381000/' + result;
                    this.brokerageImageUrl =  result;
                    console.log('Brokerage Image URL ::' + this.brokerageImageUrl);

                    //  Call third method for Brokerage Account 

                    //this.imageUrl = this.accRecord;
                }
                    

                })
                .catch(error => {
                    //this.error = error.message;
                    console.log('Error ===>' + error);
                });


                //this.imageUrl = this.accRecord;
            }
                
    
            })
            .catch(error => {
                //this.error = error.message;
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