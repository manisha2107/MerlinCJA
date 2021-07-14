global without sharing class SelfRegisterController {
   
    @AuraEnabled
    public static void saveAccountRecord(Account objAcc , String accId){
        

        System.debug('Account Record::' + objAcc);

        System.debug('Account FirstName::' + objAcc.lastname);
        System.debug('Account FirstName::' + objAcc.phone);

        System.debug('Account Username::' + objAcc.Username__c);
        System.debug('Account FirstName::' + objAcc.PersonEmail);
        System.debug('Account has the values::' + objAcc);
        
        

        try{
        
            Account  parentAccount = [Select name , id , program_audience__c , brokerage_account__c, Broker_Contact__c  from Account where id =: accId];

            // First Check the provided accId exist in Salesforce or not 

            objAcc.HiddenAccount__c = accId;
            objAcc.brokerage_account__c = parentAccount.brokerage_account__c;
            objAcc.Broker_Contact__c = parentAccount.Broker_Contact__c;
            objAcc.program_audience__c = parentAccount.program_audience__c;


            insert objAcc;

            System.debug('Account is inserted::' + objAcc);
            System.debug('Account Id::' + accId);
            
            Account perAcc = [Select id, firstname, lastname, PersonContactId from Account where id =: objAcc.Id];
            
            AccountContactRelation accConRel = new AccountContactRelation();
            accConRel.AccountId = accId;
            accConRel.ContactId = perAcc.PersonContactId;
            accConRel.Roles = 'Employee';
            accConRel.IsActive = TRUE;
            insert accConRel;
            
            Profile pro = [Select id , name from Profile where Id =: '00ef0000000KvVhAAK'];
           
            
            User usr = new User(LastName = objAcc.LastName,
                                FirstName=objAcc.FirstName,
                                Email = objAcc.PersonEmail,
                                Username = objAcc.Username__c,
                                ProfileId = pro.id,
                                TimeZoneSidKey = 'GMT',
                                LanguageLocaleKey = 'en_US',
                                EmailEncodingKey = 'UTF-8',
                                LocaleSidKey = 'en_US',
                                ContactId = perAcc.PersonContactId,
                                Alias = objAcc.LastName,
                                //PortalRole = 'COO',
                                CommunityNickname = objAcc.LastName
                               );
            
                // All your test code here
                insert usr;
            
            
            insert usr;
        }
        catch(Exception ex) {
            //throw new AuraHandledException(ex.getMessage());
            System.debug('Exception Error::' + ex.getMessage());
            
        }
    }
}