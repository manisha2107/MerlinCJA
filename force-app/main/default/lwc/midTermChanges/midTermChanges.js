import { LightningElement,track,api } from 'lwc';
import getPersonAccount from '@salesforce/apex/PersonInformation.getAccountRecord';

export default class MidTermChanges extends LightningElement {

@track accRecord;
@track isprimarycancelled;
@track isfirmpolicypurchased;
@track isERPpurchased;

  connectedCallback(){  
    getPersonAccount()
    .then(result => {
        
        if(result){
        console.log('result ===> '+JSON.stringify(result));
        this.accRecord = result;
        this.isprimarycancelled = this.accRecord.Is_Policy_Cancelled__c;
        this.isfirmpolicypurchased = this.accRecord.Is_Firm_Insurance_Purchased__c;
        this.isERPpurchased = this.accRecord.Is_ERP_Purchased__c;
        }
        else{

            console.log('Result is null' + result);
        }
    })
    .catch(error => {
        console.log('Error in Personal Information Screen ===>' + JSON.stringify(error));
    });


  } 

  showAddressChange(event){
    console.log("Parent LWC component function invoked");  
    this.template.querySelector("c-change-account-address").changeaddressfunction();  
    this.template.querySelector('div.cancelCertificateComp').classList.add('slds-hide');
    this.template.querySelector('div.changeAddressComp').classList.add('slds-hide');
    this.template.querySelector('div.ERPComp').classList.add('slds-hide');
    this.template.querySelector('div.firmInsuranceComp').classList.add('slds-hide');
    this.template.querySelector('div.compZerochangeAddressComp').classList.remove('slds-hide');
    
   }



    showCancelCertificate(event){
       console.log("Parent LWC component function invoked");  
       this.template.querySelector("c-cancel-insurance-certificate").midtermcancellationfunction();  
       this.template.querySelector('div.changeAddressComp').classList.add('slds-hide'); 
       this.template.querySelector('div.cancelCertificateComp').classList.add('slds-hide');
       this.template.querySelector('div.ERPComp').classList.add('slds-hide');
       this.template.querySelector('div.firmInsuranceComp').classList.add('slds-hide');
       this.template.querySelector('div.compOneCancelCertificate').classList.remove('slds-hide');
       
      }


      showFirmInsurance(event){
  
        this.template.querySelector("c-firm-insurance").midtermfirminsurancefunction(); 
        this.template.querySelector('div.changeAddressComp').classList.add('slds-hide'); 
        this.template.querySelector('div.cancelCertificateComp').classList.add('slds-hide');
        this.template.querySelector('div.ERPComp').classList.add('slds-hide');
        this.template.querySelector('div.firmInsuranceComp').classList.add('slds-hide');
        this.template.querySelector('div.compTwoFirmInsurance').classList.remove('slds-hide');
        
       }

       
      showERPComponent(event){
        this.template.querySelector("c-extended-reporting-period").midtermerpfunction();  
        this.template.querySelector('div.changeAddressComp').classList.add('slds-hide'); 
        this.template.querySelector('div.cancelCertificateComp').classList.add('slds-hide');
        this.template.querySelector('div.firmInsuranceComp').classList.add('slds-hide');
        this.template.querySelector('div.ERPComp').classList.add('slds-hide');
        this.template.querySelector('div.compThreeERP').classList.remove('slds-hide');
        
       }


}