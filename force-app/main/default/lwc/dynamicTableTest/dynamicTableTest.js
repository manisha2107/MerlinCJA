import { LightningElement, wire, track, api } from 'lwc';
//import createAccounts from '@salesforce/apex/GetAccLicenses.createAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { "label": "Life Insurance Companies", "apiName": "Insurance_Company__c", "fieldType": "picklist",  "type": "text",  "objectName": "Producer" },
    { "label": "Investment Dealers", "apiName": "Investment_Dealer__c", "fieldType": "picklist", "type": "phone", "objectName": "Producer" }
];


export default class DynamicTableTest extends LightningElement {

    @track columns=columns;

    @track options = [];

    @track records;
    @api recordJson;
 
    @api accountId;

    
  /*  this.columns = [
    { "label": "Life Insurance Companies", "apiName": "InsuranceCompany", "fieldType": "text",  "type": "text",  "objectName": "Account", "options": this.options1 },
    { "label": "Investment Dealers", "apiName": "InvestmentDealer", "fieldType": "text", "type": "phone", "objectName": "Account", "options": this.options1 }
];*/


/*getInvestmentDealers()
    .then(result => {

        console.log('Investment Dealers Values::' + result);


        for (var i = 0; i < result.length; i++) {
            console.log('Result to be printed' + result[i]);
            this.options.push({ 'label': result[i], 'value': result[i] });

        }

        console.log('Options::' + JSON.stringify(this.options));

        this.columns = [
            { "label": "Life Insurance Companies", "apiName": "InsuranceCompany", "fieldType": "text", "objectName": "Account", "options": this.options1 },
            { "label": "Investment Dealers", "apiName": "InvestmentDealer", "fieldType": "text", "type": "phone", "objectName": "Account", "options": this.options1 }
        ];
        
        console.log('Columns::' + this.columns);

    }).catch(error => {

        console.log('Error::' + JSON.stringify(error));

    })

*/




submit(event) {
    console.log('submit invoked :');
    var table = this.template.querySelector("c-dynamic-table");
    if (table != undefined) {
        this.records = table.retrieveRecords();

        console.log('Final Result::' + JSON.stringify(this.records));
        createAccounts({ accounts: this.records })
            .then(result => {
                this.message = result;
                this.error = undefined;
                console.log('result are :' + result);

                //this.accountRecList = [];
                if (this.message !== undefined) {
                    console.log('messages are :' + message);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Accounts Created!',
                            variant: 'success',
                        }),
                    );
                }

                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;

                console.log("error", JSON.stringify(this.error));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating records',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }
}

@api
retrieveUpdatedData(){
    console.log('submit invoked :');
    var table = this.template.querySelector("c-dynamic-table");
    if (table != undefined) {
        this.records = table.retrieveRecords();

        console.log('Final Result::' + JSON.stringify(this.records));
    }

    return this.records

}

}