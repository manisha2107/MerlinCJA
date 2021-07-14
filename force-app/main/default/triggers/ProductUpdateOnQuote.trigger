trigger ProductUpdateOnQuote on Quote2__c (before update)
{
	//initializing a set for quote id
   //	Set<id> ProductToquoteId= new Set<Id>();
    Map<id, Quote2__c> MapOfQuote = new Map<id,Quote2__c>();
    Map<id, List<Quote_Product_Details__c>> MapOfSelectedQuote = new Map<id,List<Quote_Product_Details__c>>();
    
     for(Quote2__c quote : trigger.new)
     {		   //checking if the product field on quote is empty or not
   		       if(quote.Product__c != Null)
            {
                //Trigger will compare the previous value currently changed value of product field on quote on an update func
                If( (trigger.isupdate && Trigger.oldMap.get(quote.Id).Product__c!=quote.Product__c) )
                {   
                    //assigning a quote id into set
                    MapOfQuote.put(quote.Id, quote);
                    system.debug(' ProductToquoteIdis: '+ MapOfQuote.values());   
                }   
            } 
        }  
    //List<Quote2__c> quoteList = [Select id,name, Product__c from Quote2__c Where Product__c in:ProductToquoteid];
    List <Quote_Product_Details__c> ListQPD = [Select id, Quote__c from Quote_Product_Details__c Where Quote__c in:MapOfQuote.keySet()];
	
    
    for(Quote_Product_Details__c QPD : ListQPD )
    {
     //If quote ID already exsists in map
        IF(MapOfSelectedQuote.get(QPD.Quote__c)!= null){
            List<Quote_Product_Details__c> NewListQPD = MapOfSelectedQuote.get(QPD.Quote__c);
            NewListQPD.add(QPD);
        	MapOfSelectedQuote.put(QPD.Quote__c,NewListQPD);
        }
        Else{
         	List<Quote_Product_Details__c> NewListQPD = New List <Quote_Product_Details__c>();
            NewListQPD.add(QPD);
            MapOfSelectedQuote.put(QPD.Quote__c, NewListQPD);
        }
    }    
    If(ListQPD.size()>0)
    	{
        	for(Quote2__c quote : Trigger.new)
            {
                if(MapOfSelectedQuote.get(Quote.Id)!= null)
                	{
            		quote.adderror('Please delete all the "Quote Product Details" only then you can update the product');
    				}
            }
        }
}