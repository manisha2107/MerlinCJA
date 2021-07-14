trigger FillPolicyLookup on APXT_CongaSign__Transaction__c (before update) {
    
    
        string recordIdOrPrefix;
    
        for(APXT_CongaSign__Transaction__c cst : trigger.new){
             recordIdOrPrefix = cst.APXT_CongaSign__ExternalObjectId__c;
            system.debug('system debug::: ' + recordIdOrPrefix);
               
            }
    
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
    
    system.debug(objectName);
    
    		        for(APXT_CongaSign__Transaction__c cstRecord : trigger.new){

                        If(objectName == 'InsurancePolicy'){
                            
                            cstRecord.Policy__c = recordIdOrPrefix;   
                        }
                    }
}