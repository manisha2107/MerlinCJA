public with sharing class CancelPolicy_ShortRate_Calculation {
    @InvocableMethod(label='CancelPolicy_ShortRate_Calculation')
    public static void execute(List<InsurancePolicy> policy) {
        
        Set <Decimal> DaysOfPolicy = new Set <Decimal>();
        
        for(Integer i = 0; i<policy.size(); i++)
        {
            DaysOfPolicy.add((Integer)policy[i].Days__c);
        }
        System.debug(DaysOfPolicy);
        
        Short_Rate__mdt[] shortRate = 
            [Select Days_Policy_In_Force__c,Percentage_of_Premium_Retained__c from Short_Rate__mdt where Days_Policy_In_Force__c in :DaysOfPolicy];
        System.debug(shortRate);
        List <RecordType> RecordTypeID_for_RenewalOpp =  [SELECT Id FROM RecordType WHERE SObjectType = 'Opportunity' and DeveloperName= 'Renewal_Opportunity'];
        
        System.debug('List of Policies '+policy);
        Map<decimal, decimal> SortRateData = new Map<decimal, decimal>();
        List <Opportunity> arrayOfOpportunities = new List<Opportunity>();
        for(Short_Rate__mdt record:shortRate)
        {
            SortRateData.put(record.Days_Policy_In_Force__c,record.Percentage_of_Premium_Retained__c);
            
        } 
        for (integer i = 0; i < policy.size() ; i++){
            decimal Percent_days = SortRateData.get((integer)policy[i].Days__c);
             
            Opportunity opp = new Opportunity();
            opp.CloseDate=date.today();
            opp.Name='Cancel Policy - ShortRate - '+policy[i].PolicyName;
            opp.StageName='Qualification';
            opp.AccountId = policy[i].NameInsuredId;
            opp.Broker__c = policy[i].Broker__c;
            opp.Brokerage__c = policy[i].Brokerage__c;
            opp.CurrencyIsoCode = policy[i].CurrencyIsoCode;
            //opp.Master_Policy_Agreement__c = policy[0].Master_Policy_Number__c;
            opp.Policy__c = policy[i].Id;
            opp.Product__c = policy[i].ProductId;
            opp.Premium_Amount__c = Percent_days*policy[i].PremiumAmount;
            policy[i].Cancellation_Amount__c = opp.Premium_Amount__c;
            opp.RecordTypeId= RecordTypeID_for_RenewalOpp[0].Id;
            opp.Type = 'Non Program';
            arrayOfOpportunities.add(opp);
            
            //insert opp;
        }
        system.debug(arrayOfOpportunities);
        insert arrayOfOpportunities;
        update policy;
        
        
    }
}