trigger QuoteMasterPolicy on Quote2__c (before insert, before update) {
    
    //Set<id> oppid= new Set<Id>();
    Map <id,Quote2__c> mapofActivatedQuoteOfAcc = new Map <id,Quote2__c>();
    List<Quote2__c> quoteList = new List<Quote2__c>();
    Set<Id> NewQuoteIds = new Set<Id>();
    Map <id,Quote2__c> mapofActivatedExistingQuoteOfAcc = new Map <id,Quote2__c>();
     Id recordTypeId = Schema.SObjectType.Quote2__c.getRecordTypeInfosByDeveloperName().get('Master_Policy').getRecordTypeId();
    system.debug('recordTypeId:::'+recordTypeId);
    
    
    for(Quote2__c quote : trigger.new){
        
        if(quote.Account__c != Null && quote.Status__c =='Activated'){
            
            If( (trigger.isupdate && Trigger.oldMap.get(quote.Id).status__c!=quote.status__c) || trigger.isinsert ){
                
                System.debug('Quote matches the criteria::' + quote );
                //oppid.add(quote.Account);
                
                // Check if Account's quote already exist in Map
                if(mapofActivatedQuoteOfAcc.get(quote.Account__c)!=null){
                    
                    System.debug('Account against this opportunity already exist');
                    quote.adderror('Another quote is already activated under same Account.');
                }
                
                // Check if Account's quote doesn't exist in Map
                
                else{
                    
                    System.debug('Account does not exist');
                    mapofActivatedQuoteOfAcc.put(quote.Account__c, quote);
                }               
            }
            
        }
        
        NewQuoteIds.add(quote.id);
    }  
    
    System.debug('map of Opp Ids::' + mapofActivatedQuoteOfAcc);
    
    if(!mapofActivatedQuoteOfAcc.isEmpty() ){
        quoteList = [Select id,name,Status__c, Account__c from Quote2__c  Where Status__c='Activated'
                     AND Account__c IN:mapofActivatedQuoteOfAcc.keySet()
                     and Id NOT In: NewQuoteIds
                     AND RecordTypeId=:recordTypeId];
        
    }
    
    System.debug('List of Quote::' + quoteList );
    
    // Put List data into Map
    if(quoteList.size()>0) {
        
        for(Quote2__c quote: quoteList){
            
            mapofActivatedExistingQuoteOfAcc.put(quote.Account__c , quote);
            
        }
    }
    
    if(!mapofActivatedExistingQuoteOfAcc.isEmpty() && !mapofActivatedQuoteOfAcc.isEmpty() ){ 
        
        for(Quote2__c quote : trigger.new){
            
            // If opp exist in new Map
            if(mapofActivatedQuoteOfAcc.get(quote.Account__c)!=null){
                
                // If Account exist and Quote Id is same to trigger.New.Id
                if(mapofActivatedQuoteOfAcc.get(quote.Account__c).Id == quote.Id){
                    
                    // If trigger.New.Account has already activated quote
                    if(mapofActivatedExistingQuoteOfAcc.get(quote.Account__c)!=null){
                        quote.adderror('Another quote is already activated under same Account.');
                        
                    }
                }
                
            }
        }
    }
    //}*/
}