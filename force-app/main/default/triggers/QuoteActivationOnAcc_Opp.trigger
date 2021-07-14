trigger QuoteActivationOnAcc_Opp on Quote2__c (before insert) {

    Set<id> oppid= new Set<Id>();
    Set<id> SetOfAccId= new Set<Id>();
    
    Id recordTypeId = Schema.SObjectType.Quote2__c.getRecordTypeInfosByDeveloperName().get('Master_Policy').getRecordTypeId();
    system.debug('recordTypeId:::'+recordTypeId);
    
  
    
        for(Quote2__c quote : trigger.new){
        
            if(quote.opportunity__c != Null && quote.Status__c =='Activated'){
            
                If( (trigger.isupdate && Trigger.oldMap.get(quote.Id).status__c!=quote.status__c) || trigger.isinsert ){
                    
                    oppid.add(quote.opportunity__c);
                }
                
            } 
            
            if(quote.Account__c != Null && quote.Status__c =='Activated')
            {
            //checking before update condition
                If( (trigger.isupdate && Trigger.oldMap.get(quote.Id).status__c != quote.status__c) || trigger.isinsert )
                {
                    SetOfAccId.add(quote.Account__c);//holds the Account Id on Quote.
                    
                }
                
            } 
        }  
    
    List<Quote2__c> quoteListOpp = [Select id,name,Status__c, opportunity__c from Quote2__c  Where Status__c='Activated'
                                                                                          AND Opportunity__c in:oppid];
                                                                                          
    List<Quote2__c> quoteListAcc = [Select id,name,Status__c, Account__c from Quote2__c  Where Status__c='Activated'
                                                                                          AND Account__c in:SetOfAccId
                                   														AND RecordTypeId=: recordTypeId];    
    
    if(quoteListOpp.size()>0) {
        for(Quote2__c quote : Trigger.new){
            quote.adderror('Another quote is already activated under same opportunity.');
        
        }
    }
    
    if(quoteListAcc.size()>0) {
        for(Quote2__c quote : Trigger.new){
            quote.adderror('Another quote is already activated under same Account.');
        
        }
    }
}