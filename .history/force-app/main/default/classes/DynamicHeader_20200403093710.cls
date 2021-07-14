public without sharing class DynamicHeader {
    
    public static Account PersonAccount = new Account();
    
    @AuraEnabled
    public static String getPLogoLink() {
        
        PersonAccount = PersonInformation.getAccountRecord();
        
        System.debug('Person Account ID:' + PersonAccount);
        System.debug('PersonAccount Parent Record Name' + PersonAccount.HiddenAccount__r.Name);

        System.debug('PersonAccount Parent Record Id' + PersonAccount.HiddenAccount__c);
        
        // Get Sponsored Account
        Account PAccount  = [Select id, Name, Logo__c from Account where Id =: PersonAccount.HiddenAccount__c LIMIT 1];
        
        /*System.debug('PAccount::' + PAccount);

        String firstSubString = PAccount.logo__c.substringBetween('<img', 'img>');
        System.debug('First substring: ' + firstSubString);
        
        String secondSubString = firstSubString.substringBetween('src="', '"');
        System.debug('Second substring: ' + secondSubString);
        
        String link = secondSubString.replace('amp;', '');
        System.debug('Link: ' + link);        */
        
       return PAccount.Id;
    }
}

/*
public with sharing class EligibilityTest {


public static Account account = new Account();
public static Program_Application__c pApplication = new Program_Application__c();

@AuraEnabled
public static List<Program_Question__c> getAllQuestions(){


System.debug('Program Questions Page');

account = PersonInformation.getAccountRecord();

System.debug('Account ::' + account);

System.debug('Program Audience::' + account.Program_Audience__c);

List<Program_Question__c> listofPQues = [Select id, name , Question__r.Question_Description__c , Correct_Answer__c , Question__r.Type__c from Program_Question__c where Program_Audience__c =: account.Program_Audience__c  ];

System.debug('List og Program Questions::' + listofPQues);

return listofPQues;

}
*/