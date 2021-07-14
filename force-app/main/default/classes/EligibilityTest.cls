public without sharing class EligibilityTest {

public static Applicant_Response__c questions = new applicant_Response__c();

public static Account account = new Account();
public static Program_Application__c pApplication = new Program_Application__c();
public static List<Applicant_Response__c> ListofARtoInsert = New List <Applicant_Response__c>();

@AuraEnabled
public static List<ApplicantQuestionsResponses> getAllQuestions(){


    System.debug('Program Questions Page');
    account = PersonInformation.getAccountRecord();
    System.debug('Account ::' + account);
    System.debug('Program Audience::' + account.Program_Audience__c);

    List<Program_Question__c> listofPQues = [Select id, name ,  Question__c 
                                            ,Question__r.Question_Description__c
                                            ,Correct_Answer__c , Question__r.Type__c 
                                            from Program_Question__c where Program_Audience__c =: account.Program_Audience__c  ];

    System.debug('List og Program Questions::' + listofPQues);

    List<ApplicantQuestionsResponses> listofAppQuesResp = new List<ApplicantQuestionsResponses>();

    Map<Id, Applicant_Response__c> mapOfAppResponse = getMapOfAppResponse(account);

    System.debug('Map of Applicant Response::' + mapOfAppResponse);

    for(Program_Question__c proQues: listofPQues){

        Applicant_Response__c response = new Applicant_Response__c();
        
        if(mapOfAppResponse.get(proQues.Id)!=null){

            System.debug('Response of Question already exist::' + mapOfAppResponse.get(proQues.Id));

            response = mapOfAppResponse.get(proQues.Id);
        
        }

        else{

            System.debug('Response does not exist');

            response.Answer__c = 'None';

        }

        ApplicantQuestionsResponses appQuesResp = new ApplicantQuestionsResponses(proQues,response,proQues.Id);
      
        System.debug('App Question Response::' + appQuesResp);
        listofAppQuesResp.add(appQuesResp);

    }


        return listofAppQuesResp;
    
    }  

public static Map<Id, Applicant_Response__c> getMapOfAppResponse(Account account){

    Map<Id, Applicant_Response__c> mapOfAppResponse = new Map<Id, Applicant_Response__c>();

    if(getProgramApplication()!=null){

        List<Applicant_Response__c> listofAppResponse = [Select id, name , Answer__c, Program_Question__c, Program_Application__c, Question_Answer__c from Applicant_Response__c where Program_Application__c =: getProgramApplication().Id];

        System.debug('List of Applicant Responses::' + listofAppResponse);    

        for(Applicant_Response__c appResponse:listofAppResponse){

            System.debug('App Response::' + appResponse);
            mapOfAppResponse.put(appResponse.Program_Question__c , appResponse);

        }
    }
    
    return mapOfAppResponse;
}    

@AuraEnabled
public static Program_Application__c getProgramApplication(){

    account = PersonInformation.getAccountRecord();

    List<Program_Application__c> listofRelatedProgramApplication = [Select name, id from Program_Application__c where account__c =: account.Id LIMIT 1];
    
    System.debug('List of Related Program Application::' + listofRelatedProgramApplication);

    if(listofRelatedProgramApplication.size()>0){

        return listofRelatedProgramApplication[0];

    }

    return null;

}


@AuraEnabled
public static string saveCustomerResponse(Boolean EligibilityTest , String FailedReason, List<Applicant_Response__c> listOfAppQuesResp, Boolean isCreate ){

    System.debug('Application Answers:: ' + listOfAppQuesResp);
    System.debug('Program Questions Page');
    account = PersonInformation.getAccountRecord();
    System.debug('Account ::' + account);
    System.debug('Program Audience::' + account.Program_Audience__c);

    String ExecutionStatus = '';

    pApplication = new Program_Application__c();
    pApplication.Account__c = account.id;
    pApplication.Brokerage_Account__c = account.Brokerage_Account__c;
    pApplication.Broker__c = account.Broker_Contact__c;
    pApplication.Program_Audience__c = account.Program_Audience__c;
    pApplication.Submission_Date__c = System.Now();
    pApplication.Name = account.Name + '-' + account.Program_Audience__r.Name;
    pApplication.Id = listOfAppQuesResp[0].Program_Application__c;

    if(EligibilityTest){

        System.debug('Eligibility Status Set to Submitted');
        pApplication.Status__c = 'Submitted';
        pApplication.Reason_to_Application_Fail__c = FailedReason;

    }

    else{

        System.debug('Eligibility Status Set to Approved');
        pApplication.Status__c = 'Approved';

    }

    
    if(isCreate){

        System.debug('Application Status is false so create the Application');
        pApplication = createProgramApp(pApplication);

        System.debug('PApplication is created::' + pApplication);
        if(pApplication!=null){

            return createListofApplicantResponse(listOfAppQuesResp, pApplication);

        }

        return 'Program Application have not created , please contact support for further clarification';


    }
    else{


        pApplication.Id = getProgramApplication().Id;
        System.debug('Application to be Updated');
        pApplication = updateProgramApp(pApplication);
    
        System.debug('Application Status is false so create the Application');
        
        if(pApplication!=null){

            return updateListofApplicantResponse(listOfAppQuesResp, pApplication);

        }

        return 'Program Application have not created , please contact support for further clarification';
    }

        
    }
    
    
public static Program_Application__c createProgramApp(Program_Application__c pApplication){

    try{


        insert pApplication;
        System.debug('Program Application Created::' +pApplication);
        return pApplication;

    }
    catch(Exception e){

        System.debug(e.getMessage());
        
        return null;
    }

}


public static Program_Application__c updateProgramApp(Program_Application__c pApplication){

    try{

        update pApplication;
        System.debug('Program Application Updated::' +pApplication);
        return pApplication;

    }catch(Exception e){

        System.debug(e.getMessage());
        return null;


    }
    
}


public static String createListofApplicantResponse(List<Applicant_Response__c> ListAppResponse , Program_Application__c pApplication){

    try{
    
            insert setAppResponseList(ListAppResponse , pApplication);
            return null;
    }
    catch(Exception e){

        System.debug(e.getMessage());
        return e.getMessage();
        
    }


}


public static String updateListofApplicantResponse(List<Applicant_Response__c> ListAppResponse , Program_Application__c pApplication){

    try{

            
            update setAppResponseList(ListAppResponse , pApplication);
            return null;
    }
    catch(Exception e){

        System.debug(e.getMessage());
        return e.getMessage();
        
    }


}

public static List<Applicant_Response__c> setAppResponseList(List<Applicant_Response__c> ListAppResponse, Program_Application__c pApplication){

    
    for(Applicant_Response__c appQuesResp: ListAppResponse){

        system.debug('Application Question Response::' + appQuesResp); 
        appQuesResp.Program_Application__c = pApplication.Id;
    }

    return ListAppResponse;
}

public class ApplicantQuestionsResponses{

@AuraEnabled
public Program_Question__c programQuestion;
@AuraEnabled
public Applicant_Response__c response;
@AuraEnabled
public Id QuestionId;
    
ApplicantQuestionsResponses(Program_Question__c programQuestion,Applicant_Response__c response,Id QuestionId){

    this.programQuestion = programQuestion;
    this.response = response;
    this.QuestionId = QuestionId;

}


}   
}