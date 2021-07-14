trigger ProductUpdateOnOpportunity on Opportunity (before insert, before update) {

    	//initializing a set for Opp id
   	Set<id> ProductOppId= new Set<Id>();
    Map<id, List<Insurer__c>> MapOfSelectedInsurer = new Map<id,List<Insurer__c>>();
    
     for(Opportunity opp : trigger.new)
     {		   //checking if the product field on opp is empty or not
   		       if(opp.Product__c != Null)
            {
                //Trigger will compare the previous value currently changed value of product field on opp on an update func
                If( (trigger.isupdate && Trigger.oldMap.get(opp.Id).Product__c!=opp.Product__c) )
                {   
                    //assigning a quote id into set
                    ProductOppId.add(opp.Id);
                    system.debug(' ProductOppId: '+ ProductOppId);   
                }   
            } 
        }  
    //List<Quote2__c> quoteList = [Select id,name, Product__c from Quote2__c Where Product__c in:ProductToquoteid];
    List <Insurer__c> ListInsurer = [Select id, Opportunity__c from Insurer__c Where Opportunity__c in:ProductOppId];
    
        for(Insurer__c INS : ListInsurer )
    {
     //If quote ID already exsists in map
        IF(MapOfSelectedInsurer.get(INS.Opportunity__c)!= null){
            List<Insurer__c> NewListINS = MapOfSelectedInsurer.get(INS.Opportunity__c);
            NewListINS.add(INS);
        	MapOfSelectedInsurer.put(INS.Opportunity__c,NewListINS);
        }
        Else{
         	List<Insurer__c> NewListINS = New List <Insurer__c>();
            NewListINS.add(INS);
            MapOfSelectedInsurer.put(INS.Opportunity__c, NewListINS);
        }
    } 
	
    If(ListInsurer.size()>0)
    	{
        	for(Opportunity Opportunity : Trigger.new)
            {
                if(MapOfSelectedInsurer.get(Opportunity.Id)!= null)
                	{
            Opportunity.adderror('Please delete all the "Insurers" only then you can update the product');
                    }
    		}
        }
}