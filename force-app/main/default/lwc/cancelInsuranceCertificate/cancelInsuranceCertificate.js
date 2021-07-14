import { LightningElement,track,api } from 'lwc';

import getInsuredAccount from '@salesforce/apex/PersonInformation.getAccountRecord';
import cancelInsurancePolicy from '@salesforce/apex/PersonInformation.cancelPolicy';
import cancelFirmInsurancePolicy from '@salesforce/apex/PersonInformation.cancelFirmPolicy';
import getInsuranceCertificate from '@salesforce/apex/PersonInformation.getPolicy';
import getFirmPolicy from '@salesforce/apex/PersonInformation.getBusinessAccountPolicy';
import { NavigationMixin } from 'lightning/navigation';
import USER_ID from '@salesforce/schema/User.Id';
import CURRENTUSERID  from '@salesforce/user/Id';
import USER_COMMUNITY_STATUS from '@salesforce/schema/User.Customer_Community_Status__c';
import IndividualCertCancellationRecalled from '@salesforce/apex/PersonInformation.recallBothCancellation';
import firmCancellationRecalled from '@salesforce/apex/PersonInformation.recallFirmCancellation';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import RedirectCancellationComponent from '@salesforce/label/c.Redirect_Cancellation_Component_URL';
import RedirectERPComponent from '@salesforce/label/c.Redirect_ERP_Component_URL';
import {getRecord,updateRecord,generateRecordInputForUpdate,getFieldValue} from 'lightning/uiRecordApi';
import {CurrentPageReference} from 'lightning/navigation';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import Status_FIELD from '@salesforce/schema/InsurancePolicy.Status';
import Is_Policy_Cancelled__c_FIELD from '@salesforce/schema/Account.Is_Policy_Cancelled__c';


export default class CancelInsuranceCertificate extends NavigationMixin(LightningElement) {

@track isModalOpen = false;
@track noactivePolicy = false;
@track purchasedERP = false;
@track purchasedERPStatus;
@track accRecord;
@track accRecordid;
@track personcontactId;
@track isFirmModalOpen = false;
@track insCertificate; //To store insurance certificate record
@track businessinsCertificate; //To store firm insurance certificate record
@track showfirmpolicy; //Should Firm Policy be shown
@track showinsurancecertificate; //Should Insurance Policy be shown
@track isReqCancellation = false; //Is firm policy already requested for cancellation?
@track isReqCancellationforCertificate; //Is individual policy already requested for cancellation?
@track childPremiumAmount;
@track monthsdiff;
@track cancellationAmount;
@track IndividualPremiumAmount;
@track monthsdiffinIndCert;
@track cancelAmountforIndCert;
@track firmUnderIndCert = true;
@track firmPolicyStatus;


//  @api midtermcancellationfunction(){  
connectedCallback(){  

    getInsuredAccount()
    .then(result => {
        if(result){

            console.log('Person Account Details ===> '+JSON.stringify(result));
            this.accRecord = result;
            this.accRecordid = this.accRecord.Id;
    
        }

        else{

            console.log('Result is null' + result);
            
        }    

    })

    .catch(error =>  {
        console.log('Error ===>' + JSON.stringify(error));

    });

    getInsuranceCertificate()
    .then(result => {
        

        console.log('getInsuranceCertificate ------------===>  ' + JSON.stringify(result));
     //   this.purchasedERPStatus = result.Status;
        
        if(result == null){

            console.log('in Policy result == null');
            this.noactivePolicy = true;
            this.template.querySelector('div.noPolicyFound').classList.remove('slds-hide');
            this.template.querySelector('div.purchasedERPdiv').classList.add('slds-hide');
            this.template.querySelector('div.firstStep').classList.add('slds-hide');
            this.template.querySelector('div.secondStep').classList.add('slds-hide');

        }

        if(result != null && result.Status == 'Purchased ERP'){

            console.log('in Policy result == Purchased ERP');
            this.purchasedERP = true;
            this.template.querySelector('div.purchasedERPdiv').classList.remove('slds-hide');
            this.template.querySelector('div.noPolicyFound').classList.add('slds-hide');
            this.template.querySelector('div.firstStep').classList.add('slds-hide');
            this.template.querySelector('div.secondStep').classList.add('slds-hide');

        }

        if(result != null && result.Status == 'Activated'){

            this.showinsurancecertificate = true;
            this.IndividualPremiumAmount = result.PremiumAmount;
            //this.monthsdiffinIndCert = result.months_difference__c;
           // this.cancelAmountforIndCert = (this.IndividualPremiumAmount/-12)*this.monthsdiffinIndCert;
            this.insCertificate = result;
            console.log('in Policy result == Active');
            console.log('Individual Certificate Details ===> '+ JSON.stringify(result));
            console.log('show insurance certificate -> ' + this.showinsurancecertificate);
        }

        if(result != null && result.Status == 'Requested Cancellation' || result.Status == 'Send Cancellation Notice' ){
            
            console.log('in Policy result == Requested Cancellation or Send Cancellation Notice');
            this.showinsurancecertificate = false;    
            this.isReqCancellationforCertificate = true;
            this.showfirmpolicy = false;  
            this.template.querySelector('div.secondStep').classList.add('slds-hide');

            console.log('Is Cancellation Requested for Insurance Certificate  ? ' + this.isReqCancellationforCertificate);

        }

        if(result != null && (result.Status != 'Activated' && result.Status != 'Requested Cancellation' && result.Status != 'Send Cancellation Notice' && result.Status != 'Purchased ERP')){

            console.log('in Policy result == result.Status != Active || result.Status != Requested Cancellation || result.Status != Send Cancellation Notice || result.Status == Cancelled)');
            this.noactivePolicy = true;
            this.template.querySelector('div.noPolicyFound').classList.remove('slds-hide');
            this.template.querySelector('div.purchasedERPdiv').classList.add('slds-hide');
            this.template.querySelector('div.firstStep').classList.add('slds-hide');
            this.template.querySelector('div.secondStep').classList.add('slds-hide');
      }
        
        else{

            console.log('Result is null, no condition met' + JSON.stringify(result));
        }


    })
    
    .catch(error => {
        //this.error = error.message;
        console.log('Error while retreiving Insurance Certificate ===>' + JSON.stringify(error));
    });


    getFirmPolicy()
        .then(result => {
            this.childPremiumAmount = result.PremiumAmount;
          //  this.monthsdiff = result.months_difference__c;
          //  this.cancellationAmount = (this.childPremiumAmount/-12)*this.monthsdiff;
            this.businessinsCertificate = result;
            this.firmPolicyStatus = this.businessinsCertificate.Status;
            console.log('businessinsCertificate => ' + JSON.stringify(this.businessinsCertificate));

            if(result.Status == 'Activated' && this.noactivePolicy != true){

            this.showfirmpolicy = true;
            this.isReqCancellation = false;
            console.log('firm policy Active  ???' + this.isReqCancellation);
            console.log('show Firm Policy  ???' + this.showfirmpolicy);


        }
            if(result.Status == 'Requested Cancellation' || result.Status == 'Send Cancellation Notice'){
            this.showfirmpolicy = false;    
            this.isReqCancellation = true;
            console.log('firm policy Requested Cancellation or Send Cancel Notice  ???? ' + this.isReqCancellation);

        }

            if(result.Status == 'Cancelled'){
            this.showfirmpolicy = false;    
            this.isReqCancellation = false;
            this.firmUnderIndCert  = false;
            console.log('firm Policy Cancelled???? ' + this.isReqCancellation);


        }


        else{

            console.log('Result is null while accessing firm Policy' + JSON.stringify(result));
        }
    })
    .catch(error => {
        //this.error = error.message;
        console.log('Error in retreiving firm policy ===>' + JSON.stringify(error));
    });

}


@track isModalOpen = false;
openModal() {
    this.isModalOpen = true;
}

@track openRevertReqforIndCertificate = false;

openRevertReqforMainCertificate(){

    this.openRevertReqforIndCertificate = true;
}


modalCancelforIndCert(){
this[NavigationMixin.Navigate]({
    "type": "standard__webPage",
    "attributes": {
    "url": RedirectCancellationComponent //label.RedirectCancellationComponent
    }
});

}


closeModal() {
    this.isModalOpen = false;
    this[NavigationMixin.Navigate]({
        type: 'standard__namedPage',
        attributes: {
        pageName: 'home'
        },
    });
}

@track isFirmModalOpen = false;
FirmOpenModal() {
    this.isFirmModalOpen = true;
}
FirmCloseModal() {
    this.isFirmModalOpen = false;
    this.closeModal();
}




submitDetails() {
    this.isModalOpen = false;
    console.log('Firm Policy Status ==> ' + this.firmPolicyStatus)
    if(this.firmUnderIndCert == true && this.firmPolicyStatus == 'Activated'){
    
    cancelInsurancePolicy({nameinsured:this.accRecord.Id,personcontactid:this.accRecord.PersonContactID__c})
    
    .then(result => {     

        console.log('Is both Policies Cancelled? ===> '+JSON.stringify(result));
        
        const fields = {};
        fields[USER_ID.fieldApiName] = CURRENTUSERID;
        fields[USER_COMMUNITY_STATUS.fieldApiName] = 'Has Cancelled Insurance Certificate';

        const userRecordInput = { fields };  
        
        updateRecord(userRecordInput)

        this.dispatchEvent(new ShowToastEvent
        ({title: 'Success!!',
        message: 'Both Policies Cancelled Successfully.',
        variant: 'success'
        })
        ,);
        
        
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
            "url": RedirectCancellationComponent //label.RedirectCancellationComponent
            }
        });

        

    })
    .catch(error => {
        this.error = error.message;
        console.log('Error in if ===>' + error.message);
        this.dispatchEvent(new ShowToastEvent({title:'Error!!',message: error.message,variant:'error'}),);

    });

    }

    else{
    
        cancelInsurancePolicy({nameinsured:this.accRecord.Id})
        
        .then(result => {     
    
            console.log('Is only Individual Policy Cancelled? ===> '+JSON.stringify(result));
            
            const fields = {};
            fields[USER_ID.fieldApiName] = CURRENTUSERID;
            fields[USER_COMMUNITY_STATUS.fieldApiName] = 'Has Cancelled Insurance Certificate';
    
            const userRecordInput = { fields };  
            
            updateRecord(userRecordInput)
    
            this.dispatchEvent(new ShowToastEvent
            ({title: 'Success!!',
            message: 'Individual Policy Certificate Cancelled Successfully.',
            variant: 'success'
            })
            ,);
            
            
            this[NavigationMixin.Navigate]({
                "type": "standard__webPage",
                "attributes": {
                "url": RedirectCancellationComponent //label.RedirectCancellationComponent
                }
            });
    
            
    
        })
        .catch(error => {
            this.error = error.message;
            console.log('Error in else ===>' + error.message);
            this.dispatchEvent(new ShowToastEvent({title:'Error!!',message: error.message,variant:'error'}),);
    
        });
    
        }
}

submitFirmDetails() {
    this.isFirmModalOpen = false;
    console.log('accID === ' + this.accRecord.Id + ' contactID === ' + this.accRecord.PersonContactID__c + ' cancellation amount === ' + this.cancellationAmount);
    cancelFirmInsurancePolicy({accID:this.accRecord.Id,contactID:this.accRecord.PersonContactID__c,cancellationAmount:0})//this.cancellationAmount})
    
    .then(result => {     
        // Show success messsage
        const fields = {};
        fields[USER_ID.fieldApiName] = CURRENTUSERID;
        fields[USER_COMMUNITY_STATUS.fieldApiName] = 'Has Cancelled Firm Rider not Insurance Certificate	';

        const userRecordInput = { fields };  
        
        updateRecord(userRecordInput)
        
        this.dispatchEvent(new ShowToastEvent({title: 'Success',message: 'Firm Policy has been Cancelled Successfully.',variant: 'success'}),);
        
        this.modalCancelforIndCert();
        /*
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                "recordId": this.businessinsCertificate.Id,
                "objectApiName": "InsurancePolicy",
                "actionName": "view"
            },
        });
        */

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

getInsurancePolicy(){

    getInsuranceCertificate({})
    
    .then(result => {     
        if(result){
            console.log('In getInsurancePolicy Method');
            console.log('result ===> '+JSON.stringify(result));
            this.insCertificate = result;
        //     this.template.querySelector('div.step1').classList.add('slds-hide');
            this.template.querySelector('div.firstStep').classList.add('slds-hide');
            this.template.querySelector('div.secondStep').classList.add('slds-hide');
            this.template.querySelector('div.goToCancelCertificate').classList.remove('slds-hide');
            
            console.log('insCertificate => ' + JSON.stringify(this.insCertificate));

    getFirmInsuranceCertificate({})
    .then(result => {
        if(result){
            this.businessinsCertificate = result;

            console.log('businessinsCertificate => ' + JSON.stringify(this.businessinsCertificate));
       //     this.template.querySelector('div.secondStep').classList.add('slds-hide');
        }

        else{

            console.log('Result is null' + result);

        }            

    })  
    
    .catch(error => {
        //this.error = error.message;
        console.log('Error ===>' + JSON.stringify(error));
    });
            }

            else{

                console.log('Result is null' + result);
            }
        
        
    })
    .catch(error => {
        this.error = error.message;
        window.console.log('Error ===>' + error.message);
    
    });

}

showFirmPolicyDetails() {
    this.template.querySelector('div.firstStep').classList.add('slds-hide');
    this.template.querySelector('div.secondStep').classList.add('slds-hide');

    this.template.querySelector('div.goToCancelFirmPolicy').classList.remove('slds-hide');
 
    /*   this.isModalOpen = false;
    getBusinessAccountPolicy({})
    
    .then(result => {     
    
        this.businessinsCertificate = result;          
        this.template.querySelector('div.step1').classList.add('slds-hide');
        this.template.querySelector('div.firstStep').classList.add('slds-hide');

        this.template.querySelector('div.goToCancelFirmPolicy').classList.remove('slds-hide');
        
   //     console.log('businessinsCertificate => ' + JSON.stringify(this.businessinsCertificate));

    })
    .catch(error => {
        this.error = error.message;
        window.console.log('Error ===>' + error.message);
    
    });
*/
}

handleNavigatetoERP() {
    this[NavigationMixin.Navigate]({
        "type": "standard__webPage",
        "attributes": {
        "url": RedirectERPComponent
        }
    });
}

CertCancellationRecalled(){
    this.openRevertReqforIndCertificate = false;
    IndividualCertCancellationRecalled({accID:this.accRecord.Id,contactID:this.accRecord.PersonContactID__c})
    
    .then(result => {   
        
        if(result) {
        console.log('individual certificate cancellation status => ' + JSON.stringify(result));
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Policy status has been changed to "Active"',
            variant: 'success'}),);

        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
            pageName: 'home'},});    
        } 

    })

    .catch(error =>{
    this.error = error.message;
    console.log('error while recalling cancellation for ind cert ' + JSON.stringify(this.error));

    });
}

RecallFirmCancellation(){

    firmCancellationRecalled({accID:this.accRecord.Id,contactID:this.accRecord.PersonContactID__c})
    
    .then(result => {   
        console.log('result here ' + JSON.stringify(result));

    if(result){
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Firm Policy status has been changed to "Active"',
            variant: 'success'}),);
    this.closeModal();
    }    
      
    })

    .catch(error =>{
    this.error = error.message;
    window.console.log('Error ===>' + error.message);                

    });
}

/*
redirectToERP() {
    this[NavigationMixin.Navigate]({
        type: "standard__component",
        attributes: {
            componentName: "c__extendedReportingPeriod"
        },
        state: {
            c__propertyValue: '500'
        }
    });
}*/

}