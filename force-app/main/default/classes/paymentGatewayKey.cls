public class paymentGatewayKey implements Metadata.DeployCallback {
   
    @AuraEnabled
    
    public static String saveRecord( string value ) {
        try{
            String nameSpacePrefix = '';
            
            Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();
            customMetadata.fullName = 'Payment_Metadata_Type.Payment_Gateway_Key';
            customMetadata.label = 'Payment_Gateway_Key';
            
            // Add all the field value
            
            Metadata.CustomMetadataValue customField = new Metadata.CustomMetadataValue();
            customField.field = 'Value__c';
            customField.value = value;
            customMetadata.values.add(customField);
            
            Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();
            mdContainer.addMetadata(customMetadata); 
            paymentGatewayKey callback = new paymentGatewayKey();
            
            // Enqueue custom metadata deployment
            // jobId is the deployment ID
            Id jobId = Metadata.Operations.enqueueDeployment(mdContainer, callback);
            
            system.debug('jobId='+jobId);
            return jobId;
            
        }catch(Exception ex){
            
            //System.assert(false,ex.getMessage()); 
            return ex.getMessage(); 
            
        }
    }
    
    public void handleResult(Metadata.DeployResult result, Metadata.DeployCallbackContext context) {
        
        
        
        
        if (result.status == Metadata.DeployStatus.Succeeded) {
            System.debug(' success : '+ result);
        } else {
            System.debug(' fail : '+ result);
        }
    }
}