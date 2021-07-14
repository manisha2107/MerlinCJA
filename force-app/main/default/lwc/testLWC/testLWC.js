import { LightningElement,api,track } from 'lwc';

export default class TestLWC extends LightningElement {

    @api recordId;
    @track la='LA';






register(event) {
    event.preventDefault();
    var inputCmp = this.template.querySelector(".inputCmp");
    var value = inputCmp.value;
    // is input valid text?
    if (value !== "") {
        this.template.querySelector('lightning-record-edit-form').submit();
    } 
    else if (value === "") {
        inputCmp.setCustomValidity("Please enter Province");
    }
    else{
        inputCmp.setCustomValidity(""); // if there was a custom error before, reset it

    }
    inputCmp.reportValidity(); 
}



    handleSubmit(event) {
        console.log('onsubmit event recordEditForm'+ event.detail.fields);
    }
    handleSuccess(event) {
        console.log('onsuccess event recordEditForm', event.detail.id);
    }


hidecity(event){
    var inputCmp = this.template.querySelector(".inputCmp");
    var value = inputCmp.value;
    if (value === "Ontario") {
        this.template.querySelector('div.city').classList.add('slds-hide');


    } 


}



}