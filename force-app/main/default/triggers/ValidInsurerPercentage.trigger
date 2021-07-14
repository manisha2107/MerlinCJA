trigger ValidInsurerPercentage on Insurer__c (before insert, before update ) {
    
    /*    if(Trigger.isUpdate  || Trigger.isBefore ){ 

Set<ID> Opportunity_Ids = new Set<ID>();
//Set<ID> Insurer_Ids = new Set<ID>();         
for (integer i = 0; i < trigger.new.size(); i++){
//check if Inserer percentage has changed
//Also check if opportunity is populated 
//Also check if insurer % > 0
if( Trigger.isUpdate &&  trigger.new[i].Opportunity__c!=NULL && trigger.new[i].Insurer_Percentage__c>0){
Opportunity_Ids.add(trigger.new[i].Opportunity__c);
//Insurer_Ids.add(trigger.new[i].Id);
}
else if(Trigger.isBefore && trigger.new[i].Opportunity__c!=NULL && trigger.new[i].Insurer_Percentage__c>0){
Opportunity_Ids.add(trigger.new[i].Opportunity__c);

}
}  
System.debug(Opportunity_Ids);
//System.debug(Insurer_Ids);

//Check if There are any Insurers.
if(Opportunity_Ids.size() > 0 ){            
System.debug('Opportunity id '+Opportunity_Ids);

Map<Id, decimal> Map_Of_Percentage_Opportunity =  new Map<Id, decimal>();
//Get the aggregated values against any opportunity id
//For every opportunity id we get the sum of insurer percentage against it.
//and Id not in :Insurer_Ids
AggregateResult[]  objAgr= [Select SUM(Insurer_Percentage__c),Opportunity__c from Insurer__c 
where Opportunity__c = :Opportunity_Ids  GROUP BY Opportunity__c];

System.debug(objAgr);


//Map the returned list
for (AggregateResult currentOpp : objAgr)  {

Map_Of_Percentage_Opportunity.put((Id)currentOpp.get('Opportunity__c'), (decimal)currentOpp.get('expr0'));
//Map_Of_Percentage_Opportunity.put( CurrentOpp.Opportunity__c, currentOpp.expr0);
}
System.debug(Map_Of_Percentage_Opportunity);


//Iterate over the trigger list
//if the opportunity id from the trigger is already in the map then we add the insurer percentage
//else we create a new entry in the map.
//if the current total insurer percentage (in the map) goes beyond 100 generate error
for(integer i = 0; i < Trigger.new.size(); i++){

if(Map_Of_Percentage_Opportunity.containsKey(Trigger.new[i].Opportunity__c) && !Trigger.isUpdate){
Map_Of_Percentage_Opportunity.put(Trigger.new[i].Opportunity__c,Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c) +Trigger.new[i].Insurer_Percentage__c);
System.debug(Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c));
}
else if(Map_Of_Percentage_Opportunity.containsKey(Trigger.new[i].Opportunity__c)&& Trigger.isUpdate){
Map_Of_Percentage_Opportunity.put(Trigger.new[i].Opportunity__c,Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c) +Trigger.new[i].Insurer_Percentage__c - Trigger.old[i].Insurer_Percentage__c);
System.debug(Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c));
if(Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c)>100){
Map_Of_Percentage_Opportunity.put(Trigger.new[i].Opportunity__c,Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c) -Trigger.new[i].Insurer_Percentage__c + Trigger.old[i].Insurer_Percentage__c);
Trigger.new[i].addError('Cant Add more! Percentage greater then 100');                 
}

}
else{
Map_Of_Percentage_Opportunity.put(Trigger.new[i].Opportunity__c,Trigger.new[i].Insurer_Percentage__c);
System.debug(Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c));             
}

if(Map_Of_Percentage_Opportunity.get(Trigger.new[i].Opportunity__c)>100){                  
Trigger.new[i].addError('Cant Add more! Percentage greater then 100');                 
}
}
}        
}  */
    
    // public static List<Insurer__c> listofInsurers = new List<Insurer__c>();
    public static Map<Id,Insurer__c> mapofOldInsurers = new Map<Id, Insurer__c>();
    public static List<Insurer__c> prodError = new List<Insurer__c>();
    public static Map<Id, Insurer__c> mapofInsurerWithError = new Map<Id, Insurer__c>();
    
    // mapofInsurerWithError = ValidateInsurerPercentageController.getMapofInsurersForError(Trigger.New,Trigger.OldMap);
    // if(Trigger.isInsert && Trigger.isBefore){
    //     prodError = ValidateInsurerPercentageController.method1(Trigger.New);
    // }
    
    List<Insurer__c> listofInsurers = Trigger.new;
    System.debug('TRIGGER Running');
    System.debug('listofInsurers '+listofInsurers);
    
    Map<Id, decimal> mapOfProductWithTotalInsurance = new Map<Id, decimal>(); 
    Map<Id, decimal> mapOfOppWithTotalInsurance = new Map<Id, decimal>();
    
    Map<String, Insurer__c> mapOfInsurerErrorsProd = new Map<String, Insurer__c>();
    Set<String> setofProdId = new Set<String>();
    Set<String> setofOppId = new Set<String>();
    for(Insurer__c tempinsurer:  listofInsurers){
        
        if(tempinsurer.product__c!=null){
            
             setofProdId.add(tempinsurer.product__c);
       
        }
        
        if(tempinsurer.Opportunity__c!=null){
            
        	setofOppId.add(tempinsurer.Opportunity__c);
        }
    }
    
    System.debug('Set of Product Ids' + setofProdId.size());
    System.debug(setofOppId.size());
    
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
    
    //GET THE EXISTING VALUES FROM SALESFORCE FOR PRODUCT
    if(setofProdId.size()>0){
        for (AggregateResult currentProd : [Select SUM(Insurer_Percentage__c),product__c from Insurer__c where 
                                            Product__c in : setofProdId 
                                            GROUP BY Product__c]){
                                                System.debug('CurrentOpp::'+currentProd);
                                                mapOfProductWithTotalInsurance.put((Id)currentProd.get('product__c'), (decimal)currentProd.get('expr0'));
                                                //Map_Of_Percentage_Opportunity.put( CurrentOpp.Opportunity__c, currentOpp.expr0);
                                            }
    }
    if(setofOppId.size()>0){
        for (AggregateResult currentProd : [Select SUM(Insurer_Percentage__c),Opportunity__c from Insurer__c where 
                                            Opportunity__c in : setofOppId 
                                            GROUP BY Opportunity__c]){
                                                System.debug('CurrentOpp::'+currentProd);
                                                mapOfOppWithTotalInsurance.put((Id)currentProd.get('Opportunity__c'), (decimal)currentProd.get('expr0'));
                                                //Map_Of_Percentage_Opportunity.put( CurrentOpp.Opportunity__c, currentOpp.expr0);
                                            }
    }
    
    
    System.debug( ' DB: mapOfProductWithTotalInsurance --> ' + mapOfProductWithTotalInsurance);
    
    if(setofProdId.size()>0 || setofOppId.size()>0  ){
        
        
        for(Insurer__c tempInsurer: listofInsurers){
            
            // For Product
            if(tempInsurer.Product__c != null){
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
                        if(Trigger.isInsert){
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
                        else if(Trigger.isUpdate) {
                            Decimal oldVal = Trigger.oldMap.get(tempInsurer.id).Insurer_Percentage__c;
                            Decimal newVal = Trigger.newMap.get(tempInsurer.id).Insurer_Percentage__c;
                            
                            if(mapOfProductWithTotalInsurance.get(tempInsurer.Product__c) + newVal - oldVal<= 100){
                                mapOfProductWithTotalInsurance.put(tempInsurer.Product__c,mapOfProductWithTotalInsurance.get(tempInsurer.Product__c) + newVal - oldVal);
                                System.debug('mapOfProductWithTotalInsurance' +mapOfProductWithTotalInsurance);
                            }
                            else{
                                System.debug('Added Error');
                                //Show Error
                                mapOfInsurerErrorsProd.put(tempInsurer.Id, tempInsurer);
                            }
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
            //For Opportunity
            else{
                System.debug('Size of Trigger new' +listofInsurers.size());
                // Percentage = 0 or null we will add it to the map
                //if its null or 0 we will add it as 0 in map. This is important bcz null will give us error
                if(tempInsurer.Insurer_Percentage__c != null || tempInsurer.Insurer_Percentage__c !=0){
                    System.debug('tempInsurer.Insurer_Percentage__c != null || tempInsurer.Insurer_Percentage__c !=0');
                    /**
* If the value exists in map add it with previous value 
* else add it in map
*/
                    if(mapOfOppWithTotalInsurance.containskey(tempInsurer.Opportunity__c)){
                        System.debug('mapOfOppWithTotalInsurance.containskey(tempInsurer.Opportunity__c) True');
                        System.debug('tempInsurer.Insurer_Percentage__c ' +tempInsurer.Insurer_Percentage__c);
                        if(Trigger.isInsert){
                            if(mapOfOppWithTotalInsurance.get(tempInsurer.Opportunity__c)!=null){
                                if(mapOfOppWithTotalInsurance.get(tempInsurer.Opportunity__c) + tempInsurer.Insurer_Percentage__c <= 100){
                                    mapOfOppWithTotalInsurance.put(tempInsurer.Opportunity__c,mapOfOppWithTotalInsurance.get(tempInsurer.Opportunity__c) +tempInsurer.Insurer_Percentage__c);
                                    System.debug('mapOfOppWithTotalInsurance' +mapOfOppWithTotalInsurance);
                                }
                                else{
                                    System.debug('Added Error');
                                    //Show Error
                                    mapOfInsurerErrorsProd.put(tempInsurer.Id, tempInsurer);
                                }
                            }
                        }
                        else if(Trigger.isUpdate) {
                            Decimal oldVal = Trigger.oldMap.get(tempInsurer.id).Insurer_Percentage__c;
                            Decimal newVal = Trigger.newMap.get(tempInsurer.id).Insurer_Percentage__c;
                            
                            if(mapOfOppWithTotalInsurance.get(tempInsurer.Opportunity__c) + newVal - oldVal<= 100){
                                mapOfOppWithTotalInsurance.put(tempInsurer.Opportunity__c,mapOfOppWithTotalInsurance.get(tempInsurer.Opportunity__c) + newVal - oldVal);
                                System.debug('mapOfOppWithTotalInsurance' +mapOfOppWithTotalInsurance);
                            }
                            else{
                                System.debug('Added Error');
                                //Show Error
                                mapOfInsurerErrorsProd.put(tempInsurer.Id, tempInsurer);
                            }
                        }
                    }
                    else{
                        System.debug('mapOfOppWithTotalInsurance.containskey(tempInsurer.Opportunity__c) False');
                        mapOfOppWithTotalInsurance.put(tempInsurer.Opportunity__c, tempInsurer.Insurer_Percentage__c);  
                        System.debug('mapOfOppWithTotalInsurance ' +mapOfOppWithTotalInsurance);  
                    }
                }   
                else{
                    System.debug('tempInsurer.Insurer_Percentage__c =0');
                    mapOfOppWithTotalInsurance.put(tempInsurer.Opportunity__c,0);
                }
            }
        }
        
    }
    System.debug('mapOfInsurerErrorsProd ' + mapOfInsurerErrorsProd);
    
    
    
    
    for(Insurer__c insurer: mapOfInsurerErrorsProd.values()){
        insurer.addError('Can not add more! Insurer percentage is greater than 100');
    }
    // for(Insurer__c insurer: Trigger.New){
    
    //     // if(prodError.get(insurer.Id)!=null){
    
    //     //     insurer.addError('Can not add more! Insurer percentage is greater than 100');
    //     // }
    
    // }   
    // mapofInsurerWithError = ValidateInsurerPercentageController.method1(Trigger.New);
    // for(Insurer__c insurer: Trigger.New){
    
    //     if(mapofInsurerWithError.get(insurer.Id)!=null){
    
    //         insurer.addError('Can not add more! Insurer percentage is greater than 100');
    //     }
    // }
    
}