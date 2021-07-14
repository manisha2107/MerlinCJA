public class paymentMetaData {

     @AuraEnabled
    public static String getBrokerageAPIKey(string brokerageName){
        String DataToReturn;
        
        Payment_Metadata_Type__mdt[] metadatRecords = [select MasterLabel, DeveloperName, Value__c
                                                       from Payment_Metadata_Type__mdt	 where 
                                                       DeveloperName =: brokerageName];
        
        if(metadatRecords.size() < 1){
            DataToReturn = 'No API key specified';
            return DataToReturn;
        }
        
        String Secret_Key = metadatRecords[0].Value__c;
        system.debug('Secret Key is  '   +  Secret_Key);
        return Secret_Key;
        
    }  
    
     public class createUpdateMetadata{

    public Metadata.CustomMetadata createCustomMetadata(){
       Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();
       customMetadata.fullName = 'Profile_Setting__mdt.TEST_SARA'; 
       customMetadata.label = 'Master Label' ;

       Metadata.CustomMetadataValue customField1 = new Metadata.CustomMetadataValue();   
       customField1.field = 'Is_Admin_c__c';
       customField1.value = true;
       customMetadata.values.add(customField1);

       Metadata.CustomMetadataValue customField2 = new Metadata.CustomMetadataValue();  
       customField2.field = 'Profile_Full_Name_c__c' ;
       customField2.value = 'Admin';
       customMetadata.values.add(customField2);

       Metadata.CustomMetadataValue customField3 = new Metadata.CustomMetadataValue(); 
       customField3.field = 'Profile_Name_c__c' ;
       customField3.value = 'Admin';
       customMetadata.values.add(customField3); 

       Metadata.CustomMetadataValue customField4 = new Metadata.CustomMetadataValue(); 
       customField4.field = 'Updated_c__c' ;
       customField4.value = false;
       customMetadata.values.add(customField4);

       return customMetadata;
    }

}

}