trigger CheckEndSignature on InsurancePolicy (before update) {
    
    Set<Id> PolicyIds = New Set <Id>();
    List<Policy_Wording_and_Endorsements__c> listofwording = New List <Policy_Wording_and_Endorsements__c>();
    
    
    Map<id, InsurancePolicy> MapOfPolicy = new Map<id,InsurancePolicy>();
    Map<id, List<Policy_Wording_and_Endorsements__c>> MapOfSelectedPolicy = new Map<id,List<Policy_Wording_and_Endorsements__c>>();
    
    
    for (InsurancePolicy policy : trigger.new){
        
        MapOfPolicy.put(policy.Id,policy);
        
    }
    
       List<Policy_Wording_and_Endorsements__c> wordingsList = [Select Id,Status__c,Policy__c,Signature_Required__c from Policy_Wording_and_Endorsements__c
                                                                where Policy__c IN: MapOfPolicy.keyset() AND
                                                                Signature_Required__c = True];
    
    
    
        for(Policy_Wording_and_Endorsements__c PWE : wordingsList )
    {
 
        IF(MapOfSelectedPolicy.get(PWE.Policy__c)!= null){
            List<Policy_Wording_and_Endorsements__c> NewListPWE = MapOfSelectedPolicy.get(PWE.Policy__c);
            NewListPWE.add(PWE);
            MapOfSelectedPolicy.put(PWE.Policy__c,NewListPWE);
        }
        Else{
            List<Policy_Wording_and_Endorsements__c> NewListPWE = New List <Policy_Wording_and_Endorsements__c>();
            NewListPWE.add(PWE);
            MapOfSelectedPolicy.put(PWE.Policy__c, NewListPWE);
        }
    } 
    
    
            for(InsurancePolicy policy : Trigger.new)
            {
                if(policy.status == 'Signature Required' && MapOfSelectedPolicy.get(policy.Id)== null && Trigger.oldMap.get(Policy.Id).Status !=policy.Status)
                    {
                    policy.adderror('Not any active endorsement against this policy requires signature. Please choose different status.');
                    }
            }
        
}