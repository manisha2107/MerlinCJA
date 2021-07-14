import { LightningElement , track, api} from 'lwc';


import getPOlst from '@salesforce/apex/CoverageChoice.getPOlst';
import getMapOfQPD from '@salesforce/apex/CoverageChoice.getMapOfQPD';


export default class CreateCommunityUser extends LightningElement {


    @track error;
    @api accountId;
    @track poList;
    @track QPDMapData = [];
    
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


        
        getMapOfQPD()
        .then(result => {
            // Clear the user enter values
            //this.accRecord = {};
            if(result.data){

            console.log(result.data);
            
            // var conts = result.data;
            // for(var key in conts){
            //     this.QPDMapData.push({value:conts[key], key:key}); //Here we are creating the array to show on UI.
            // }

            // console.log('Quote Product Detail Map::' + this.QPDMapData);
            
        }
            

        })
        .catch(error => {
            //this.error = error.message;
            console.log('Error of Map ===>' + error);
        });

    }



}