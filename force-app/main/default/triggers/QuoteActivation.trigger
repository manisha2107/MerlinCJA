trigger QuoteActivation on Quote2__c (after insert, after update) {
    
    //Set<id> oppid= new Set<Id>();
    Map <id,Quote2__c> mapofActivatedQuoteOfOpp = new Map <id,Quote2__c>();
    List<Quote2__c> quoteList = new List<Quote2__c>();
    Set<Id> NewQuoteIds = new Set<Id>();
    Map <id,Quote2__c> mapofActivatedExistingQuoteOfOpp = new Map <id,Quote2__c>();
    
    
    for(Quote2__c quote : trigger.new){
        
        if(quote.opportunity__c != Null && quote.Status__c =='Activated'){
            
            If( (trigger.isupdate && Trigger.oldMap.get(quote.Id).status__c!=quote.status__c) || trigger.isinsert ){
                
                System.debug('Quote matches the criteria::' + quote );
                //oppid.add(quote.opportunity__c);
                
                // Check if Opportunity's quote already exist in Map
                if(mapofActivatedQuoteOfOpp.get(quote.Opportunity__c)!=null){
                    
                    System.debug('Quote against this opportunity already exist');
                    quote.adderror('Another quote is already activated under same opportunity.');
                }
                
                // Check if Opportunity's quote doesn't exist in Map
                
                else{
                    
                    System.debug('Quote does not exist');
                    mapofActivatedQuoteOfOpp.put(quote.Opportunity__c, quote);
                }               
            }
            
        }
        
        NewQuoteIds.add(quote.id);
    }  
    
    System.debug('map of Opp Ids::' + mapofActivatedQuoteOfOpp);
    
    if(!mapofActivatedQuoteOfOpp.isEmpty() ){
        quoteList = [Select id,name,Status__c, opportunity__c from Quote2__c  Where Status__c='Activated'
                     AND Opportunity__c IN:mapofActivatedQuoteOfOpp.keySet()
                     and Id NOT In: NewQuoteIds];
        
    }
    
    System.debug('List of Quote::' + quoteList );
    
    // Put List data into Map
    if(quoteList.size()>0) {
        
        for(Quote2__c quote: quoteList){
            
            mapofActivatedExistingQuoteOfOpp.put(quote.Opportunity__c , quote);
            
        }
    }
    
    if(!mapofActivatedExistingQuoteOfOpp.isEmpty() && !mapofActivatedQuoteOfOpp.isEmpty() ){ 
        
        for(Quote2__c quote : trigger.new){
            
            // If opp exist in new Map
            if(mapofActivatedQuoteOfOpp.get(quote.Opportunity__c)!=null){
                
                // If opp exist and Quote Id is same to trigger.New.Id
                if(mapofActivatedQuoteOfOpp.get(quote.Opportunity__c).Id == quote.Id){
                    
                    // If trigger.New.Opporunity has already activated quote
                    if(mapofActivatedExistingQuoteOfOpp.get(quote.Opportunity__c)!=null){
                        quote.adderror('Another quote is already activated under same opportunity.');
                        
                    }
                }
                
            }
        }
    }
    //}*/
}