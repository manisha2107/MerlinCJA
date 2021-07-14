import { LightningElement, api, wire, track } from 'lwc';
import getBrokerageAcc from '@salesforce/apex/PersonInformation.getBrokerageAccounts';
import createUpdateMetadata from '@salesforce/apex/CreateUpdateMetadataUtils.createUpdateMetadata';

let i=0;


export default class CreateUpdateMetadata extends LightningElement {


    @track error;   //this holds errors
    @track items = []; //this holds the array for records with value & label
    @track value = '';  //this displays selected value of combo box
    @track selectedObjectlabel;
    @track selectedObjectId;
    @track APIkey;
    @track fullName;



    /* Load Contacts based on AccountId from Controller */
    @wire(getBrokerageAcc, {})
    wiredAccounts({ error, data }) {
        if (data) {
            for(i=0; i<data.length; i++) {
                this.items = [...this.items ,{value: data[i].Id , label: data[i].Name}];
                                   
            }                
            this.error = undefined;
        } else if (error) {
            this.error = error;
        }
    }
   
    //getter property from statusOptions which return the items array
    get statusOptions() {
        console.log('this.items');
        return this.items;
    }

    /*
    
    handleChange(event) {
        // Get the string of the "value" attribute on the selected option
        const selectedOption = event.detail.value;


        console.log('selectedOption=' + selectedOption);

    }
    */


    handleChange(event) {

        this.selectedObjectId = event.detail.value;
        this.selectedObjectlabel  = event.target.options.find(opt => opt.value === event.detail.value).label;
        //this.fullName = 'Payment_Metadata_Type.'+ this.selectedObjectlabel;
        //this.fullName = 'Payment_Metadata_Type.'+ 'ZEN_Insurance';
        
        
        this.fullName = 'Payment_Metadata_Type.'+this.selectedObjectlabel.replace(/ /g,"_"); //returns my_name


        console.log('Id ->' + this.selectedObjectId);
        console.log('full Name =' +  this.fullName);
        console.log('Label ->' + this.selectedObjectlabel);


   }


    handleKeyChange(event){
    this.APIkey = event.target.value;
    console.log('API Key ->' + this.APIkey);

}



submitAPIKey(event) {
    console.log('test' + this.selectedObjectId);
    createUpdateMetadata({fullName:this.fullName,label:this.selectedObjectlabel,brokerageId:this.selectedObjectId,stripekey:this.APIkey})
   
    .then(result => {     
        console.log('success');

    })
    .catch(error => {
        this.error = error.message;
        window.console.log('Error ===>' + error.message);
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error!!',
            message: error.message,
            variant: 'error'
        }),);
    });

}


}