/* test class for GetAccLicenses
 * written by : Ariba Khan
 */
@isTest
public class Test_GetAccLicenses
{
    static testMethod void validateGetLicenses()
    {
        Account brokerAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact brokerCon = TestDataFactory_SelfRegisterController.getBroker(brokerAcc.id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerAcc.id, brokerCon.id, ibc.Id);
        Account bizAccount = new Account();
        String accountId = bizAccount.id;
        
        test.startTest();
        
        TestDataFactory_SelfRegisterController.getLicense(accountId);
        GetAccLicenses.GetAccLicenses(accountId);
        
        test.stopTest();
    }
    
    static testMethod void validateProgramQuestions()
    {
        //getting data to send as parameters in the data factory
        Program_Audience__c testProg = TestDataFactory_SelfRegisterController.getProgramType();
        Account brokerAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact broker = TestDataFactory_SelfRegisterController.getBroker(brokerAcc.id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        Account accObj = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerAcc.Id, broker.Id, ibc.Id);
        List<Question__c> questionList = TestDataFactory_SelfRegisterController.getQuestion();
        TestDataFactory_SelfRegisterController.getLicense(accObj.Id);
        
        //calling data factory to get and insert program questions
        List<Program_Question__c> programQuestions = TestDataFactory_SelfRegisterController.getProgramQuestion(testProg.id, accObj.Id,questionList);
        
        test.startTest();
        GetAccLicenses.ProgramQuestions(accObj.Id, 'Exempt Market Dealer (EMD)');
        test.stopTest();
        
    }
    
    static testMethod void validateGetPickList()
    {
         test.startTest();
         GetAccLicenses.getPickList('Opportunity', 'StageName');
         test.stopTest();
    }
    
    
    //need to check how  to cover catch
    static testMethod void validateGetPicklistAcc()
    {
        //Creating a list of account names that shouldnt be included
        String [] accNames = new List<String>();
        accNames.add('Test Account Name 1');
        accNames.add('Test Account Name 2');
        accNames.add('Test Account Name 3');
        
        //getting a brokerage account from data factory
        Account brokerAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        
        test.startTest();
        
        GetAccLicenses.getPickListAccounts(brokerAcc.Name , 'Insurer', accNames);
        GetAccLicenses.getPickListAccounts('Test Account Name 4' , 'Brokerageee', accNames);
         
       /* try
        {
            
              
        }
        catch(Exception e )
        {
            
            
        }*/
        test.stopTest();
    }
    
    static testMethod void validateCreateAccConRelation()
    {
        Program_Audience__c testProg = TestDataFactory_SelfRegisterController.getProgramType();
        Account brokerAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact broker = TestDataFactory_SelfRegisterController.getBroker(brokerAcc.id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        Account accObj = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerAcc.Id, broker.Id, ibc.Id);
        
        Account person = TestDataFactory_SelfRegisterController.getPersonAcc('whatever@gmail.com', ibc.Id, testProg.id, 'test', accObj.id);
        List<Account> personAcc  = [select id, Name, PersonContactId from Account where Id =: person.Id limit 1];
        
       AccountContactRelation acr = TestDataFactory_SelfRegisterController.getACR(accObj.id, personAcc[0].PersonContactId);
       AccountContactRelation [] AccountContactRel = new List<AccountContactRelation>();
       AccountContactRel.add(acr);
        
       test.startTest();
       System.debug('this is for test acr'+ acr);
       System.debug('this is for test'+ AccountContactRel);
       GetAccLicenses.CreateAccConRelation(AccountContactRel);
       GetAccLicenses.getAccConRelation(personAcc[0].PersonContactId,'Employee');
       test.stopTest();
        
    }
    
    //validates two methods : GetBusinessLicense and getBuisnessLicenseData
    static testMethod void validateLicenseGetting()
    {
        Program_Audience__c testProg = TestDataFactory_SelfRegisterController.getProgramType();
        Account brokerAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact broker = TestDataFactory_SelfRegisterController.getBroker(brokerAcc.id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        Account accObj = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerAcc.Id, broker.Id, ibc.Id);
        TestDataFactory_SelfRegisterController.getLicense(accObj.id);
        
        test.startTest();
        GetAccLicenses.GetBusinessLicense(accObj.id, 'Licensed Life/Accident &amp; Sickness (Insured All Provinces)');
        GetAccLicenses.getBuisnessLicenseData(accObj.id);
        test.stopTest();

    }
    
    static testMethod void validateInsertProgramApp()
    {
        Account broker = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact con = TestDataFactory_SelfRegisterController.getBroker(broker.Id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        Program_Audience__c progType = TestDataFactory_SelfRegisterController.getProgramType();
        Account acc = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', broker.id, con.id, ibc.Id);
        List<BusinessLicense> bLicense = TestDataFactory_SelfRegisterController.getLicense(acc.Id);
        String License = bLicense[1].id;
        
        List<Question__c> questions = TestDataFactory_SelfRegisterController.getQuestion();
        List<Program_Question__c> progQuestions = TestDataFactory_SelfRegisterController.getProgramQuestion(progType.Id, acc.Id, questions);
        String [] correctAns = new List<String>();
        String [] ans = new List<String>();
        String [] progId = new List<String>();
      
        for(integer i = 0;i<progQuestions.size();i++)
        {
            correctAns.add(progQuestions[i].Correct_Answer__c);
            ans.add('test'+ i);
            progId.add(progQuestions[i].id);
            
        }
        
        Boolean exceptionCaught = false;
        
        test.startTest();
        
        try
        {
            GetAccLicenses.InsertProgramApplication('name', broker.id, con.id, 'Submitted', acc.Id, progId, ans, correctAns, License);  
        }
        catch(exception e)
        {
            exceptionCaught = true;
        }
        
        test.stopTest();
    }
    
    
    static testMethod void validateUpdateBusinessLicense()
    {
        Program_Audience__c testProg = TestDataFactory_SelfRegisterController.getProgramType();
        Account brokerAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact broker = TestDataFactory_SelfRegisterController.getBroker(brokerAcc.id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        Account accObj = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerAcc.Id, broker.Id, ibc.Id);
        Account person = TestDataFactory_SelfRegisterController.getPersonAcc('whatever@gmail.com', ibc.Id, testProg.id, 'test', accObj.id);
        List<BusinessLicense> Licenses = TestDataFactory_SelfRegisterController.getLicenseData(person.Id);
        
        List<BusinessLicense> bizLicense = TestDataFactory_SelfRegisterController.getLicense(accObj.id);
        String ApplicableLicense = bizLicense[2].Name;
        String AssignedLicense = bizLicense[3].Name;
        List<Producer> nullList = new List<Producer>();
        
        test.startTest();
        //sending a null list of producers since the actual code doesnt require it
        GetAccLicenses.UpdateBusinessLicense(Licenses, '', person.Id, ApplicableLicense, AssignedLicense, nullList);
        test.stopTest();
        
        
    }
    
    //for testing method  : UpdateLicenseFields
    static testMethod void validateUpdateFields()
    {
        Program_Audience__c testProg = TestDataFactory_SelfRegisterController.getProgramType();
        Account brokerAcc = TestDataFactory_SelfRegisterController.getBrokerAccount();
        Contact broker = TestDataFactory_SelfRegisterController.getBroker(brokerAcc.id);
        Program_Audience__c ibc = TestDataFactory_SelfRegisterController.getIBC();
        Account accObj = TestDataFactory_SelfRegisterController.getBusinessAcc('Bound', brokerAcc.Id, broker.Id, ibc.Id);
        Account person = TestDataFactory_SelfRegisterController.getPersonAcc('whatever@gmail.com', ibc.Id, testProg.id, 'test', accObj.id);
        List<BusinessLicense> Licenses = TestDataFactory_SelfRegisterController.getLicense(accObj.id);
        List<BusinessLicense> personBiz = TestDataFactory_SelfRegisterController.getLicenseData(person.Id);
        
        String [] province = new List<String>();
        String [] licenseName = new List<String>();
        Double [] percentageIncome = new List<Double>();
        Double [] annualIncome = new List<Double>();
        
        for(BusinessLicense abc: personBiz)
        {
            System.debug('-->size of list: '+personBiz.size());
            System.debug('-->province: '+ abc.Percentage_Of_Total_Income__c);
            System.debug('-->percentage income '+abc.Provincial_Jurisdiction__c);
            System.debug('-->annual income '+abc.Percentage_Of_Total_Income__c);
            System.debug('-->license name: '+abc.Name);
            province.add(abc.Provincial_Jurisdiction__c);
            percentageIncome.add(abc.Percentage_Of_Total_Income__c);
            annualIncome.add(abc.Total_Annual_Earning__c);
            licenseName.add(abc.Name);
        }
        
/*
        for(integer i = 0;i<2; i++){
            System.debug('-->size of list: '+personBiz.size());
            System.debug('-->province: '+personBiz[i].Percentage_Of_Total_Income__c);
            System.debug('-->percentage income '+personBiz[i].Percentage_Of_Total_Income__c);
            System.debug('-->annual income '+personBiz[i].Percentage_Of_Total_Income__c);
            System.debug('-->license name: '+personBiz[i].Percentage_Of_Total_Income__c);
            province[i] = personBiz[i].Provincial_Jurisdiction__c;
            percentageIncome[i] = personBiz[i].Percentage_Of_Total_Income__c;
            annualIncome[i] = personBiz[i].Total_Annual_Earning__c;
            licenseName[i] = personBiz[i].Name;
        }
         */   
        
        
        
        
        
        Program_Application__c progApp = TestDataFactory_SelfRegisterController.getProgApp(brokerAcc.id , broker.id , person.Id);   
        List<Question__c> questions = TestDataFactory_SelfRegisterController.getQuestion();
        String [] questionId = new List<String>();
        /*for(integer i = 0;i<questions.size();i++)
        {
            questionId[i] = questions[i].id;
        }*/
        List<Program_Question__c> progQuestions = TestDataFactory_SelfRegisterController.getProgramQuestion(testprog.Id, accObj.id, questions);
        
        String [] CorrectAns = new List<String>();
        String [] UserAns = new List<String>();
        
        for(Program_Question__c pq :progQuestions )
        {
            CorrectAns.add(pq.Correct_Answer__c);
            UserAns.add('Yes');
            questionId.add(pq.id);
        }
        
        
        /*for(integer i=0;i<progQuestions.size();i++)
        {
            CorrectAns[i] = progQuestions[i].Correct_Answer__c;
            UserAns[i] = 'Yes';
            questionId[i] = progQuestions[i].id;
        }*/
            

      GetAccLicenses.UpdateLicenseFields(licenseName, province, percentageIncome, annualIncome, person.Id, Licenses[0].id, Licenses[1].id, progApp.Name, progApp.Status__c, progApp.Account__c, progApp.Broker__c, questionId, CorrectAns, UserAns, 'Licensed Assistant');
    }

    
    
        
        
        
    

}