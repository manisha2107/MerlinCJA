import { LightningElement, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class UploadButton extends LightningElement {
    // @api recordId;
    @api recFromParent
    // accepted parameters
    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }
   
    handleUploadFinished(event) {
        console.log('ID in CHILD'+ this.recFromParent)
        let strFileNames = '';
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;

        for(let i = 0; i < uploadedFiles.length; i++) {
            strFileNames += uploadedFiles[i].name + ', ';
        }
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success!!',
                message: strFileNames + ' Files uploaded Successfully!!!',
                variant: 'success',
            }),
        );
    }
}