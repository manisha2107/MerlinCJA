import { LightningElement , track, api} from 'lwc';

// import getPOlst from '@salesforce/apex/CoverageChoice.getPOlst';
import getQPDs from '@salesforce/apex/CoverageChoice.getQPDs';
import getProductQuestions from '@salesforce/apex/CoverageChoice.getProductQuestions';
import makePolicy from '@salesforce/apex/CoverageChoice.makePolicy'
import makePolicy2 from '@salesforce/apex/CoverageChoice.makePolicy2'
import InsertProgramApplicationList from '@salesforce/apex/CoverageChoice.InsertProgramApplicationList';
// import savePolicy from '@salesforce/apex/CoverageChoice.createPolicy';


export default class CreateCommunityUser extends LightningElement {
@track frimRiderEligibility = false
@track wantToBuyFirmRider =false
@track ppdstoSend =[]
@track firmRiderQuestionPick
// @track firmRiderQuestionMultiPick
@track firmRiderQuestionText
@api LicenseQPD 
@track getDeductible
@track getPremium
@track productOptionsList;
   
 
@track selectedProductQPD;
@track QPDtoDisplay
@track indexOfQPD = 0
// @track boughtValue
@track ListOfProducts = []
@track mapOfPPD = new Map()
@track mapOfQuestions = new Map()
@track programQuestions
@track NoProduct
@track firmQuestion= [
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

// @track showError = false
@track dataForProgApp =new Map()
@track prodOptionWithEligibilityStatus = new Map()
// @track conditions = true
@track conds
loaded = false;

    
get showContinueOrSave(){
   console.log('showContinueOrSave function ' )
   if(( this.QPDtoDisplay[0].type == 'Product' && this.QPDtoDisplay[0] ) || this.disabled ==true || this.selectedProductQPD=='No'){
      console.log('showContinueOrSave Type  ' +  this.QPDtoDisplay[0].type)
      return true
   }
   else{
      return false
   }
}


ansSelectedFunc(event){

   
   var id = event.target.id.split('-')[0]
   console.log('Answer Selected  ' + event.target.value)
   console.log('Answer ID  ' +id )
   let status = 'Approved'
   let correctAnser= 'None'

   let array = this.QPDtoDisplay[0].EligibilityQuestion
   
   for(let i =0; i <array.length ; i++){
      if(array[i].Id == id){
         console.log('CURRENT QUESTION IS::::: '+JSON.stringify(array[i]))
         
         this.QPDtoDisplay[0].EligibilityQuestion[i].userAns = event.target.value
         correctAnser=array[i].CorrectAns
         if(array[i].CorrectAns!=event.target.value){
            status=array[i].Consequences
            this.QPDtoDisplay[0].EligibilityQuestion[i].type = false
            break
         }
      }
      
   }
   
   console.log('this.dataForProgApp.has(this.QPDtoDisplay[0].productOptionName  '+this.dataForProgApp.has(this.QPDtoDisplay[0].productOptionName))
   if(this.dataForProgApp.has(this.QPDtoDisplay[0].productOptionName)){
      let currentArray = this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName)
      console.log('current array' +JSON.stringify(currentArray))
      let objToInsert = {
         Status: status,
         QuestionId:id,
         UserAns: event.target.value,
         CorrectAns:correctAnser,
         Id:this.QPDtoDisplay[0].productOptionId
      }
      let isInserted = false
      for(let i =0;i < currentArray.length; i++){
         console.log('currentArray data ' + currentArray[i].QuestionId)
         if(currentArray[i].QuestionId==id){
            currentArray[i] = objToInsert
            isInserted = true
         }
      }
      if(!isInserted){
         currentArray.push(objToInsert)
      }
      this.dataForProgApp.set(this.QPDtoDisplay[0].productOptionName ,currentArray)
      console.log('DATA FOR PROG APP IS NOW ---> ' + JSON.stringify(this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName)))
   }
   else{
      console.log('in else this.dataForProgApp.has(this.QPDtoDisplay[0].productOptionName')
      this.dataForProgApp.set(this.QPDtoDisplay[0].productOptionName ,
         [{ Status: status,
            QuestionId:id,
            UserAns: event.target.value,
            CorrectAns:correctAnser,
            Id:this.QPDtoDisplay[0].productOptionId
         }])
   }
   
   var get_entries = this.dataForProgApp.entries(); 
      console.log("FINAL for dataForProgApp"); 
      
      for(var ele of get_entries)
            console.log(ele);
   
}

@track isModalOpen = false
@track ErrorMessage = ''

closeModal(){
   this.isModalOpen = false
}

handleFirmRiderQuestionsPick(e){
   this.firmRiderQuestionPick = e.target.value
   console.log(this.firmRiderQuestionPick)
   if(e.target.value == '4+'){
      // show Error Message
      this.frimRiderEligibility = false
      
      
      console.log(' frimRiderEligibility ' + this.frimRiderEligibility)
   }
   else if(this.firmRiderQuestionText && this.firmRiderQuestionPick){
      this.frimRiderEligibility = true
   }
     
}
handleFirmRiderQuestionsText(e){
   this.firmRiderQuestionText = e.target.value
   console.log(this.firmRiderQuestionText)
   if(this.firmRiderQuestionText && this.firmRiderQuestionPick){
      this.frimRiderEligibility = true
   }
}
// handleFirmRiderQuestionsMultiPick(e){
   
//    let str = e.target.value.replace(",", ";");
//    this.firmRiderQuestionMultiPick = str
//    console.log(JSON.parse(this.firmRiderQuestionMultiPick))
//    if(this.firmRiderQuestionPick && this.firmRiderQuestionMultiPick && this.firmRiderQuestionText && !this.isModalOpen ){
//       makeFirmRider({
//          Name:this.firmRiderQuestionText,
//          LicensedRep:this.firmRiderQuestionPick,
//          Provinces:this.firmRiderQuestionMultiPick
//       })
//    }   
// }
@track disabled

// set showContinueOrSave(e){
//    if(e.target.value =='No'){
//       return true
//    }
// }





getinputval() {
   let returnvalue; //assigning temp variable
   var inputCmp = this.template.querySelector(".inputfield"); //getting element
   var value = inputCmp.value; //assigning value to variable
   // is input valid text?
   if (value === "") {
       //adding custom validation
       inputCmp.setCustomValidity("Field is Required!");
       returnvalue = false;
   } else {
       //Removing validation error
       inputCmp.setCustomValidity(""); // if there was a custom error before, reset it
       returnvalue = this.datevalue;
   }
   inputCmp.reportValidity(); // Tells lightning-input to show the error right away without needing interaction

   return returnvalue; // returning inputvalue
}


get provinces(){
   return [
      { label: 'Alberta', value: 'Alberta' },
      { label: 'British Columbia', value: 'British Columbia' },
      { label: 'Manitoba', value: 'Manitoba' },
      { label: 'New Brunswick', value: 'New Brunswick' },
      { label: 'Newfoundland and Labrador', value: 'Newfoundland and Labrador' },
      { label: 'Ontario', value: 'Ontario' },
      { label: 'Northwest Territories', value: 'Northwest Territories' },
      { label: 'Nunavut', value: 'Nunavut' },
      { label: 'Nova Scotia', value: 'Nova Scotia' },
      { label: 'Prince Edward Island', value: 'Prince Edward Island' },
      { label: 'Quebec', value: 'Quebec' },
      { label: 'Saskatchewan', value: 'Saskatchewan' },
      { label: 'Yukon', value: 'Yukon' }
  ];
}

get picklistOpt(){
   return [
      { label: 'Yes', value: 'Yes', checked:false },
      { label: 'No', value: 'No',checked:false },
   ]
}

showFirmRiderQuestions(e){
    console.log('e.target.value is ' +e.target.value)
    
    if(e.target.value == 'Yes'){
      this.productOptionsList[this.indexOfQPD].selectionOption[0].checked = true      
      this.productOptionsList[this.indexOfQPD].selectionOption[1].checked = false

      this.wantToBuyFirmRider = true
    }
    else{
      this.productOptionsList[this.indexOfQPD].selectionOption[0].checked = false      
      this.productOptionsList[this.indexOfQPD].selectionOption[1].checked = true
      this.wantToBuyFirmRider = false
    }
   //  this.ListOfProducts.push({})
   console.log('Wants to buy firm rider ' +this.wantToBuyFirmRider)
}

get licensedRepresentatives(){
   return [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4+', value: '4+' },
   ]
}
get proRata(){

}
@track dataFromParent   
@track TotalPremium = new Map()



get getCurPremium(){
   console.log('getCurPremium is running ')
   this.getPremium = this.QPDtoDisplay[0].productQPD[0].QPDPremium
   return this.QPDtoDisplay[0].productQPD[0].QPDPremium
}

@track premiumToshow
get getTotalPremium(){
   let premiumToshow = 0;
   if(this.QPDtoDisplay){
      
      console.log(' TYPE ' + this.QPDtoDisplay[0].type)

      console.log(' PREMIUM ' + this.QPDtoDisplay[0].productQPD[0].QPDPremium)

      console.log('this.selectedProductQPD ' + this.selectedProductQPD)
   }

   if(this.QPDtoDisplay[0].type != 'Product' && this.selectedProductQPD =='Yes'){
    //For Endorsement and FIRM RIDER  
      this.TotalPremium.set(this.QPDtoDisplay[0].productOptionName ,this.QPDtoDisplay[0].productQPD[0].QPDPremium)
      
   }
   
   else {
      if(this.selectedProductQPD){
         //FOR PRODUCT
         let premium  = this.selectedProductQPD.split('-')
         this.TotalPremium.set(this.QPDtoDisplay[0].productOptionName ,premium[9])
   
      }
      
   }
   console.log('this.TotalPremium '+ JSON.stringify(this.TotalPremium.values() )+ ' '  )
   console.log('this.TotalPremium.keys() ' + JSON.stringify(this.TotalPremium.keys()))
   premiumToshow =0;
   var get_entries = this.PPDmapToQuote.entries(); 
   console.log(get_entries)
         for(var ele of get_entries) {
            console.log('this.TotalPremium ', ele)
         }

   // for (let value of this.TotalPremium.values()){
   //    console.log('Values => ' + Number(value))
   //    premiumToshow = Number(premiumToshow) + Number(value)
   // }

   for (let value of this.PPDmapToQuote.values()){
      console.log('Values => ' + Number(value['PremiumAmount']))
      if(Number(value['PremiumAmount']) != NaN){
         premiumToshow = Number(premiumToshow) + Number(value['PremiumAmount'])
      }
      
   }

   console.log('premiumToshow is ' + premiumToshow)
   
   this.premiumToshow = premiumToshow
   return premiumToshow
}

formatToCurrency = amount => { 
      amount = Number(amount)
      console.log('AMOUNT TO CONVERT '  +amount)
      let a=  "CA$" + amount.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, "$&,"); 
      console.log(' TO RETURN  ' + a)
      return a
   }
      
      ;

@track PPDmapToQuote = new Map()
@api childFunction(accRecord,license,mapOfAllPPdds,FirmRiderData){ 
        // initialize component
        console.log('FirmRiderData ' + FirmRiderData)
         if(FirmRiderData){
            this.firmRiderQuestionPick = FirmRiderData.Number_of_Licensed_Representatives__c
            this.firmRiderQuestionText = FirmRiderData.Name
         }
         console.log('firmRiderQuestionPick ' + this.firmRiderQuestionPick)
         console.log('firmRiderQuestionPick ' + this.firmRiderQuestionText)
         this.dataFromParent= accRecord
         console.log('DATAA FROM NAVIGATION ' +JSON.stringify(accRecord))
         console.log('Product Info called');
         console.log('mapOfAllPPdds '+mapOfAllPPdds)
         console.log('map recieved ' +JSON.stringify(mapOfAllPPdds.get('Privacy Breach Liability Endorsement')) )
         this.PPDmapToQuote = mapOfAllPPdds
         // var get_entries = mapOfAllPPdds.entries(); 
         // for(var ele of get_entries) {
         //    console.log('this.tempMap ', ele)
         // }
         getQPDs({ClassSelectedLicense:license,
         AccountId: this.dataFromParent.Id
      })
         .then(Licenses=>{
               if(Licenses.length > 0){
                  this.LicenseQPD = Licenses;
               console.log('Eligiblity license class is:::>'+JSON.stringify(this.LicenseQPD));
               let productOptions = []
               let mapIndex = 0;
                  console.log('this.LicenseQPD[0].Quote__r.Transaction_Fees__c ' +this.LicenseQPD[0].Quote__r.Transaction_Fees__c)
               //stores key => Id (product option) value=> index (of that product option)
               let tempMapOfOptions = new Map()

               //stores key => prodOpt id value=> Prod detail
               let tempMapOfQues = new Map()

               let setOfIds = []
               
               
               /**
                * iterate over the QPDS and make an array of Product option with QPD as child
                * We will use array and map array will store the data and map will help tell us where to put the data
                * map will give index of the product option 
                * Logic => if 
                *          the prod option is already in array 
                *          Add the new qpd as a child
                *          Else
                *          Add a new index with that product option
                */
               
               console.log('this.LicenseQPD.length in product info' +this.LicenseQPD.length)
               if(this.LicenseQPD.length >0){
                  for(let i=0 ; i<this.LicenseQPD.length; i++){
                  
                     console.log('NAME ==> '+  Licenses[i].ProductOption__r.Name )
                     if(tempMapOfOptions.has(this.LicenseQPD[i].ProductOption__r.Id)){
                        console.log(Licenses[i].ProductOption__r.Name+ ' inserted in if at index ' + tempMapOfOptions.get(this.LicenseQPD[i].ProductOption__r.Id +' Type '+this.LicenseQPD[i].Type_of_QPD__c))
                        
                        let tempQPD = {
                              QPDName: this.LicenseQPD[i].Name,
                              QPDCategory: this.LicenseQPD[i].Category__c,
                              QPDId: this.LicenseQPD[i].Id,
                              QPDPolicyLimit: this.LicenseQPD[i].Policy_Limit__c,
                              QPRDAggregate: this.LicenseQPD[i].Aggregate__c,
                              QPDPremium: this.LicenseQPD[i].Premium_Amount__c,
                              QPDDeductible: this.LicenseQPD[i].Deductible_Amount__c,
                              Approved:this.LicenseQPD[i].Approved__c
                        }
                        
                        

                        if(tempQPD.Approved){
                           var tempCheckBoxOpt = {
                              label: 'Claim: '+this.formatToCurrency(this.LicenseQPD[i].Policy_Limit__c)   +' / Aggregate: '+ this.formatToCurrency(this.LicenseQPD[i].Aggregate__c) +' / Deductible: '+this.formatToCurrency(this.LicenseQPD[i].Deductible_Amount__c),
                              
                              value: 'Policy_Limit__c-'+ this.LicenseQPD[i].Policy_Limit__c  +'-Aggregate-'+ this.LicenseQPD[i].Aggregate__c+
                                    '-Category__c-'+this.LicenseQPD[i].Category__c+'-Id-'+this.LicenseQPD[i].Id+'-Premium-'+this.LicenseQPD[i].Premium_Amount__c+
                                    '-Deductible-'+this.LicenseQPD[i].Deductible_Amount__c+'-Product_Detail__c-'+this.LicenseQPD[i].Product_Detail__c+'-Quuote-'+this.LicenseQPD[0].Quote__c +'-ProdOptId-'+this.LicenseQPD[i].ProductOption__r.Id,
                                 checked:true,
                           
                           }
                           
                        }
                        else{
                           var tempCheckBoxOpt = {
                              label: 'Claim: '+this.formatToCurrency(this.LicenseQPD[i].Policy_Limit__c)   +' / Aggregate: '+ this.formatToCurrency(this.LicenseQPD[i].Aggregate__c) +' / Deductible: '+this.formatToCurrency(this.LicenseQPD[i].Deductible_Amount__c),
                              
                              value: 'Policy_Limit__c-'+ this.LicenseQPD[i].Policy_Limit__c  +'-Aggregate-'+ this.LicenseQPD[i].Aggregate__c+
                                    '-Category__c-'+this.LicenseQPD[i].Category__c+'-Id-'+this.LicenseQPD[i].Id+'-Premium-'+this.LicenseQPD[i].Premium_Amount__c+
                                    '-Deductible-'+this.LicenseQPD[i].Deductible_Amount__c+'-Product_Detail__c-'+this.LicenseQPD[i].Product_Detail__c+'-Quuote-'+this.LicenseQPD[0].Quote__c +'-ProdOptId-'+this.LicenseQPD[i].ProductOption__r.Id,
                                 checked:false,
                           
                           }
                        }
                        productOptions[tempMapOfOptions.get(this.LicenseQPD[i].ProductOption__r.Id)].productQPD.push(tempQPD)
                        productOptions[tempMapOfOptions.get(this.LicenseQPD[i].ProductOption__r.Id)].checkBoxOpt.push(tempCheckBoxOpt)
                     
                     }
                     else{
                        // 
                        if(this.LicenseQPD[i].Product_Detail__c){
                           // setOfIds[productOptions.length]=(this.LicenseQPD[i].Product_Detail__c) 
                           if(setOfIds.includes(this.LicenseQPD[i].Product_Detail__c)){
                              console.log('PRODUCT DETAIL ALREADY IN ARRAY')
                              tempMapOfQues.set(this.LicenseQPD[i].ProductOption__r.Id,this.LicenseQPD[i].Product_Detail__c)
                           }
                           else{
                              console.log('PRODUCT DETAIL===>')
                              tempMapOfQues.set(this.LicenseQPD[i].ProductOption__r.Id,this.LicenseQPD[i].Product_Detail__c)
                              setOfIds.push(this.LicenseQPD[i].Product_Detail__c) 
                           }
                        }
                        else{
                           console.log('PRODUCT DETAIL IS NULL')
                        }
                           console.log(Licenses[i].ProductOption__r.Name+ ' inserted in else')
                           tempMapOfOptions.set(this.LicenseQPD[i].ProductOption__r.Id, productOptions.length)
                           var tempProdOpt = {
                              index:productOptions.length,
                              productOptionName: this.LicenseQPD[i].ProductOption__r.Name,
                             
                              showCheckBox:false,
                              showQuestions:false,
                              showList:false,
                              EligibilityQuestion:[],
                              Product_Detail__c:this.LicenseQPD[i].Product_Detail__c,
                              type: this.LicenseQPD[i].Type_of_QPD__c,
                              productOptionId: this.LicenseQPD[i].ProductOption__r.Id,
                              productQPD: [{
                                 QPDName: this.LicenseQPD[i].Name,
                                 QPDCategory: this.LicenseQPD[i].Category__c,
                                 QPDId: this.LicenseQPD[i].Id,
                                 QPDPolicyLimit: this.LicenseQPD[i].Policy_Limit__c,
                                 QPRDAggregate: this.LicenseQPD[i].Aggregate__c,
                                 QPDPremium: this.LicenseQPD[i].Premium_Amount__c,
                                 QPDDeductible: this.LicenseQPD[i].Deductible_Amount__c,
                                 Approved:this.LicenseQPD[i].Approved__c
                              }],
                              selectionOption:[
                                 {
                                 label:'Yes', value: 'Yes', checked:false
                                 },
                                 {
                                 label:'No', value:'No', checked:false
                                 }
                              ],
                              checkBoxOpt :[{
                                 label: 'Claim: '+this.formatToCurrency(this.LicenseQPD[i].Policy_Limit__c)   +' / Aggregate: '+ this.formatToCurrency(this.LicenseQPD[i].Aggregate__c) +' / Deductible: '+this.formatToCurrency(this.LicenseQPD[i].Deductible_Amount__c),
                                 
                                 value: 'Policy_Limit__c-'+ this.LicenseQPD[i].Policy_Limit__c  +'-Aggregate-'+ this.LicenseQPD[i].Aggregate__c+
                                       '-Category__c-'+this.LicenseQPD[i].Category__c+'-Id-'+this.LicenseQPD[i].Id+'-Premium-'+this.LicenseQPD[i].Premium_Amount__c+
                                       '-Deductible-'+this.LicenseQPD[i].Deductible_Amount__c+'-Product_Detail__c-'+this.LicenseQPD[i].Product_Detail__c+'-Quuote-'+this.LicenseQPD[0].Quote__c +'-ProdOptId-'+this.LicenseQPD[i].ProductOption__r.Id
                                 ,checked:false,
                                    }]
                           }
                           
                           if(tempProdOpt.productQPD[0].Approved){
                              tempProdOpt.checkBoxOpt[0].checked = true
                              tempProdOpt.selectionOption[0].checked = true
                           }

                           if(tempProdOpt.type == 'Product'){
                              tempProdOpt.showCheckBox = true
                           }
                           
                           else if(tempProdOpt.type == 'Firm Rider'){
                              tempProdOpt.showQuestions = true
                              if(this.firmRiderQuestionPick !=''){
                                 console.log('this.firmRiderQuestionPick is not null ' +this.firmRiderQuestionPick)
                                 tempProdOpt.selectionOption[0].checked = true
                              }
                           }
                           else if(tempProdOpt.type == 'Endorsement'){
                              tempProdOpt.showList = true
                           }
      
                           productOptions.push(tempProdOpt)
                        
                     }
                     
                     
                     console.log('LENGTH ' +productOptions.length)
                  }
               }
               
               // let prodOpt2 = []
               // for(let i =0; i < productOptions.length; i++){
               //    if(productOptions[i].produc tQPD[0].QPDPremium != Number(0) || productOptions[i].productQPD[0].QPDPremium!= '0'){
               //       prodOpt2.push(productOptions[i]) 
               //    }
                  
                  
               // }
               
               // console.log('Printing prodOpt2 ' + JSON.stringify(prodOpt2))
               //this.productOptionsList = productOptions
               this.productOptionsList = productOptions
               console.log('productOptions => ' + JSON.stringify(this.productOptionsList))
               let tempMapOfProddet = new Map()
               console.log('ids for set===> '+JSON.stringify(setOfIds))
               if(setOfIds.length>0){
               getProductQuestions({Ids:setOfIds, Account:this.dataFromParent.Id , Quote:this.LicenseQPD[0].Quote__c})
               .then(result=>{
                  console.log(' QUESTIONS ' + JSON.stringify(result))
                  var get_entries = tempMapOfQues.entries(); 
                  console.log("----------entries--------- 111111111"); 
                  for(var ele of get_entries) 
                     console.log(ele);

                  /**
                   * WE CREATED A MAP =>tempMapOfProddet
                   * 
                   * PURPOSE OF THIS MAP IS TO RETURN THE QUESTIONS ASSOCIATED WITH EVERY PRODUCT DETAIL.
                   * 
                   * GOAL: OUR GOAL IS TO GO OVER QPD GET THE PRODUCT DETAIL AND THEN SHOW THE QUESTIONS ASSOCIATED
                   */


                  
                  
                  /**
                   * We will iterate over the results and check if the prod detail is in the map
                   * if it is then we will add the question at the end of the array
                   * else we will set it against the product detail
                   */
                  
                  for( let i =0; i < result.length; i ++){
                     //check if the map has the value
                     if(tempMapOfProddet.has(result[i].Product_Detail__c)){
                        tempMapOfProddet.set(result[i].Product_Detail__c,[...tempMapOfProddet.get(result[i].Product_Detail__c), {Question:result[i].Question__r.Question_Description__c, CorrectAns: result[i].Correct_Answer__c,Consequences:result[i].Consequence__c, Id: result[i].Id,type:'true',options: this.picklistOpt,Error:result[i].Error_Description__c,userAns:result[i].ReponseField__c}])
                     }
                     else{
                        tempMapOfProddet.set(result[i].Product_Detail__c,[{Question:result[i].Question__r.Question_Description__c, CorrectAns: result[i].Correct_Answer__c,Consequences:result[i].Consequence__c, Id: result[i].Id,type:'true',options: this.picklistOpt,Error:result[i].Error_Description__c,userAns:result[i].ReponseField__c}])
                     }
                  }
               
                  this.mapOfQuestions =tempMapOfProddet
                  var get_entries = tempMapOfProddet.entries(); 
                  console.log("----------entries--------- 222222222222"); 
                  for(var ele of get_entries) 
                     console.log(ele);

                  // This is the First Item to Display
                  this.indexOfQPD =0
                  this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]
                  
                  console.log('This is the First Item to Display ' + JSON.stringify(this.QPDtoDisplay))
                  for(let i = this.indexOfQPD; i<this.productOptionsList.length;i++){
                     if(this.QPDtoDisplay[0].productQPD[0].QPDPremium == Number(0) ){
                        
                        console.log('Premium ==0 '+ JSON.stringify(this.QPDtoDisplay))
                        //this.QPDtoDisplay[0].checkBoxOpt[0].value
                        if(this.QPDtoDisplay.type ='Endorsement'){
                           var e = {target:{value:'Yes'}}
                           this.selectedProductQPD = 'Yes'
                        }
                        else if(this.QPDtoDisplay.type ='Product'){
                           this.selectedProductQPD=this.QPDtoDisplay[0].checkBoxOpt[0].value
                        }
                        
                        // this.selectedProductQPD = this.QPDtoDisplay[0].checkBoxOpt[0].value
                        console.log('this.selectedProductQPD SELECTED PRODUCT VALUE IS' +JSON.stringify(this.selectedProductQPD))
                        this.handleChangeProductQPD(e)
                        this.indexOfQPD = this.indexOfQPD +1;
                        if(this.indexOfQPD < this.productOptionsList.length ){
                           this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]
                           this.selectedProductQPD= null
                        }
                        else{
                           // if while iterating over the 0 premium products we reach the end of array
                           // we need to stop pagination and make the server calls
                           // by calling the function again we will check again 
                           // and it will skip the if block and go into the else block.
                           this.nextProdOpt(e)
                        }
                        
                        this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]
                        this.selectedProductQPD= null
                     }
                  }
                  
                  console.log(' this.QPDtoDisplay ' + JSON.stringify(this.QPDtoDisplay))
                  
                  this.QPDtoDisplay[0].EligibilityQuestion =  tempMapOfProddet.get(this.QPDtoDisplay[0].Product_Detail__c)
      
                  console.log(' QPDtoDisplay  ' + JSON.stringify(this.QPDtoDisplay[0]))
         

                     
               })
               .catch(err=>{
                  console.log('ERROR ' + err)
               })
               }
               console.log('OUTSIDE FUNC CALL')
               
               var get_entries = tempMapOfOptions.entries(); 
   
   

               console.log("----------entries--------- 333333"); 
               for(var ele of get_entries) 
                  console.log(ele);
               console.log('PRODUCT TO DISPLAY '+ JSON.stringify(this.QPDtoDisplay))
               console.log('Product OPtions '+JSON.stringify(productOptions))
               }
               else{
                  this.NoProduct = 'There are no Products for '+license
               }
         })
         .catch(error=>{
               console.log('error'+ JSON.stringify(error));
               if(error.message == 'No Products'){
                  this.NoProduct = 'There are no Products for '+license
               }
         })
        

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


@track PolicyForQPD 

makePPD(){
   let ppds=[]
   for(let j =0; j < this.ListOfProducts.length; j++){
      console.log('prodOptName[j]' +this.ListOfProducts[j])
      if(this.mapOfPPD.has(this.ListOfProducts[j]) ){
         let tempData = this.mapOfPPD.get(this.ListOfProducts[j])
         if(tempData[0] == undefined){
            ppds.push(tempData)
         }
         else if(tempData[0]){
            for(let i=0; i<tempData.length;i++){
               ppds.push(tempData[i])
            }
         }
      }
   }
   makePolicy2({
      Policy:[this.PolicyForQPD],
      ppds,
      parentID:this.dataFromParent.Id,
      OppId:this.LicenseQPD[0].Quote__r.Opportunity__c})
      .then(result=>{
         console.log('result from make Policy ' + JSON.stringify(result))
         // this.ppdstoSend = result

         console.log('this.ppdToSend ' + JSON.stringify(this.ppdstoSend));
         for(let i = 0 ;  i < result.length; i++){
            console.log('Policy_Product_Name__c is ' +result[i].Policy_Product_Name__c + ' PPD --> ' +JSON.stringify(result[i]))
            if(!this.PPDmapToQuote.has(result[i].Policy_Product_Name__c)){
              this.PPDmapToQuote.set(result[i].Policy_Product_Name__c,result[i]);
              
              console.log("tempMap.get(result[i].Policy_Product_Name__c) " +JSON.stringify(this.PPDmapToQuote.get(result[i].Policy_Product_Name__c)))
            }
    
            if(this.firmRiderQuestionText && i ==result.length-1 ){
               this.PPDmapToQuote.set(result[i].Policy_Product_Name__c,result[i]);
              }
          }


          
      })
      .catch(err=>{
         console.log('err in makePolicy2 ' + JSON.stringify(err))
      })

}

get checkConditionsforProductDets(){
   

   for(let i =0; i < this.QPDtoDisplay[0].checkBoxOpt.length;i++){
      if(this.QPDtoDisplay[0].checkBoxOpt[i].checked){
         this.selectedProductQPD = this.QPDtoDisplay[0].checkBoxOpt[i].value
         return true
      }
   }
   return false
}
handleChangeProductQPD(e) {
   if(!this.PolicyForQPD){
      console.log('Policy Empty')
      //Quote + MasterpolicyNumber + 000_ <- 
      let rightNow = new Date();

      // Adjust for the user's time zone
      rightNow.setMinutes(
         new Date().getMinutes() - new Date().getTimezoneOffset()
      );

      // Return the date in "YYYY-MM-DD" format
      let yyyyMmDd = rightNow.toISOString().slice(0,10);

      console.log('Creating Policy')
      let arrayDataforPremiumProd = []
      let arrayDataforPremiumEndo = []
      var get_entries = this.mapOfPPD.entries(); 
      console.log("this.mapOfPPD"); 
      for(var ele of get_entries) {
         console.log(ele[0])
         console.log(ele[1])
         if(ele[1].Type == 'Product' ){
            arrayDataforPremiumProd.push(ele[1])
         }
         else if(ele[1][0] != undefined){
            console.log('Array in ppd ' + JSON.stringify(ele[1][0]))
            if(ele[1][0].Type =='Endorsement' && ele[1][0].PremiumAmount !=0 ){
               arrayDataforPremiumEndo.push(ele[1][0])
            }
         }  
      }
      console.log('this.LicenseQPD[0].Quote__r ' +JSON.stringify(this.LicenseQPD[0].Quote__r))
      console.log('this.LicenseQPD[0].Quote__r.Opportunity__c ' +this.LicenseQPD[0].Quote__r.Opportunity__c)

      var proRata = this.calculatePolicyPremium(arrayDataforPremiumProd,yyyyMmDd,this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,arrayDataforPremiumEndo)
      var Discount=0;
      if(this.dataFromParent.Is_License_Eligibility_Failed__c){
         if(this.LicenseQPD[0].Quote__r.Discount__c){
            Discount =proRata*this.LicenseQPD[0].Quote__r.Discount__c/100
         }
      }
      var proRata = this.calculatePolicyPremium(arrayDataforPremiumProd,yyyyMmDd,this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,arrayDataforPremiumEndo)
         
      this.PolicyForQPD = {
            
            RecordTypeId:'012f0000000feEZAAY',
            Category__c:'Firm Rider Insurance Certificate',
                     Master_Policy_Number__c:this.LicenseQPD[0].Quote__r.Master_Policy_Number__c,
                     Contact__c: this.dataFromParent.PersonContactId,
                     EffectiveDate:yyyyMmDd,
                     RecordTypeId:'012f0000000feEZAAY',
                     SaleDate:yyyyMmDd,
                     PremiumAmount:proRata,
                     RenewalDate:this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,
                     Renewal_Quote__c:this.LicenseQPD[0].Quote__c,
                     Policy_Terms__c:this.LicenseQPD[0].Quote__r.Quote_Term__c,
                     Intital_Policy_Terms__c:this.LicenseQPD[0].Quote__r.Quote_Term__c,
                     Renewal_Opportunity__c:this.LicenseQPD[0].Quote__r.Opportunity__c,
                     ExpirationDate:this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,
                     SourceOpportunityId:this.LicenseQPD[0].Quote__r.Opportunity__c,
                     // Billing_Contact__c:this.dataFromParent.Id,
                     PolicyName:this.dataFromParent.Name + '-' +this.LicenseQPD[0].Product__r.Name,
                     Name: this.dataFromParent.Name + '-' +this.LicenseQPD[0].Product__r.Name ,
                     ProductId:this.LicenseQPD[0].Product__r.Id,
                     Policy_Holder__c:this.dataFromParent.HiddenAccount__c,
                     NameInsuredId:this.dataFromParent.Id,
                     Brokerage__c:this.dataFromParent.Brokerage_Account__c,
                     Broker__c:this.dataFromParent.Broker_Contact__c,
                     Commission__c:Number(this.LicenseQPD[0].Quote__r.Commission__c),
                     Quote__c:this.LicenseQPD[0].Quote__c,
                     Status:'Draft',
                     Discount,
                     Category__c:'Individual Insurance Certificate',
                     ExternalId__c: this.dataFromParent.Id+ '-'+this.dataFromParent.HiddenAccount__c+'Individual Insurance Certificate' //add category 
            }
            
   }


   console.log('CHECING DATA == ' + JSON.stringify(this.productOptionsList)); 
   this.selectedProductQPD = e.target.value
// 
   if(this.selectedProductQPD == 'Yes' && this.QPDtoDisplay[0].type =='Endorsement'){
      console.log('Endorsement Selected')
      console.log('SETTING CHECKBOX OPTIONS')
      this.productOptionsList[this.indexOfQPD].selectionOption[0].checked = true
      this.productOptionsList[this.indexOfQPD].selectionOption[1].checked = false
      console.log('Entering loop')
      for(let i=0; i <this.QPDtoDisplay[0].productQPD.length; i++ ){
         if(!this.mapOfPPD.has(this.QPDtoDisplay[0].productOptionName)){
            let temp = {
               // Name:this.QPDtoDisplay[0].productOptionName,
               // /PPL_Date__c:
               Product_Detail__c: this.QPDtoDisplay[0].Product_Detail__c,
               Policy_Product_Name__c:this.QPDtoDisplay[0].productOptionName,
               CoverageTypeId	:this.QPDtoDisplay[0].productOptionId,
               Status__c:'Draft',
               Type:this.QPDtoDisplay[0].type,
               EffectiveDate: this.getDate(),
               Product__c:this.LicenseQPD[0].Product__r.Id,
               PremiumAmount:this.QPDtoDisplay[0].productQPD[0].QPDPremium,
               Policy_Limit__c:this.QPDtoDisplay[0].productQPD[0].QPDPolicyLimit,
               Aggregate__c:this.QPDtoDisplay[0].productQPD[0].QPRDAggregate,
               DeductibleAmount:this.QPDtoDisplay[0].productQPD[0].QPDDeductible,
               Category:this.QPDtoDisplay[0].productQPD[0].QPDCategory,
               Quote_Product_Detail__c:this.QPDtoDisplay[0].productQPD[0].QPDId,
               RecordTypeId:'012f0000000fpA4AAI',
               EID__c: this.LicenseQPD[0].Quote__c+'-'+this.QPDtoDisplay[0].Product_Detail__c+'-'+this.QPDtoDisplay[0].productQPD[i].QPDName
            }
            this.mapOfPPD.set(this.QPDtoDisplay[0].productOptionName,[temp])

            this.PPDmapToQuote.set(this.QPDtoDisplay[0].productOptionName, temp)
         }
         else{
            this.mapOfPPD.set(this.QPDtoDisplay[0].productOptionName,
               [...this.mapOfPPD.get(this.QPDtoDisplay[0].productOptionName) ,{ 
                  // Name:this.QPDtoDisplay[0].productOptionName,
                  Product_Detail__c:this.QPDtoDisplay[0].Product_Detail__c,
                  Policy_Product_Name__c:this.QPDtoDisplay[0].productOptionName,
                  CoverageTypeId	:this.QPDtoDisplay[0].productOptionId,
                  Status__c:'Draft',
                  Type:this.QPDtoDisplay[0].type,
                  Product__c:this.LicenseQPD[0].Product__r.Id,
                  EffectiveDate: this.getDate(),
                  PremiumAmount:this.QPDtoDisplay[0].productQPD[0].QPDPremium,
                  Policy_Limit__c:this.QPDtoDisplay[0].productQPD[0].QPDPolicyLimit,
                  Aggregate__c:this.QPDtoDisplay[0].productQPD[0].QPRDAggregate,
                  Quote_Product_Detail__c:this.QPDtoDisplay[0].productQPD[0].QPDId,
                  DeductibleAmount:this.QPDtoDisplay[0].productQPD[0].QPDDeductible,
                  Category:this.QPDtoDisplay[0].productQPD[0].QPDCategory,
                  RecordTypeId:'012f0000000fpA4AAI',
                  EID__c: this.LicenseQPD[0].Quote__c+'-'+this.QPDtoDisplay[0].Product_Detail__c+'-'+this.QPDtoDisplay[0].productQPD[i].QPDName
               }]
            )
         }

      }
      
      console.log('COVERAGE MAP DATA ===> ' +JSON.stringify(this.mapOfPPD.get(this.QPDtoDisplay[0].productOptionName)))
   }
   else if(this.selectedProductQPD == 'No'){
      this.productOptionsList[this.indexOfQPD].selectionOption[0].checked = false
      this.productOptionsList[this.indexOfQPD].selectionOption[1].checked = true
      if(this.mapOfPPD.has(this.QPDtoDisplay[0].productOptionName)){
         this.mapOfPPD.delete(this.QPDtoDisplay[0].productOptionName)
         this.TotalPremium.delete(this.QPDtoDisplay[0].productOptionName)
      }
   }
   // else if(!this.QPDtoDisplay[0].productOptionName.includes('Firm Rider')){
   
   else if (this.QPDtoDisplay[0].type =='Product' ){
   console.log('this.QPDtoDisplay[0].productOptionName  ' + this.QPDtoDisplay[0].productOptionName)
   //'Policy_Limit__c-'+ this.LicenseQPD[i].Policy_Limit__c  +'-Aggregate-'+ this.LicenseQPD[i].Aggregate__c+
   // '-Category__c-'+this.LicenseQPD[i].Category__c+'-Id-'+this.LicenseQPD[i].Id+'-Premium-'+this.LicenseQPD[i].Premium_Amount__c+
   // '-Deductible-'+this.LicenseQPD[i].Deductible_Amount__c
   for(let i =0; i < this.productOptionsList[this.indexOfQPD].checkBoxOpt.length ; i++ ){
      //console.log(JSON.stringify(this.productOptionsList[this.indexOfQPD].checkBoxOpt[i].value ))
      if(e.target.value == this.productOptionsList[this.indexOfQPD].checkBoxOpt[i].value){
          
          this.productOptionsList[this.indexOfQPD].checkBoxOpt[i].checked = true
          console.log('Data checked -> '+JSON.stringify(this.productOptionsList[this.indexOfQPD].checkBoxOpt[i]))
      
         }
         else{
            this.productOptionsList[this.indexOfQPD].checkBoxOpt[i].checked = false
         }
      
  }

   var splitVals =this.selectedProductQPD.split('-')
   if(splitVals.length < 11){
      this.selectedProductQPD = this.QPDtoDisplay[0].checkBoxOpt[0].value
      
      splitVals =this.selectedProductQPD.split('-')
   }
   console.log('splitVals  '+splitVals)
   //Policy_Limit__c-2111-Aggregate-222-Category__c-Coverage
   
   this.mapOfPPD.set(this.QPDtoDisplay[0].productOptionName,
      {
         Product_Detail__c:this.QPDtoDisplay[0].Product_Detail__c,
         Policy_Product_Name__c:this.QPDtoDisplay[0].productOptionName,
         RecordTypeId:'012f0000000fpA4AAI',
         CoverageTypeId	:this.QPDtoDisplay[0].productOptionId,
         // PremiumAmount:this.QPDtoDisplay[0].QPDPremium,
         Product__c:this.LicenseQPD[0].Product__r.Id,
         PremiumAmount:splitVals[9],
         DeductibleAmount:splitVals[11],
         Status__c:'Draft',
         EffectiveDate: this.getDate(),
         Type:this.QPDtoDisplay[0].type,
         //DeductibleAmount:this.QPDtoDisplay[0].Deductible_Amount__c,
         Quote_Product_Detail__c:splitVals[7],
         Policy_Limit__c:splitVals[1],
         Aggregate__c:splitVals[3],
         Category:splitVals[5],
         EID__c: this.LicenseQPD[0].Quote__c+'-'+this.QPDtoDisplay[0].Product_Detail__c
      })   
      this.PPDmapToQuote.set(this.QPDtoDisplay[0].productOptionName, {
         Product_Detail__c:this.QPDtoDisplay[0].Product_Detail__c,
         Policy_Product_Name__c:this.QPDtoDisplay[0].productOptionName,
         RecordTypeId:'012f0000000fpA4AAI',
         CoverageTypeId	:this.QPDtoDisplay[0].productOptionId,
         // PremiumAmount:this.QPDtoDisplay[0].QPDPremium,
         Product__c:this.LicenseQPD[0].Product__r.Id,
         PremiumAmount:splitVals[9],
         DeductibleAmount:splitVals[11],
         Status__c:'Draft',
         EffectiveDate: this.getDate(),
         Type:this.QPDtoDisplay[0].type,
         //DeductibleAmount:this.QPDtoDisplay[0].Deductible_Amount__c,
         Quote_Product_Detail__c:splitVals[7],
         Policy_Limit__c:splitVals[1],
         Aggregate__c:splitVals[3],
         Category:splitVals[5],
         EID__c: this.LicenseQPD[0].Quote__c+'-'+this.QPDtoDisplay[0].Product_Detail__c
      }) 
   }
   else if(this.selectedProductQPD == 'Yes' && this.QPDtoDisplay[0].type =='Firm Rider'){

   }  
console.log('this.PPDmapToQuote ',JSON.stringify(this.PPDmapToQuote.get(this.QPDtoDisplay[0].productOptionName)))
console.log('MAP OF PPD -->' +JSON.stringify(this.mapOfPPD.get(this.QPDtoDisplay[0].productOptionName)) )
   this.getDeductible = this.mapOfPPD.get(this.QPDtoDisplay[0].productOptionName).DeductibleAmount
   this.getPremium = this.mapOfPPD.get(this.QPDtoDisplay[0].productOptionName).PremiumAmount
   if(this.selectedProductQPD!='No'){
      // this.ListOfProducts.push({
      //    productoption:this.QPDtoDisplay[0].productOptionName,
      //    selected: this.selectedProductQPD
      // })
      this.ListOfProducts.push(this.QPDtoDisplay[0].productOptionName)
      var set = new Set(this.ListOfProducts);
      this.ListOfProducts = Array.from(set)
   }
   // this.mapOfPPD.set(this.QPDtoDisplay[0].productOptionName,this.QPDtoDisplay[0])
      console.log('this.ListOfProducts ' + JSON.stringify(this.ListOfProducts))
      
  }


   get conditionforQuestion() {
      console.log('Firm Rider Ques check ' +(this.QPDtoDisplay[0].type == 'Firm Rider' && this.wantToBuyFirmRider==true))
      //if(this.QPDtoDisplay[0].productOptionName.includes('Firm Rider') && this.wantToBuyFirmRider ){
      if(this.QPDtoDisplay[0].type == 'Firm Rider' ){
         return this.wantToBuyFirmRider
         
      }
      if(this.QPDtoDisplay[0].type == 'Endorsement' && (this.QPDtoDisplay[0].selectionOption[0].checked )){
         return true
      }
      if(this.selectedProductQPD == 'No' || this.selectedProductQPD == null || this.selectedProductQPD == undefined ){
       
         return false
      };
      
      return true
   }
   @track FirmRiderEligibility = true
  checkEligibilityOfProd(arrayOFEligibility){
   
      console.log('Checking Eligibility of PRODUCT')
      if(arrayOFEligibility){
         console.log('Checking Eligibility '+ JSON.stringify(arrayOFEligibility))
      let prodName = this.QPDtoDisplay[0].productOptionName

      if(this.QPDtoDisplay[0].type == 'Firm Rider' && !this.frimRiderEligibility ){
         this.prodOptionWithEligibilityStatus.set(prodName,"Auto-Fail" )
         this.FirmRiderEligibility = false;
         console.log('FIRM RIDER FAILED.')

      }

      arrayOFEligibility.forEach(element => {
         if(element.Status=="Auto-Fail"){
               this.prodOptionWithEligibilityStatus.set(prodName,"Auto-Fail" )
         }
         else if(element.Status=="Approval Process" 
            && (this.prodOptionWithEligibilityStatus.get(prodName) !='Auto-Fail' 
               || !this.prodOptionWithEligibilityStatus.has(prodName) )
            ){
               this.prodOptionWithEligibilityStatus.set(prodName,"Approval Process" )
         }
         else if(!this.prodOptionWithEligibilityStatus.has(prodName)){
            this.prodOptionWithEligibilityStatus.set(prodName,"Approved" )
         }
      });
      }
      else{
         console.log('NO RESPONSES')
         return true
      }
  }

  @track makeFirmRiderPolicy = false

  @track PolicyPremium = 0

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

  getDisabledFunc(){
      if((this.QPDtoDisplay[0].type =='Endorsement' || this.QPDtoDisplay[0].type =='Firm Rider') && 
         this.QPDtoDisplay[0].selectionOption[0].checked ){
         this.disabled =true
      }
      else{
         this.disabled = false
      }
  }
  checkEligibilityFuncForSaveAndSubmit(e){
     console.log('checkEligibilityFuncForSaveAndSubmit running recieved ' +e)
   if(this.checkIfError() || e==true){
      
      this.disabled = true
      console.log('checkEligibilityFuncForSaveAndSubmit ' +this.disabled)
      console.log('this.disabled  is true checkEligibilityFuncForSaveAndSubmit'+ this.disabled )
   if(!this.frimRiderEligibility && this.QPDtoDisplay[0].productOptionName.includes('Firm Rider')){
      this.ErrorMessage = 'You have Failed'
      this.isModalOpen = true

   }
   var eligibility =this.prodOptionWithEligibilityStatus.get(this.QPDtoDisplay[0].productOptionName)
   if(this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName)){
      this.checkEligibilityOfProd(this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName))
   }
   else{
      eligibility = 'Approved'
   }
   
   // var eligibility =this.prodOptionWithEligibilityStatus.get(this.QPDtoDisplay[0].productOptionName)
   console.log('Save and Submit Clicked ::::-->  ' + eligibility)
   
   if(eligibility == 'Approved'){

   }
   else if(eligibility =='Approval Process'){

   }
   else if(eligibility =='Auto-Fail'){
      this.ErrorMessage = 'You have Failed'
      this.isModalOpen = true
   }
   
   }
   

}

getConditionsForRetro(){
   console.log("getConditionsForRetro")
   let currentArray = this.QPDtoDisplay[0].checkboxItem
   for(let i =0; i < currentArray.length; i++){
      console.log(" checkConditionsforRetro " + currentArray[i].checked)
      if(currentArray[i].checked){
         
         return true
      }
   }
   return false
}

  checkIfError(){
   var areAllValid = true;
   var inputs = this.template.querySelectorAll('.invvalidation');
   inputs.forEach(input => {
       if(!input.checkValidity()){
           input.reportValidity();
           areAllValid = false;

       }
       });
  
       return areAllValid;

}
 get checkIfApproved(){
   let check = false
   let arrayToCheckIfThereIsApprovedQPD = this.QPDtoDisplay[0].productQPD
   for(let i = 0; i < arrayToCheckIfThereIsApprovedQPD.length; i++){
      if(arrayToCheckIfThereIsApprovedQPD[i].Approved == true){
         this.QPDtoDisplay[0].selectionOption[0].checked = true

         console.log('Sending true in check Eligibility Func For Save And Submit')
         check = true
      }
   }
   if(check){
      this.checkEligibilityFuncForSaveAndSubmit(true)
   }
   return check
}

  nextProdOpt(e){
   this.disabled = false
      
      
      // this.selectedProductQPD = false
      // this.selectedProductQPD= 
      if(this.checkEligibilityOfProd(this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName))){
         this.makePPD()
      }
      this.indexOfQPD = this.indexOfQPD +1;

      console.log('NEXT ITEM' +'this.PPDmapToQuote ' )
      
      console.log('NEXT INDEX '+ this.indexOfQPD)
      console.log('LENGTH OF productOptionsList == '+this.productOptionsList.length)
      let eligibilityForFirmRider = ''
      if(this.QPDtoDisplay[0].type =='Firm Rider' ){
         
         if(this.checkEligibilityOfProd(this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName))){
            eligibilityForFirmRider = this.prodOptionWithEligibilityStatus.get(this.QPDtoDisplay[0].productOptionName)
         }

         if(eligibilityForFirmRider !='Auto-Fail' && this.frimRiderEligibility !='Auto-Fail' ){
            this.makeFirmRiderPolicy = true
         }
         else{
            this.makeFirmRiderPolicy = false
         }
         console.log('eligibilityForFirmRider' +eligibilityForFirmRider)
      
         console.log('this.makeFirmRiderPolicy ' + this.makeFirmRiderPolicy)

      }

      if(this.indexOfQPD < this.productOptionsList.length){
         console.log('INDEX < SIZE' + this.productOptionsList[this.indexOfQPD])
         this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]
         for(let i = this.indexOfQPD; i<this.productOptionsList.length;i++){
            
            if(this.QPDtoDisplay[0].productQPD[0].QPDPremium == Number(0)  ){
               console.log('Premium ==0 '+ JSON.stringify(this.QPDtoDisplay))
               //this.QPDtoDisplay[0].checkBoxOpt[0].value
               if(this.QPDtoDisplay.type ='Endorsement'){
                  var e = {target:{value:'Yes'}}
                  this.selectedProductQPD = 'Yes'
               }
               else if(this.QPDtoDisplay.type ='Product'){
                  this.selectedProductQPD=this.QPDtoDisplay[0].checkBoxOpt[0].value
               }
               // this.selectedProductQPD = this.QPDtoDisplay[0].checkBoxOpt[0].value
               console.log('this.selectedProductQPD SELECTED PRODUCT VALUE IS' +JSON.stringify(this.selectedProductQPD))

               this.handleChangeProductQPD(e)
               this.indexOfQPD = this.indexOfQPD +1;
               if(this.indexOfQPD < this.productOptionsList.length ){
                  this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]
                  this.selectedProductQPD= null
               }
               else{
                  // if while iterating over the 0 premium products we reach the end of array
                  // we need to stop pagination and make the server calls
                  // by calling the function again we will check again 
                  // and it will skip the if block and go into the else block.
                  this.nextProdOpt(e)
               }
               
            }
         }

         this.QPDtoDisplay[0].EligibilityQuestion =  this.mapOfQuestions.get(this.QPDtoDisplay[0].Product_Detail__c)
         console.log('NEXT OBJECT '+ JSON.stringify(this.QPDtoDisplay))
         
         //POPULATE this.prodOptionWithEligibilityStatus
         this.checkEligibilityOfProd(this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName))
         // if(this.firmRiderQuestionPick && this.firmRiderQuestionMultiPick && this.firmRiderQuestionText  ){
         //    makeFirmRider({
         //       Name:this.firmRiderQuestionText,
         //       LicensedRep:this.firmRiderQuestionPick,
         //       Provinces:this.firmRiderQuestionMultiPick,
         //       ParentID: this.dataFromParent.Id
         //    }).then(result=>{
         //       if(result){
         //          console.log('Created Firm Rider')
         //       }
         //       else{
         //                console.log('No results')
         //             }
         //          })
         //       .catch(err=>console.log('ERROR FROM FIRM RIDER CREATION ' +err))
         //    } 

         console.log(this.prodOptionWithEligibilityStatus.get(this.QPDtoDisplay[0].productOptionName))
         if(this.prodOptionWithEligibilityStatus.get(this.QPDtoDisplay[0].productOptionName) == 'Auto-Fail' ){
            this.isModalOpen=true
            if(this.mapOfPPD.has(this.QPDtoDisplay[0].productOptionName)){
               this.mapOfPPD.delete(this.QPDtoDisplay[0].productOptionName)
            }
            
         }
         this.getDisabledFunc()
         // this.selectedProductQPD = ''
      }

      
      //Calculate everything
      
      else{
         this.loaded = !this.loaded
         console.log('No more Options')
         // console.log('NEXT OBJECT '+ JSON.stringify(this.QPDtoDisplay))

         //POPULATE this.prodOptionWithEligibilityStatus
         this.checkEligibilityOfProd(this.dataForProgApp.get(this.QPDtoDisplay[0].productOptionName))

         console.log('STATUS FOR THE PRODUCT OPTION '+ this.prodOptionWithEligibilityStatus.get(this.QPDtoDisplay[0].productOptionName))
         if(this.prodOptionWithEligibilityStatus.get(this.QPDtoDisplay[0].productOptionName) == 'Auto-Fail' ){
            
            if(this.mapOfPPD.has(this.QPDtoDisplay[0].productOptionName)){
               this.mapOfPPD.delete(this.QPDtoDisplay[0].productOptionName)
            }
            
         }
         // this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]
         var get_entries = this.dataForProgApp.entries(); 
         console.log("FINAL for dataForProgApp"); 
        

                  //Quote + MasterpolicyNumber + 000_ <- 
                  let rightNow = new Date();

                  // Adjust for the user's time zone
                  rightNow.setMinutes(
                     new Date().getMinutes() - new Date().getTimezoneOffset()
                  );

                  // Return the date in "YYYY-MM-DD" format
                  let yyyyMmDd = rightNow.toISOString().slice(0,10);

         console.log('Creating Policy')
         let arrayDataforPremiumProd = []
         let arrayDataforPremiumEndo = []
         var get_entries = this.mapOfPPD.entries(); 
         console.log("this.mapOfPPD"); 
         for(var ele of get_entries) {
            console.log(ele[0])
            console.log(ele[1])
            if(ele[1].Type == 'Product' ){
               arrayDataforPremiumProd.push(ele[1])
            }
            else if(ele[1][0] != undefined){
               console.log('Array in ppd ' + JSON.stringify(ele[1][0]))
               if(ele[1][0].Type =='Endorsement' && ele[1][0].PremiumAmount !=0 ){
                  arrayDataforPremiumEndo.push(ele[1][0])
               }
            }
         }
         console.log('this.LicenseQPD[0].Quote__r ' +JSON.stringify(this.LicenseQPD[0].Quote__r))
         console.log('this.LicenseQPD[0].Quote__r.Opportunity__c ' +this.LicenseQPD[0].Quote__r.Opportunity__c)
       
         var proRata = this.calculatePolicyPremium(arrayDataforPremiumProd,yyyyMmDd,this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,arrayDataforPremiumEndo)
         var Discount=0;
         if(this.dataFromParent.Is_License_Eligibility_Failed__c){
            if(this.LicenseQPD[0].Quote__r.Discount__c){
               Discount =proRata*this.LicenseQPD[0].Quote__r.Discount__c/100
            }
         }
         var Policy = [{
            
            RecordTypeId:'012f0000000feEZAAY',
            Category__c:'Firm Rider Insurance Certificate',
                     Master_Policy_Number__c:this.LicenseQPD[0].Quote__r.Master_Policy_Number__c,
                     Contact__c: this.dataFromParent.PersonContactId,
                     EffectiveDate:yyyyMmDd,
                     RecordTypeId:'012f0000000feEZAAY',
                     SaleDate:yyyyMmDd,
                     PremiumAmount:proRata,
                     RenewalDate:this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,
                     Renewal_Quote__c:this.LicenseQPD[0].Quote__c,
                     Policy_Terms__c:this.LicenseQPD[0].Quote__r.Quote_Term__c,
                     Intital_Policy_Terms__c:this.LicenseQPD[0].Quote__r.Quote_Term__c,
                     Renewal_Opportunity__c:this.LicenseQPD[0].Quote__r.Opportunity__c,
                     ExpirationDate:this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,
                     SourceOpportunityId:this.LicenseQPD[0].Quote__r.Opportunity__c,
                     // Billing_Contact__c:this.dataFromParent.Id,
                     PolicyName:this.dataFromParent.Name + '-' +this.LicenseQPD[0].Product__r.Name,
                     Name: this.dataFromParent.Name + '-' +this.LicenseQPD[0].Product__r.Name ,
                     ProductId:this.LicenseQPD[0].Product__r.Id,
                     Policy_Holder__c:this.dataFromParent.HiddenAccount__c,
                     NameInsuredId:this.dataFromParent.Id,
                     Brokerage__c:this.dataFromParent.Brokerage_Account__c,
                     Broker__c:this.dataFromParent.Broker_Contact__c,
                     Commission__c:Number(this.LicenseQPD[0].Quote__r.Commission__c),
                     Quote__c:this.LicenseQPD[0].Quote__c,
                     Status:'Draft',
                     Discount,
                     Category__c:'Individual Insurance Certificate',
                     ExternalId__c: this.dataFromParent.Id+ '-'+this.dataFromParent.HiddenAccount__c+'Individual Insurance Certificate' //add category 
            }]
            console.log('POLICY IS '+JSON.stringify(Policy))
            console.log('this.FirmRiderEligibility is ', this.FirmRiderEligibility)
            if(this.FirmRiderEligibility && this.makeFirmRiderPolicy !='Auto-Fail' && this.makeFirmRiderPolicy && this.wantToBuyFirmRider){
               //Master_Policy__c: this.LicenseQPD[0].Quote__r.Master_Policy__c,
                  console.log('Creating Firm Rider Policy ' + this.makeFirmRiderPolicy)
                  console.log('Creating Firm Rider Policy ' + this.wantToBuyFirmRider)
                  
                  console.log('EFFECTIVE DATEs '+yyyyMmDd);
                  Policy.push({
                     Category__c:'Firm Rider Insurance Certificate',
                     Master_Policy_Number__c:this.LicenseQPD[0].Quote__r.Master_Policy_Number__c,
                     Contact__c: this.dataFromParent.PersonContactId,
                     EffectiveDate:yyyyMmDd,
                     RecordTypeId:'012f0000000feEZAAY',
                     SaleDate:yyyyMmDd,
                     PremiumAmount:this.LicenseQPD[0].Quote__r.Policy_Premium__c,
                     RenewalDate:this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,
                     Renewal_Quote__c:this.LicenseQPD[0].Quote__c,
                     Policy_Terms__c:this.LicenseQPD[0].Quote__r.Quote_Term__c,
                     Intital_Policy_Terms__c:this.LicenseQPD[0].Quote__r.Quote_Term__c,
                     Renewal_Opportunity__c:this.LicenseQPD[0].Quote__r.Opportunity__c,
                     ExpirationDate:this.LicenseQPD[0].Quote__r.Quote_Expiry_Date__c,
                     SourceOpportunityId:this.LicenseQPD[0].Quote__r.Opportunity__c,
                     // Billing_Contact__c:this.dataFromParent.Id,
                     PolicyName:this.dataFromParent.Name + '-' +this.LicenseQPD[0].Product__r.Name,
                     Name: this.dataFromParent.Name + '-' +this.LicenseQPD[0].Product__r.Name +' Firm Rider',
                     ProductId:this.LicenseQPD[0].Product__r.Id,
                     Policy_Holder__c:this.dataFromParent.HiddenAccount__c,
                     Brokerage__c:this.dataFromParent.Brokerage_Account__c,
                     Broker__c:this.dataFromParent.Broker_Contact__c,
                     Commission__c:Number(this.LicenseQPD[0].Quote__r.Commission__c),
                     Quote__c:this.LicenseQPD[0].Quote__c,
                     Status:'Draft',
                     ExternalId__c: this.dataFromParent.Id+ '-'+this.dataFromParent.HiddenAccount__c+'Firm Rider Certificate' //add category 
                     })
            }
         console.log('Policy' +JSON.stringify(Policy)) 
         // makePolicy({
         //    RecordTypeId:Policy.RecordTypeId,
         //    PolicyName:Policy.PolicyName,
         //    Name:Policy.Name,
         //    ProductId:Policy.ProductId,
         //    PolicyHolder:Policy.Policy_Holder__c,
         //    NameInsuredId:Policy.NameInsuredId,
         //    Brokerage:Policy.Brokerage__c,Broker:Policy.Broker__c,
         //    Commission:Number(Policy.Commission__c),
         //    Quote:Policy.Quote__c,
         //    ExId:Policy.ExId
         // })
         // .then(result=>{
         //    console.log('RESULT 2' + result)
         // })
         // .catch(err=>{
         //    console.log(err)
         // })

         //make program application


         // Also show tax and fee in quote .
         // let ProgramApplication=[]
         let Name=[]
         let Product_Option__c=[]
         let Product_Detail__c=[]
         let statusProgOpt=[]
         let External_Id =[]
         let prodOptName =[]
         // this.ListOfProducts
         let SelectedProducts  =[ ...this.dataForProgApp.keys() ];
         for(let i=0; i < this.productOptionsList.length; i++){
            /**SelectedProducts 
             * this.ListOfProducts is a list of all the products the user picked.
             * this.productOptionsList is the list containing all the data from the apex class
             * in this we check if the user chose the data
             * we also check if the eligibility questions are present
             */
            if( SelectedProducts.includes(this.productOptionsList[i].productOptionName) && this.productOptionsList[i].EligibilityQuestion.length>0){
               Name.push(this.LicenseQPD[0].Quote__r.Name +'-'+i)
               External_Id.push(this.LicenseQPD[0].Quote__r.Name+'-'+this.productOptionsList[i].productOptionName)
               Product_Option__c.push(this.productOptionsList[i].productOptionId)
               prodOptName.push({name:this.productOptionsList[i].productOptionName,id:this.productOptionsList[i].productOptionId})
               Product_Detail__c.push(this.productOptionsList[i].Product_Detail__c)
               let data= this.prodOptionWithEligibilityStatus.get(this.productOptionsList[i].productOptionName)
               if(data ){
                  statusProgOpt.push(data)
               }
               else{
                  statusProgOpt.push('Approved')
               }
            }
         }

         // console.log('Program Application '+JSON.stringify(ProgramApplication))
         console.log('Product_Option__c '+JSON.stringify(Product_Option__c))
         console.log('statusProgOpt' +statusProgOpt)
         console.log('Product_Detail__c '+JSON.stringify(Product_Detail__c))
         console.log('QUOTE '+JSON.stringify(this.LicenseQPD[0].Quote__c))

         
         
         let arrayOfId = []
         let arrayOfQuesId = []
         let arrayOfAnsByUser = []
         let arrayOfCorrAns = []
         let aggregates =[]
         // let claims =[]
         let categories =[]
         let limits =[]
         let ppdStatus=[]
         let ppdId =[]
         let ppds =[]
         
               
            for(let j =0; j < this.ListOfProducts.length; j++){
               console.log('prodOptName[j]' +this.ListOfProducts[j])
               if(this.mapOfPPD.has(this.ListOfProducts[j]) ){
                  let tempData = this.mapOfPPD.get(this.ListOfProducts[j])
                  if(tempData[0] == undefined){
                     ppds.push(tempData)
                  }
                  else if(tempData[0]){
                     for(let i=0; i<tempData.length;i++){
                        ppds.push(tempData[i])
                     }
                  }
                  
                  aggregates.push(this.mapOfPPD.get(this.ListOfProducts[j]).Aggregate)  
                  categories.push(this.mapOfPPD.get(this.ListOfProducts[j]).Category)
                  limits.push(this.mapOfPPD.get(this.ListOfProducts[j]).Policy_Limit__c)
                  ppdStatus.push(this.mapOfPPD.get(this.ListOfProducts[j]).Status)
                  ppdId.push(this.mapOfPPD.get(this.ListOfProducts[j]).ProdOptId)
               }
               
               
            }

            console.log('ppd---> ' +ppds)
            var get_entries = this.dataForProgApp.entries(); 
         console.log("FINAL for dataForProgApp"); 
        
            for(var ele of get_entries){
               console.log(ele[0],ele[1]);
                  let Values = this.dataForProgApp.get(ele[0])
                  let Key = ele[0]
                  if(Values){
                        console.log('ARRAY DATA '+this.dataForProgApp.get(Key))
                        console.log('Values ===> '+JSON.stringify(Values))
                        for(let k =0; k < Values.length; k++ ){
                           arrayOfId.push(Values[k].Id)
                           arrayOfQuesId.push(Values[k].QuestionId)
                           arrayOfAnsByUser.push(Values[k].UserAns)
                           arrayOfCorrAns.push(Values[k].CorrectAns)
                        }
                  }
               }
            
         
            console.log('arrayOfId'+arrayOfId)
            console.log('arrayOfQuesId'+arrayOfQuesId)
            console.log('arrayOfAnsByUser'+arrayOfAnsByUser)
            console.log('arrayOfCorrAns'+arrayOfCorrAns)

            console.log('aggregates'+aggregates)
            console.log('categories'+categories)
            console.log('limits'+limits)
            console.log('ppdStatus'+ppdStatus)
            console.log('ppdId'+ppdId)
            

            console.log('PPDS -->>> ' +JSON.stringify(ppds))


            InsertProgramApplicationList({
               arrayOfId,
               arrayOfQuesId,
               arrayOfAnsByUser,
               arrayOfCorrAns,
               Name:Name,      
               Broker:this.dataFromParent.Broker_Contact__c,
               Status:statusProgOpt,
               externalId:External_Id,
               RecordTypeId:'012f0000000foosAAA',
               ProdOpt:Product_Option__c,
               ProdDetail:Product_Detail__c,
               Quote:this.LicenseQPD[0].Quote__c,
               Account : this.dataFromParent.Id
            })
            .then(resultFromClass=>{
               console.log('resultFrom PROGRAM APPLICATION' + JSON.stringify(resultFromClass))
               console.log('statusProgOpt' + statusProgOpt)
               
               
            })
            .catch(err=>{
               console.log('error from PROGRAM APPLICATION ' +JSON.stringify(err))
            })
         

         makePolicy2({
            Policy:Policy,
            ppds,
            FirmRiderName:this.firmRiderQuestionText,
            numberOfFirms:this.firmRiderQuestionPick,
            parentID:this.dataFromParent.Id,
            OppId:this.LicenseQPD[0].Quote__r.Opportunity__c
         }).then(result=>{
            console.log('RESULT FROM MAKEPOLICY ' + JSON.stringify(result))
            // this.ppdstoSend = result
            let mapIter = this.PPDmapToQuote.entries()
            for(var ele of mapIter) {
               this.ppdstoSend.push(ele[1])
               
            }console.log('PPDmapToQuote ==> ' +JSON.stringify(this.ppdstoSend))
            let autoFail = false
            let approval = false
            
            
            if(statusProgOpt){
               // statusProgOpt.forEach(element => {
                  
               // })
               for(let i = 0 ; i  < statusProgOpt.length; i ++ ){
                  if(statusProgOpt[i]=='Auto-Fail'){
                     autoFail= true
                     
                  }
                  else if(statusProgOpt[i]=='Approval Process'){
                     approval = true
                     break
                  }
               }
               console.log(' autoFail ' +autoFail)
               console.log(' approval ' +approval)
            }
            
            else{
               
              if(this.premiumToshow == 0 || this.premiumToshow ==null || this.premiumToshow ==undefined ||this.premiumToshow==''){
               const evt = new CustomEvent('quoteevent', { detail: { quotecomp:"True", quotedescription: "True" } });
               this.dispatchEvent(evt);

              }
              else{
               var evt= new CustomEvent('mythirdevent',
               {detail:{childcompname:'Suspended',childcompdescription:this.childcompdescription,  Policies:Policy, ppds:this.ppdstoSend }});
              }
            }

            // if(autoFail){
            //    var evt= new CustomEvent('mythirdevent',
            // {detail:{childcompname:'Suspended',childcompdescription:this.childcompdescription,  Policies:Policy, ppds,autoFail }});
            // console.log('EVENT IS '+evt)
            // }

            let arrayOfPolicy = []
            //We will fill Policy Id 
            if(Policy.length > 1){
               
               Policy[0].Id = result[0].InsurancePolicyId
               Policy[1].Id = result[result.length - 1].InsurancePolicyId
               
            }
            else{
               Policy[0].Id = result[0].InsurancePolicyId
            }

            console.log('Policy  ' + JSON.stringify(Policy))

            
            console.log('ppds --> ' + JSON.stringify(ppds))
            if(approval){
               var evt= new CustomEvent('mythirdevent',
               {detail:{childcompname:'Suspended',childcompdescription:this.childcompdescription,  Policies:Policy, ppds:this.ppdstoSend,Status:'Approval Process',transactionFee:this.LicenseQPD[0].Quote__r.Transaction_Fees__c }});
            
            }
            else{
               var evt= new CustomEvent('mythirdevent',
               {detail:{childcompname:'Payment',childcompdescription:this.childcompdescription,  Policies:Policy,  ppds:this.ppdstoSend,Status: 'Appoved',transactionFee:this.LicenseQPD[0].Quote__r.Transaction_Fees__c }});
            
            }
            console.log('EVT ' + evt)
            this.dispatchEvent(evt);
         })
         .catch(err=>{
            console.log(err)
         })
         
         console.log('data sent to PROG APP')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('arrayOfIds ' +arrayOfId)
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('arrayOfQuesId '  +arrayOfQuesId)
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('arrayOfAnsByUser '+ arrayOfAnsByUser )
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('arrayOfCorrAns '+ arrayOfCorrAns )
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('Name:Name' +Name)
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('statusProgOpt  ' +statusProgOpt)
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('statusProgOpt  ' +Product_Option__c)
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('--------------------------------------------------')
         console.log('Product_Detail__c  ' +Product_Detail__c)
         
         

         
      
  }



  
        
  }

NavigateBack(){
   console.log('GO BACK ')
   this.QPDtoDisplay = []
   
   this.indexOfQPD = this.indexOfQPD - 1;
   
   console.log('Previous ITEM')
   console.log('prev INDEX '+ this.indexOfQPD)
   
   if(this.indexOfQPD > -1){

      console.log('this.selectedProductQPD= null ' + this.selectedProductQPD)
      this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]
      let curIndex = this.indexOfQPD
      for(let i =curIndex ; i > -1; i--){
         // this.QPDtoDisplay = [this.productOptionsList[i]]
         this.indexOfQPD = i;
         this.QPDtoDisplay = [this.productOptionsList[this.indexOfQPD]]

         console.log('curIndex is ' +i)
         console.log('this.QPDtoDisplay[0].productQPD[0].QPDPremium premium is  ' +this.QPDtoDisplay[0].productQPD[0].QPDPremium)
         console.log('this.QPDtoDisplay[0].selectionOption[0].checked == in navigate back ' +this.QPDtoDisplay[0].selectionOption[0].checked +' this.QPDtoDisplay[0].type  '+this.QPDtoDisplay[0].type + ' ' + JSON.stringify(this.QPDtoDisplay[0].productOptionName))
         if((this.QPDtoDisplay[0].productQPD[0].QPDPremium == '0' || this.QPDtoDisplay[0].productQPD[0].QPDPremium == Number(0))  ){
           
            console.log('cond 2 == ' + (this.QPDtoDisplay[0].productQPD[0].QPDPremium == '0' || this.QPDtoDisplay[0].productQPD[0].QPDPremium == Number(0)))
            console.log('cond 3 == ' + (this.QPDtoDisplay[0].selectionOption[0].checked == true && this.QPDtoDisplay[0].type =='Endorsement') )
            

            console.log('curIndex is ' +i+ ' this should skip '+this.QPDtoDisplay[0].productOptionName)
            if(i==0){
               this.indexOfQPD = 0
               this.NavigateBack()
            }
         } 
         else{
            break;
         }

         

      }

      this.selectedProductQPD = null
      
      console.log('Navigate back == ' +(this.QPDtoDisplay[0].selectionOption[0].checked == true ))
      if((this.QPDtoDisplay[0].type == 'Endorsement' || this.QPDtoDisplay[0].type =='Firm Rider') && this.QPDtoDisplay[0].selectionOption[0].checked == true ){
         this.disabled = true

         console.log('this.disabled  is true '+ this.disabled )
      }


      // console.log('PREV ITEM == ' + JSON.stringify(this.QPDtoDisplay))
   }
   else{
      let childcompname='Name of comp is personalInformation';
      let childcompdescription='Description of personalInformation';
      const evt= new CustomEvent('myfirstevent', {detail:{childcompname,childcompdescription}});
      this.dispatchEvent(evt);
   }
   


}

 
}