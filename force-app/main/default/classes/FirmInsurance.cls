public  without sharing class FirmInsurance {
    
    
    @AuraEnabled
    public static InsurancePolicy createFirmInsurance(string policyName,integer policyterm,string quoteType,string insuredAccount,string policyHolder,string broker,string brokerage, string contactId, string quoteId,string opportunityId, decimal premium,datetime expiryDate){
        
        InsurancePolicy FirmPolicy =  New InsurancePolicy();
        
        FirmPolicy.Status = 'Pending Payment';
        FirmPolicy.PolicyType  = quoteType;
        FirmPolicy.Contact__c = contactId;
        FirmPolicy.NameInsuredId = insuredAccount;
        FirmPolicy.Name   = policyName;
        FirmPolicy.Master_Policy_Number__c = policyName;
        FirmPolicy.Quote__c = quoteId;
        FirmPolicy.SourceOpportunityId = opportunityId;
        FirmPolicy.PremiumAmount = premium;
        FirmPolicy.EffectiveDate = datetime.now();
        FirmPolicy.Broker__c = broker;
        FirmPolicy.Is_Firm_Insurance__c = true;
        FirmPolicy.Brokerage__c = brokerage;
        FirmPolicy.Policy_Holder__c = policyHolder;
        FirmPolicy.RecordTypeId = '012f0000000feEZAAY';
        FirmPolicy.ExpirationDate = expiryDate;
        FirmPolicy.Intital_Policy_Terms__c = policyterm;
        
        try{
            insert FirmPolicy;
            
        }
        catch(Exception e){
            
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        return FirmPolicy;
        
    }
    @AuraEnabled
    public static InsurancePolicy updateFirmInsurance(string firmPolicyrecId,integer policyterm,string policyName,string quoteType,string insuredAccount,string policyHolder,string broker,string brokerage, string contactId, string quoteId,string opportunityId, decimal premium,datetime expiryDate){
        
        InsurancePolicy FirmPolicy = [select id,status, policyType,Contact__c,Intital_Policy_Terms__c,NameInsuredId,Name,Master_Policy_Number__c,Quote__c,SourceOpportunityId
                                      ,PremiumAmount,EffectiveDate,Broker__c,Brokerage__c,Policy_Holder__c,RecordTypeId,ExpirationDate from InsurancePolicy
                                      Where Id=: firmPolicyrecId ]; //AND Is_Firm_Insurance__c = True
        
        
        
        FirmPolicy.Status = 'Pending Payment';
        FirmPolicy.PolicyType  = quoteType;
        FirmPolicy.Contact__c = contactId;
        FirmPolicy.NameInsuredId = insuredAccount;
        FirmPolicy.Name   = policyName;
        FirmPolicy.Master_Policy_Number__c = policyName;
        FirmPolicy.Quote__c = quoteId;
        FirmPolicy.SourceOpportunityId = opportunityId;
        FirmPolicy.PremiumAmount = premium;
        FirmPolicy.EffectiveDate = datetime.now();
        FirmPolicy.Broker__c = broker;
        FirmPolicy.Brokerage__c = brokerage;
        FirmPolicy.Policy_Holder__c = policyHolder;
        FirmPolicy.RecordTypeId = '012f0000000feEZAAY';
        FirmPolicy.Intital_Policy_Terms__c = policyterm;
        FirmPolicy.ExpirationDate = expiryDate;
        
        try{
            update FirmPolicy;
            return FirmPolicy;
            
        }
        catch(Exception e){
            
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        } 
    }
    
    /*
Method to get Object name from the record Id passed to it
as a Parameter with Schema sojbects
*/
    public static String findObjectNameFromRecordIdPrefix(String recordIdOrPrefix){
        String objectName = '';
        try{
            //Get prefix from record ID
            //This assumes that you have passed at least 3 characters
            String myIdPrefix = String.valueOf(recordIdOrPrefix).substring(0,3);
            
            //Get schema information
            Map<String, Schema.SObjectType> gd =  Schema.getGlobalDescribe(); 
            
            //Loop through all the sObject types returned by Schema
            for(Schema.SObjectType stype : gd.values()){
                Schema.DescribeSObjectResult r = stype.getDescribe();
                String prefix = r.getKeyPrefix();
                //System.debug('Prefix is ' + prefix);
                
                //Check if the prefix matches with requested prefix
                if(prefix!=null && prefix.equals(myIdPrefix)){
                    objectName = r.getName();
                    System.debug('Object Name! ' + objectName);
                    break;
                }
            }
        }catch(Exception e){
            System.debug(e);
        }
        return objectName;
    }
    /*
Method to get sObject data from where the global action 
invoked
*/
    public  list<sObject> getsObjectData(string recordId, map<string, string> mapOfFxConfig, string objectName)
    {
        id recId = (ID)recordId;
        
        DescribeSObjectResult describeResult = recId.getSObjectType().getDescribe();	
        set<String> setfieldNames = new set<string>();
        //List<String> fieldNames = new List<String>( describeResult.fields.getMap().keySet() );	
        set<string> setOfSystemFields = new set<string>{'id','isdeleted','name','setupownerid','createddate',
            'createdbyid','lastmodifieddate','lastmodifiedbyid',
            'systemmodstamp','cloudjunction__firm__c',
            'cloudjunction__api_user__c', 'cloudjunction__api_password__c',
            'cloudjunction__object__c', 'cloudjunction__filogix_user__c',
            'cloudjunction__islive__c'};
                for(string fxMapKey :mapOfFxConfig.keyset())
            {
                if(!setOfSystemFields.contains(fxMapKey))
                    setfieldNames.add(mapOfFxConfig.get(fxMapKey).trim().tolowerCase());
            }
        
        //system.debug('##setfieldNames='+setfieldNames);
        List<String> fieldNames = new list<string>();
        fieldNames.addAll(setfieldNames);
        //system.debug('##mapOfFxConfig='+mapOfFxConfig);
        system.debug('##fieldNames='+fieldNames);
        
        String query = ' SELECT ' +	string.join( fieldNames, ',' ) + ' FROM ' +	 objectName +	 ' WHERE ' + ' id = :recordId ' + ' LIMIT 1 ';	
        // return generic list of sobjects or typecast to expected type	
        system.debug('soql='+query);
        List<SObject> records = Database.query( query );	
        
        return records;
    }
    
    
}