public class CreateQPDunderPOClass {
   /* 
    public static void getlistOfQuotePD(List<Policy_Option__c> listOfPolicyOption){
        
        Map<Id, List<Policy_Option__c>> PolicyOptionMap = getMapOfPolicyOption(listOfPolicyOption);
        List<Quote_Product__c> QPList = getListofQuote(PolicyOptionMap.keySet());
        Map<Id, List<Quote_Product__c>> QPMap = getMapOfQP(QPList);
        List<Quote_Product_Details__c> listOfQuotePD = getListOfQP(QPMap ,PolicyOptionMap );
               
        try{
            
            insert listOfQuotePD;
            
        } catch(Exception e){
            
            System.debug('Exception Message::' + e.getMessage());
        }
    }           

public static Map<Id, List<Policy_Option__c>> getMapOfPolicyOption (List<Policy_Option__c> listOfPolicyOption){
    
    Map<Id, List<Policy_Option__c>> PolicyOptionMap = new Map<Id, List<Policy_Option__c>>();
    List<Policy_Option__c> existingPolicyOption     = New List <Policy_Option__c>();
    List<Policy_Option__c> newPolicyOption          = New List <Policy_Option__c>();
    
    for (Policy_Option__c po : listOfPolicyOption){    
        
        If(po.Quote__c != Null) {
            
            If(PolicyOptionMap.containsKey(po.Quote__c)){
                existingPolicyOption = PolicyOptionMap.get(po.Quote__c);
                existingPolicyOption.add(po);
                PolicyOptionMap.put(po.Quote__c,existingPolicyOption);    
                
            }   
            
            else{
                newPolicyOption = New List <Policy_Option__c>();
                newPolicyOption.add(po);
                PolicyOptionMap.put(po.Quote__c,newPolicyOption);    
            }
        }
    }
    
    return PolicyOptionMap;
}

// List of Quote Products
public static List<Quote_Product__c> getListofQuote(Set<Id> setofPolicyOptionId){
    
    List<Quote_Product__c> QPList = [Select Name, id, Quote__c, Product__c, Product__r.Name  from Quote_Product__c where Quote__c IN:setofPolicyOptionId ];        
    return QPList;
    
}

// Get Map of QP
public static Map<Id, List<Quote_Product__c>> getMapOfQP(List<Quote_Product__c> QPList){
    
    Map<Id, List<Quote_Product__c>> QPMap = new Map<Id, List<Quote_Product__c>>();
    List<Quote_Product__c> existingQP     = New List <Quote_Product__c>();
    List<Quote_Product__c> newQP          = New List <Quote_Product__c>();  
    
    for (Quote_Product__c QP : QPList){
        
        If(QP.Quote__c != Null) {
            
            If(QPMap.containsKey(QP.Quote__c)){
                existingQP = QPMap.get(QP.Quote__c);
                existingQP.add(QP);
                QPMap.put(QP.Quote__c,existingQP);     
            }   
            
            else{
                newQP = New List <Quote_Product__c>();
                newQP.add(QP);
                QPMap.put(QP.Quote__c,newQP);          
                
            }
            
            System.debug('QPDList' + QPList);
            
        }
    }    
    
    return QPMap;
    
}    

// Get List of Quote Product Details
public static List<Quote_Product_Details__c> getListOfQP(Map<Id, List<Quote_Product__c>> QPMap , Map<Id, List<Policy_Option__c>> PolicyOptionMap){
    
    List<Quote_Product_Details__c> ListofQPDtoInsert = new List<Quote_Product_Details__c>();
    
    For (Id poId : PolicyOptionMap.keySet()){
        If(PolicyOptionMap.containsKey(poId)){
            For(Policy_option__c InsP : PolicyOptionMap.get(poId)){
                If(QPMap.containskey(poId)){
                    For(Quote_Product__c QPObj : QPMap.get(poId)){
                        
                        Quote_Product_Details__c QPD = New Quote_Product_Details__c();
                        QPD.Name                     = QPObj.Product__r.Name + '-' + Insp.Name;
                        QPD.Policy_Option__c         = Insp.Id;
                        QPD.Quote_Product__c         = QPObj.Id;
                        QPD.Quote__c                 = poId; 
                        QPD.Product__c               = QPObj.Product__c; 
                        QPD.Status__c                = 'Draft';
                        
                        ListofQPDtoInsert.add(QPD);
                        
                    }
                }
            }
        }
    }
    
    return ListofQPDtoInsert;
    
}*/
}