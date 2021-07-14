global without sharing class SelfRegisterController {

    
        //gets list of contacts. If contact already exists, return true, if not then return false
        @AuraEnabled
        public static boolean getContactList(String Email) {
            //return [SELECT Id FROM Account where PersonEmail =: email limit 1];
            List<Account> account_data = [Select Id from Account where PersonEmail =: email limit 1];
            boolean check = false;
            if(account_data.size()>0){
                    check =  true;
            }
            return check;
        }
    

    //This method saves person account records
    //these person account must be affiliated to a business account first, the accId in the params is account id of the parent account
    @AuraEnabled
    public static void saveAccountRecord(String firstname, String lastname, String email, String username, String phone , String accId){
        //boolean email_exists = EmailExists(email);
        RecordType recId = [Select Id from RecordType where developerName =: 'PersonAccount' limit 1];
        
        Account objAcc = new Account();
        objAcc.firstname = firstname;
        objAcc.lastname = lastname;
        objAcc.PersonEmail = email;
        objAcc.Username__c = username;
        objAcc.phone = phone;
        objAcc.RecordTypeId = recId.id;
            //'0126g000000zIHRAA2';

        System.debug('Account Record::' + objAcc);

        System.debug('Account lastName::' + objAcc.lastname);
        System.debug('Account Phone::' + objAcc.phone);

        System.debug('Account Username::' + objAcc.Username__c);
        System.debug('Account email::' + objAcc.PersonEmail);
        System.debug('Account has the values::' + objAcc);
        
        

        try{
        
            Account  parentAccount = [Select name , id , HiddenAccount__r.IBC_Code__c,program_audience__c , brokerage_account__c, Broker_Contact__c  from Account where id =: accId];
			
            // First Check the provided accId exist in Salesforce or not 
            
                objAcc.HiddenAccount__c = accId;
                objAcc.brokerage_account__c = parentAccount.brokerage_account__c;
                objAcc.Broker_Contact__c = parentAccount.Broker_Contact__c;
                objAcc.program_audience__c = parentAccount.program_audience__c;
                objAcc.IBC_Code__c = parentAccount.HiddenAccount__r.IBC_Code__c;
                objAcc.Application_Current_Stage__c = 'Not Started';
                objAcc.FinServ__Status__c = 'Prospect';
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
                
            
            

            
            
            //insert usr;
        }
        catch(Exception ex) {
            System.debug('Error message in save account'+ex);
            throw new AuraHandledException('Email Already Exists');
            //System.debug('Exception Error::' + ex.getMessage());
            
        }
    }
    
    //checks status of business account (parent acc)
    @AuraEnabled
    public static Boolean CurrentAccStatus(string objAcc){
        //check if account id is null
            if(objAcc != ''){
                
        List<Account> AccStatus = [Select FinServ__Status__c From Account Where Id=: objAcc Limit 1];
        
        if(AccStatus.size() >0){
            if(AccStatus[0].FinServ__Status__c == 'Bound'){
                return true;
            }
        }
        
        
    }
            return false;
    }
}