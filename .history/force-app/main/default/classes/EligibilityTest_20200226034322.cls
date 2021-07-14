public with sharing class EligibilityTest {
    
    
    public Account account = new Account();
    public Program_Application__c pApplication = new Program_Application__c();


    public EligibilityTest() {

        
        
    }

    @AuraEnabled
    public static List<Program_Question__c> getAllQuestions(){

        account = PersonInformation.getAccountRecord();

        List<Program_Question__c> listofPQues = [Select id, name , Question__r.Question_Description__c , Correct_Answer__c , Question__r.Type__c from Program_Question__c where Program_Audience__c =: account.Program_Audience__c  ];

        return listofPQues;

    }

    public static createProgramApplication(){

        
    }


}
