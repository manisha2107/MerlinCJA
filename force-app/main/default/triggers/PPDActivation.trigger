trigger PPDActivation on InsurancePolicyCoverage (before insert, before update) {

     Set<id> SetOfPPDId= new Set<Id>();
     Set<id> SetOfPolicyId= new Set<Id>();
     Map<String,InsurancePolicyCoverage> PPDonPolicyMap = new Map<String,InsurancePolicyCoverage>();

    for(InsurancePolicyCoverage PPD : trigger.new)
    {
        system.debug('PPD.CoverageType= '+PPD.CoverageTypeId);
        // checking before insert condtion
        if(PPD.Status__c =='Activated')
        {
            //checking before update condition
            If( (trigger.isupdate && Trigger.oldMap.get(PPD.Id).Status__c != PPD.Status__c) || trigger.isinsert )
            {
                SetOfPPDId.add(PPD.CoverageTypeId);//holds the product option Id on PPD.
                SetOfPolicyId.add(PPD.InsurancePolicyId); //holds the policy id
                system.debug(' SetOfPPDId:::'+ SetOfPPDId);
                system.debug(' SetOfPPDId:::'+ SetOfPPDId);
            }
        }
    }
 List<InsurancePolicyCoverage> ListOFPPD = [SELECT id, InsurancePolicyId, CoverageTypeId from InsurancePolicyCoverage
                                            WHERE InsurancePolicy.Id In: SetOfPolicyId
                                 			AND CoverageType.Id In:SetOfPPDId AND Status__c='Activated'];
 
    
    for(InsurancePolicyCoverage RecordPPD: ListOFPPD)
    {
        System.debug('Insurance Policy ID = ' + RecordPPD.InsurancePolicyId + ' Coverage type ID = ' 
                     + RecordPPD.CoverageTypeId);
        String Key = RecordPPD.InsurancePolicyId+'-'+RecordPPD.CoverageTypeId;
        PPDonPolicyMap.put(Key, RecordPPD);
    }
    
    for(InsurancePolicyCoverage RecordPPD: trigger.new)
    {
        String Key = RecordPPD.InsurancePolicyId+'-'+RecordPPD.CoverageTypeId;
        System.debug('PPD Key = ' + Key);
        if(PPDonPolicyMap.get(key) != null)
        {
            //policy is already activated
            System.debug('Existing active policy!!');
            RecordPPD.addError(RecordPPD.CoverageName  + ' already exists , please de-activate the active policy first to create/update a new one');
        }
        
    }

}