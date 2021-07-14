trigger CreatePolicyCoverages on InsurancePolicy (after insert) {
    
  /*  
    List<InsurancePolicyCoverage> ListofQPDtoInsert = PolicyCoverageClass.getListofIP(Trigger.New);
    
    try{
        
        insert ListofQPDtoInsert;
        
    } catch(Exception e){
        
        System.debug('Exception Message::' + e.getMessage());
    }
    
*/
    
    /* Map<Id, List<InsurancePolicy>> PolicyMap = new Map<Id, List<InsurancePolicy>>();
List<InsurancePolicy> existingPO = New List <InsurancePolicy>();
List<InsurancePolicy> newPO = New List <InsurancePolicy>();

Map<Id, List<Quote_Product_Details__c>> QPDMap = new Map<Id, List<Quote_Product_Details__c>>();
List<Quote_Product_Details__c> existingQPD = New List <Quote_Product_Details__c>();
List<Quote_Product_Details__c> newQPD = New List <Quote_Product_Details__c>();   

List<InsurancePolicyCoverage> ListofQPDtoInsert = New List <InsurancePolicyCoverage>();

for (InsurancePolicy ip : Trigger.new){    

If(ip.Policy_Option__c != Null) {

If(PolicyMap.containsKey(ip.Policy_Option__c)){
existingPO = PolicyMap.get(ip.Policy_Option__c);
existingPO.add(ip);
PolicyMap.put(ip.Policy_Option__c,existingPO);    

}   

else{
newPO = New List <InsurancePolicy>();
newPO.add(ip);
PolicyMap.put(ip.Policy_Option__c,newPO);    
}
}
}

List<Quote_Product_Details__c> QPDList = [Select id, Product_Detail__r.ProductId,name, Policy_Option__c 
from Quote_Product_Details__c where Policy_Option__c IN:PolicyMap.keySet()];

for (Quote_Product_Details__c QPD : QPDList){

If(QPD.Policy_Option__c != Null) {

If(QPDMap.containsKey(QPD.Policy_Option__c)){
existingQPD = QPDMap.get(QPD.Policy_Option__c);
existingQPD.add(QPD);
QPDMap.put(QPD.Policy_Option__c,existingQPD);     
}   

else{
newQPD = New List <Quote_Product_Details__c>();
newQPD.add(QPD);
QPDMap.put(QPD.Policy_Option__c,newQPD);          

}

System.debug('QPDList' + QPDList);

}
}    
For (Id poId : PolicyMap.keySet()){
If(PolicyMap.containsKey(poId)){
For(InsurancePolicy InsP : PolicyMap.get(poId)){
If(QPDMap.containskey(poId)){
For(Quote_Product_Details__c QPDObj : QPDMap.get(poId)){
InsurancePolicyCoverage PPD = New InsurancePolicyCoverage();
PPD.CoverageName      = QPDObj.Name;
PPD.InsurancePolicyId = InsP.Id;
PPD.Product__c        = QPDObj.Product_Detail__r.ProductId;
PPD.Category          = QPDObj.Category__c;
PPD.CategoryCode      = QPDObj.Category_Code__c;
PPD.CategoryGroup     = QPDObj.Category_Group__c;
PPD.CategoryGroupType = QPDObj.Category_Group_Type__c;
PPD.LimitRange        = QPDObj.Limit_Range__c;
PPD.LimitAmount       = QPDObj.Limit_Amount__c;
PPD.LimitPercentage   = QPDObj.Limit_Percentage__c;
PPD.LimitDate         = QPDObj.Limit_Date__c;
PPD.EffectiveDate     = QPDObj.Effective_Date__c;
PPD.ExpirationDate    = QPDObj.Expiration_Date__c;
PPD.PremiumAmount     = QPDObj.Premium_Amount__c;
PPD.DeductibleAmount  = QPDObj.Deductible_Amount__c;
PPD.Description       = QPDObj.Coverage_Type_Description__c;

ListofQPDtoInsert.add(PPD);

}
}
}
}        
}    
Insert ListofQPDtoInsert;
*/
    
}