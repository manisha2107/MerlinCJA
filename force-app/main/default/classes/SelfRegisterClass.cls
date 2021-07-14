public class SelfRegisterClass {
      
    
    @AuraEnabled
    
     public static String SelfRegistrationAcc(Account objAcc, String accId){
 
     Account createdAcc = saveAccountRecord(objAcc,accId);    
 	 Account PersonContact =  getPersonContactId(createdAcc.PersonContactId);        
     createAccConRelation(accId,PersonContact.PersonContactId);
     User tempAcc = createUser(PersonContact);     
     

    return 'Account, Account-Contact Relation and Community User has been successfuly created'; 
      }
    
    
    @AuraEnabled
    
    Public static Account saveAccountRecord (Account objAcc, String accId) {
        
        if(accId != null){                       
            
            try{
                
                insert objAcc;
                return objAcc;
            }  
            
            catch(Exception ex) {                
                System.debug('Exception Error::' + ex.getMessage()); 
                return (Null);
            }        
        }
        return Null;
    }
    
    Public static Account getPersonContactId (string pContactId){
        
        try{   
            Account PersonAccount = [Select id, firstname, lastname, PersonContactId from Account where id =: pContactId];
            return PersonAccount; 
        }
        catch (exception e) {
            system.debug('Error:' + e.getMessage());
            return null;             
        }
    }
    
    Public static AccountContactRelation createAccConRelation (String accId, string conId){
        
        try {
            AccountContactRelation accConRel = new AccountContactRelation();
            accConRel.AccountId  = accId;
            accConRel.ContactId  = conId;
            accConRel.Roles     = 'Employee';
            accConRel.IsActive  = TRUE;
            insert accConRel;
            return accConRel;
        }          
        catch (DmlException e){
            System.debug('A DML exception has ocurred: ' + e.getMessage());
            return (NULL);
        }              
    }
    
    Public static User createUser (Account accObject){
        
        Profile pro = [Select id , name from Profile where Name =: 'Custom Customer Community'];     
        
        try{
            User user = New User ();      
            user.FirstName          = accObject.FirstName;
            user.LastName           = accObject.LastName;
            user.Email              = accObject.PersonEmail;
            user.username           = accObject.Username__c;
            user.TimeZoneSidKey     = 'GMT';    
            user.LanguageLocaleKey  = 'en_US';
            user.EmailEncodingKey   = 'UTF-8';
            user.LocaleSidKey       = 'en_US';
            user.ContactId          = accObject.PersonContactId;
            user.Alias              = accObject.LastName;
            user.CommunityNickname  = accObject.LastName;
            user.ProfileId          = pro.id;
         insert user;
         return user;
           }
        
     catch (DmlException e){
            System.debug('A DML exception has ocurred: ' + e.getMessage());
             throw new AuraHandledException(e.getMessage());
            // return (NULL);
        }     
        
    }
}