@isTest
public class TestDataFactory_SelfRegisterController 
{
    public static Account getBrokerAccount()
    {
        Account brokerAcc = new Account ();
        String brokerName = 'testBroker';
        brokerAcc.Name = brokerName;
        brokerAcc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Brokerage').getRecordTypeId();
        insert brokerAcc ;
        return brokerAcc;
    }
    
    public static User user()
    {
        Profile p = [SELECT Id FROM Profile WHERE Name='Custom Customer Community'];
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
            LanguageLocaleKey='en_US');
        insert u; 
        return u;
    }
    
    public static Account hiddenAcc(string BrokerageAccount, string BrokerContact, string progType)
    {
            Account HiddenAccount = New Account();
            HiddenAccount.Name = 'Test Hiddent Account11';
            HiddenAccount.FinServ__Status__c = 'Quote';
            HiddenAccount.Brokerage_Account__c = BrokerageAccount;
            HiddenAccount.Broker_Contact__c = BrokerContact;
            HiddenAccount.Program_Audience__c = progType;
            HiddenAccount.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Business').getRecordTypeId();       
            insert HiddenAccount;
            return HiddenAccount;
    }
    
    public static Program_Audience__c getIBC()
    {
        Program_Audience__c Ibc = new Program_Audience__c(name = 'ibcTest');
        Ibc.Name = '0001';
        Ibc.RecordTypeId = Schema.SObjectType.Program_Audience__c.getRecordTypeInfosByName().get('IBC Code').getRecordTypeId(); 
        
        System.debug('Program Audience::' + Ibc);
        
        /* Ibc.RecordTypeId.name = 'IBC Code'; */
        
        System.debug('Program Audience::' + Ibc);
        
        insert Ibc;
        return Ibc;
    }
    
    public static Program_Audience__c getProgramType()
    {
        Program_Audience__c progType = new Program_Audience__c(name = 'programtest');
        progType.RecordTypeId = Schema.SObjectType.Program_Audience__c.getRecordTypeInfosByName().get('Program Type').getRecordTypeId(); 
        insert progType;
        return progType;
    }
    
    public static Contact getBroker(Id AccountId)
    {
        Contact testBroker = new Contact();
        testBroker.LastName ='test';
        testBroker.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('Broker').getRecordTypeId();
        // testBroker.CurrencyIsoCode = CAD - Canadian Dollar;
        insert testBroker;
        return testBroker;
    }
    
    public static Account getPersonAcc(String email, String IbcId, String progId, String LastName, String SponsoredAccount)
    {
        
        List<Account> accList = [Select brokerage_account__c, broker_contact__c from account where id=: SponsoredAccount limit 1];
        
        System.debug(accList);
        Account person = new Account();
        person.PersonEmail = email;
        person.IBC_Code__c = IbcId;
        person.Program_Audience__c = progId;
        person.LastName = LastName;
        person.HiddenAccount__c = accList[0].Id;
        person.Broker_Contact__c = accList[0].broker_contact__c;
        person.brokerage_account__c = accList[0].brokerage_account__c;
        
        //not sure if record type id should be person account or individual
        person.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Person Account').getRecordTypeId();
        insert person;
        return person;
        
    }
    
    public static Account getBusinessAcc(String status, String brokerageId, String brokerId, String ibcId)
    {
        
        Account businessAcc = new Account();
        businessAcc.Name = 'testBusiness';
        businessAcc.Brokerage_Account__c = getBrokerAccount().Id;
        businessAcc.FinServ__Status__c = 'Bound';
        businessAcc.IBC_Code__c = getIBC().Id;
        businessAcc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Business').getRecordTypeId();
        /* businessAcc.Contact_Name__c = getBroker().Id; */
        //how to add program type
        insert businessAcc;
        return businessAcc;      
    }
    
   /* public static Account getBusinessAccData(String status, String brokerageId, String brokerId, String ibcId)
    {
        
    }*/
    
    public static List<BusinessLicense> getLicense(String accId)
    {
        List<BusinessLicense> bLicense =  new List<BusinessLicense>();
        
        BusinessLicense b1 = new  BusinessLicense();
        b1.Name = 'IIROC Registered Representatives';
        b1.AccountId = accId;
        b1.Licenses_Type__c = 'Licensed Life Insurance and/or Accident and Sickness Insurance Agent (LLQP)';
        b1.Status = 'Verified'; 
        b1.IsActive = TRUE;
        //b1.Role__c = 'Licensed Assistant';
        b1.IsActive = TRUE;
        bLicense.add(b1);
        
        BusinessLicense b2 = new BusinessLicense();
        b2.Name = 'LLQP & MF (icensed Assistant)';
        b2.Licenses_Type__c = 'Investment Industry Regulatory Organization of Canada (IIROC) Registered Representative';
        b2.AccountId = accId;   
        b2.Status = 'Verified'; 
        b2.IsActive = TRUE;
        //b2.Role__c = 'Licensed Advisor';
        bLicense.add(b2);
        
        BusinessLicense b3 = new BusinessLicense();
        b3.Name = 'Licensed Life/Accident &amp; Sickness (Insured All Provinces)';
        b3.Licenses_Type__c = 'Mutual Fund Dealer Association (MFDA) Registered Representative';
        b3.AccountId = accId;   
        b3.Status = 'Verified'; 
        b3.IsActive = TRUE;
        //b3.Role__c = 'Licensed Advisor';
        bLicense.add(b3);
        
        BusinessLicense b4 = new BusinessLicense();
        b4.Name = 'Licensed Life/Accident &amp; Sickness (Insured All Provinces)';
        b4.Licenses_Type__c = 'Exempt Market Dealer (EMD)';
        b4.AccountId = accId;   
        b4.Status = 'Verified'; 
        b4.IsActive = TRUE;
        b4.Role__c = 'Licensed Assistant';
        bLicense.add(b4);
        
        insert bLicense;
        return bLicense; 
        
    }
    
    //this method creates license data without insertion
    //NOTE : PERSON ACCOUNT ID IS USED INSTEAD OF BUSINESS ACCID
    public static List<BusinessLicense> getLicenseData(String accId)
    {
        List<BusinessLicense> bLicense =  new List<BusinessLicense>();
        
        BusinessLicense b1 = new  BusinessLicense();
        b1.Name = 'IIROC Registered Representatives';
        b1.AccountId = accId;
        b1.Licenses_Type__c = 'Licensed Life Insurance and/or Accident and Sickness Insurance Agent (LLQP)';
        b1.Status = 'Verified'; 
        b1.IsActive = TRUE;
        b1.Provincial_Jurisdiction__c = 'Alberta';
        b1.Percentage_Of_Total_Income__c = 50.0;
        b1.Total_Annual_Earning__c = 60000.00;
        //b1.Role__c = 'Licensed Assistant';
        b1.IsActive = TRUE;
        bLicense.add(b1);
        
        BusinessLicense b2 = new BusinessLicense();
        b2.Name = 'LLQP & MF (icensed Assistant)';
        b2.Licenses_Type__c = 'Investment Industry Regulatory Organization of Canada (IIROC) Registered Representative';
        b2.AccountId = accId;   
        b2.Status = 'Verified'; 
        b2.IsActive = TRUE;
        b2.Provincial_Jurisdiction__c = 'Manitoba';
        b2.Percentage_Of_Total_Income__c = 30.0;
        b2.Total_Annual_Earning__c = 6000.00;
        //b2.Role__c = 'Licensed Advisor';
        bLicense.add(b2);
        
    
        return bLicense; 
        
    }
    
    
    public static List<Question__c> getQuestion()
    {
        List<Question__c> question = new List<Question__c>();
        Question__c q1 = new Question__c();
        q1.Type__c = 'Text';
        q1.Question_Description__c = 'Text Description';
        question.add(q1);
            
        Question__c q2 = new Question__c();
        q2.Type__c = 'Number';
        q2.Question_Description__c = '2';
        question.add(q2);
        
        Question__c q3 = new Question__c();
        q3.Type__c = 'Pick list';
        q3.Question_Description__c = 'picklist description';
        question.add(q3);
        
        
        //for this question check if type should be '' or 'None' or should not be defined at all
        Question__c q4 = new Question__c();
        q4.Type__c = '';
        q4.Question_Description__c = 'None description';
        question.add(q4);
        
        insert question;
        return question;
        
    }
    
    public static List<Program_Question__c> getProgramQuestion(String progAudience, String accId, List<Question__c> questions)
    {
        //select biz licenses where id is accid and role = 'assistant'
        
        List<BusinessLicense> bizLicense = [Select id, Licenses_Type__c , Role__c  from BusinessLicense where Role__c='Licensed Assistant' and AccountId =:accId];
       
        List<Program_Question__c> programList = new List<Program_Question__c>();
        System.debug('list of business license'+bizLicense);
        
        Program_Question__c pq1 = new Program_Question__c();
        pq1.Correct_Answer__c = 'pq1';
        pq1.Program_Audience__c = progAudience;
        pq1.Business_License__c = bizLicense[0].id;
        pq1.Question__c = questions[0].id;
        programList.add(pq1);
        
        Program_Question__c pq2 = new Program_Question__c();
        pq2.Correct_Answer__c = 'pq2';
        pq2.Program_Audience__c = progAudience;
        pq2.Business_License__c = bizLicense[0].id;
        pq2.Question__c = questions[1].id;
        programList.add(pq2);
        
        Program_Question__c pq3 = new Program_Question__c();
        pq3.Correct_Answer__c = 'pq3';
        pq3.Program_Audience__c = progAudience;
        pq3.Business_License__c = bizLicense[0].id;
        pq3.Question__c = questions[2].id;
        programList.add(pq3);
        
        Program_Question__c pq4 = new Program_Question__c();
        pq4.Correct_Answer__c = 'pq4';
        pq4.Program_Audience__c = progAudience;
        pq4.Business_License__c = bizLicense[0].id;
        pq4.Question__c = questions[3].id;
        programList.add(pq4);
        
        insert programList;
        return programList;
        
    }
    
    public static Program_Application__c getProgApp(String brokerAcc, String brokerCon, String accId )
    {    
        Program_Application__c p1 = new Program_Application__c();
        p1.Name = 'test1';
        p1.Status__c = 'Approved';
        p1.Broker__c = brokerCon;
        p1.Brokerage_Account__c = brokerAcc;
        
        return p1;
    }
    
    
    public static AccountContactRelation getACR(String accId, String conId)
    {    
        AccountContactRelation acr1 = new AccountContactRelation();
        acr1.AccountId = accId;
        acr1.ContactId = conId;
        acr1.IsActive = True;
        acr1.FinServ__SourceSystemId__c = accId + '-'+conId;
        return acr1;
    }
    
    public static InsurancePolicy getInsurancePolicy(
        String accId, 
       // String contactId, 
        String name,  
        //String erp, 
        String product, 
        string opp,
        string quote,
        string renewOpp, 
        string renewQuote,  
        string insuredId, 
        string brokerage, 
        string broker,
        string policyStatus,
        string contact
    )
    {
        InsurancePolicy ip = new InsurancePolicy();
        ip.Name = name;//this is policy number
        ip.Status = policyStatus;
        
        //ip.Extended_Reporting_Period__c = erp;//need to create object
        ip.ProductId = product;
        ip.PremiumAmount = 140000.00;
        ip.Commission__c = 20.00;
        String convertedOppId = opp.subString(0, 15);
        ip.SourceOpportunityId = opp;
             
/*String str = '0019000001O73UCAAZ';
String convertedStr = str.subString(0, 15);
System.debug('15 digit ID:'+convertedStr);*/
        String convertedStr = quote.subString(0, 15);
        
       // ip.SourceQuoteId = convertedStr;
        ip.Quote__c = quote;
        ip.Cancellation_Amount__c = 1200;
        ip.CancellationDate = Date.valueOf('2021-12-13 08:00:00');
        ip.Category__c = 'Firm Rider Insurance Certificate';
        ip.ExpirationDate = Date.valueOf('2022-04-13 08:00:00');
        ip.SaleDate = Date.valueOf('2021-04-13 08:00:00');//for date time
        ip.Intital_Policy_Terms__c = 12;
        ip.Renewal_Opportunity__c = convertedOppId;//probably same as source opp
        ip.EffectiveDate = Date.valueOf('2021-04-11 08:00:00');
        ip.Renewal_Quote__c = quote;//probably same as source quote
        ip.Policy_Terms__c = 12;
        ip.NameInsuredId = insuredId;//person acc id
        ip.Brokerage__c = brokerage;
        ip.Broker__c = broker;
        ip.Contact__c = contact;
 
        insert ip;
        return ip;
    }
    
   public static Extended_Report_Period__c getErp (string policy)
   {
       Extended_Report_Period__c erp = new Extended_Report_Period__c();
       erp.Name = 'Test ERP';
       erp.Policy__c = policy;
       erp.Additional_Premium__c = 12;
       erp.RecordTypeId = Schema.SObjectType.Extended_Report_Period__c.getRecordTypeInfosByName().get('Extended Reporting Period of Policy').getRecordTypeId();
       
       insert erp;
       return erp;
       
       
   }
    
   public static Opportunity getOpp(string acc, string product)
   {
       Opportunity opp = new Opportunity();
       opp.Name = 'test opp';
       opp.AccountId = acc;
       opp.Product__c = product;
       opp.Type = 'Non Program';
       opp.StageName = 'Closed Won';
       opp.CloseDate = Date.newInstance(2020, 12, 9);
       opp.Commission__c = 10.00;
       opp.Premium_Amount__c = 2000.00;
       insert opp;
       return opp;
   }
    
    public static Product2 getProduct()
    {
        Product2 prod = new Product2();
        prod.Name = 'test product';
        prod.RecordTypeId = Schema.SObjectType.Product2.getRecordTypeInfosByName().get('Merlin Products').getRecordTypeId();
        insert prod;
        return prod;
    }
    
    public static Quote2__c getQuote(string opp,string product, string broker, string brokerage, string acc)
    { 
        Quote2__c q = new Quote2__c();
        q.Opportunity__c = opp;
        q.Category__c = 'New Quote';
        q.Policy_Premium__c = 140000;
        q.Commission__c = 20;
        q.Is_Renewable__c = true;
        q.Status__c = 'Issued';
        q.RecordTypeId = Schema.SObjectType.Quote2__c.getRecordTypeInfosByName().get('Non-Program Quote').getRecordTypeId();
        q.Account__c = acc;
        insert q;
        return q;
        
    }
    
    
    
}