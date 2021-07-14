public class CoverageChoice {
    
    public static Account PersonAccount = new Account();
    

    //Combing all methods and list of policy options
    @AuraEnabled
    public static List <Policy_Option__c> getPOlst(){
        
        //Get Account Details of Running User
        PersonAccount = PersonInformation.getAccountRecord();
        
        //Get Activated Quote of Running User's Account 
        string QuoteId = getQuoteRecord(PersonAccount.HiddenAccount__c);
        
        //Get List of All Policy Options under Activated Quote
        List <Policy_Option__c> POLst = getPolicyOptions(QuoteId);
        
        return POLst;
    }
    
    
    public static string getQuoteRecord(string AccountId){
        try{
            Quote2__c QuoteRecord = [Select id from Quote2__c WHERE Account__c =: AccountId AND Recordtype.Name = 'Master Policy' AND Status__c = 'Activated' AND Expiration_Date__c <=  Today  LIMIT 1];
            return QuoteRecord.Id;        
        } 
        catch (exception e) {
            system.debug('Error:' + e.getMessage());
            return null;   
        }
        
    } 
    public static List<Policy_Option__c> getPolicyOptions(String QuoteId){
        try{   
            List <Policy_Option__c>  PolicyOptionslst  = [Select Id From Policy_Option__c Where Quote__c =: QuoteId];
            
            return PolicyOptionslst;
        }
        catch (exception e){
            system.debug('Error' + e.getMessage());
            return null;
        }
    }
    
}