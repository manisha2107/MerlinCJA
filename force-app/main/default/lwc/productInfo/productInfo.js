import { LightningElement, api } from 'lwc';
import getProductQuestions from '@salesforce/apex/CoverageChoice.getProductQuestions';
import makePolicy2 from '@salesforce/apex/CoverageChoice.makePolicy2'
import InsertProgramApplicationList from '@salesforce/apex/CoverageChoice.InsertProgramApplicationList';
import getQPDs from '@salesforce/apex/CoverageChoice.getQPDs';
export default class ProductInfo_Product extends LightningElement {

    
    

    // data=[
    //     {
    //         "index":0,
    //         "productOptionName":"Privacy Breach Liability Endorsement",
    //         "showCheckBox":false,
    //         "showQuestions":false,
    //         "showList":true,
    //         "EligibilityQuestion":[
               
    //         ],
    //         "Product_Detail__c":"0YJf00000008OIZGA2",
    //         "type":"Endorsement",
    //         "productOptionId":"0YGf000000000EkGAI",
    //         "productQPD":[
    //            {
    //               "QPDName":"Privacy Breach Liability - Coverage A",
    //               "QPDCategory":"Endorsement",
    //               "QPDId":"a0gf0000006puFsAAI",
    //               "QPDPolicyLimit":29000,
    //               "QPRDAggregate":10000,
    //               "QPDPremium":10,
    //               "QPDDeductible":10000
    //            },
    //            {
    //               "QPDName":"Privacy Breach Liability - Coverage C",
    //               "QPDCategory":"Endorsement",
    //               "QPDId":"a0gf0000006puG2AAI",
    //               "QPDPolicyLimit":50000,
    //               "QPRDAggregate":50000,
    //               "QPDPremium":10,
    //               "QPDDeductible":10000
    //            }
    //         ],
    //         "checkBoxOpt":[
    //            {
    //               "label":"Claim: CA$29000 / Aggregate: CA$10000 / Deductible: CA$10000",
    //               "value":"Policy_Limit__c-29000-Aggregate-10000-Category__c-Endorsement-Id-a0gf0000006puFsAAI-Premium-10-Deductible-10000-Product_Detail__c-0YJf00000008OIZGA2-Quuote-a0bf0000003tpnVAAQ-ProdOptId-0YGf000000000EkGAI"
    //            },
    //            {
    //               "label":"Claim: CA$50000 / Aggregate: CA$50000 / Deductible: CA$10000",
    //               "value":"Policy_Limit__c-50000-Aggregate-50000-Category__c-Endorsement-Id-a0gf0000006puG2AAI-Premium-10-Deductible-10000-Product_Detail__c-0YJf00000008OIZGA2-Quuote-a0bf0000003tpnVAAQ-ProdOptId-0YGf000000000EkGAI"
    //            }
    //         ]
    //      },
    //      {
    //         "index":1,
    //         "productOptionName":"Ombudsmen for Banking Services and Investments",
    //         "showCheckBox":false,
    //         "showQuestions":false,
    //         "showList":false,
    //         "EligibilityQuestion":[
               
    //         ],
    //         "Product_Detail__c":"0YJf0000000CaSeGAK",
    //         "productOptionId":"0YGf0000000CaTkGAK",
    //         "productQPD":[
    //            {
    //               "QPDName":"Ombudsmen for Banking Services and Investments",
    //               "QPDCategory":"Coverage",
    //               "QPDId":"a0gf0000006ptUnAAI",
    //               "QPDPolicyLimit":1000000,
    //               "QPRDAggregate":2000000,
    //               "QPDPremium":0,
    //               "QPDDeductible":10000
    //            }
    //         ],
    //         "checkBoxOpt":[
    //            {
    //               "label":"Claim: CA$1000000 / Aggregate: CA$2000000 / Deductible: CA$10000",
    //               "value":"Policy_Limit__c-1000000-Aggregate-2000000-Category__c-Coverage-Id-a0gf0000006ptUnAAI-Premium-0-Deductible-10000-Product_Detail__c-0YJf0000000CaSeGAK-Quuote-a0bf0000003tpnVAAQ-ProdOptId-0YGf0000000CaTkGAK"
    //            }
    //         ]
    //      },
    //      {
    //         "index":2,
    //         "productOptionName":"Vicarious Liability",
    //         "showCheckBox":true,
    //         "showQuestions":false,
    //         "showList":false,
    //         "EligibilityQuestion":[
               
    //         ],
    //         "Product_Detail__c":"0YJf0000000CaSjGAK",
    //         "type":"Product",
    //         "productOptionId":"0YGf0000000CaTVGA0",
    //         "productQPD":[
    //            {
    //               "QPDName":"Vicarious Liability",
    //               "QPDCategory":"Coverage",
    //               "QPDId":"a0gf0000006ptUpAAI",
    //               "QPDPolicyLimit":1000000,
    //               "QPRDAggregate":2000000,
    //               "QPDPremium":0,
    //               "QPDDeductible":15000
    //            }
    //         ],
    //         "checkBoxOpt":[
    //            {
    //               "label":"Claim: CA$1000000 / Aggregate: CA$2000000 / Deductible: CA$15000",
    //               "value":"Policy_Limit__c-1000000-Aggregate-2000000-Category__c-Coverage-Id-a0gf0000006ptUpAAI-Premium-0-Deductible-15000-Product_Detail__c-0YJf0000000CaSjGAK-Quuote-a0bf0000003tpnVAAQ-ProdOptId-0YGf0000000CaTVGA0"
    //            }
    //         ]
    //      },
    // ]
   //  Query_QPD_List = [
   //      {
   //         "Name":"Ombudsmen for Banking Services and Investments",
   //         "Category__c":"Coverage",
   //         "Product__c":"01tf0000006yxPJAAY",
   //         "ProductOption__c":"0YGf0000000CaTkGAK",
   //         "Product_Detail__c":"0YJf0000000CaSeGAK",
   //         "Approved__c":true,
   //         "Status__c":"Activated",
   //         "Policy_Limit__c":1000000,
   //         "Aggregate__c":2000000,
   //         "Quote__c":"a0bf0000003tpnVAAQ",
   //         "Premium_Amount__c":0,
   //         "Deductible_Amount__c":10000,
   //         "Type_of_QPD__c":"Product",
   //         "Id":"a0gf0000006ptUnAAI",
   //         "Product__r":{
   //            "Name":"Financial Advisors (SP)",
   //            "Id":"01tf0000006yxPJAAY"
   //         },
   //         "ProductOption__r":{
   //            "Name":"Ombudsmen for Banking Services and Investments",
   //            "Id":"0YGf0000000CaTkGAK"
   //         },
   //         "Quote__r":{
   //            "Transaction_Fees__c":20,
   //            "Quote_Expiry_Date__c":"2022-02-01T00:00:00.000Z",
   //            "Quote_Term__c":12,
   //            "Master_Policy_Number__c":"MP-0001001",
   //            "Opportunity__c":"006f000000PhSdPAAV",
   //            "Expiration_Date__c":"2022-01-31",
   //            "Name":"A-0391",
   //            "Product__c":"01tf0000006yxPJAAY",
   //            "Commission__c":10,
   //            "RecordTypeId":"012f0000000gyIgAAI",
   //            "Id":"a0bf0000003tpnVAAQ"
   //         }
   //      },
   //      {
   //         "Name":"Vicarious Liability",
   //         "Category__c":"Coverage",
   //         "Product__c":"01tf0000006yxPJAAY",
   //         "ProductOption__c":"0YGf0000000CaTVGA0",
   //         "Product_Detail__c":"0YJf0000000CaSjGAK",
   //         "Approved__c":true,
   //         "Status__c":"Activated",
   //         "Policy_Limit__c":1000000,
   //         "Aggregate__c":2000000,
   //         "Quote__c":"a0bf0000003tpnVAAQ",
   //         "Premium_Amount__c":66000,
   //         "Deductible_Amount__c":15000,
   //         "Type_of_QPD__c":"Product",
   //         "Id":"a0gf0000006ptUpAAI",
   //         "Product__r":{
   //            "Name":"Financial Advisors (SP)",
   //            "Id":"01tf0000006yxPJAAY"
   //         },
   //         "ProductOption__r":{
   //            "Name":"Vicarious Liability",
   //            "Id":"0YGf0000000CaTVGA0"
   //         },
   //         "Quote__r":{
   //            "Transaction_Fees__c":20,
   //            "Quote_Expiry_Date__c":"2022-02-01T00:00:00.000Z",
   //            "Quote_Term__c":12,
   //            "Master_Policy_Number__c":"MP-0001001",
   //            "Opportunity__c":"006f000000PhSdPAAV",
   //            "Expiration_Date__c":"2022-01-31",
   //            "Name":"A-0391",
   //            "Product__c":"01tf0000006yxPJAAY",
   //            "Commission__c":10,
   //            "RecordTypeId":"012f0000000gyIgAAI",
   //            "Id":"a0bf0000003tpnVAAQ"
   //         }
   //      },
   //      {
   //         "Name":"Privacy Breach Liability - Coverage A",
   //         "Category__c":"Endorsement",
   //         "Product__c":"01tf0000006yxPJAAY",
   //         "ProductOption__c":"0YGf000000000EkGAI",
   //         "Product_Detail__c":"0YJf00000008OIZGA2",
   //         "Approved__c":true,
   //         "Status__c":"Activated",
   //         "Policy_Limit__c":29000,
   //         "Aggregate__c":10000,
   //         "Quote__c":"a0bf0000003tpnVAAQ",
   //         "Premium_Amount__c":10,
   //         "Deductible_Amount__c":10000,
   //         "Type_of_QPD__c":"Endorsement",
   //         "Id":"a0gf0000006puFsAAI",
   //         "Product__r":{
   //            "Name":"Financial Advisors (SP)",
   //            "Id":"01tf0000006yxPJAAY"
   //         },
   //         "ProductOption__r":{
   //            "Name":"Privacy Breach Liability Endorsement",
   //            "Id":"0YGf000000000EkGAI"
   //         },
   //         "Quote__r":{
   //            "Transaction_Fees__c":20,
   //            "Quote_Expiry_Date__c":"2022-02-01T00:00:00.000Z",
   //            "Quote_Term__c":12,
   //            "Master_Policy_Number__c":"MP-0001001",
   //            "Opportunity__c":"006f000000PhSdPAAV",
   //            "Expiration_Date__c":"2022-01-31",
   //            "Name":"A-0391",
   //            "Product__c":"01tf0000006yxPJAAY",
   //            "Commission__c":10,
   //            "RecordTypeId":"012f0000000gyIgAAI",
   //            "Id":"a0bf0000003tpnVAAQ"
   //         }
   //      },
   //      {
   //         "Name":"Privacy Breach Liability - Coverage C",
   //         "Category__c":"Endorsement",
   //         "Product__c":"01tf0000006yxPJAAY",
   //         "ProductOption__c":"0YGf000000000EkGAI",
   //         "Product_Detail__c":"0YJf00000008OIZGA2",
   //         "Approved__c":false,
   //         "Status__c":"Activated",
   //         "Policy_Limit__c":50000,
   //         "Aggregate__c":50000,
   //         "Quote__c":"a0bf0000003tpnVAAQ",
   //         "Premium_Amount__c":10,
   //         "Deductible_Amount__c":10000,
   //         "Type_of_QPD__c":"Endorsement",
   //         "Id":"a0gf0000006puG2AAI",
   //         "Product__r":{
   //            "Name":"Financial Advisors (SP)",
   //            "Id":"01tf0000006yxPJAAY"
   //         },
   //         "ProductOption__r":{
   //            "Name":"Privacy Breach Liability Endorsement",
   //            "Id":"0YGf000000000EkGAI"
   //         },
   //         "Quote__r":{
   //            "Transaction_Fees__c":20,
   //            "Quote_Expiry_Date__c":"2022-02-01T00:00:00.000Z",
   //            "Quote_Term__c":12,
   //            "Master_Policy_Number__c":"MP-0001001",
   //            "Opportunity__c":"006f000000PhSdPAAV",
   //            "Expiration_Date__c":"2022-01-31",
   //            "Name":"A-0391",
   //            "Product__c":"01tf0000006yxPJAAY",
   //            "Commission__c":10,
   //            "RecordTypeId":"012f0000000gyIgAAI",
   //            "Id":"a0bf0000003tpnVAAQ"
   //         }
   //      },
   //      {
   //         "Name":"Firm Rider - All Provinces",
   //         "Category__c":"Endorsement",
   //         "Product__c":"01tf0000006yxPJAAY",
   //         "ProductOption__c":"0YGf000000000EaGAI",
   //         "Product_Detail__c":"0YJf0000000CaY4GAK",
   //         "Approved__c":false,
   //         "Status__c":"Activated",
   //         "Policy_Limit__c":45000,
   //         "Aggregate__c":135000,
   //         "Quote__c":"a0bf0000003tpnVAAQ",
   //         "Premium_Amount__c":150,
   //         "Deductible_Amount__c":10000,
   //         "Type_of_QPD__c":"Firm Rider",
   //         "Id":"a0gf0000006puQYAAY",
   //         "Product__r":{
   //            "Name":"Financial Advisors (SP)",
   //            "Id":"01tf0000006yxPJAAY"
   //         },
   //         "ProductOption__r":{
   //            "Name":"Firm Rider (All Provinces)",
   //            "Id":"0YGf000000000EaGAI"
   //         },
   //         "Quote__r":{
   //            "Transaction_Fees__c":20,
   //            "Quote_Expiry_Date__c":"2022-02-01T00:00:00.000Z",
   //            "Quote_Term__c":12,
   //            "Master_Policy_Number__c":"MP-0001001",
   //            "Opportunity__c":"006f000000PhSdPAAV",
   //            "Expiration_Date__c":"2022-01-31",
   //            "Name":"A-0391",
   //            "Product__c":"01tf0000006yxPJAAY",
   //            "Commission__c":10,
   //            "RecordTypeId":"012f0000000gyIgAAI",
   //            "Id":"a0bf0000003tpnVAAQ"
   //         }
   //      }
   //  ]
   //  accRecord = {
   //      "Id":"001f000001dtmt1AAA",
   //      "Name":"Ali Siddiqui",
   //      "PersonContactID__c":"003f000001XHTILAA5",
   //      "Application_Current_Stage__c":"Quote",
   //      "Program_Audience__c":"a0af0000003bDnKAAU",
   //      "PersonContactId":"003f000001XHTILAA5",
   //      "HiddenAccount__c":"001f000001XEywRAAT",
   //      "FirstName":"Ali",
   //      "LastName":"Siddiqui",
   //      "Brokerage_Account__c":"001f000001PUeSaAAL",
   //      "Broker_Contact__c":"003f000001OJ9kvAAD",
   //      "Applicable_License__c":"0cEf00000004C98EAE",
   //      "BillingCity":"ansma",
   //      "Suit__c":"233",
   //      "BillingCountry":"Canada",
   //      "BillingState":"Alberta",
   //      "BillingStreet":"Street 1232",
   //      "BillingPostalCode":"K1A 0B1",
   //      "Phone":"(321) 231-3112",
   //      "PersonEmail":"ali.siddiqui@cloudjunction.cloud",
   //      "Assigned_License__c":"0cEf00000004C9DEAU",
   //      "Program_Audience__r":{
   //         "Name":"Financial Agents",
   //         "Id":"a0af0000003bDnKAAU"
   //      },
   //      "HiddenAccount__r":{
   //         "Name":"Mackie Financial Services Inc.",
   //         "OwnerId":"0056g000002jWvgAAE",
   //         "Id":"001f000001XEywRAAT"
   //      },
   //      "Brokerage_Account__r":{
   //         "Name":"AON Empower Results",
   //         "Id":"001f000001PUeSaAAL"
   //      },
   //      "Broker_Contact__r":{
   //         "Name":"Steven Smith",
   //         "Id":"003f000001OJ9kvAAD"
   //      },
   //      "Applicable_License__r":{
   //         "Role__c":"Licensed Assistant",
   //         "Licenses_Type__c":"Investment Industry Regulatory Organization of Canada (IIROC) Registered Representative",
   //         "Id":"0cEf00000004C98EAE"
   //      }
   //  }

   Midterm

   PolicyPremiumToSend

    PremiumOfCurrent=0;
    
    TotalPremium=0;
    
    //Saves the name of ALL the product Options
    ListOfProductOptions = []

    mapOfQpd = new Map();
    
    mapOfQuestions = new Map();
    
    checkProductExist = true;

    //Saves the current QPD
    currentQPD 

    selectedProduct

    conditionforQuestion

    mapOfPPD = new Map();
    
    wantToBuyFirmRider = false
    
    mapOfEligibility = new Map();
    policies = []

    PolicyPremium = 0

    firmRiderQuestionPick

    firmRiderQuestion

    loaded = false

    suspendedApplication = false

    firmQuestion= [
        {  Id:1,
           Question:'Provide the name of the firms or corporate entities requiring this coverage',
           type: false
        },
        // {  Id:2,
        //    Question:'In which provinces does your firm hold a license?',
        //    type: false, options: this.provinces, multi: true
        // },
        
        {Id:3,
           Question:'In addition to yourself, the applicant, how many other licensed representatives, including licensed assistants are employed by your Firm(s)?',
           type:'true' ,options: this.licensedRepresentatives
     
        }
    ]

    StatusOfApplication = ''
    mapOfQuestionsAnswered = new Map();
    get picklistOpt(){
        return [
           { label: 'Yes', value: 'Yes', checked:false },
           { label: 'No', value: 'No',checked:false },
        ]
     }
    printmap(mapToPrint){
        console.log('Print Map called')
        var get_entries = mapToPrint.entries(); 
                  console.log("----------entries--------- of the Map " + mapToPrint); 
                  for(var ele of get_entries) 
                     console.log(ele);
    }
    get licensedRepresentatives(){
      return [
         { label: '1', value: '1' },
         { label: '2', value: '2' },
         { label: '3', value: '3' },
         { label: '4+', value: '4+' },
      ]
   }
    formatToCurrency = amount => { 
        amount = Number(amount).toFixed(2);
        
        let a=  "CA$" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
        
        return a
     }

     @api childFunction(accRecord,license,mapOfAllPPdds,FirmRiderData,midterm){ 
      console.log('Child function running product info')
      this.Midterm = midterm;
      this.accRecord = accRecord;
      this.mapOfPPD = new Map();
      this.currentQPD = '';
      this.loaded = false;
      this.mapOfPPD = mapOfAllPPdds;
      if(FirmRiderData){
            this.firmRiderQuestionPick = FirmRiderData.Number_of_Licensed_Representatives__c
            this.firmRiderQuestionText = FirmRiderData.Name
         }
      getQPDs({ClassSelectedLicense:license,
         AccountId: this.accRecord.Id
      }).then(Licenses=>{
         this.Query_QPD_List = Licenses
         //Check if we have products to Display
            if(this.Query_QPD_List.length>0){
               // we have Products and endorsements and Firm Rider to Show
               console.log('The List Of QPDs is ' + JSON.stringify(this.Query_QPD_List));


               //we will iterate over the data and make it in proper json format
               //Proper Json Format:
               // we will have the QPDs as child of the product option and not the other way around.

               //While doing this we will also store all the Productdetails in an array so that we can query the questions related to that 
               //ProductDetail
               this.mapOfQpd = new Map();
               let setofId = []; //this will stor all the Ids of the Product detail
               for(let i =0; i < this.Query_QPD_List.length; i++){
                  console.log('current iteration is ' + i)
                  //Check if we already have the Product option in the map.
                  if(this.mapOfQpd.has(this.Query_QPD_List[i].ProductOption__r.Name)){

                     //if the Product option is in the map we will append the object to 'productQPD'
                     //So this way we will have an object of product option in which we will have an array of all the 
                     // QPDS of that option
                     let tempArrayOFQPD = this.mapOfQpd.get(this.Query_QPD_List[i].ProductOption__r.Name).productQPD;
                     let TempProductQPD= {
                           QPDName: this.Query_QPD_List[i].Name,
                           QPDCategory: this.Query_QPD_List[i].Category__c,
                           QPDId: this.Query_QPD_List[i].Id,
                           QPDPolicyLimit: this.Query_QPD_List[i].Policy_Limit__c,
                           QPRDAggregate: this.Query_QPD_List[i].Aggregate__c,
                           QPDPremium: this.Query_QPD_List[i].Premium_Amount__c,
                           QPDDeductible: this.Query_QPD_List[i].Deductible_Amount__c,
                           checked:this.Query_QPD_List[i].Approved__c,
                           QPDProductDetail:this.Query_QPD_List[i].Product_Detail__c,
                           QPDQuote:this.Query_QPD_List[0].Quote__c,
                           ProdOptId:this.Query_QPD_List[i].ProductOption__r.Id,
                           value: tempArrayOFQPD.length,
                           label:   'Claim: '+this.formatToCurrency(this.Query_QPD_List[i].Policy_Limit__c)   +
                                    ' / Aggregate: '+ this.formatToCurrency(this.Query_QPD_List[i].Aggregate__c) +
                                    ' / Deductible: '+this.formatToCurrency(this.Query_QPD_List[i].Deductible_Amount__c)
                     }
                     //Updated Array, with the latest QPD
                     tempArrayOFQPD.push(TempProductQPD);
                     //Now we have to insert this back into the ProductOption Object
                     
                     //First we get the Object
                     let prodObject = this.mapOfQpd.get(this.Query_QPD_List[i].ProductOption__r.Name);

                     //then we add the array in the object
                     prodObject.productQPD = tempArrayOFQPD;

                     //last we update the map with the Updated object
                     this.mapOfQpd.set(this.Query_QPD_List[i].ProductOption__r.Name,prodObject )
                  }
                  else{
                     //if the Product option is not in the map we will add the ProductOption object with the QPD array to map

                     //we made a temp object
                     // console.log('Make tempProdOpt')
                     var tempProdOpt = {
                           index:this.mapOfQpd.size,
                           productOptionName: this.Query_QPD_List[i].ProductOption__r.Name,
                           EligibilityQuestion:[],
                           Product_Detail__c:this.Query_QPD_List[i].Product_Detail__c,
                           type: this.Query_QPD_List[i].Type_of_QPD__c,
                           productOptionId: this.Query_QPD_List[i].ProductOption__r.Id,
                           prodLocked:false,
                           buttonToShow: false,
                           conditionforQuestion:false,
                           productQPD: [{
                              QPDName: this.Query_QPD_List[i].Name,
                              QPDCategory: this.Query_QPD_List[i].Category__c,
                              QPDId: this.Query_QPD_List[i].Id,
                              QPDPolicyLimit: this.Query_QPD_List[i].Policy_Limit__c,
                              QPRDAggregate: this.Query_QPD_List[i].Aggregate__c,
                              QPDPremium: this.Query_QPD_List[i].Premium_Amount__c,
                              QPDDeductible: this.Query_QPD_List[i].Deductible_Amount__c,
                              checked:this.Query_QPD_List[i].Approved__c,
                              QPDProductDetail:this.Query_QPD_List[i].Product_Detail__c,
                              QPDQuote:this.Query_QPD_List[0].Quote__c,
                              ProdOptId:this.Query_QPD_List[i].ProductOption__r.Id,
                              value: 0,
                              label:   'Claim: '+this.formatToCurrency(this.Query_QPD_List[i].Policy_Limit__c)   +
                                       ' / Aggregate: '+ this.formatToCurrency(this.Query_QPD_List[i].Aggregate__c) +
                                       ' / Deductible: '+this.formatToCurrency(this.Query_QPD_List[i].Deductible_Amount__c)
                           }],
                           selectionOption:[]
                        
                     }
                     // console.log('tempProdOpt is set ')
                     
                     //We checked if the status is apprved then we marked the RadioButton to true
                     //For Firm Rider we will do the same once we add the EligibilityQuestions with the current product
                     //this happens in handlenext function
                     if(tempProdOpt.productQPD[0].checked){
                           var TempSelectionOption= [{
                                 label:'Yes', value: 'Yes', checked:true
                              },
                              {
                                 label:'No', value: 'No', checked:false
                              }]
                           tempProdOpt.prodLocked = true
                           tempProdOpt.buttonToShow = true
                           tempProdOpt.conditionforQuestion = true
                           tempProdOpt.selectionOption = TempSelectionOption
                     }   
                     else{
                        var TempSelectionOption=[{
                           label:'Yes', value: 'Yes', checked:false
                        },
                        {
                           label:'No', value: 'No', checked:false
                        }]
                        tempProdOpt.selectionOption = TempSelectionOption
                     }
                     console.log('tempProdOpt is Updated ') 
                     //we have inserted the object in the map
                     //the key is the Productoption name and the value is the object with all the options/details of the product option.
                     this.mapOfQpd.set(this.Query_QPD_List[i].ProductOption__r.Name,tempProdOpt )
                     // console.log('map is Set')


                     
                     if(!setofId.includes(this.Query_QPD_List[i].Product_Detail__c)){
                           setofId.push(this.Query_QPD_List[i].Product_Detail__c)
                     }
                     //console.log('setofIds is set ')
                  }
               }
               console.log('Finised making JSON')
               this.printmap(this.mapOfQpd)
               //Now that we are done setting up the JSON we will Query the Questions related to productOption
               
               
               //Since we have the map we will also save the keys in an array 
               //the purpose of this is to use the array to get the index
               //and then use the index for navigation
               /**
                * Example;
                * map has (a=>{}, b=>{}, c=>{}, d=>{})
                * array has [a,b,c,d]
                * assuming we are on 'c' we cant go back to b using the map alone
                * With array we will get the index of 'c' using 'array.indexOf(c)'
                * then we can use simple logic to get the name of previos option in our case 'b'
                * Logic: array[array.indexOf(c) - 1] (we used -1 to get the previous)
                * and then use it in map to get the previous option
                * map.get(array[array.indexOf(c) - 1]) ==> we will ge 'b'
                * 
                */
               this.ListOfProductOptions = Array.from(this.mapOfQpd.keys())

               console.log('List of Product options '+JSON.stringify(this.ListOfProductOptions))

                  
               if(setofId.length>0){
                  getProductQuestions({Ids:setofId,Account:this.accRecord.Id, Quote:this.Query_QPD_List[0].Quote__c })
                  .then(result=>{
                        console.log(' QUESTIONS from getPRODQuestion' + JSON.stringify(result));
                        

                        /**
                         * WE CREATED A MAP =>tempMapOfProddet
                         * 
                         * PURPOSE OF THIS MAP IS TO RETURN THE QUESTIONS ASSOCIATED WITH EVERY PRODUCT DETAIL.
                         * 
                         * GOAL: OUR GOAL IS TO GO OVER QPD GET THE PRODUCT DETAIL AND THEN SHOW THE QUESTIONS ASSOCIATED
                         */
                        let tempMapOfProddet = new Map();

                        
                        
                        /**
                         * We will iterate over the results and check if the prod detail is in the map
                         * if it is then we will add the question at the end of the array
                         * else we will set it against the product detail
                         */
                        
                        for( let i =0; i < result.length; i ++){
                           //check if the map has the value
                           if(tempMapOfProddet.has(result[i].Product_Detail__c)){
                              tempMapOfProddet.set(result[i].Product_Detail__c,[...tempMapOfProddet.get(result[i].Product_Detail__c), {index:tempMapOfProddet.get(result[i].Product_Detail__c).length ,Question:result[i].Question__r.Question_Description__c, CorrectAns: result[i].Correct_Answer__c,Consequences:result[i].Consequence__c, Id: result[i].Id,showError:false,options: this.picklistOpt,Error:result[i].Error_Description__c,userAns:result[i].ReponseField__c}]);
                           }
                           else{
                              tempMapOfProddet.set(result[i].Product_Detail__c,[{index:0,Question:result[i].Question__r.Question_Description__c, CorrectAns: result[i].Correct_Answer__c,Consequences:result[i].Consequence__c, Id: result[i].Id,showError:false,options: this.picklistOpt,Error:result[i].Error_Description__c,userAns:result[i].ReponseField__c}]);
                           }
                        }
                        
                        //we then saved it in a track Variable.
                        this.mapOfQuestions =tempMapOfProddet
                        this.printmap(this.mapOfQuestions)
                        console.log('Handle Next Called From Connected Callback')
                        if(Licenses.length > 0 ){
                           this.loaded = true
                        }
                        //Now that all our data is prepared we will call navigations\
                        this.handleNext()
                     })
                     .catch(err=>{
                        console.log('ERROR ' + JSON.stringify(err))
                     })
                  }
                  
            }
            else{
                  // No products to show for the seelected license
                  // show Error.
                  console.log('No Products Show error');
                  this.checkProductExist = false
                  this.loaded = true;
            }
      })
        
    }
    NavigateToPolicy(e){
      var evt= new CustomEvent('paymentevent',{detail:{payment:true}})
      this.dispatchEvent(evt);
    }

    get getCurPremium(){
       if(this.currentQPD.type =='Product'){
        console.log('Current QPD is ' + this.currentQPD.productOptionName + ' Type ' + this.currentQPD.type +' Premium = '+this.selectedProduct.QPDPremium )
        
        
            if(this.selectedProduct.QPDPremium){
               this.PremiumOfCurrent = this.selectedProduct.QPDPremium
               console.log('Premium Amount::' + this.PremiumOfCurrent);
            }
            else{
               for(let i =0 ;i < this.currentQPD.productQPD.length; i++){
                  if(this.currentQPD.productQPD[i].checked==true){
                     this.PremiumOfCurrent =this.currentQPD.productQPD[i].QPDPremium
                     console.log('Premium of Current::' + this.PremiumOfCurrent);
                  }
               }
            }
         
        
       }
       else{
            console.log('Current QPD is ' + this.currentQPD.productOptionName + ' Type ' + this.currentQPD.type +' Premium = '+ this.currentQPD.productQPD[0].QPDPremium )
            this.PremiumOfCurrent =this.currentQPD.productQPD[0].QPDPremium  

       }
       return this.formatToCurrency(this.PremiumOfCurrent)
    }
    
    get CumulPremium(){
        let temp = 0
        let array = Array.from(this.mapOfPPD.values())

        
        let yyyMmDd = this.getDate()
        
        let EndDate = this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c.substring(0, 10)
        
        let monthStart = yyyMmDd.split('-')
        let monthEnd = EndDate.split('-')
     
        let yearStart = monthStart[0]
        let yearEnd = monthEnd[0]
        
        monthStart=monthStart[1]
        monthEnd=monthEnd[1]
        
        let months = (Number(yearEnd)-Number(yearStart))*12 +((Number(monthEnd)-Number(monthStart)) )
     
         


        for(let i =0; i < array.length;i++){
            // console.log('In get Total Premium' + JSON.stringify(array))
               console.log(JSON.stringify(array))
                if(array[i].Type == 'Product'){
               
                //console.log('Number(array[i].PremiumAmount)*months/12 ',Number(array[i].PremiumAmount)*months/12 + ' ' + array[i].PremiumAmount)
                  let tempPremium = Number(array[i].PremiumAmount)*months/12;
                  if(tempPremium < Number(array[i].PremiumAmount)*.3){
                     
                     tempPremium =  Number(array[i].PremiumAmount)*.3
                  }
                  temp += tempPremium
                }
                
                else{
                 
                  

                  if(array[i][0]){
                     
                    temp = temp + Number(array[i][0].PremiumAmount)
                  }

                  else{

                     temp = temp + Number(array[i].PremiumAmount)
                  }

                  //temp = temp + Number(array[i][0].PremiumAmount)
                }
                console.log('Cumulative premium::' + temp);
        }
         
        //Since Firm Rider is not in the map of PPD we have to check if the current product is Firm rider or not
        // if the case is true: we will check if it is selected or not.
        // incase it is selected we woill add the premium
        //incase No is selected we will remove the premium
   
        if(this.currentQPD.type == 'Firm Rider' && this.wantToBuyFirmRider){
           console.log('Current QPD IS FIRM RIDER ADDING FIRM RIDER PREMIUM')
         temp+=this.currentQPD.productQPD[0].QPDPremium
         
        }
        console.log('Cumulative working')
        if(temp > 0 && this.policies[0]){
         this.policies[0].PremiumAmount = temp
        }

        this.PolicyPremiumToSend =temp
        console.log('Cumulative working after Policy Premium update')
        return this.formatToCurrency(temp)
    }
    
    get checkEndorsement(){
        if(this.currentQPD.type =='Endorsement') return true

        return false
    }
    
    get checkConditionsforProductDets(){
        if(this.currentQPD.type =='Product' && this.selectedProduct) return true

        return false
    }
    handleEndorsementChange(e){
        console.log('Endorsement Changed ')
        console.log('Value ==> ' + e.target.value)
        this.selectedProduct = e.target.value
        if(e.target.value == 'Yes'){
            // this.selectedProduct = this.currentQPD.productQPD
            this.currentQPD.selectionOption[0].checked = true
            this.currentQPD.selectionOption[1].checked = false
            console.log('Selected product = ' + JSON.stringify(this.selectedProduct))
            this.currentQPD.conditionforQuestion = true
            console.log('Condition for Question::' +  this.currentQPD.conditionforQuestion);
            let arrayOfQPD = []
            for(let i =0; i< this.currentQPD.productQPD.length; i++){
                let temp = {
                    Product_Detail__c: this.currentQPD.Product_Detail__c,
                    Policy_Product_Name__c:this.currentQPD.productOptionName,
                    CoverageTypeId	:this.currentQPD.productOptionId,
                    Status__c:'Draft',
                    Type:this.currentQPD.type,
                    EffectiveDate: this.getDate(),
                    Product__c:this.Query_QPD_List[0].Product__r.Id,
                    PremiumAmount:this.currentQPD.productQPD[i].QPDPremium,
                    Policy_Limit__c:this.currentQPD.productQPD[i].QPDPolicyLimit,
                    Aggregate__c:this.currentQPD.productQPD[i].QPRDAggregate,
                    DeductibleAmount:this.currentQPD.productQPD[i].QPDDeductible,
                    Category:this.currentQPD.productQPD[i].QPDCategory,
                    Quote_Product_Detail__c:this.currentQPD.productQPD[i].QPDId,
                    RecordTypeId:'012f0000000fpA4AAI',
                    EID__c: this.Query_QPD_List[0].Quote__c+'-'+this.currentQPD.Product_Detail__c+'-'+this.currentQPD.productQPD[i].QPDName
                 }
                 arrayOfQPD.push(temp)
            }
            console.log('Temp created')
            this.mapOfPPD.set(this.currentQPD.productOptionName,arrayOfQPD)
            
            this.printmap(this.mapOfPPD)

        }   
        else{
            this.currentQPD.selectionOption[0].checked = false
            this.currentQPD.selectionOption[1].checked = true
            this.currentQPD.conditionforQuestion = false
            //I want to refresh the Variable so it is being tracked
            let temp = this.currentQPD
            this.currentQPD = ''
            this.currentQPD = temp
            this.mapOfPPD.delete(this.currentQPD.productOptionName)
            
        }
        
        console.log(' handlebuttonLogic()  called from Endorsement')
        this.handlebuttonLogic()
    }
    

    checkIfError() {
      var areAllValid = true;
      var inputs = this.template.querySelectorAll('.invvalidation');
      inputs.forEach(input => {
          if (!input.checkValidity()) {
              input.reportValidity();
              areAllValid = false;

          }
      });

      return areAllValid;

  }
   checkValid(){
      
      console.log('Check validity running for == ' + JSON.stringify(this.currentQPD))
      if(this.currentQPD.type =='Product'){
         let tempArray = this.currentQPD.productQPD;
         
         for(let i=0; i < tempArray.length; i++){
            console.log('Check Valid running :::  ' + JSON.stringify(tempArray[i].checked))
            if(tempArray[i].checked){
               return true
            }
         }
         console.log('Adding Error Class');
         for(let i = 0; i < tempArray.length; i++ ){
            console.log('Adding Error Class ' +tempArray[i].label);
            // this.template.querySelectorAll('div.'+tempArray[i].label).classList.add('slds-has-error');
            var inputs = this.template.querySelectorAll('.checkValid');


            inputs.forEach(input => {
               input.classList.add('slds-has-error');
           });
         }

      }
      else{

         return true;

      }

      return false;
   }
    checkEligibilityofProduct(){
     

        if(this.checkIfError()){

         console.log('checkEligibilityofProduct running')
         let temp =this.currentQPD
         // First we lock the Product
         temp.prodLocked = true
         temp.buttonToShow = true
         this.currentQPD = ''
         this.currentQPD = temp
         
         let questionsArray = this.currentQPD.EligibilityQuestion
         console.log('Questions for Firm Rider are:  ' + JSON.stringify(questionsArray))
         //We will iterate over the Questions and set the map of Eligibility
         
         for(let indexOfQuestion = 0; indexOfQuestion < questionsArray.length; indexOfQuestion++){
            console.log('Current Question '+ JSON.stringify(questionsArray[indexOfQuestion]))

            

            if(questionsArray[indexOfQuestion].userAns != questionsArray[indexOfQuestion].CorrectAns){
               if(questionsArray[indexOfQuestion].Consequences =='Auto-Fail'){
                  
                  this.mapOfEligibility.set(this.currentQPD.productOptionName,questionsArray[indexOfQuestion].Consequences )
                  //since the eligibility failed we will not have the ppd
                  if(this.mapOfPPD.has(this.currentQPD.productOptionName)){//check if map has the product 
                     this.mapOfPPD.delete(this.currentQPD.productOptionName) //if it does then delete it
                  }
               }
               else if(questionsArray[indexOfQuestion].Consequences == 'Approval Process' && this.mapOfEligibility.get(this.currentQPD.productOptionName) !='Auto-Fail' ){
                     this.mapOfEligibility.set(this.currentQPD.productOptionName,questionsArray[indexOfQuestion].Consequences )
                     this.suspendedApplication = true;
               }
               
            }
            else{
               this.mapOfEligibility.set(this.currentQPD.productOptionName,'Approved' )
            }
         }
         


         //We check the Eligibility of the product 
         if(this.mapOfEligibility.has(this.currentQPD.productOptionName)){
             // Product  Failed.
             if(this.mapOfEligibility.get(this.currentQPD.productOptionName) =='Auto-Fail'){

               console.log('Auto Fail eligibility::' + this.currentQPD.productOptionName);

                 if(this.mapOfPPD.has(this.currentQPD.productOptionName)){
                     //Map of ppd has the failed produuct Option.
                     // So we will remove it
                     console.log('Map of ppd has the failed produuct Option.')
                     this.mapOfPPD.delete(this.currentQPD.productOptionName)
                 }
             } //Product Approval Process
             else if(this.mapOfEligibility.get(this.currentQPD.productOptionName) =='Approval Process'){
               this.StatusOfApplication = this.mapOfEligibility.get(this.currentQPD.productOptionName)

               if(this.currentQPD.type == 'Firm Rider'){
                  this.makeFirmRiderPolicyAndAccount(this.currentQPD.QPDId)
               }
             } //Product Passed
             else{
               if(this.currentQPD.type == 'Firm Rider'){
                  this.makeFirmRiderPolicyAndAccount(this.currentQPD.QPDId)
               }
             }
         }
         else{
            console.log('Eligibility not set')
         }
         
         


         let arrayOfId = []
         let arrayOfQuesId = []
         let arrayOfAnsByUser = []
         let arrayOfCorrAns = []
        
         let Values = this.currentQPD.EligibilityQuestion
         console.log('Eligibility Questions::' + Values);
         
         for(let i =0; i < Values.length; i++ ){
             console.log()
             arrayOfId.push(this.currentQPD.productOptionId)
             arrayOfQuesId.push(Values[i].Id)
             arrayOfAnsByUser.push(Values[i].userAns)
             arrayOfCorrAns.push(Values[i].CorrectAns)
          }
          console.log('Array if Id ' +JSON.stringify(arrayOfId) )
          console.log('Array if arrayOfQuesId ' +JSON.stringify(arrayOfQuesId) )
          console.log('Array if arrayOfAnsByUser ' +JSON.stringify(arrayOfAnsByUser) )
          console.log('Array if arrayOfCorrAns ' +JSON.stringify(arrayOfCorrAns) )
          
 
          InsertProgramApplicationList({
             arrayOfId,
             arrayOfQuesId,
             arrayOfAnsByUser,
             arrayOfCorrAns,
             Name:[this.currentQPD.productOptionName],      
             Broker:this.accRecord.Broker_Contact__c,
             Status:[this.mapOfEligibility.get(this.currentQPD.productOptionName)],
             externalId:[this.Query_QPD_List[0].Quote__r.Name+'-'+this.currentQPD.productOptionName],
             RecordTypeId:'012f0000000foosAAA',
             ProdOpt:[this.currentQPD.productOptionId],
             ProdDetail:[this.currentQPD.Product_Detail__c],
             Quote:this.Query_QPD_List[0].Quote__c,
             Account : this.accRecord.Id
          })
          .then(resultFromClass=>{
             console.log('resultFrom PROGRAM APPLICATION' + JSON.stringify(resultFromClass))
             
          })
          .catch(err=>{
             console.log('error from PROGRAM APPLICATION ' +JSON.stringify(err))
          })
         //Then we swap the button option from continue to next
         // this.checkButtonToshow(true)
         this.handlebuttonLogic()
        }
    }
   makeFirmRiderPolicyAndAccount(Id){
      console.log('makeFirmRiderPolicyAndAccount running ;;; ')
      if(this.firmRiderQuestionPick && this.firmRiderQuestionText){
         let tempFirmRiderPolicy  = this.makePolicy('Firm Rider')
         tempFirmRiderPolicy.Quote_Product_Detail__c = Id
         this.policies.push(tempFirmRiderPolicy)
         console.log(' tempFirmRiderPolicy = ' +  JSON.stringify(this.policies))
         let arrayOfPpd = Array.from(this.mapOfPPD.values())
         console.log('PPDS to save are ' + JSON.stringify(Array.from(this.mapOfPPD.values())))
         if(this.policies.length == 2){
            this.policies[1].PremiumAmount = this.currentQPD.productQPD[0].QPDPremium
            makePolicy2({
               Policy:this.policies,
               ppds:[arrayOfPpd[0]],
               parentID:this.accRecord.Id,
               FirmRiderName:this.firmRiderQuestionText, 
               numberOfFirms:this.firmRiderQuestionPick,
               OppId:this.Query_QPD_List[0].Quote__r.Opportunity__c,
               Midterm:this.Midterm ,
               RecentPurchase:this.PolicyPremiumToSend
               })
               .then(result=>{
                  console.log('result from make Firm Rider ' + JSON.stringify(result))
                  
                  let temp = {
                     "DeductibleAmount":this.currentQPD.productQPD[0].QPDDeductible,
                      "PremiumAmount":this.currentQPD.productQPD[0].QPDPremium,
                     "Category":this.currentQPD.productQPD[0].QPDCategory,
                     "Policy_Limit__c":this.currentQPD.productQPD[0].QPDPolicyLimit,
                     "Policy_Product_Name__c":this.currentQPD.productQPD[0].QPDName,
                     "Quote_Product_Detail__c":this.currentQPD.productQPD[0].QPDProductDetail,
                     "Aggregate__c":this.currentQPD.productQPD[0].QPRDAggregate,
                     "InsurancePolicyId":result[result.length -1].InsurancePolicyId,
                     "Product__c":this.currentQPD.productQPD[0].ProdOptId,
                     "Product_Detail__c":this.currentQPD.productQPD[0].QPDProductDetail,
                  }
                  this.policies[1].Id = result[result.length -1].InsurancePolicyId
                  this.mapOfPPD.set(result[result.length -1 ].Policy_Product_Name__c,temp )
                  
                  this.printmap(this.mapOfPPD)
               })
               .catch(err=>{
                  console.log('Firm Rider make policy error' + JSON.stringify(err))
               })
         }
         else{
            console.log('Length of Polices < 2')
         }
      }
      
   }

   handleProductChange(e){
      console.log('Product Changed ')
      console.log('Value ==> ' + e.target.value)
      let temp = {
         indexnumber : e.target.value,
         Product_Detail__c: this.currentQPD.Product_Detail__c,
         Policy_Product_Name__c:this.currentQPD.productOptionName,
         CoverageTypeId	:this.currentQPD.productOptionId,
         Status__c:'Draft',
         Type:this.currentQPD.type,
         EffectiveDate: this.getDate(),
         Product__c:this.Query_QPD_List[0].Product__r.Id,
         PremiumAmount:this.currentQPD.productQPD[e.target.value].QPDPremium,
         Policy_Limit__c:this.currentQPD.productQPD[e.target.value].QPDPolicyLimit,
         Aggregate__c:this.currentQPD.productQPD[e.target.value].QPRDAggregate,
         DeductibleAmount:this.currentQPD.productQPD[e.target.value].QPDDeductible,
         Category:this.currentQPD.productQPD[e.target.value].QPDCategory,
         Quote_Product_Detail__c:this.currentQPD.productQPD[e.target.value].QPDId,
         RecordTypeId:'012f0000000fpA4AAI',
         EID__c: this.Query_QPD_List[0].Quote__c+'-'+this.currentQPD.Product_Detail__c+'-'+this.currentQPD.productQPD[e.target.value].QPDName
      }
      console.log('Temp created ' + JSON.stringify(temp))
      this.mapOfPPD.set(this.currentQPD.productOptionName,temp)
      
      this.selectedProduct = this.currentQPD.productQPD[e.target.value]
      //this.currentQPD.productQPD[e.target.value].checked = true
      console.log('Selected product = ' + JSON.stringify(this.selectedProduct))
      let tempArr = this.currentQPD.productQPD
      for(let i =0; i < tempArr.length; i++){
         if(Number(e.target.value) == i){
            tempArr[e.target.value].checked = true
         }
         else{
            tempArr[i].checked = false
         }
      }
      this.currentQPD.productQPD = tempArr
      this.mapOfQpd.set(this.currentQPD.productOptionName,this.currentQPD)
      // this.mapOfPPD
      this.printmap(this.mapOfPPD)
      
   }
   getDate(){
        let rightNow = new Date();
     
        // Adjust for the user's time zone
        rightNow.setMinutes(
           new Date().getMinutes() - new Date().getTimezoneOffset()
        );
     
     
        // Return the date in "YYYY-MM-DD" format
        let yyyyMmDd = rightNow.toISOString().slice(0,10);
        return(yyyyMmDd)
   }
   getDateTime(){
      let rightNow = new Date();
      let yyyyMmDd = rightNow.toISOString();
      return(yyyyMmDd)
   }
     
    get FirmRiderCheck(){
        if(this.currentQPD.type == 'Firm Rider'){
            return true
        }
        return false
    }
    handleFirmRiderQuestionsPick(e){
         this.firmRiderQuestionPick = e.target.value
        console.log('Firm Rider Picklist changed')
    }
    handleFirmRiderQuestionsText(e){
      this.firmRiderQuestionText = e.target.value
        console.log('Firm Rider Question Answered')
    }
    showFirmRiderQuestions(e){
        if(e.target.value=='Yes'){
            this.wantToBuyFirmRider = true
            this.currentQPD.conditionforQuestion= true
            this.currentQPD.buttonToShow = false;   
            return true
        }
        else{
            this.wantToBuyFirmRider = false
            this.currentQPD.conditionforQuestion= false
            this.currentQPD.buttonToShow = true;
        }
        return false
    }
    ansSelectedFunc(e){
        let indexOfQuestion = e.target.dataset.id
        console.log('Answer Selected for ' + indexOfQuestion+ ' value '+ e.target.value)
        let questionsArray = this.currentQPD.EligibilityQuestion
        console.log(JSON.stringify(questionsArray[indexOfQuestion].CorrectAns))
        questionsArray[indexOfQuestion].userAns = e.target.value
        
        if(questionsArray[indexOfQuestion].userAns != questionsArray[indexOfQuestion].CorrectAns){
            questionsArray[indexOfQuestion].showError = true
        }
        else{
         questionsArray[indexOfQuestion].showError = false
        }

        this.currentQPD.EligibilityQuestion =[]
        this.currentQPD.EligibilityQuestion = questionsArray
        //console.log('Updated Eligibility = '+ JSON.stringify(this.currentQPD.EligibilityQuestion))
    }
    calculatePolicyPremium(ArrayOfData,StartDate,EndDateRcv,arrayDataforPremiumEndo){

        console.log('Calculating Policy Premium')
     
        console.log('Data 1 Recieved ==> ' +JSON.stringify(ArrayOfData))
        console.log('Data 2 Recieved ==> ' +JSON.stringify(arrayDataforPremiumEndo))
        let EndDate = EndDateRcv.substring(0, 10)
        console.log('StartDate is ' +StartDate)// StartDate is 2021-01-22
        console.log('EndDate is '+EndDate  )// EndDate is 2021-01-28
        let monthStart = StartDate.split('-')
        let monthEnd = EndDate.split('-')
     
        let yearStart = monthStart[0]
        let yearEnd = monthEnd[0]
        
        monthStart=monthStart[1]
        monthEnd=monthEnd[1]
        
        let months = (Number(yearEnd)-Number(yearStart))*12 +((Number(monthEnd)-Number(monthStart)) )
     
        console.log('MONTHS ' + months)
       
        for(let i=0; i < ArrayOfData.length; i ++){
           let tempPremium = Number(ArrayOfData[i].PremiumAmount)*months/12;
           if(tempPremium < Number(ArrayOfData[i].PremiumAmount)*.3){
              tempPremium =  Number(ArrayOfData[i].PremiumAmount)*.3
           }
           console.log('CALCULATING PREMIUM ' + JSON.stringify(ArrayOfData[i])+ ' Premium is ' + tempPremium)
           this.PolicyPremium += tempPremium
        }
        console.log('PREMIUM ==? '+this.PolicyPremium)
        for(let i =0; i < arrayDataforPremiumEndo.length;i++){
           if(arrayDataforPremiumEndo[i].PremiumAmount){
              this.PolicyPremium +=arrayDataforPremiumEndo[i].PremiumAmount
           }
     
        }
        console.log('PREMIUM ==? '+this.PolicyPremium)
        // this.PolicyPremium = 
        return(this.PolicyPremium)
       }

       makePolicy(PolicyToMake){


         let rightNow = new Date();

         // Adjust for the user's time zone
         rightNow.setMinutes(
             new Date().getMinutes() - new Date().getTimezoneOffset()
         );

         // Return the date in "YYYY-MM-DD" format
         let yyyyMmDd = rightNow.toISOString().slice(0,10);

         let arrayDataforPremiumProd = []
         let arrayDataforPremiumEndo = []
         var get_entries = this.mapOfPPD.entries(); 
         
         for(var ele of get_entries) {
           
            if(ele[1].Type == 'Product' ){
               arrayDataforPremiumProd.push(ele[1])
            }
            else if(ele[1][0] != undefined){
               
               if(ele[1][0].Type =='Endorsement' && ele[1][0].PremiumAmount !=0 ){
                  arrayDataforPremiumEndo.push(ele[1][0])
               }
            }
         }
         console.log('this.Query_QPD_List[0].Quote__r ' +JSON.stringify(this.Query_QPD_List[0].Quote__r))
         console.log('this.Query_QPD_List[0].Quote__r.Opportunity__c ' +this.Query_QPD_List[0].Quote__r.Opportunity__c)
       
         var proRata = this.calculatePolicyPremium(arrayDataforPremiumProd,yyyyMmDd,this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,arrayDataforPremiumEndo)
         var Discount=0;
         if(this.accRecord.Is_License_Eligibility_Failed__c){
            if(this.Query_QPD_List[0].Quote__r.Discount__c){
               Discount =proRata*this.Query_QPD_List[0].Quote__r.Discount__c/100
            }
         }







            if(PolicyToMake == 'PPD'){
               let temp = {
         
                     
                  Category__c:'Firm Rider Insurance Certificate',
                   Master_Policy_Number__c:this.Query_QPD_List[0].Quote__r.Master_Policy_Number__c,
                   Contact__c: this.accRecord.PersonContactId,
                   EffectiveDate:yyyyMmDd,
                   RecordTypeId:'012f0000000feEZAAY',
                   SaleDate:yyyyMmDd,
                   PremiumAmount:proRata,
                   RenewalDate:this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,
                   Renewal_Quote__c:this.Query_QPD_List[0].Quote__c,
                   Policy_Terms__c:this.Query_QPD_List[0].Quote__r.Quote_Term__c,
                   Intital_Policy_Terms__c:this.Query_QPD_List[0].Quote__r.Quote_Term__c,
                   Renewal_Opportunity__c:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                   ExpirationDate:this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,
                   SourceOpportunityId:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                   // Billing_Contact__c:this.accRecord.Id,
                   PolicyName:this.accRecord.Name + '-' +this.Query_QPD_List[0].Product__r.Name,
                   Name: this.accRecord.Name + '-' +this.Query_QPD_List[0].Product__r.Name ,
                   ProductId:this.Query_QPD_List[0].Product__r.Id,
                   Policy_Holder__c:this.accRecord.HiddenAccount__c,
                   NameInsuredId:this.accRecord.Id,
                   Brokerage__c:this.accRecord.Brokerage_Account__c,
                   Broker__c:this.accRecord.Broker_Contact__c,
                   Commission__c:Number(this.Query_QPD_List[0].Quote__r.Commission__c),
                   Quote__c:this.Query_QPD_List[0].Quote__c,
                   Status:'Draft',
                   Discount,
                   Category__c:'Individual Insurance Certificate',
                   ExternalId__c: this.accRecord.Id+ '-'+this.accRecord.HiddenAccount__c+'Individual Insurance Certificate' //add category 
          }
          console.log('Temp == ',JSON.stringify(temp))
          return temp
            }


             else{
                let temp ={
                  Category__c:'Firm Rider Insurance Certificate',
                  Master_Policy_Number__c:this.Query_QPD_List[0].Quote__r.Master_Policy_Number__c,
                  Contact__c: this.accRecord.PersonContactId,
                  EffectiveDate:yyyyMmDd,
                  RecordTypeId:'012f0000000feEZAAY',
                  SaleDate:yyyyMmDd,
                  PremiumAmount:this.Query_QPD_List[0].Quote__r.Policy_Premium__c,
                  RenewalDate:this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,
                  Renewal_Quote__c:this.Query_QPD_List[0].Quote__c,
                  Policy_Terms__c:this.Query_QPD_List[0].Quote__r.Quote_Term__c,
                  Intital_Policy_Terms__c:this.Query_QPD_List[0].Quote__r.Quote_Term__c,
                  Renewal_Opportunity__c:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                  ExpirationDate:this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,
                  SourceOpportunityId:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                  Quote_Product_Detail__c:'', // Mapped this field when we called it 
                  PolicyName:this.accRecord.Name + '-' +this.Query_QPD_List[0].Product__r.Name,
                  Name: this.accRecord.Name + '-' +this.Query_QPD_List[0].Product__r.Name +' Firm Rider',
                  ProductId:this.Query_QPD_List[0].Product__r.Id,
                  Policy_Holder__c:this.accRecord.HiddenAccount__c,
                  Brokerage__c:this.accRecord.Brokerage_Account__c,
                  Broker__c:this.accRecord.Broker_Contact__c,
                  Commission__c:Number(this.Query_QPD_List[0].Quote__r.Commission__c),
                  Quote__c:this.Query_QPD_List[0].Quote__c,
                  Status:'Draft',
                  ExternalId__c: this.accRecord.Id+ '-'+this.accRecord.HiddenAccount__c+'Firm Rider Certificate' //add category 
                  }
                  return temp
             }
       }

      savePPD(currentQPD){
        if(this.policies.length == 0){
         let rightNow = new Date();

         // Adjust for the user's time zone
         rightNow.setMinutes(
             new Date().getMinutes() - new Date().getTimezoneOffset()
         );

         // Return the date in "YYYY-MM-DD" format
         let yyyyMmDd = rightNow.toISOString().slice(0,10);

         let arrayDataforPremiumProd = []
         let arrayDataforPremiumEndo = []
         var get_entries = this.mapOfPPD.entries(); 
         
         for(var ele of get_entries) {
           
            
            if(ele[1][0] != undefined){
               
               if(ele[1][0].Type =='Endorsement' && ele[1][0].PremiumAmount !=0 ){
                  arrayDataforPremiumEndo.push(ele[1][0])
               }
            }
            else{
               
                  arrayDataforPremiumProd.push(ele[1])
               
            }
         }
         console.log('arrayDataforPremiumEndo ' + JSON.stringify(arrayDataforPremiumEndo))
         console.log('arrayDataforPremiumProd ' + JSON.stringify(arrayDataforPremiumProd))
         console.log('this.Query_QPD_List[0].Quote__r ' +JSON.stringify(this.Query_QPD_List[0].Quote__r))
         console.log('this.Query_QPD_List[0].Quote__r.Opportunity__c ' +this.Query_QPD_List[0].Quote__r.Opportunity__c)
       
         var proRata = this.calculatePolicyPremium(arrayDataforPremiumProd,yyyyMmDd,this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,arrayDataforPremiumEndo)
         var Discount=0;
         if(this.accRecord.Is_License_Eligibility_Failed__c){
            if(this.Query_QPD_List[0].Quote__r.Discount__c){
               Discount =proRata*this.Query_QPD_List[0].Quote__r.Discount__c/100
            }
         }
         console.log('PRO RATA ' +proRata )






            
               let temp = {
         
                     
                  Category__c:'Firm Rider Insurance Certificate',
                   Master_Policy_Number__c:this.Query_QPD_List[0].Quote__r.Master_Policy_Number__c,
                   Contact__c: this.accRecord.PersonContactId,
                   EffectiveDate:yyyyMmDd,
                   RecordTypeId:'012f0000000feEZAAY',
                   SaleDate:yyyyMmDd,
                   PremiumAmount:proRata,
                   RenewalDate:this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,
                   Renewal_Quote__c:this.Query_QPD_List[0].Quote__c,
                   Policy_Terms__c:this.Query_QPD_List[0].Quote__r.Quote_Term__c,
                   Intital_Policy_Terms__c:this.Query_QPD_List[0].Quote__r.Quote_Term__c,
                   Renewal_Opportunity__c:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                   ExpirationDate:this.Query_QPD_List[0].Quote__r.Quote_Expiry_Date__c,
                   SourceOpportunityId:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                   // Billing_Contact__c:this.accRecord.Id,
                   PolicyName:this.accRecord.Name + '-' +this.Query_QPD_List[0].Product__r.Name,
                   Name: this.accRecord.Name + '-' +this.Query_QPD_List[0].Product__r.Name ,
                   ProductId:this.Query_QPD_List[0].Product__r.Id,
                   Policy_Holder__c:this.accRecord.HiddenAccount__c,
                   NameInsuredId:this.accRecord.Id,
                   Brokerage__c:this.accRecord.Brokerage_Account__c,
                   Broker__c:this.accRecord.Broker_Contact__c,
                   Commission__c:Number(this.Query_QPD_List[0].Quote__r.Commission__c),
                   Quote__c:this.Query_QPD_List[0].Quote__c,
                   Status:'Draft',
                   Discount,
                   Category__c:'Individual Insurance Certificate',
                   ExternalId__c: this.accRecord.Id+ '-'+this.accRecord.HiddenAccount__c+'Individual Insurance Certificate' //add category 
          }
         
                this.policies.push(temp)

        }
        
        if(currentQPD.type == 'Product'){
            console.log('Type was Product Name;; ' +currentQPD.productOptionName )
            console.log('PPD =>  ' + JSON.stringify([this.mapOfPPD.get(currentQPD.productOptionName)]))
            if([this.mapOfPPD.get(currentQPD.productOptionName)]){
               makePolicy2({
                  Policy:this.policies,
                  ppds:[this.mapOfPPD.get(currentQPD.productOptionName)],
                  parentID:this.accRecord.Id,
                  OppId:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                  Midterm:this.Midterm ,
                  RecentPurchase:this.PolicyPremiumToSend})
                  .then(result=>{
                     console.log('result from make Policy ' + JSON.stringify(result))
                     
                     this.policies[0].Id = result[0].InsurancePolicyId
                     console.log('prod opt name in make policy ',currentQPD.productOptionName)
                     
                     this.mapOfPPD.set(result[0].Policy_Product_Name__c , result[0])
                    
                     this.printmap(this.mapOfPPD)

                     console.log('Current PPD ID' + JSON.stringify(this.mapOfPPD.get(result[0].Policy_Product_Name__c)));
                  })
                  .catch(err=>{
                     console.log('err in makePolicy2 ' + JSON.stringify(err))
                  })
            }
        }
        else if(currentQPD.type == 'Endorsement'){
            console.log('Type was Product Name;; ' +currentQPD.productOptionName )
            console.log('PPD =>  ' + JSON.stringify(this.mapOfPPD.get(currentQPD.productOptionName)))


            var EndrosementQDPs = [];
            if(this.mapOfPPD.get(currentQPD.productOptionName)[0]){

               EndrosementQDPs =  this.mapOfPPD.get(currentQPD.productOptionName);
               console.log('Created::' + JSON.stringify(EndrosementQDPs) + EndrosementQDPs.length);

            }
            else{
               EndrosementQDPs.push(this.mapOfPPD.get(currentQPD.productOptionName))
               console.log('Updated::' + JSON.stringify(EndrosementQDPs));

            }

            if(this.mapOfPPD.get(currentQPD.productOptionName)){
               makePolicy2({
                  Policy:this.policies,
                  ppds:EndrosementQDPs,
                  parentID:this.accRecord.Id,
                  OppId:this.Query_QPD_List[0].Quote__r.Opportunity__c,
                  Midterm:this.Midterm ,
                  RecentPurchase:this.PolicyPremiumToSend})
                  .then(result=>{
                     console.log('result from make Policy ' + JSON.stringify(result))
                     
                     this.mapOfPPD.set(result[0].Policy_Product_Name__c , result[0])
                     this.printmap(this.mapOfPPD)
                     //console.log('Current PPD ID' + JSON.stringify(this.mapOfPPD.get(result[0].Policy_Product_Name__c)));
               
                     
                      
                  })
                  .catch(err=>{
                     console.log('err in makePolicy2 ' + JSON.stringify(err))
                  })
            }
        }
        else if (currentQPD.type == 'Firm Rider'){
            console.log('Type was Firm Rider')
        }
        else{
           console.log('PPD NOT SAVED')
        }
    }

    handleNext(){
        console.log('handle next Clicked')
         /*
         * The purpose of this function is to manage the navigations.
         * There are a number of things we need to take care of while navigating.
         * 1- make sure we skip the 0 $ products/Endorsements
         * 2- if a product was purchased make sure we save save the product and eligibility of that product.
         * 3- clear the Selected product
         */
        //we need to check if there is a currentQPD.
        // If we do not have it we will assign the First QPD of map to the current QPD
        if(!this.currentQPD){
            this.currentQPD = this.mapOfQpd.get(this.ListOfProductOptions[0]) 
        }
        else{
            //We know that this is not the First QPD
            // We have to save the First QPD to the Salesforce DB
            if( (this.currentQPD.productQPD[0].QPDPremium != 0 ||  
                  this.currentQPD.productQPD[0].QPDPremium != '0') && 
                  this.mapOfPPD.has(this.currentQPD.productOptionName)
               ){
               console.log('Save PPD called for ' + this.currentQPD.productOptionName)
               this.savePPD(this.currentQPD)
            }
            if(this.ListOfProductOptions.indexOf(this.currentQPD.productOptionName)+1 < this.ListOfProductOptions.length){
               if(this.checkValid()){
                  this.currentQPD = this.mapOfQpd.get(this.ListOfProductOptions[this.ListOfProductOptions.indexOf(this.currentQPD.productOptionName)+1]) 
               } 
               else{
                  console.log('Show Error. Fields not Filled.')
                  
               }
            }
            else{
               console.log('We have reached the end')
               let ppds = Array.from(this.mapOfPPD.values())
               console.log('before sending to the quote ppds====   '+JSON.stringify(ppds))
               
               var evt= new CustomEvent('mythirdevent',
               {detail:{childcompname:'Payment',isSuspended: this.suspendedApplication , childcompdescription:this.childcompdescription,  
               Policies:this.policies,  ppds:ppds,Status: 'Appoved',RecentPremium:this.PolicyPremiumToSend,
               transactionFee:this.Query_QPD_List[0].Quote__r.Transaction_Fees__c }});

               this.dispatchEvent(evt);
            }  
        }
        this.currentQPD.EligibilityQuestion =  this.mapOfQuestions.get(this.currentQPD.Product_Detail__c)
        
         


        console.log('Current Qpd is ' + JSON.stringify(this.currentQPD))
        
        if(this.currentQPD.productQPD[0].QPDPremium == 0 ||  this.currentQPD.productQPD[0].QPDPremium == '0' ){
            if(this.currentQPD.type=='Product'){
                let e = {target:{value:0}}
                this.handleProductChange(e)
            }
            else{
                let e = {target:{value:'Yes'}}
                this.handleEndorsementChange(e)
            }
            this.savePPD(this.currentQPD)
            this.mapOfQpd.delete(this.currentQPD.productOptionName) 
            this.ListOfProductOptions  = Array.from(this.mapOfQpd.keys())
            this.handleNext()
        }

        //Now that we have our QPD we can check the conditions for Questions
        
        this.handlebuttonLogic()
        // In case the Answers are filled ie the userAns field is filled we will assume that this product was already 
        //Chosen before
        if(this.currentQPD.type =='Firm Rider' ){
         if(this.currentQPD.EligibilityQuestion[0].userAns){
            this.currentQPD.selectionOption[{
               label:'Yes', value: 'Yes', checked:true
               },
               {
                  label:'No', value: 'No', checked:false
               }]
                  
               this.currentQPD.prodLocked = true
               this.currentQPD.buttonToShow = true
               this.currentQPD.conditionforQuestion = true
         }
     }
        
     this.loaded = true
    }

    get checkProduct(){
        if(this.currentQPD.type == 'Product'){
            
            return true
        }
        return false
    }
    
    handlebuttonLogic(){
        //This Code handles the logic to swap the button of next and continue
        console.log('handle button Logic Running ')
        console.log('Type = ' + this.currentQPD.type)
        console.log('selectionOption' + JSON.stringify(this.currentQPD.selectionOption))
        console.log('prodLocked ' + JSON.stringify(this.currentQPD.prodLocked))
       
        //If the Type is product it should show 'next'
        if(this.currentQPD.type =='Product'){
            let temp = this.currentQPD
            this.currentQPD = ''
            temp.buttonToShow = true
            this.currentQPD =temp
        }
        //if the type is endorsement
        //check if the Option is 'no' if No is selected then show 'next'
        //Check if the Option is 'yes' and the answers are locked, if this case is true show 'next'
        else if(this.currentQPD.type =='Endorsement' && (this.currentQPD.selectionOption[1].checked || (this.currentQPD.selectionOption[0].checked && this.currentQPD.prodLocked))){
            let temp = this.currentQPD
            this.currentQPD = ''
            temp.buttonToShow = true
            this.currentQPD =temp
        }
        //otherwise show 'continue'
        else if(this.currentQPD.type =='Endorsement'  ){
            let temp = this.currentQPD
            this.currentQPD = ''
            temp.buttonToShow = false
            this.currentQPD =temp
        }
        //iF its a firm Rider and the mapofEligibility doesnt exist then show false
        else if(this.currentQPD.type =='Firm Rider' && !this.mapOfEligibility.has(this.currentQPD.productOptionName)){
         let temp = this.currentQPD
         this.currentQPD = ''
         temp.buttonToShow = false
         this.currentQPD =temp
        }
        else if(this.currentQPD.type =='Firm Rider' && this.mapOfEligibility.has(this.currentQPD.productOptionName)){
         let temp = this.currentQPD
         this.currentQPD = ''
         temp.buttonToShow = true
         this.currentQPD =temp
        }
        else{
         let temp = this.currentQPD
         this.currentQPD = ''
         temp.buttonToShow = true
         this.currentQPD =temp
        }
        
    }
    checkQuestionConditionForQPD(){
                //now that we are in the previous/next QPD we need to make sure that our selection is still being reflected.
                // for that we will use the mapofQPD in which we keep our selected data.
                console.log('in checkQuestionConditionForQPD ' + this.currentQPD.productOptionName +' type ' +this.currentQPD.type)
                if(this.mapOfPPD.has(this.currentQPD.productOptionName)){
                    //We have the product option
                    //check if the product option is Endorsement or Product or Firm Rider
                    if(this.mapOfPPD.get(this.currentQPD.productOptionName).Type == 'Product'){
                        //We already get the product selected so we wont do anything for now
                        
                    }
                    else if(this.mapOfPPD.get(this.currentQPD.productOptionName)[0].Type == 'Endorsement'){
                        //We already get the label 'Yes' Selected we need to make sure that the questions 
                        //are also being displayed
                        this.currentQPD.conditionforQuestion = true
                    }
                    else if(this.mapOfPPD.get(this.currentQPD.productOptionName).Type == 'Firm Rider'){
                        //We already get the label 'Yes' Selected we need to make sure that the questions 
                        //are also being displayed
                        this.currentQPD.conditionforQuestion = true
                    }
                }
                console.log('checkQuestionConditionForQPD ended')
    }
    handlePrevious(e){
         /**
         * The purpose of this function is to manage the navigations.
         * There are a number of things we need to take care of while navigating.
         * 1- make sure we skip the 0 $ products/Endorsements
         * 2- if a product was purchased make sure we save save the product and eligibility of that product.
         * 3- if we are navigating back make sure our previous choices were saved
         * 4- make sure the previous product is selected
         */
        console.log('handle Previous Clicked')
        //If we are on the first QPD
        if(!this.currentQPD){
           //Navigate back
           console.log(' Navigate back to Previous page')

        }
        else{
            console.log('index to be = '+ this.ListOfProductOptions.indexOf(this.currentQPD.productOptionName) +' product is '+ this.ListOfProductOptions[this.ListOfProductOptions.indexOf(this.currentQPD.productOptionName)-1])

            if(this.ListOfProductOptions.indexOf(this.currentQPD.productOptionName) -1 != -1){
                this.currentQPD = this.mapOfQpd.get(this.ListOfProductOptions[this.ListOfProductOptions.indexOf(this.currentQPD.productOptionName)-1]) 
                    //Now that we have our QPD we can check the conditions for Questions
                    this.checkQuestionConditionForQPD()   
            }
            else{
                console.log('We have reached the First Product')
                let childcompname='Name of comp is personalInformation';
                  let childcompdescription='Description of personalInformation';
                  const evt= new CustomEvent('myfirstevent', {detail:{direction: 'GO BACK'}});
                  this.dispatchEvent(evt);
            }  
            console.log('Current Qpd is ' + JSON.stringify(this.currentQPD))
            if(this.currentQPD.productQPD[0].QPDPremium == 0 ||  this.currentQPD.productQPD[0].QPDPremium == '0' ){
                this.handlePrevious()
            }
        }
       
    }




}