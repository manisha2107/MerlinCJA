/**
 * Class Name: Parent Navigation (JS)
 * Description : JS Class to navigate to child components (Personal Information, Eligibility, Product Info, Quote, Invoice) on different criteria
 * Author : Ahad Farooque, Maaz Hasnein, Mohammed Ali & Manisha Kumari
 * Date: 6th April 2020
 * Last Modified By: Manisha Kumari
 * Last Modified Date: 12/02/2021
 */

import { LightningElement, api, track } from 'lwc';

// Importing Lightning Navigation
import { NavigationMixin } from 'lightning/navigation';

// Importing Apex Classes
import getAccount from '@salesforce/apex/PersonInformation.getAccountRecord';
import getBuisnessLicenseData from '@salesforce/apex/GetAccLicenses.getBuisnessLicenseData';
import getPPDSForParentNav from '@salesforce/apex/CoverageChoice.getPPDSForParentNav';
import getFirmRider from '@salesforce/apex/CoverageChoice.getFirmRider';
// Default Method 
export default class ParentNavigation extends NavigationMixin(LightningElement) {

  // Store Design variable (Purchase Policy , Mid-Term Changes, Renewal)
  @api Design;

  // Store Running User Account
  @track accRecord;

  // Variables of Authorization Page 
  @track currentStep;
  @track title = 'Welcome!';
  @track message;
  @track accepted = false;
  @track showFeatures = true;
  @track AccountName;

  // Variables of Eligibility Page
  @api parentdata

  // Variables of Invoice Component

  @track amount;
  @track invoiceandlineobj;
  @track opportunityWrapper;
  @track ppdListtoExpire;
  @track ppdListtoActivate = [];
  @track policyObj = [];
  @track accountfullname;
  @track accountFirstName;
  @track accountLastName;
  @track accountemail;
  @track brokerage;
  @track splitlicensesList = [];
  @track mapOfAllPPdds = new Map()

  /**
   * Connected Call Back Method
   * Apex Call to Get Account Record
   * Navigate to proper page 
   */


  connectedCallback() {
    
    getAccount()
      .then(result => {

        if (result) {

          getPPDSForParentNav({
            PolicyHolder:result.HiddenAccount__r.Id,
            NameInsured:result.Id
          })
          .then(
            resultFromgetPPDSForParentNav=>{
             if(resultFromgetPPDSForParentNav.length>0){
              let tempMap = new Map();
              console.log('resultFromgetPPDSForParentNav ' + JSON.stringify(resultFromgetPPDSForParentNav))
              for(let i = 0 ;  i < resultFromgetPPDSForParentNav.length; i++){
                // console.log('Policy_Product_Name__c is ' +resultFromgetPPDSForParentNav[i].Policy_Product_Name__c + ' PPD --> ' +JSON.stringify(resultFromgetPPDSForParentNav[i]))
                if(!tempMap.has(resultFromgetPPDSForParentNav[i].Policy_Product_Name__c)){
                  console.log('in if  resultFromgetPPDSForParentNav[i].Policy_Product_Name__')
                  tempMap.set(resultFromgetPPDSForParentNav[i].Policy_Product_Name__c,resultFromgetPPDSForParentNav[i]);
                  console.log("tempMap.get(resultFromgetPPDSForParentNav[i].Policy_Product_Name__c) " +JSON.stringify(tempMap.get(resultFromgetPPDSForParentNav[i].Policy_Product_Name__c)))
                }
                else{
                  console.log('in else resultFromgetPPDSForParentNav[i].Policy_Product_Name__c')
                }
                
              }

              this.mapOfAllPPdds = tempMap
            
             }
              
              
              
            }
          )
          .catch(errorgetPPDSForParentNav=>{
            console.log('Error ' + errorgetPPDSForParentNav)
          })

          this.accRecord = result;
          
          this.NavigateToProperPage();

        }
      })
      .catch(error => {
        console.log('Error in Connected Callback of Parent Nav===>' + JSON.stringify(error));
      });
      

  }

  /**
   * Method to navigate to Proper Page based on the Account Current Stage
   * 
   * If == Eligibility, assign ParentData and navigate to Eligbility
   * If == Quote, assign this.accountRecord and navigate to Product Info
   * If == Payment, assign Policies, ListOfPPDS and navigate to Quote
   * If == Suspended , navigate to Suspend Component
   */


  NavigateToProperPage() {
    console.log('this.accRecord.Application_Current_Stage__c  '+ this.accRecord.Application_Current_Stage__c )
    if(this.accRecord.Application_Current_Stage__c == 'Not Started'){
      this.currentStep="1"
      this.navigateToGeneralInfo()
    }
    // If Current Stage == Personal Information, assign this.accountRecord and navigate to PersonalInformation
    else if (this.accRecord.Application_Current_Stage__c == 'Personal Information') {
      this.currentStep="2"
      this.navigateToPersonalInfo()

    }

    //If == Eligibility, assign ParentData and navigate to Eligbility
    else if(this.accRecord.Application_Current_Stage__c == 'Eligibility Test') {
      this.currentStep="3"
      this.navigateToEligibility()
    }
    else if(this.accRecord.Application_Current_Stage__c == 'Quote'){
      this.currentStep="4"
      let values = {detail:{childcompname:'Product info',childcompdescription:'DESCRIPTION',SelectedLicence:this.accRecord.Applicable_License__r.Licenses_Type__c }}
      this.navigateToProductInfo(values)
    }

    else if(this.accRecord.Application_Current_Stage__c == 'Suspended'){

      this.currentStep = "4";
      //stepThree2
        
      this.template.querySelector('div.stepOne').classList.add('slds-hide');
      this.template.querySelector('div.stepTwo').classList.add('slds-hide');
      this.template.querySelector('div.stepThree').classList.add('slds-hide');
      this.template.querySelector('div.stepThree2').classList.remove('slds-hide');
      this.template.querySelector('div.stepFour').classList.add('slds-hide');
    }

    else {

      console.log('Application Current Stage::' + this.accRecord.Application_Current_Stage__c);
    }
    console.log('Account Record ::' + JSON.stringify(this.accRecord));
    this.AccountName = this.accRecord.HiddenAccount__r.Name;

    
  }


  /**
   * Method to assign Authorization description and other variables
   */
  setAuthorizationVar(result) {

    console.log('result ===> ' + JSON.stringify(result));

    this.accRecord = result;

    this.title = this.title + ' ' + this.accRecord.FirstName;

    console.log('Account record values::' + JSON.stringify(this.accRecord));

    console.log('Title::' + this.title + 'Account First Name::' + this.accRecord.HiddenAccount__r.Name);

    this.AccountName = this.accRecord.HiddenAccount__r.Name;

    console.log('Message to print::' + this.message);

  }

  navigateToGeneralInfo(){
    this.currentStep = '1';
    this.template.querySelector('div.stepOne').classList.remove('slds-hide');
    this.template.querySelector('div.stepTwo').classList.add('slds-hide');
    this.template.querySelector('div.stepThree').classList.add('slds-hide');
    this.template.querySelector('div.stepFour').classList.add('slds-hide');
  }
  /**
   * Method to show Personal Information Component and hide all other components
   * Call Personal Information ChildFunction to set Account record
   */
  navigateToPersonalInfo() {


    try {

      this.currentStep = '2';
      console.log("Navigate to Personal Info has called");
      console.log('Account Record to be passed::' + JSON.stringify(this.accRecord));
      this.template.querySelector('div.stepOne').classList.add('slds-hide');
      this.template.querySelector('div.stepTwo').classList.remove('slds-hide');
      this.template.querySelector('div.stepThree').classList.add('slds-hide');
      this.template.querySelector('div.stepFour').classList.add('slds-hide');

      this.template.querySelector("c-personal-information").childFunction(this.accRecord, this.Design);
      console.log('Child Function has called::' + JSON.stringify(this.accRecord));


    } catch (error) {

      console.log('Error in Personal Info Navigation::' + JSON.stringify(error));
    }

  }

  /**
   * Method to show Eligbility Component and hide all other components
   * Call Personal Information ChildFunction to set License Details and Related Licenses
   * If Design is Mid-Term skip this component and navigate to Product Info
   */
  navigateToEligibility(event) {
    console.log('NAVIGATING TO ELIGIBILITY')
    if (this.Design != 'Mid-Term') {

      console.log('Advisor Licenses has called');

      this.currentStep = '3';
      console.log('Current step ' + this.currentStep)

      try {

        console.log('Role__c  ' + this.accRecord.Applicable_License__r.Role__c)
        console.log('License ' + this.accRecord.Applicable_License__r.Licenses_Type__c)
     
      }
      catch (e) {
        
        console.log('No role and licenses')
       
      }

      console.log('ELigibility Template::' + this.template.querySelector("c-eligibilty"));
      var tem = this.template.querySelector("c-eligibilty");
      getBuisnessLicenseData({ AccId: this.accRecord.Id })
        .then(result => {
          console.log('BEFORE GOING TO ELIGIBILITY QUESTIONS ' + JSON.stringify(result))
          console.log('SPLIT LICENSES FROM PARENT = ' + this.splitlicensesList)
          this.template.querySelector("c-eligibilty").childFunction(this.accRecord, result);
          console.log('Advisor Licenses::' + JSON.stringify(this.template));
          this.template.querySelector('div.stepOne').classList.add('slds-hide');
          this.template.querySelector('div.stepTwo').classList.add('slds-hide');
          this.template.querySelector('div.stepThree').classList.remove('slds-hide');
          this.template.querySelector('div.stepFour').classList.add('slds-hide');
          

        })
        .catch(err => console.log('error in parentNav before running eligibility' + err))



    }
    else {
      
      if(event.detail.direction){
        this.navigateToPersonalInfo(event)
      }
      else{
        this.navigateToProductInfo(event)
      }
    }
  }

  //NAVIGATE TO PRODUCT
  navigateToProductInfo(event) {
    const secondchildcompname = event.detail.childcompname;
    const secondchildcompdescription = event.detail.childcompdescription;
    const license = event.detail.SelectedLicence;
    console.log('In parent Navigation, about to call product info Selected license is ' + license)
    console.log('secondchildcompname: ' + secondchildcompname)
    // console.log('childcompdescription: ' + childcompdescription)
    this.currentStep = '4';
    
    console.log('Current Step::' + this.currentStep);
    console.log('this.mapOfAllPPdds ' + this.mapOfAllPPdds)
    getFirmRider({ HiddenAccId: this.accRecord.HiddenAccount__c,  UserId:this.accRecord.Id, })
    .then(result=>{
      console.log('getFirmRider data ' + JSON.stringify(result))
      
      this.template.querySelector("c-product-info").childFunction(this.accRecord, license,this.mapOfAllPPdds,result,this.Design);

    })
    .catch(
      result=>{
        console.log('error in getFirmRider ' + result)
        this.template.querySelector("c-product-info").childFunction(this.accRecord, license,this.mapOfAllPPdds,{},this.Design);
      }
    )

    


    this.template.querySelector('div.stepOne').classList.add('slds-hide');
    this.template.querySelector('div.stepTwo').classList.add('slds-hide');
    this.template.querySelector('div.stepThree').classList.add('slds-hide');
    this.template.querySelector('div.stepFour').classList.remove('slds-hide');
  }

  //NAVIGATE TO QUOTE
  navigateToQuoteInfo(event) {
    const thirdchildcompname = event.detail.thirdchildcompname;
    const thirdchildcompdescription = event.detail.thirdchildcompdescription;
    const policy = event.detail.Policies;
    const PPD = event.detail.ppds;
    const transactionFee = event.detail.transactionFee;
    const RecentPremium = event.detail.RecentPremium
    const isSuspended = event.detail.isSuspended

    if(isSuspended){
      this.template.querySelector('div.stepThree').classList.add('slds-hide');
      this.template.querySelector('div.stepFour').classList.add('slds-hide');
      this.template.querySelector('div.stepThree2').classList.remove('slds-hide');
      this.template.querySelector('div.stepFive').classList.add('slds-hide');
    }
    else{
      console.log('thirdchildcompname: ' + thirdchildcompname)
      this.currentStep = '5';
      console.log('CALLING QUOTE')
      console.log('policy in navigateToQuoteInfo' +JSON.stringify(policy))
      console.log('PPD in navigateToQuoteInfo' +JSON.stringify(PPD))
      console.log('transactionFee in navigateToQuoteInfo' + JSON.stringify(transactionFee))
      this.template.querySelector("c-quote").childFunction(this.accRecord, policy, PPD, transactionFee,this.Design,RecentPremium);
      this.template.querySelector('div.stepThree2').classList.add('slds-hide');
      this.template.querySelector('div.stepThree').classList.add('slds-hide');
      this.template.querySelector('div.stepFour').classList.add('slds-hide');
      this.template.querySelector('div.stepFive').classList.remove('slds-hide');
    }
    
  }



  // Get Current Stage of Application


  concentTaken(event) {
    console.log(" ACCEPTEDDDD 111:: " + event.target.value)
    this.accepted = event.target.checked

  }

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


  //------------------------------------------------------------------------------------------------------------//

  //Go to Introduction Page

  goBackToStepOne() {
    this.currentStep = '1';
    this.template.querySelector('div.stepTwo').classList.add('slds-hide');
    this.template.querySelector('div.stepOne').classList.remove('slds-hide');
  }

  //------------------------------------------------------------------------------------------------------------//

  //Go to Personal Information Page

  // goToStepTwo() {

  //   this.currentStep = '2';

  //   console.log("Parent LWC component function invoked");
  //   console.log('Account Record to be passed::' + this.accRecord);
  //   this.template.querySelector("c-personal-information").childFunction(this.accRecord);
  //   console.log('Child Function has called::' + JSON.stringify(this.accRecord));
  //   this.step2 = true;
  //   this.template.querySelector('div.stepOne').classList.add('slds-hide');
  //   this.template.querySelector('div.stepTwo').classList.remove('slds-hide');
  //   this.template.querySelector('div.stepThree').classList.add('slds-hide');
  //   this.template.querySelector('div.stepFour').classList.add('slds-hide');

  // }
  //------------------------------------------------------------------------------------------------------------//







  //Go to Eligibility Questions Page

  //   @track splitlicensesList = []
  //   handlechildevent(event) {
  //     console.log('Advisor Licenses has called');
  //     const childcompname = event.detail.childcompname;
  //     const childcompdescription = event.detail.childcompdescription;
  //     this.currentStep = '3';
  //     console.log('Current step ' + this.currentStep)
  //     // this.template.querySelector("c-eligibility-test").childFunction();  
  //     // var accRec2 = 
  //     // if(this.accRecord.Applicable_License__r.Role__c && this.accRecord.Applicable_License__r.Licenses_Type__c)
  //     try {
  //       console.log('Role__c  ' + this.accRecord.Applicable_License__r.Role__c)
  //       console.log('License ' + this.accRecord.Applicable_License__r.Licenses_Type__c)
  //       var parentdata = {
  //         role: this.accRecord.Applicable_License__r.Role__c,
  //         License: this.accRecord.Applicable_License__r.Licenses_Type__c,
  //         accRecord: this.accRecord
  //       };
  //     }
  //     catch (e) {
  //       console.log('No role and licenses')
  //       var parentdata = {
  //         role: null,
  //         License: null,
  //         accRecord: this.accRecord
  //       };
  //     }

  //     console.log('PARENT DATA ' + JSON.stringify(parentdata))
  //     // let splitlicenses = []
  //     getBuisnessLicenseData({ AccId: this.accRecord.Id })
  //       .then(result => {
  //         console.log('BEFORE GOING TO ELIGIBILITY QUESTIONS ' + JSON.stringify(result))
  //         for (let i = 0; i < result.length; i++) {
  //           console.log('in For')
  //           this.splitlicensesList.push({
  //             LicensesTypeSplit: result[i].Name,
  //             TotalAnnualEarning: result[i].Percentage_Of_Total_Income__c,
  //             PercentageOfTotalIncome: result[i].Total_Annual_Earning__c,
  //             ProvincialJurisdictions: result[i].Provincial_Jurisdiction__c.split(';'),
  //             Id: i
  //           })

  //           // console.log('splitlicenses in for' +JSON.stringify(this.splitlicensesList))

  //           // console.log('splitlicenses final ' +JSON.stringify(this.splitlicensesList)) 



  //         }

  //           this.template.querySelector("c-eligibilty").childFunction(parentdata, this.splitlicensesList);
  //           console.log('Advisor Licenses::' + JSON.stringify(this.template));

  //           if(this.Design !='Mid-Term'){
  //             this.template.querySelector('div.stepOne').classList.add('slds-hide');
  //             this.template.querySelector('div.stepTwo').classList.add('slds-hide');
  //             this.template.querySelector('div.stepThree').classList.remove('slds-hide');
  //             this.template.querySelector('div.stepFour').classList.add('slds-hide');
  //           }
  //           else{
  //             this.template.querySelector('div.stepOne').classList.add('slds-hide');
  //             this.template.querySelector('div.stepTwo').classList.add('slds-hide');
  //             this.template.querySelector('div.stepThree').classList.add('slds-hide');
  //             this.template.querySelector('div.stepFour').classList.remove('slds-hide');
  //           }

  //       })
  //       .catch(err => console.log('error in parentNav before running eligibility' + err))

  //   }
  //   //------------------------------------------------------------------------------------------------------------//

  //   //Go to Product Info

  //   handlechildevent2(event) {
  //     const secondchildcompname = event.detail.childcompname;
  //     const secondchildcompdescription = event.detail.childcompdescription;
  //     const license = event.detail.SelectedLicence;
  //     console.log('In parent Navigation, about to call product info Selected license is '+license)
  //     console.log('secondchildcompname: ' + secondchildcompname)
  //     // console.log('childcompdescription: ' + childcompdescription)
  //     this.currentStep = '4';

  //     console.log('Current Step::' + this.currentStep);
  //     this.template.querySelector("c-product-info").childFunction(this.accRecord,license);


  //     this.template.querySelector('div.stepOne').classList.add('slds-hide');
  //     this.template.querySelector('div.stepTwo').classList.add('slds-hide');
  //     this.template.querySelector('div.stepThree').classList.add('slds-hide');
  //     this.template.querySelector('div.stepFour').classList.remove('slds-hide');
  //     /*
  //            if(secondchildcompname =='Quote'){ 

  //             this.template.querySelector('div.stepThree').classList.add('slds-hide');
  //             this.template.querySelector('div.stepFour').classList.remove('slds-hide');
  //           }
  //           else if (secondchildcompname =='Suspended'){

  //             this.template.querySelector('div.stepThree').classList.add('slds-hide');
  //             this.template.querySelector('div.stepThree2').classList.remove('slds-hide');

  //           }
  //           else if(secondchildcompname == 'Personal Information'){

  //             this.template.querySelector('div.stepThree').classList.add('slds-hide');
  //             this.template.querySelector('div.stepTwo').classList.remove('slds-hide');

  //           }*/
  //   }
  //  // ------------------------------------------------------------------------------------------------------------//

  //   //Go to Quote
  //   handlechildevent3(event) {
  //     const thirdchildcompname = event.detail.thirdchildcompname;
  //     const thirdchildcompdescription = event.detail.thirdchildcompdescription;
  //     const policy = event.detail.Policies;
  //     const PPD = event.detail.ppds;
  //     console.log('thirdchildcompname: ' + thirdchildcompname)
  //     this.currentStep = '5';


  //     this.template.querySelector("c-quote").childFunction(this.accRecord, policy, PPD);

  //     this.template.querySelector('div.stepThree').classList.add('slds-hide');
  //     this.template.querySelector('div.stepFour').classList.add('slds-hide');
  //     this.template.querySelector('div.stepFive').classList.remove('slds-hide');
  //   }

  //   //------------------------------------------------------------------------------------------------------------//

  //Go to Pay Page
  handlechildevent4(event) {

    // let temp = [];

    //     for(i = 0 ; i< event.detail.policyObject ; i++){

    //         temp.push({
    //             Status: 'Active',
    //             EffectiveDate: this.getDate()
    //     })

    //     }

    //     this.policyObject = temp;


    const fourthchildcompname = event.detail.fourthchildcompname;
    const fourthchildcompdescription = event.detail.fourthchildcompdescription;

    //   const amount = event.detail.amount;
    this.amount = event.detail.amount;
    //    const invoiceandlineobj = event.target.invoiceandlineobj;
    this.invoiceandlineobj = event.detail.invoiceandlineobj;
    //    const opportunityWrapper = event.target.OppWrapper;
    this.opportunityWrapper = event.detail.OppWrapper;
    //    const ppdListtoActivate = event.target.ppdtoActivate;
    this.ppdListtoActivate = event.detail.ppdtoActivate;
    //    const policyObj = event.target.policyObject;
    this.policyObj = event.detail.policyObject;
    //    const accountfullname = event.target.accountfullname;
    this.accountfullname = event.detail.accountfullname;
    //    const accountFirstName = event.target.accountFirstName;
    this.accountFirstName = event.detail.accountFirstName;
    //    const accountLastName = event.target.accountLastName;
    this.accountLastName = event.detail.accountLastName;
    //    const accountemail = event.target.accountemail;
    this.accountemail = event.detail.accountemail;
    //    const brokerage = event.target.brokerage;
    this.brokerage = event.detail.brokerage;


    console.log('fourthchildcompname: ' + fourthchildcompname)
    console.log('-----------------------------------------------')
    console.log('-----------------------------------------------')
    console.log('-----------------------------------------------')
    console.log('-----------------------------------------------')
    console.log('-----------------------------------------------')
    console.log('-----------------------------------------------')
    console.log('-----------------------------------------------')
    console.log('amount = ' + this.amount + '  ' + 'invoiceandlineobj = ' + JSON.stringify(this.invoiceandlineobj) + '  ' + 'opportunityWrapper = ' + JSON.stringify(this.opportunityWrapper) +
      '  ' + 'ppdListtoActivate = ' + JSON.stringify(this.ppdListtoActivate) + '  ' + 'policyObj = ' + JSON.stringify(this.policyObj) +
      '  ' + 'accountfullname   = ' + this.accountfullname + '  ' + 'accountFirstName = ' + this.accountFirstName +
      '  ' + 'accountLastName   = ' + this.accountLastName + '  ' + 'accountemail = ' + this.accountemail +
      '  ' + 'brokerage         = ' + this.brokerage)
    this.currentStep = '6';
    this.template.querySelector('div.stepFive').classList.add('slds-hide');
    this.template.querySelector('div.stepSix').classList.remove('slds-hide');
  }

  paymentconfirmation(event) {

    const payment = event.detail.payment;
    //const paymentdescription = event.detail.paymentdescription;
    console.log('Payment Accepted? ' + payment);
    //this[NavigationMixin.Navigate]({type: 'standard__namedPage',attributes: {pageName: 'home'},});
    this[NavigationMixin.Navigate]({ type: 'standard__objectPage', 
    attributes: { objectApiName: 'InsurancePolicy', actionName: 'list' }, 
    state: { filterid: '00Bf00000029lyzEAA' }, });

  }
  //------------------------------------------------------------------------------------------------------------//

  //Go to Home Page from Personal Information

  // gotoHomePageFromPI(event) {
  //   const existingcomp = event.detail.existingcomp;
  //   const existingcompdescription = event.detail.existingcompdescription;
  //   console.log('existingcomp: ' + existingcomp)
  //   this[NavigationMixin.Navigate]({ type: 'standard__namedPage', attributes: { pageName: 'home' }, });

  // }

  //------------------------------------------------------------------------------------------------------------//

  //Go to Home Page from Eligibility Questions

  // gotoHomePageFromEQ(event) {
  //   const navigatetoHomepage = event.detail.navigatetoHomepage;
  //   const navigatetoHomepagedescription = event.detail.navigatetoHomepagedescription;
  //   console.log('navigatetoHomepage: ' + navigatetoHomepage)
  //   this[NavigationMixin.Navigate]({ type: 'standard__namedPage', attributes: { pageName: 'home' }, });

  // }

  //------------------------------------------------------------------------------------------------------------//

  //Go to Home Page from Product Info

  // HomeFromProdInfo(event) {
  //   const productinfocomp = event.detail.productinfocomp;
  //   const productinfocompdescription = event.detail.productinfocompdescription;
  //   console.log('productinfocomp: ' + productinfocomp)
  //   this[NavigationMixin.Navigate]({ type: 'standard__namedPage', attributes: { pageName: 'home' }, });

  // }

  //------------------------------------------------------------------------------------------------------------//


  //Go to Home Page from Quote

  // HomefromQuote(event) {
  //   const quotecomp = event.detail.quotecomp;
  //   const quotedescription = event.detail.quotedescription;
  //   this[NavigationMixin.Navigate]({ type: 'standard__namedPage', attributes: { pageName: 'home' }, });

  // }

  //------------------------------------------------------------------------------------------------------------//



  // paymentconfirmation(event) {

  //   const payment = event.detail.payment;
  //   const paymentdescription = event.detail.paymentdescription;
  //   console.log('Payment Accepted? ' + payment);
  //   //this[NavigationMixin.Navigate]({type: 'standard__namedPage',attributes: {pageName: 'home'},});
  //   this[NavigationMixin.Navigate]({ type: 'standard__objectPage', attributes: { objectApiName: 'InsurancePolicy', actionName: 'list' }, state: { filterid: '00Bf00000029lyzEAA' }, });

  // }

}