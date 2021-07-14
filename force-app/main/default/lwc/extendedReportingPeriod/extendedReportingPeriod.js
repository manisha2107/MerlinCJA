import { LightningElement, api,track } from 'lwc';
import getERPs from '@salesforce/apex/getAllExtenedReportPeriod.getAllERP';
import getFirmInsuranceCertificate from '@salesforce/apex/PersonInformation.getBusinessAccountPolicy';
import getSelectedERP from '@salesforce/apex/getAllExtenedReportPeriod.getSelectedERP';
import getPPD from '@salesforce/apex/PersonInformation.getPPDList';
import getAcc from '@salesforce/apex/PersonInformation.getAccountRecord';
import { NavigationMixin } from 'lightning/navigation';

// import createOpp from '@salesforce/apex/createRenewalOpportunity.createERPOpp';
// import getOldERPInvoice from '@salesforce/apex/getAllExtenedReportPeriod.getOldERPInvoice';
// import createtheInvoice from '@salesforce/apex/CheckoutProcess.createInvoice';
// import createInvoiceandLine from '@salesforce/apex/CheckoutProcess.createInvoiceandLine';
// import createtheInvoiceCJA from '@salesforce/apex/CheckoutProcess.createInvoiceCJA';
// import deleteOpp from '@salesforce/apex/createRenewalOpportunity.deleteOpportunity';
// import updateOpp from '@salesforce/apex/createRenewalOpportunity.updateOpportunity';
// import UpdateOpponPaymentError from '@salesforce/apex/createRenewalOpportunity.updateOppAfterPaymentErr';
// import { deleteRecord } from 'lightning/uiRecordApi';
// import POLICY_OBJECT from '@salesforce/schema/InsurancePolicy';
// import isActive_FIELD from '@salesforce/schema/InsurancePolicy.IsActive';
// import Status_FIELD from '@salesforce/schema/InsurancePolicy.Status';
// import Extended_Reporting_Period__c_FIELD from '@salesforce/schema/InsurancePolicy.Extended_Reporting_Period__c';
// import Id from '@salesforce/schema/InsurancePolicy.Id';
// import {getRecord,updateRecord,generateRecordInputForUpdate,getFieldValue} from 'lightning/uiRecordApi';
// import USER_ID from '@salesforce/schema/User.Id';
// import CURRENTUSERID  from '@salesforce/user/Id';
// import USER_COMMUNITY_STATUS from '@salesforce/schema/User.Customer_Community_Status__c';
// import {CurrentPageReference} from 'lightning/navigation';
// import { createRecord } from 'lightning/uiRecordApi';
// import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
// import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
// import StageName_FIELD from '@salesforce/schema/Opportunity.StageName';
// import CloseDate_FIELD from '@salesforce/schema/Opportunity.CloseDate';
// import {ShowToastEvent} from 'lightning/platformShowToastEvent';
// import FinServ__ClaimsOnHouseholdPolicies__c from '@salesforce/schema/Account.FinServ__ClaimsOnHouseholdPolicies__c';

export default class ExtendedReportingPeriod extends NavigationMixin(LightningElement) {

@track erps;
@track error;
@api selectedOption;
@track title = 'Welcome';
@track currentStep;
@track showFeatures = true;
@track returnedERP;
@track accRecord;
@track childAddtionalpremiumPercentage;
@api propertyValue;
@track masterpolicystatus;
@track policyStatus;


@track transactionfee;
@track tax;

@track Invlineitems1 = {apiName: "AcctSeed__Billing_Line__c"};
@track Invlineitems2 = {apiName: "AcctSeed__Billing_Line__c"};
@track Invlineitems3 = {apiName: "AcctSeed__Billing_Line__c"};
@track Invlineitems4 = {apiName: "AcctSeed__Billing_Line__c"};

@track cjaInvlineitems1 = {apiName: "Invoice_Line_Items__c"};
@track cjaInvlineitems2 = {apiName: "Invoice_Line_Items__c"};
@track cjaInvlineitems3 = {apiName: "Invoice_Line_Items__c"};
@track cjaInvlineitems4 = {apiName: "Invoice_Line_Items__c"};


@track policiestoUpdate1 = {apiName: "InsurancePolicyCoverage"};
@track policiestoUpdate2 = {apiName: "InsurancePolicyCoverage"};


@track InvlineitemsData = [];

@track cjaInvlineitemsData = [];

@track invoiceLineArray = [];

@track policyObj = [];

@track invoiceandlineobj;

@track opportunityWrapper;

@track ppdListtoExpire = [];

@api childId;
@track childName;
@track childAddtionalpremium;
@track childPeriod;
@track childCategory;
@track childPolicyid; 
@track childAccountId; 
@track amount; 
@track currency ='CAD';
@track childinvnotes = 'This invoice is related to Extended Reporting Period';
@track invoiceDate; 
@track invoiceID; 
@track accountFirstName; 
@track accountLastName; 
@track accountfullname;
@track accountemail;
@track childPolicyrenewal;
@track childPremiumAmount;
@track monthsdiff;
@track CancelPolicyStatus = 'Purchased ERP';
@track unearnedpremium;
@track unearnedpremiumFirmCertificate;
@track prembyadditionalprem;
@track totaltransactioncharges;
@track tax;
@track broker;
@track brokerage;
@track productid;
@track quoteid;
@track oppRecord;
@track oppid;
@track commission;
@track oppPremiumAmount;
@track firmInsCertificate;
@track firmInsCertificateId;
@track monthsdiffFirmCert;
@track noPolicy = false;
@track purchasedERP = false;
@track firmPolicyStatus;
@track ERPexists;





get features() {
    return [
        {
            label: 'Update your Personal Information',
            icon: 'utility:edit',
        },
        {
            label:
                'Answer Eligibility Questions to select Coverage Options',
            icon: 'utility:save',
        },
        {
            label: 'Select Coverage Options',
            icon: 'utility:refresh',
        },
        {
            label: 'Review Quote',
            icon: 'utility:brush',
        },
        {
            label: 'Pay and Receive Insurance Certificate',
            icon: 'utility:download',
        },
    ];
}

        getTodayDate(){
        let rightNow = new Date();

        // Adjust for the user's time zone
        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );

        // Return the date in "YYYY-MM-DD" format
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        return(yyyyMmDd)
        }



        //Get today's date and time
        getDate(){

        //2021-01-22T17:00:00.000Z (from salesforce record)    
        let date = new Date();
        date.toISOString().slice(0, -5)

        return(date)

        }



goToStepTwo() { 
    this.currentStep = '2';

    this.template.querySelector('div.step1').classList.add('slds-hide');
    this.template.querySelector('div.step2').classList.remove('slds-hide');

   
}


    formatToCurrency = amount => { 
        amount = Number(amount)
        console.log('AMOUNT TO CONVERT '  +amount)
        let a=  "$" + amount.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, "$&,"); 
        console.log(' TO RETURN  ' + a)
        return a
     }


    numberWithCommas(x) {
        console.log('Number with comma =>  '+x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }


    connectedCallback(){  
      getERPs()
        .then(result => {

            console.log('Result::' + JSON.stringify(result));

            if(result == null){
                  
                this.ERPexists = true;
                this.template.querySelector('div.noERPFound').classList.remove('slds-hide');  
                this.template.querySelector('div.step1').classList.add('slds-hide');       

            }

            if(result != null){
    
                
                console.log('Result is not null::' + JSON.stringify(result));


                var erpsList = [];
              
                for(let i = 0; i < result.length; i++){

                    console.log('result i' + JSON.stringify(result[i]))
                    var amount  = result[i].Policy__r.PremiumAmount * result[i].Additional_Premium__c;
                   var calculatedamountvalue = 'CA$' + this.numberWithCommas(amount/100) + ' (' +  this.numberWithCommas(result[i].Additional_Premium__c) +'% of '+ 'CA$' + this.numberWithCommas(result[i].Policy__r.PremiumAmount) + ' for ' + result[i].Extended_Report_Period__c + ' ' + result[i].Extended_Reporting_Period_Category__c + ')' ;
              //      var calculatedamountvalue = this.formatToCurrency(amount/100) + ' (' +  result[i].Additional_Premium__c +'% of '+ result[i].Policy__r.PremiumAmount + ' for ' + result[i].Extended_Report_Period__c + ' ' + result[i].Extended_Reporting_Period_Category__c + ')' ;

                    console.log('Erp List ' + result[i].Id)
                    console.log('var amount = ' + amount)
                    console.log('var value = ' + calculatedamountvalue)
                    this.policyStatus = result[i].Policy__r.Status;
                    erpsList.push({
                            label: calculatedamountvalue,
                            value: result[i].Id
                           
                        })

                }

                console.log('Erp List ' + JSON.stringify(erpsList))
                this.erps = erpsList;

                console.log('ERP index 0 policy status ==' + JSON.stringify(this.erps[0])); 

                console.log('policy status ' + this.policyStatus);
                console.log('Get All ERPS ===> '+JSON.stringify(this.erps));

            }

            if(result != null && this.policyStatus != 'Activated' && this.policyStatus != 'Requested Cancellation' && this.policyStatus != 'Send Cancellation Notice' && this.policyStatus != 'Purchased ERP' && this.policyStatus != 'Cancelled'){

                this.noPolicy = true; 
                this.template.querySelector('div.noPolicyFound').classList.remove('slds-hide');                
                this.template.querySelector('div.step1').classList.add('slds-hide');                
                console.log('no Active Policy There (IF 1) ==> ' + this.noPolicy);

            } 

            if(this.policyStatus == 'Purchased ERP')
            
            {
                this.purchasedERP = true;
                this.template.querySelector('div.purchERP').classList.remove('slds-hide');  
                this.template.querySelector('div.step1').classList.add('slds-hide');                
                console.log('Purchased ERP ==> (IF 2)' + this.noPolicy);

            } 

            if(this.policyStatus == 'Activated' || this.policyStatus == 'Requested Cancellation' || this.policyStatus == 'Send Cancellation Notice' || this.policyStatus == 'Cancelled')

            {
            
                console.log('also other if  (IF 3)'); 
                this.currentStep = '1';  
                this.template.querySelector('div.step1').classList.remove('slds-hide');                
                
            getAcc()
                .then(result => {
                    
                    if(result){                    
                    this.accRecord = result;
                    this.accountemail = result.PersonEmail;
                    this.accountFirstName = result.firstName;
                    this.accountLastName = result.lastname;
                    this.accountfullname = result.Name;
                  //  this.title = 'Welcome ' + result.firstName 
                    console.log('Person email::' + this.accountemail);
                    console.log('Person name::' + this.accountfullname);

            //New Method to Get Firm Policy  
            getFirmInsuranceCertificate({})
             
             .then(result => {
             
          
              if(result){

                 this.firmInsCertificate = result; 
                 this.firmPolicyStatus = this.firmInsCertificate.Status;
                 this.firmInsCertificateId = this.firmInsCertificate.Id;
                 console.log('firm Insurance record details ==>'  + JSON.stringify(this.firmInsCertificate));

             }

            
         
             })
          
             .catch(error => {
                 this.error = error.message;
         
                 console.log('Error in firm certification ===>' + error.message);
             })

       
             }
            
             else{
        
                console.log('Result is null' + result);
                
            }
                })
                
            .catch(error => {
                    //this.error = error.message;
            console.log('Error ===>' + JSON.stringify(error));
              
            });
    
        }//}
               

        })
        .catch(error => {
            this.error = error;
            console.log('result not returned =>' + JSON.stringify(this.error));
        });

    }

handleChange(event) {
    
    this.selectedOption = event.detail.value;
    console.log('Option selected with value:' + this.selectedOption);
 }

 //Step 3
getSelectedERP() {
    
    if(this.checkIfError()) {

  //  console.log('ERP Record::' +this.selectedOption );
    getSelectedERP({selectedOption: this.selectedOption})
    .then(result => {
     //   console.log('Method has called');    
        if(result){
        console.log('result ===> '+JSON.stringify(result));
      //  this.returnedERP = result;
      //  console.log('result.name:::' + result.Name);
       
       //ERP Name
        this.childName = result.Name;
        console.log('childName:::' + this.childName);   

        //ERP Premium
        this.childAddtionalpremium = result.Additional_Premium__c;
        console.log('childAddtionalpremium:::' + this.childAddtionalpremium);  

        this.childAddtionalpremiumPercentage = this.childAddtionalpremium/100;

        //ERP Period
        this.childPeriod = result.Extended_Report_Period__c;
        console.log('childPeriod:::' + this.childPeriod);  
        
        //ERP Category
        this.childCategory = result.Extended_Reporting_Period_Category__c;
        console.log('childCategory:::' + this.childCategory); 

        //ERP Policy Id
        this.childPolicyid = result.Policy__c;
        console.log('childPolicyId:::' + this.childPolicyid);   
        
        //ERP Policy Renewal Date
          this.childPolicyrenewal = result.Policy__r.DateRenewed;
          console.log('childPolicyrenewal:::' + this.childPolicyrenewal); 

        //ERP Policy Renewal Date
        this.childPremiumAmount = result.Policy__r.PremiumAmount;
        console.log('childPremiumAmount:::' + this.childPremiumAmount); 

        //ERP Policy Broker
        this.broker = result.Policy__r.Broker__c;
        console.log('broker:::' + this.broker); 

        //ERP Policy Brokerage
        this.brokerage = result.Policy__r.Brokerage__c;
        console.log('broker:::' + this.brokerage); 
        
        //Policy Commission
        this.commission = result.Policy__r.Commission__c;
        console.log('commission:::' + this.commission); 


        //Today
        this.monthsdiff = result.months_difference__c;
        console.log('today' + this.monthsdiff); 

   //     this.monthsdiffFirmCert = this.firmInsCertificate.months_difference__c;

        //ERP Account Id
        this.childAccountId = result.Policy__r.NameInsuredId;
        console.log('childAccountId:::' + this.childAccountId); 

        //ERP Account Id
        this.productid = result.Policy__r.ProductId;
        console.log('quoteproductid:::' + this.productid); 

        //ERP Quote Id
        this.quoteid = result.Policy__r.Renewal_Quote__c;
        console.log('quoteproductid:::' + this.quoteid); 

        this.masterpolicystatus = result.Policy__r.Status;

        /*Invoice Amount
        this.amount = (result.Policy__r.PremiumAmount *  result.Additional_Premium__c)/100;
        console.log('Yealy Premium:::' + this.amount); */
        //Hide ERP Screen and Show Invoice Component
    
    if(this.masterpolicystatus != 'Cancelled'){   

    var BLI1calculation = (this.childPremiumAmount * this.childAddtionalpremium)/100;
    var BLI2calculation = (this.childPremiumAmount/-12)*this.monthsdiff;
    console.log('BLI1calculation in if ==> ' + BLI1calculation + ' -- ' + BLI2calculation + 'master policy status ==> ' + this.masterpolicystatus );
    }

    else{

        console.log('BLI1calculation in else' + BLI1calculation + ' -- ' + BLI2calculation);
        var BLI1calculation = (this.childPremiumAmount * this.childAddtionalpremium)/100;
        var BLI2calculation = 0; 
    }

     var BLI3calculation = 10;

     var BLI4calculation = 20;

    if(this.firmInsCertificate != null && this.firmInsCertificate.Status != 'Cancelled' ){

    var BLI5calculation = (this.firmInsCertificate.PremiumAmount/-12)*this.firmInsCertificate.months_difference__c;

    console.log('BLI5calculation ===========>' + BLI5calculation);
    }

    else{

      var  BLI5calculation = 0;
    }

      console.log('the date difference is:::::' + BLI1calculation);
      console.log('the date difference is:::::' + BLI2calculation);
      console.log('BLI5 Calculation' + BLI5calculation);
    
//Billing Line or CJA Invoice Line 1


 console.log('invoice line item array ==> ' + JSON.stringify(this.invoiceLineArray));


        this.Invlineitems1.AcctSeed__Billing__c = "";
        this.Invlineitems1.AcctSeed__Rate__c    = BLI1calculation;
        this.Invlineitems1.AcctSeed__Hours_Units__c = 1;

        this.cjaInvlineitems1.Invoice__c = "";
        this.cjaInvlineitems1.Rate__c = 100;// BLI1calculation;
        this.cjaInvlineitems1.Quantity__c = 1;    

        this.InvlineitemsData.push(this.Invlineitems1);
        this.cjaInvlineitemsData.push(this.cjaInvlineitems1);
//

//Billing Line or CJA Invoice Line 2
      this.Invlineitems2.AcctSeed__Billing__c = "";
      this.Invlineitems2.AcctSeed__Rate__c    = BLI2calculation;
      this.Invlineitems2.AcctSeed__Hours_Units__c = 1;

      this.cjaInvlineitems2.Invoice__c = "";
      this.cjaInvlineitems2.Rate__c = 200; //BLI2calculation;
      this.cjaInvlineitems2.Quantity__c = 1;

      this.InvlineitemsData.push(this.Invlineitems2);
      this.cjaInvlineitemsData.push(this.cjaInvlineitems2);

//
      //Billing Line or CJA Invoice Line 3
      this.Invlineitems3.AcctSeed__Billing__c = "";
      this.Invlineitems3.AcctSeed__Rate__c    = BLI3calculation;
      this.Invlineitems3.AcctSeed__Hours_Units__c = 1;

      this.cjaInvlineitems3.Invoice__c = "";
      this.cjaInvlineitems3.Rate__c = BLI3calculation;
      this.cjaInvlineitems3.Quantity__c = 1;
    
      this.InvlineitemsData.push(this.Invlineitems3);
      this.cjaInvlineitemsData.push(this.cjaInvlineitems3);

//Billing Line or CJA Invoice Line 4

      this.Invlineitems4.AcctSeed__Billing__c = "";
      this.Invlineitems4.AcctSeed__Rate__c    = BLI4calculation;
      this.Invlineitems4.AcctSeed__Hours_Units__c = 1;

      this.cjaInvlineitems4.Invoice__c = "";
      this.cjaInvlineitems4.Rate__c = BLI4calculation;
      this.cjaInvlineitems4.Quantity__c = 1;  

      this.InvlineitemsData.push(this.Invlineitems4);
      this.cjaInvlineitemsData.push(this.cjaInvlineitems4);

//Sum of All Calculations
      var sumoflineitems = BLI1calculation + (BLI2calculation) + BLI3calculation + BLI4calculation + BLI5calculation;
      this.amount       =   sumoflineitems;
      this.oppPremiumAmount =  BLI1calculation + (BLI2calculation) + BLI5calculation;
      this.transactionfee =  BLI3calculation;
      this.tax = BLI4calculation;



      console.log('cjaInvlineitemsData =====================!!!!>>>>>>>>>>>>>>   '  + JSON.stringify(this.cjaInvlineitemsData));
      console.log('InvlineitemsData    =====================!!!!>>>>>>>>>>>>>>   '  + JSON.stringify(this.InvlineitemsData));




      this.prembyadditionalprem =  BLI1calculation;     
      this.unearnedpremium =  BLI2calculation;
      this.totaltransactioncharges =  BLI3calculation;
      this.tax = BLI4calculation;
      this.unearnedpremiumFirmCertificate = BLI5calculation;

      this.invoiceLineArray.push({invid : "", rate : this.prembyadditionalprem, quantity : 1});
      this.invoiceLineArray.push({invid : "", rate : this.unearnedpremium, quantity : 1});
      this.invoiceLineArray.push({invid : "", rate : this.totaltransactioncharges, quantity : 1});
      this.invoiceLineArray.push({invid : "", rate : this.tax, quantity : 1});


/*
      this.invoiceLineArray.push({invid : "", rate : 5000, quantity : 1});
      this.invoiceLineArray.push({invid : "", rate : 1000, quantity : 1});
      this.invoiceLineArray.push({invid : "", rate : 15000, quantity : 1});
      this.invoiceLineArray.push({invid : "", rate : 20000, quantity : 1});

*/  

    // console.log('premium by additional amount => ' + BLI1calculation)
    // console.log('unearnedpremium => ' + BLI2calculation)
    // console.log('totaltransactioncharges => ' + BLI1calculation)
    // console.log('tax => ' + BLI3calculation)
    // console.log('unearnedpremiumFirmCertificate => ' + BLI4calculation)


     console.log('premium by additional amount => ' + this.prembyadditionalprem)
    console.log('unearnedpremium => ' + this.unearnedpremium)
    console.log('totaltransactioncharges => ' + this.totaltransactioncharges)
    console.log('tax => ' + this.tax)
    console.log('unearnedpremiumFirmCertificate => ' + this.unearnedpremiumFirmCertificate)

    this.currentStep = '3';
      this.template.querySelector('div.step2').classList.add('slds-hide');
      this.template.querySelector('div.step5').classList.remove('slds-hide');
      console.log('premium by additional amount after hide and show => ' + this.prembyadditionalprem)

/*
      if(this.masterpolicystatus != 'Cancelled'){ 
      this.policiestoUpdate1.Id = this.childPolicyid;          
      this.policiestoUpdate1.Extended_Reporting_Period__c = this.selectedOption;
      this.policiestoUpdate1.Status = 'Purchased ERP';
      this.policiestoUpdate1.ERP_Amount__c = this.prembyadditionalprem;
      this.policiestoUpdate1.ERP_Purchased_Date__c =  this.getTodayDate();
      this.policiestoUpdate1.CancellationDate = this.getTodayDate();
      this.policiestoUpdate1.Cancellation_Invoice__c = "";
      this.policiestoUpdate1.Cancellation_Amount__c = this.unearnedpremium;

      this.policyObj.push(this.policiestoUpdate1);
      
    }


    if(this.masterpolicystatus == 'Cancelled'){
        this.policiestoUpdate1.Id = this.childPolicyid;
        this.policiestoUpdate1.Extended_Reporting_Period__c = this.selectedOption;
        this.policiestoUpdate1.Status = 'Purchased ERP';
        this.policiestoUpdate1.ERP_Amount__c = this.prembyadditionalprem;
        this.policiestoUpdate1.ERP_Purchased_Date__c =  this.getTodayDate();
        this.policiestoUpdate1.Cancellation_Invoice__c = "";
  
        this.policyObj.push(this.policiestoUpdate1);
        
      }


      if(this.firmInsCertificate == 'Active'){
        this.policiestoUpdate2.Id = this.firmInsCertificate.Id;  
        this.policiestoUpdate2.Status = 'Cancelled';
        this.policiestoUpdate2.CancellationDate = this.getTodayDate();
        this.policiestoUpdate2.Cancellation_Amount__c = this.unearnedpremiumFirmCertificate;
  
        this.policyObj.push(this.policiestoUpdate2);
        
      }

 */
    
    /*
    createOpp({name:this.childName,broker:this.broker,brokerage:this.brokerage,accountid:this.childAccountId,
               productId:this.productid,policyId:this.childPolicyid,quoteId:this.quoteid})
    
    .then(result => {
    

     if(result){

        console.log('opportunity created');
        this.oppRecord = result;
        this.oppid = result.Id;
        console.log('opp record details ==>'  + JSON.stringify(this.oppRecord));
        console.log('opp record id ==>'  + this.oppid);

    }

    })
 
    .catch(error => {
        this.error = error.message;

        window.console.log('Error in opp ===>' + error.message);
    })
*/

/*
      const fields = {};

        fields[NAME_FIELD.fieldApiName] = this.childName + ' - Renewal';
        fields[StageName_FIELD.fieldApiName] = 'Qualification';
       fields[CloseDate_FIELD.fieldApiName] = '2020-10-28';
       
        // Creating record using uiRecordApi
        let recordInput = { apiName:OPPORTUNITY_OBJECT.objectApiName, fields }
        createRecord(recordInput)
        .then(result => {
            // Clear the user enter values

            window.console.log('result ===> '+result);
            // Show success messsage
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: 'Opportunity Created Successfully!!',
                variant: 'success'
            }),);
        })
        .catch(error => {
            this.error = JSON.stringify(error);
        });


*/
  
          }
          
      })
    .catch(error => {
        this.error = error.message;
        window.console.log('Error ===>' + error.message);
     
    });

        }
    }

  
//get all PPDs related to invoice and show invoice 
showInvoiceGetPPd() {
   
    if(this.masterpolicystatus != 'Cancelled'){ 
        this.policiestoUpdate1.Id = this.childPolicyid;          
        this.policiestoUpdate1.Extended_Reporting_Period__c = this.selectedOption;
        this.policiestoUpdate1.Status = 'Purchased ERP';
        this.policiestoUpdate1.ERP_Amount__c = this.prembyadditionalprem;
        this.policiestoUpdate1.ERP_Purchased_Date__c =  this.getTodayDate();
        this.policiestoUpdate1.CancellationDate = this.getTodayDate();
        this.policiestoUpdate1.Cancellation_Invoice__c = "";
        this.policiestoUpdate1.Cancellation_Amount__c = this.unearnedpremium * -1;
  
        this.policyObj.push(this.policiestoUpdate1);
        
      }
  
  
      if(this.masterpolicystatus == 'Cancelled'){
          this.policiestoUpdate1.Id = this.childPolicyid;
          this.policiestoUpdate1.Extended_Reporting_Period__c = this.selectedOption;
          this.policiestoUpdate1.Status = 'Purchased ERP';
          this.policiestoUpdate1.ERP_Amount__c = this.prembyadditionalprem;
          this.policiestoUpdate1.ERP_Purchased_Date__c =  this.getTodayDate();
          this.policiestoUpdate1.Cancellation_Invoice__c = "";
    
          this.policyObj.push(this.policiestoUpdate1);
          
        }
  
  
        if(this.firmPolicyStatus == 'Activated'){
          this.policiestoUpdate2.Id = this.firmInsCertificateId;
          this.policiestoUpdate2.Status = 'Cancelled';
          this.policiestoUpdate2.CancellationDate = this.getTodayDate();
          this.policiestoUpdate2.Cancellation_Amount__c = this.unearnedpremiumFirmCertificate * -1;
    
          this.policyObj.push(this.policiestoUpdate2);
        }  

    console.log('policy obj  => ' + JSON.stringify(this.policyObj));

    this.invoiceandlineobj = {accid:this.childAccountId,
        accEmail:this.accountemail,
        policyId:this.childPolicyid,
        curr:this.currency,
        invamount:this.amount,
        invnotes:this.childinvnotes,
        erpId:this.selectedOption,
        invoicetype:'Cancelled with Purchase ERP',
       listofInvLineItems:this.invoiceLineArray
    };

//check if objects are filled properly
console.log('invoice array wrapper   ===>  ' + JSON.stringify(this.invoiceandlineobj)); 

//entering opportunity object data
this.opportunityWrapper = ({name:this.accountfullname + ' - ' + 'Purchased ERP',     
                 recordtypeDevName:'Renewal_Opportunity',
                 accountid:this.childAccountId,
                 type:'Purchase ERP',
                 policyId:this.childPolicyid,
                 productId:this.productid,
                 quoteId:this.quoteid,
                 broker:this.broker,
                 brokerage:this.brokerage,
                 commission:this.commission,
                 amount:this.oppPremiumAmount,
                 discount:0,
                 policyfee:this.transactionfee,
                 stage:'Closed Won'
               //  closedate:this.getTodayDate()
               })

console.log('Opportunity array wrapper   ===>  ' + JSON.stringify(this.opportunityWrapper)); 


    getPPD({policyId:this.childPolicyid})
    
        .then(result => {
    
         console.log('policy prodyct details ---' + JSON.stringify(result));
    
         if(result){

           this.currentStep = '4';      
           this.template.querySelector('div.step5').classList.add('slds-hide');
           this.template.querySelector('div.step3').classList.remove('slds-hide');
          // this.ppdList = result;
    
        let temp = [];

        for (let i = 0 ; i< result.length; i++){

        temp.push({
                Id: result[i].Id,
                Status__c: 'Expired',
                ExpirationDate: this.getDate() 

        })    
        } 
        this.ppdListtoExpire = temp
        console.log('policy product details after update ==> ' + JSON.stringify(this.ppdListtoExpire));
        
    }    
    
        })
     
        .catch(error => {
            this.error = error.message;
            console.log('Error while creating cja invoice!!! ===>' + JSON.stringify(this.error));
        })
    }
        


    showInvoice() {
//entering invoice object data    

/*
createInvoiceandLine({invline:this.invoiceLineArray,invoice:this.invoiceobj})

    .then(result => {

     console.log('inserted invoice detail ---' + JSON.stringify(result));

     if(result){

      this.invoiceDate  = result.Invoice_Date__c;
        this.invoiceID    = result.Id;
        console.log('invDate --' + this.invoiceDate);
        console.log('invID  --' + this.invoiceID);
        console.log('SelectedOption  --' + this.selectedOption);
        console.log('amount  --' + this.amount);
 

    }
    

    })
 
    .catch(error => {
        this.error = error.message;
        console.log('Error while creating cja invoice!!! ===>' + JSON.stringify(this.error));
    })
*/
}
    


handleERPAfterPayment(event){
    const childcompname=event.detail.childcompname;
    const childcompdescription=event.detail.childcompdescription;
    console.log('child event passed succussfuly from Invoice to ERP Component');

 /*  let record = {fields: {Id:this.childPolicyid,Status:this.CancelPolicyStatus,Extended_Reporting_Period__c:this.selectedOption},};
      updateRecord(record)

        const fields = {};
        fields[USER_ID.fieldApiName] = CURRENTUSERID;
        fields[USER_COMMUNITY_STATUS.fieldApiName] = 'Purchased ERP';
 
        const userRecordInput = { fields };  
        
        updateRecord(userRecordInput)

            // eslint-disable-next-line no-unused-vars
            .then(() => {

            //     this[NavigationMixin.Navigate]({
            //         type: 'standard__recordPage',
            //         attributes: {
            //             "recordId": this.childPolicyid,
            //             "objectApiName": "InsurancePolicy",
            //             "actionName": "view"
            //         },
            //    });

            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({title: 'Error on data save',message: error.message.body,variant: 'error',}),
                );
            });

*/
}

handlePaymentError(event){

    const childcompname=event.detail.childcompnameerror;
    const childcompdescription=event.detail.childcomperrorDesc;
    console.log('child event passed succussfuly from Invoice Error to ERP Component but theres and error');

}

checkIfError(){
    var areAllValid = true;
    var inputs = this.template.querySelectorAll('.erpvalidation');
    inputs.forEach(input => {
        if(!input.checkValidity()){
            input.reportValidity();
            areAllValid = false;

        }
        });
   
        return areAllValid;

}

}