/*for test method  1 create a person account, insert with an email. then insert an email only
 * for test method 2 create a parent acc (business account) and then a person acc related to it
 * for test method 3 send id of parent accs
*/

@isTest
public class TestSelfRegisterController 
{
   static testMethod void validateGetContacts()
   {
        Account brokerageAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Program_Audience__c IbcObj = TestDataFactory_SelfRegisterController.getIBC();
        Contact brokerCon = TestDataFactory_SelfRegisterController.getBroker(brokerageAcc.Id);
        Account parentAcc = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound',brokerageAcc.Id, brokerCon.Id , IbcObj.Id);
       
      
       Program_Audience__c progTypeObj = TestDataFactory_SelfRegisterController.getProgramType();
       String progId = progTypeObj.Id;
      
       Account person = TestDataFactory_SelfRegisterController.getPersonAcc('ariba@cloudjunction.cloud', IbcObj.Id, progId, 'Khan',parentAcc.Id);
       String trueEmail = person.PersonEmail;
       String falseEmail = 'false@shouldreturnfalse.com';
          
       Test.startTest();
       Boolean testEmailFalse = SelfRegisterController.getContactList(trueEmail);
       Boolean testEmailTrue = SelfRegisterController.getContactList(falseEmail);
       Test.stopTest();
   }
    
    static testMethod void validateSaveAccount()
    {
        Account brokerageAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Program_Audience__c IbcObj = TestDataFactory_SelfRegisterController.getIBC();
        Contact brokerCon = TestDataFactory_SelfRegisterController.getBroker(brokerageAcc.Id);
        Account parentAcc = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound',brokerageAcc.Id, brokerCon.Id , IbcObj.Id);
        Program_Audience__c progTypeObj = TestDataFactory_SelfRegisterController.getProgramType();
        
        test.startTest();
        SelfRegisterController.saveAccountRecord('Ariba', 'Khan', 'a20@cloudjunction.com', 'a20@cloudjunction.com', '021738829', parentAcc.Id);
        
        try
        {
             SelfRegisterController.saveAccountRecord('Areeba', 'Khan', 'a20@cloudjunction.com', 'a30@cloudjunction.com', '021738829', parentAcc.Id);
        }
        catch(Exception e)
        {
            
        }

    //     List<User> usr  = [Select id , isactive, firstname, lastname from User where firstName =: 'Ariba' limit 1];  
    //     System.debug('Useer ::' + usr);      // Query User with name=Ariba
    
    //     if(usr.size()>0){

    //     for(User userToActive: usr){

    //         userToActive.IsActive = true;


    //     }
    
    //     update usr;

    //     System.runAs(usr[0]){
    //         PersonInformation.getAccountRecord();
    //     }

        
    // }

         test.stopTest();     
    } 
    
    static testMethod void validateCurrentAccStatus()
    {
        Account brokerageAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Program_Audience__c IbcObj = TestDataFactory_SelfRegisterController.getIBC();
        Contact brokerCon = TestDataFactory_SelfRegisterController.getBroker(brokerageAcc.Id);
        Account parentAcc = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound',brokerageAcc.Id, brokerCon.Id , IbcObj.Id);
        String objAcc = String.valueOf(parentAcc);
        
        Account brokerageAcc2 = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Program_Audience__c IbcObj2 = TestDataFactory_SelfRegisterController.getIBC();
        Contact brokerCon2 = TestDataFactory_SelfRegisterController.getBroker(brokerageAcc.Id);
        Account parentAcc2 = TestDataFactory_SelfRegisterController.getBusinessAcc('Prospect',brokerageAcc2.Id, brokerCon2.Id , IbcObj2.Id);
        String objAccFalse = String.valueOf(parentAcc2);
        
        test.startTest();
        SelfRegisterController.CurrentAccStatus(objAcc);
        SelfRegisterController.CurrentAccStatus(objAccFalse);
        test.stopTest();
    }

    // static testMethod void validateAccountRecord(){
    //     Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
    //     User u = new User(
    //     Alias = 'standt', 
    //     Email='standarduser@testorg.com',
    //     LastName='Testing',
    //     CommunityNickname = 'User16166802911282164072',
    //     ProfileId = p.Id,
    //     TimeZoneSidKey='America/Los_Angeles',
    //     LocaleSidKey='en_US',
    //     EmailEncodingKey='UTF-8',
    //     LanguageLocaleKey='en_US',
    //     UserName= 'standarduser12345@testorg.com');
    //     insert u;
 
    //     System.runAs(u) { 
    //     test.startTest();
    //     // List<User> usr  = [Select id from User where firstName =: 'Ariba' limit 1];        // Query User with name=Ariba
    //     // System.runAs(usr[0]){
    //     PersonInformation.getAccountRecord();
    //     }
    //     test.stopTest();
        
    // }
}