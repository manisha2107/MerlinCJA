@IsTest

public class TestingClass {
    
    
    static testMethod void test_PersonInfo(){
        
        
        
      //  UserRole r = new UserRole(name = 'TEST ROLE');
     //   Database.insert(r);
        
           
        Account brokerAccount = new Account();
        brokerAccount = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact brokerCon = TestDataFactory_SelfRegisterController.getBroker(brokerAccount.Id);
        Program_Audience__c IbcObj = TestDataFactory_SelfRegisterController.getIBC();
        
        Account businessAccount = new Account();
        businessAccount = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerAccount.Id, brokerCon.Id, IbcObj.Id);

        /*
        UserRole r = new UserRole(name = 'TEST ROLE');
        Database.insert(r);
        
        
        User userWithRole = new User(alias = 'hasrole', email='userwithrole@roletest.com', userroleid = r.id,
                                     emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US', 
                                     localesidkey='en_US', profileid = UserInfo.getProfileId(), 
                                     timezonesidkey='America/Los_Angeles', username='userwithrole@testorg.com');
       
        
        */
        Account a;
      //  System.runAs(userWithRole){
            String recordTypeId = Schema.getGlobalDescribe().get('Account').getDescribe().getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
            
            a = new Account(RecordTypeId = recordTypeId, 
                            FirstName = 'TestPersonAccountFirst', 
                            LastName = 'TestPersonAccountLast', 
                            PersonEmail = 'test@user.com',
                            Billingstreet = 'Mary street',
                            BillingCity = 'Toronto',
                            BillingCountry = 'Canada',
                            BillingPostalCode = 'M3T 63A',
                            BillingState = 'Ontario',
                            Brokerage_Account__c = brokerAccount.Id,
                            Broker_Contact__c = brokerCon.Id,
                            HiddenAccount__c = businessAccount.Id
                            );
            insert a;
        //}
        Account acc = [Select PersonContactId From Account Where Id = :a.Id];
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Custom Customer Community' LIMIT 1];
        User u = new User(
            FirstName = 'TestFirstName',
            LastName = 'TestLastName',
            Email = 'test@user.com',
            Username = 'test@user.com',
            Alias = 'TestPA', 
            TimeZoneSidKey = 'GMT', 
            LocaleSidKey = 'en_US', 
            EmailEncodingKey = 'UTF-8', 
            ProfileId = p.Id, 
            LanguageLocaleKey = 'en_US',
            ContactId = acc.PersonContactId);
        
        insert u;
                
        test.startTest();
        System.runAs(u){
            PersonInformation.getAccountRecord();
        }
        test.stopTest();
        
        
        
        /* Program_Audience__c IbcObj = TestDataFactory_SelfRegisterController.getIBC();
Program_Audience__c ProgObj = TestDataFactory_SelfRegisterController.getProgramType();
System.debug('Program Audience::' + ProgObj);   



Account person = New Account();                       
person.PersonEmail = 'email@test.com';
person.IBC_Code__c = IbcObj.Id;
person.Program_Audience__c = ProgObj.Id;
person.LastName = 'Khan';
person.Billingstreet = 'Mary street';
person.BillingCity = 'Toronto';
person.BillingCountry = 'Canada';
person.BillingPostalCode = 'M3T 63A';
person.BillingState = 'Ontario';        
person.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
insert person;

system.debug('This is the account ID::::' + person.Id);
Account brokerAccount = new Account();
brokerAccount = TestDataFactory_SelfRegisterController.getBrokerAccount();

Contact brokerCon = TestDataFactory_SelfRegisterController.getBroker(brokerAccount.Id);

system.debug('This is the broker contact::::::' + brokerCon);
system.debug('This is personAccount  ' + person);
system.debug('This is IbcObj  ' + IbcObj);*/
        
        
        
        
        
        
        
        
        
        /* Profile p = [SELECT Id FROM Profile WHERE Name='Custom Customer Community'];
Contact contact = new Contact(LastName ='testCon',AccountId = person.Id);
insert contact;  
User u = new User(
Alias = 'standt', 
Email='baberCJA@cloudjunction.cloud',
UserName= 'baberCJA@cloudjunction.cloud',
LastName='CJA',
CommunityNickname = 'User16166802911282164072',
ProfileId = p.Id,
TimeZoneSidKey='America/Los_Angeles',
LocaleSidKey='en_US',
EmailEncodingKey='UTF-8',
LanguageLocaleKey='en_US',
ContactId = contact.Id
);
insert u; 

test.startTest();
System.runAs(u) {
system.debug('This is the user i have created:::'+ u );
PersonInformation.getAccountRecord();
}
test.stopTest();
}
}*/
        
    }
}