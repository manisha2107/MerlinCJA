public class CreateUpdateMetadataUtils implements Metadata.DeployCallback {
    
     
    public void handleResult(Metadata.DeployResult result, Metadata.DeployCallbackContext context) {
        if (result.status == Metadata.DeployStatus.Succeeded) {
            System.debug(' success : '+ result);
        } else {
            System.debug(' fail : '+ result);
        }
    }
     @AuraEnabled
    public static void createUpdateMetadata(String fullName, String label,string brokerageId, String stripekey ){
        
        
        Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();
        customMetadata.fullName = fullName;
        customMetadata.label = label;
        
     //   for(String key : fieldWithValuesMap.keySet()){
            Metadata.CustomMetadataValue customField = new Metadata.CustomMetadataValue();
            customField.field = 'Value__c';
            customField.value = stripekey; 
            customMetadata.values.add(customField);
    //    }
         Metadata.CustomMetadataValue customField1 = new Metadata.CustomMetadataValue();
            customField1.field = 'Brokerage_Account_Id__c';
            customField1.value = brokerageId; 
            customMetadata.values.add(customField1);
        system.debug('brokerage id == ' + brokerageId);
    //    
        
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
        mdContainer.addMetadata(customMetadata);
        CreateUpdateMetadataUtils callback = new CreateUpdateMetadataUtils();
        Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback);
    }
}