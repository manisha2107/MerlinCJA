public class ValidateInsurerPercentageController {
    
    RecordType insurerProductRT = [Select id , name from RecordType where DeveloperName = 'Insurer_of_Product' LIMIT 1];
    //Map<id,Decimal> totalPercentageByOpp = new Map<id, Decimal>();
    //Map<id, Decimal> totalPercentageByProd = new Map<id, Decimal>();  
    public static Map<Id, insurer__c> mapOfInsurerProductIds = new Map<Id, Insurer__c>();
    public static Map<Id , Insurer__c> mapOfInsurerOppIds = new Map<Id, Insurer__c>();
    public static Set<Id> setOfProductIds = new Set<Id>();
    public static Set<Id> setOfOppIds = new Set<ID>();
    public static Map<Id, Decimal> Map_Of_Percentage_Opportunity = new Map<Id,Decimal>();
    public static Map<Id,Decimal> Map_Of_Percentage_Product = new Map<Id, Decimal>();
    public static Map<Id , Insurer__c> MapOfInsurersForError = new Map<Id, Insurer__c>();
    
    
    public static Map<Id, Insurer__c> getMapofInsurersForError(List<Insurer__c> listofInsurers , Map<Id, Insurer__c> mapofOldInsurers){
        
        
        for(Insurer__c insurer: listofInsurers){
            
             
                if(insurer.product__c !=null ){
                    mapOfInsurerProductIds.put(insurer.Id , insurer);
                    setOfProductIds.add(insurer.product__c);
                    System.debug('Product is not Null::' + insurer.product__c);
                }
                else if(insurer.Opportunity__c != null){
                    
                    mapOfInsurerOppIds.put(insurer.Id , insurer);
                    setOfOppIds.add(insurer.Opportunity__c);          
                    System.debug('Opportunity is not Null::' + insurer.opportunity__c);
                }
                
            
        }
            
        System.debug('Set of OppIds::' + setOfOppIds + 'Map of Opp Insurer::' + mapOfInsurerOppIds);
        System.debug('Set of Product Ids::' + setOfProductIds + 'Map of Product Insurer::' + mapOfInsurerProductIds);
        
        Map_Of_Percentage_Opportunity = getMapofOppInsurersTotal(setOfOppIds,mapOfInsurerOppIds);
        
        System.debug('Map of Already Existed Opp Insurer::' + Map_Of_Percentage_Opportunity );
        
        Map_Of_Percentage_Product = getMapOfProdInsurersTotal(setOfProductIds,mapOfInsurerProductIds);
        
        System.debug('Map of Already Existed Product Insurer::' + Map_Of_Percentage_Product );
        
        MapOfInsurersForError = getMapofInsurerError(listofInsurers, Map_Of_Percentage_Opportunity,Map_Of_Percentage_Product);
        
        System.debug('Map of Insurer with Error::' + MapOfInsurersForError);
        
        return MapOfInsurersForError;
    }
    
    public static Map<Id, Decimal> getMapofOppInsurersTotal(set<id> setOfOppIds , Map<Id, Insurer__c> mapOfOppInsurer){
 
        Map<Id, Decimal> Map_Of_Percentage_Opportunity = new Map<Id, Decimal>();
        if(setOfOppIds.size()>0){
            
                AggregateResult[]  objAgr= [Select SUM(Insurer_Percentage__c),Opportunity__c from Insurer__c 
                                            where Opportunity__c = :setOfOppIds and Id NOT IN:mapOfOppInsurer.keyset()
                                            GROUP BY Opportunity__c];
                
                System.debug(objAgr);
                
                
                //Map the returned list
                for (AggregateResult currentOpp : objAgr)  {
                     
                    Map_Of_Percentage_Opportunity.put((Id)currentOpp.get('Opportunity__c'), (decimal)currentOpp.get('expr0'));
                    //Map_Of_Percentage_Opportunity.put( CurrentOpp.Opportunity__c, currentOpp.expr0);
                }
            }
            
        return Map_Of_Percentage_Opportunity;
        
    }

    public static Map<Id,Decimal> getMapOfProdInsurersTotal (set<id> setOfProductIds , Map<Id, Insurer__c> mapOfInsurerProductIds ){
        
        Map<Id, Decimal> Map_Of_Percentage_Product = new Map<Id, Decimal>();
        
          if(setOfProductIds.size()>0){
            
              System.debug('Set of Product Ids::' +setOfProductIds );
                AggregateResult[]  objAgr= [Select SUM(Insurer_Percentage__c),Product__c from Insurer__c 
                                            where product__c = :setOfProductIds and Id NOT IN:mapOfInsurerProductIds.keyset()
                                            GROUP BY Product__c];
                
                System.debug('Sum of Insurer Percentage by Product::' +objAgr);
                
                
                //Map the returned list
                for (AggregateResult currentOpp : objAgr)  {
                    
                    System.debug('CurrentOpp::'+currentOpp);
                    
                    Map_Of_Percentage_Product.put((Id)currentOpp.get('product__c'), (decimal)currentOpp.get('expr0'));
                    //Map_Of_Percentage_Opportunity.put( CurrentOpp.Opportunity__c, currentOpp.expr0);
                }
            }
        
        
        return Map_Of_Percentage_Product;
        
    }

    public static Map<Id, Insurer__c> getMapofInsurerError(List<Insurer__c> listofInsurers , Map<Id, Decimal> mapofOppTotals, Map<Id, Decimal> mapOfProTotals){
        
        Map<Id, Insurer__c> mapOfInsurerErrors = new Map<Id, Insurer__c>();
        
        for(Insurer__c insurer:listofInsurers ){
            
            if(mapofOppTotals.get(insurer.Opportunity__c)!=null){
                
                if(mapofOppTotals.get(insurer.Opportunity__c)+insurer.Insurer_Percentage__c >100){
                    
                    mapOfInsurerErrors.put(insurer.Id, insurer);
                }
                
                else{
                    
                    mapofOppTotals.put(insurer.Opportunity__c , mapofOppTotals.get(insurer.Opportunity__c)+ insurer.Insurer_Percentage__c);
                    
                }
                
            }
            
            if(mapOfProTotals.get(insurer.product__c)!=null){
                
                if(mapOfProTotals.get(insurer.product__c)+insurer.Insurer_Percentage__c >100){
                    
                    mapOfInsurerErrors.put(insurer.Id, insurer);
                }
                
                else{
                    if(mapofOppTotals.containskey(insurer.product__c)){
                        System.debug('insurer.product__c' + insurer.product__c);
                        System.debug('mapofOppTotals.get(insurer.product__c) '+ mapofOppTotals.get(insurer.product__c));
                        System.debug('insurer.Insurer_Percentage__c '+ insurer.Insurer_Percentage__c);
                        mapOfProTotals.put(insurer.product__c , mapofOppTotals.get(insurer.product__c)+ insurer.Insurer_Percentage__c);
                    }
                    else {
                        System.debug('insurer.product__c' + insurer.product__c);
                        System.debug('mapofOppTotals.get(insurer.product__c) '+ mapofOppTotals.get(insurer.product__c));
                        System.debug('insurer.Insurer_Percentage__c '+ insurer.Insurer_Percentage__c);
                        mapOfProTotals.put(insurer.product__c ,  insurer.Insurer_Percentage__c);
                    }
                    
                }
                
            }
        }
        
        return mapOfInsurerErrors;
    }


    //For every product store the total insurance
    public static Map<Id, decimal> mapOfProductWithTotalInsurance = new Map<Id, decimal>(); 

    public static List<Insurer__c> method1(List<Insurer__c> listofInsurers){
    Map<String, Insurer__c> mapOfInsurerErrorsProd = new Map<String, Insurer__c>();
    Set<String> setofId = new Set<String>();
    for(Insurer__c tempinsurer:  listofInsurers){
        setofId.add(tempinsurer.product__c);
    }
    System.debug('setofId ' +setofId);
    /**
     * Goal: If on a particular product the 'insurance percentage' is greater then 100
     *       Show error.
     * Steps 1 -> Get all the Total Percentage on every Product and store it in map.
     *              We will now have all the percentages against the products.
     * Step  2 -> Iterate over the new list 
     *              In case the Trigger is Update we will subtract the old value and then add the new value.
     *                  Check: 
     *                        before adding it to map we will check if the total percentage is > 100 or not
     *                        add error if % > 100
     *              In case the Trigger is Insert we will add in the new value
     *                  Check: 
     *                        before adding it to map we will check if the total percentage is > 100 or not
     *                        add error if % > 100
     */
    if(!setofId.isEmpty()){
        for (AggregateResult currentProd : [Select SUM(Insurer_Percentage__c),Product__c from Insurer__c where 
                                        Product__c in : setofId 
                                        GROUP BY Product__c]){
        System.debug('CurrentOpp::'+currentProd);
        mapOfProductWithTotalInsurance.put((Id)currentProd.get('product__c'), (decimal)currentProd.get('expr0'));
        //Map_Of_Percentage_Opportunity.put( CurrentOpp.Opportunity__c, currentOpp.expr0);
        }
    }
    System.debug( ' DB: mapOfProductWithTotalInsurance --> ' + mapOfProductWithTotalInsurance);
    for(Insurer__c tempInsurer: listofInsurers){
        System.debug('Size of Trigger new' +listofInsurers.size());
        // Percentage = 0 or null we will add it to the map
        //if its null or 0 we will add it as 0 in map. This is important bcz null will give us error
        if(tempInsurer.Insurer_Percentage__c != null || tempInsurer.Insurer_Percentage__c !=0){
            System.debug('tempInsurer.Insurer_Percentage__c != null || tempInsurer.Insurer_Percentage__c !=0');
            /**
             * If the value exists in map add it with previous value 
             * else add it in map
             */
            if(mapOfProductWithTotalInsurance.containskey(tempInsurer.Product__c)){
                System.debug('mapOfProductWithTotalInsurance.containskey(tempInsurer.Product__c) True');
                System.debug('tempInsurer.Insurer_Percentage__c ' +tempInsurer.Insurer_Percentage__c);
                if(mapOfProductWithTotalInsurance.get(tempInsurer.Product__c) + tempInsurer.Insurer_Percentage__c <= 100){
                    mapOfProductWithTotalInsurance.put(tempInsurer.Product__c,mapOfProductWithTotalInsurance.get(tempInsurer.Product__c) +tempInsurer.Insurer_Percentage__c);
                    System.debug('mapOfProductWithTotalInsurance' +mapOfProductWithTotalInsurance);
                }
                else{
                    System.debug('Added Error');
                    //Show Error
                    mapOfInsurerErrorsProd.put(tempInsurer.Id, tempInsurer);
                }
            }
            else{
                System.debug('mapOfProductWithTotalInsurance.containskey(tempInsurer.Product__c) False');
                mapOfProductWithTotalInsurance.put(tempInsurer.Product__c, tempInsurer.Insurer_Percentage__c);  
                System.debug('mapOfProductWithTotalInsurance ' +mapOfProductWithTotalInsurance);  
            }
        }   
        else{
            System.debug('tempInsurer.Insurer_Percentage__c =0');
            mapOfProductWithTotalInsurance.put(tempInsurer.Product__c,0);
        }
    }
    System.debug('mapOfInsurerErrorsProd ' + mapOfInsurerErrorsProd);
    return mapOfInsurerErrorsProd.values();
        

    }


}