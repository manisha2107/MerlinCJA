trigger PriceValidity on Quote_Product_Details__c (before insert, before update) {

    //  If Endrosement under an quote is created as a QPD , it must have same price.
    //  Like : Privacy Breach Liability Coverage A : Premium = 100
    //  Privacy Breach Liability Coverage B : Premium = 200
    //  It must show me an error. It can either be same or if other 
    //  one is blank then it should copy from the existing QPD.

    Map<String,Decimal> MapOfQPD_Amount = new Map<String,Decimal>();
    set<string> setofProdOpt= new Set<String>();
    for(Quote_Product_Details__c temp: trigger.new){
        if(temp.Type_of_QPD__c == 'Endorsement'){
            setofProdOpt.add(temp.ProductOption__c);
        }
    }

    System.debug('setofProdOpt are ==> ' +setofProdOpt);
    List<AggregateResult> QPD_List_DB = [Select max(Premium_Amount__c),ProductOption__c,Quote__c
                                                 from Quote_Product_Details__c where Type_of_QPD__c='Endorsement' and
                                                 ProductOption__c in : setofProdOpt
                                                 group by ProductOption__c,Quote__c];

    for(AggregateResult temp: QPD_List_DB){
        MapOfQPD_Amount.put((String)temp.get('ProductOption__c') + (String)temp.get('Quote__c'),(decimal)temp.get('expr0'));
    }
    System.debug('MapOfQPD_Amount ' +MapOfQPD_Amount);
    for(Quote_Product_Details__c temp: Trigger.new){
        if(!MapOfQPD_Amount.containsKey(String.valueOf(temp.ProductOption__c)+String.valueOf(temp.Quote__c))){
            MapOfQPD_Amount.put(String.valueOf(temp.ProductOption__c)+String.valueOf(temp.Quote__c), temp.Premium_Amount__c);
        }
        else{
            
            if(MapOfQPD_Amount.get(String.valueOf(temp.ProductOption__c)+String.valueOf(temp.Quote__c)) !=temp.Premium_Amount__c){
                if(temp.Premium_Amount__c ==null){
                    temp.Premium_Amount__c = MapOfQPD_Amount.get(String.valueOf(temp.ProductOption__c)+String.valueOf(temp.Quote__c));
                }
                else{
                    temp.addError('Invalid Premium amount. Amount should be '+ MapOfQPD_Amount.get(String.valueOf(temp.ProductOption__c)+String.valueOf(temp.Quote__c)));

                }
            }
        }
    }

}