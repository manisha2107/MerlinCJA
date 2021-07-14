@IsTest

public class TestPersonInformation {
    
    static testMethod void validateGetAccountRecord(){
        UserRole r = new UserRole(name = 'TEST ROLE');
        Database.insert(r);
        
        User userWithRole = new User(alias = 'hasrole', email='userwithrole@roletest.com', userroleid = r.id,
                                     emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US', 
                                     localesidkey='en_US', profileid = UserInfo.getProfileId(), IsActive = True,
                                     timezonesidkey='America/Los_Angeles', username='userwithrole@testorg.com');
        Account a;
        

        Profile p1 = [SELECT Id FROM Profile WHERE Name = 'System Administrator' LIMIT 1];
        userWithRole.ProfileId =p1.id;
        
        System.runAs(userWithRole){
            
            Account BrokerageAccount = New Account();
            
            BrokerageAccount.Name = 'Test Brokerage Account';
            BrokerageAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Brokerage').getRecordTypeId();       
            
            
            insert BrokerageAccount;
            
            Contact BrokerContact = New Contact();
            
            BrokerContact.FirstName = 'Test Broker';
            BrokerContact.LastName = 'Test Broker Contact';
            BrokerContact.AccountId = BrokerageAccount.Id;
            BrokerContact.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Broker').getRecordTypeId();       
            
            insert BrokerContact;
            
            Program_Audience__c progType = new Program_Audience__c();
            progType.name = 'programtest';
            progType.Active__c = True;
            progType.IBC_Code__c = 'TEST CODE IBC';
            progType.RecordTypeId =  Schema.SObjectType.Program_Audience__c.getRecordTypeInfosByName().get('Program Type').getRecordTypeId(); 
            insert progType;
            
            
            Account HiddenAccount = New Account();
            
            HiddenAccount.Name = 'Test Hiddent Account11';
            HiddenAccount.FinServ__Status__c = 'Quote';
            HiddenAccount.Brokerage_Account__c = BrokerageAccount.Id;
            HiddenAccount.Broker_Contact__c = BrokerContact.Id;
            HiddenAccount.Program_Audience__c = progType.Id;
            HiddenAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Business').getRecordTypeId();       
            insert HiddenAccount;
            
            system.debug('Hidden Account => ' + HiddenAccount);
            
            String recordTypeId = Schema.getGlobalDescribe().get('Account').getDescribe().getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
            a = new Account(RecordTypeId = recordTypeId,
                            FirstName = '222',
                            LastName = '1313',
                            PersonEmail = 'testemail'+Math.round(Math.random()*Math.pow(10, 7))+'@testemail.com',
                            //      HiddenAccount__c = BrokerageAccount.Id,
                            Brokerage_Account__c = BrokerageAccount.Id,
                            Broker_Contact__c = BrokerContact.Id
                           );
            insert a;
            
            Account account = [Select HiddenAccount__c from Account where Id =: a.Id];
            account.HiddenAccount__c = HiddenAccount.Id;
            Account.BillingState = '';
            Account.BillingCountry = '';
            update account;
        }
        
        Account acc = [Select Id,PersonContactId,IsCustomerPortal From Account Where Id = :a.Id];
        
        
        Profile p = [SELECT Id FROM Profile WHERE Name = 'Custom Customer Community' LIMIT 1];
        User u = new User(
            FirstName = 'TestFirstName22',
            LastName = 'TestLastName1212',
            Email = 'testemail'+Math.round(Math.random()*Math.pow(10, 7))+'@testemail.com',
            Username =  'testemail'+Math.round(Math.random()*Math.pow(10, 8))+'@testemai.com',
            Alias = 'al', 
            TimeZoneSidKey = 'GMT', 
            LocaleSidKey = 'en_US', 
            EmailEncodingKey = 'UTF-8', 
            ProfileId = p.Id, 
            LanguageLocaleKey = 'en_US',
            ContactId = acc.PersonContactId);
        insert u;
 
               
        String accName = 'Ariba Investment Inc.';
        String ShippingStreet = 'TestStreet';
        String ShippingCity = 'Toronto';
        String ShippingState = 'Ontario';
        String ShippingPostalCode = 'M6t 0K4';
        //accObj.Firm_Owner__c = person.id;
        String Mailingcity = 'Ohio';
        
        
        
        
        /*Product2 prod = TestDataFactory_SelfRegisterController.getProduct();
        Opportunity opp = TestDataFactory_SelfRegisterController.getOpp(acc.Id , prod.Id);
        Quote2__c quote = TestDataFactory_SelfRegisterController.getQuote(opp.id, prod.id, BrokerContact.id, BrokerageAccount.id, acc.id);
        
        InsurancePolicy policy = TestDataFactory_SelfRegisterController.getInsurancePolicy(acc.id, 'test policy', prod.id, opp.id, quote.id, opp.id, quote.id, acc.id, BrokerageAccount.id, BrokerContact.id, 'Requested Cancellation');
        
        Extended_Report_Period__c erp = TestDataFactory_SelfRegisterController.getErp(policy.id);
        
        policy.Extended_Reporting_Period__c = erp.id;
        update policy;
        
        
        
        
        integer cancelAmt =  Integer.valueOf(policy.Cancellation_Amount__c); */
        
        
        
        
        
 
        test.startTest();
        System.runAs(userWithRole) {
        try{
            //system.debug(acc);
            Account pAccount = PersonInformation.getAccountRecord();
            
            PersonInformation.createFirmAccount(accName, ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, pAccount.Broker_Contact__c, pAccount.Brokerage_Account__c, pAccount.Id);
            PersonInformation.updateFirmAccount(accName, ShippingStreet, Mailingcity, ShippingState, ShippingPostalCode, pAccount.Broker_Contact__c, pAccount.Brokerage_Account__c, pAccount.Id);
            PersonInformation.GetFirmAccount(pAccount.Id);
            PersonInformation.contactList(pAccount.Id);
            
            
          //  List<Account> personAcc  = [select id, Name, PersonContactId from Account where Id =: pAccount.Id limit 1];
           // AccountContactRelation acr = TestDataFactory_SelfRegisterController.getACR(pAccount.id, personAcc[0].PersonContactId);
           // insert acr; 
            
            Account BrokerageAccount = New Account();
            
            BrokerageAccount.Name = 'Test Brokerage Account';
            BrokerageAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Brokerage').getRecordTypeId();      
            insert BrokerageAccount;
            
            Contact BrokerContact = New Contact();
            BrokerContact.FirstName = 'Test Broker';
            BrokerContact.LastName = 'Test Broker Contact';
            BrokerContact.AccountId = BrokerageAccount.Id;
            BrokerContact.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Broker').getRecordTypeId();       
            insert BrokerContact;
            
            Program_Audience__c Ibc = new Program_Audience__c(name = 'ibcTest');
            Ibc.Name = '0001';
            Ibc.RecordTypeId = Schema.SObjectType.Program_Audience__c.getRecordTypeInfosByName().get('IBC Code').getRecordTypeId(); 
            
            Account businessAcc = new Account();
            businessAcc.Name = 'testBusiness';
            businessAcc.Brokerage_Account__c = BrokerageAccount.id;
            businessAcc.FinServ__Status__c = 'Bound';
            businessAcc.IBC_Code__c = Ibc.Id;
            businessAcc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Business').getRecordTypeId();
        
            insert businessAcc;
            Product2 prod = TestDataFactory_SelfRegisterController.getProduct();
            Opportunity opp = TestDataFactory_SelfRegisterController.getOpp(pAccount.id , prod.Id);
            Quote2__c quote = TestDataFactory_SelfRegisterController.getQuote(opp.id, prod.id, BrokerContact.id, BrokerageAccount.id, pAccount.id);
        
            InsurancePolicy policy = TestDataFactory_SelfRegisterController.getInsurancePolicy(pAccount.id, 'test policy', prod.id, opp.id, quote.id, opp.id, quote.id, businessAcc.id, BrokerageAccount.id, BrokerContact.id, 'Bound',acc.PersonContactId);
        
            Extended_Report_Period__c erp = TestDataFactory_SelfRegisterController.getErp(policy.id);
        
            policy.Extended_Reporting_Period__c = erp.id;
            //policy.OwnerId = userWithRole.id;
            
            //system.debug('user id'+userWithRole.id);
            update policy;
           
           
           
            PersonInformation.recallFirmCancellation(pAccount.id,acc.PersonContactId);
   
        	    
        }
        
        catch(exception e){
            
            //exceptionCaught = true;
            System.debug('this is exception'+e);
        	}
        } 
        test.stopTest();
        
        
        
    }
    
    
    
    
    static testMethod void validateSaveAccountRecord(){
        
        Boolean exceptionCaught = false;
        
        
        Account account = new account(LastName='Doe',FirstName='John');
        insert account;                
        
        test.startTest();
        try{
            PersonInformation.saveAccountRecord(account);
        }
        
        catch(exception e){
            
            exceptionCaught = true;
        }
        
        test.stopTest();
    }
    
    
    static testMethod void validateUpdateFirmAddress(){
        
        Boolean exceptionCaught = false;
        
        
        Account account = new account(LastName='Doe',FirstName='John');
        insert account;                
           
        //account.lastname = '';
        
        test.startTest();
        try{
            PersonInformation.updateFirmAddress(account);
        }
        
        catch(exception e){
            
            exceptionCaught = true;
        }
        
        test.stopTest();
    }
    
    //for validating methods : cancelpolicy() and cancelfirmpolicy
    static testmethod void validateCancelPolicy()
    {
        Account brokerage = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact broker = TestDataFactory_SelfRegisterController.getBroker(brokerage.Id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        Program_Audience__c testProg = TestDataFactory_SelfRegisterController.getProgramType();
        Account accObj = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerage.Id, broker.Id, ibc.Id);
        Account person = TestDataFactory_SelfRegisterController.getPersonAcc('whatever@gmail.com', ibc.Id, testProg.id, 'test', accObj.id);
        List<Account> personAcc  = [select id, Name, PersonContactId from Account where Id =: person.Id limit 1];
        AccountContactRelation acr = TestDataFactory_SelfRegisterController.getACR(accObj.id, personAcc[0].PersonContactId);
        insert acr;
        
        Product2 prod = TestDataFactory_SelfRegisterController.getProduct();
        Opportunity opp = TestDataFactory_SelfRegisterController.getOpp(person.Id , prod.Id);
        Quote2__c quote = TestDataFactory_SelfRegisterController.getQuote(opp.id, prod.id, broker.id, brokerage.id, person.id);
        
        InsurancePolicy policy = TestDataFactory_SelfRegisterController.getInsurancePolicy(person.id, 'test policy', prod.id, opp.id, quote.id, opp.id, quote.id, accObj.id, brokerage.id, broker.id, 'Bound',personAcc[0].PersonContactId);
        
        Extended_Report_Period__c erp = TestDataFactory_SelfRegisterController.getErp(policy.id);
        
        policy.Extended_Reporting_Period__c = erp.id;
        update policy;
        
        //for validating cancelling firm policy
//InsurancePolicy policy2 = TestDataFactory_SelfRegisterController.getInsurancePolicy(person.id, 'test policy 2', prod.id, opp.id, quote.id, opp.id, quote.id, accObj.id, brokerage.id, broker.id, 'Bound',personAcc[0].PersonContactId);
       // policy.Extended_Reporting_Period__c = erp.id;
       // update policy2;
        
        
        
        integer cancelAmt =  Integer.valueOf(policy.Cancellation_Amount__c);  
         
        test.startTest();
        PersonInformation.cancelPolicy(person.id,personAcc[0].PersonContactId);
        PersonInformation.cancelFirmPolicy(person.id,personAcc[0].PersonContactId,cancelAmt);
       // PersonInformation.recallFirmCancellation(person.id,personAcc[0].PersonContactId);
        test.stopTest();
        
    }
    
   
    
    
    
    static testmethod void validateGetFirmAcc()
    {
        Account brokerage = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact broker = TestDataFactory_SelfRegisterController.getBroker(brokerage.Id);
        test.startTest();
        PersonInformation.getBrokerageAccounts();
        test.stopTest();
    }
    
    
    
    
}