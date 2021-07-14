public class PolicyCoverageClass {
    
    
    /*public static List<InsurancePolicyCoverage> getListofIP(List<InsurancePolicy> listOfPolicy){
        
        Map<Id, List<InsurancePolicy>> PolicyMap = getMapOfPolicy(listOfPolicy);
        List<Quote_Product_Details__c> QPDList = getListofQuote(PolicyMap.keySet());
        Map<Id, List<Quote_Product_Details__c>> QPDMap = getMapOfQPD(QPDList);
        List<InsurancePolicyCoverage> listOfIIp = getListOfPPD(QPDMap ,PolicyMap );
        
        return listOfIIp;
    }
    
    // Get Map of Policy from the List of Policy with key Policy Option
    public static Map<Id, List<InsurancePolicy>> getMapOfPolicy (List<InsurancePolicy> listOfPolicy){
        
        Map<Id, List<InsurancePolicy>> PolicyMap = new Map<Id, List<InsurancePolicy>>();
        List<InsurancePolicy> existingPO = New List <InsurancePolicy>();
        List<InsurancePolicy> newPO = New List <InsurancePolicy>();
        
        for (InsurancePolicy ip : listOfPolicy){    
            
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
        
        return PolicyMap;
    }
    
    // Get List of QPD
    public static List<Quote_Product_Details__c> getListofQuote(Set<Id> setofPolicyId){
        
        List<Quote_Product_Details__c> QPDList = [Select id, Product_Detail__r.ProductId,name, Policy_Option__c,Category__c, Category_Code__c,
                                                            Category_Group__c, Category_Group_Type__c, Category_Group_Type_Value__c, Coverage_Code__c,
                                                            Coverage_Type_Description__c, Deductible_Amount__c, Effective_Date__c, Expiration_Date__c,
                                                            Limit_Amount__c, Limit_Date__c, Limit_Percentage__c, Limit_Range__c, Premium_Amount__c,
                                                            Product_Detail__c, Quote__c, Quote_Product__c
                                                  from Quote_Product_Details__c where Policy_Option__c IN:setofPolicyId];
        
        return QPDList;
    }
    
    // Get Map of QPD
    public static Map<Id, List<Quote_Product_Details__c>> getMapOfQPD(List<Quote_Product_Details__c> QPDList){
        
        Map<Id, List<Quote_Product_Details__c>> QPDMap = new Map<Id, List<Quote_Product_Details__c>>();
        List<Quote_Product_Details__c> existingQPD = New List <Quote_Product_Details__c>();
        List<Quote_Product_Details__c> newQPD = New List <Quote_Product_Details__c>();  
        
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
        
        return QPDMap;
        
    }    
    
    // Get List of Policy Product Details
    public static List<InsurancePolicyCoverage> getListOfPPD(Map<Id, List<Quote_Product_Details__c>> QPDMap , Map<Id, List<InsurancePolicy>> PolicyMap ){
        
        List<InsurancePolicyCoverage> ListofQPDtoInsert = new List<InsurancePolicyCoverage>();
        
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
        
        
        return ListofQPDtoInsert;
        
    }
  */  
}