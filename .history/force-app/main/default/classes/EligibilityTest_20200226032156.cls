public with sharing class EligibilityTest {
    
    
    public static Account account = new Account();



    public EligibilityTest() {

        account = PersonInformation.getAccountRecord();
    }

    public static void getAllQuestions(String pAudience){

        List<Program_Question__c> listofPQues = [Select id, name , Question__r.Question_Description__c , Correct_Answer__c , Question__r.Type__c from Program_Question__c where Program_Audience__c =: pAudience  ];
        

    }


}
