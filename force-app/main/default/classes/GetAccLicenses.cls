public  without sharing class GetAccLicenses {
    @AuraEnabled
    public static List<BusinessLicense> GetAccLicenses(String accountId) {

        system.debug(accountId);
        //list to get busines licenses of that account
        List <BusinessLicense> ListBusLicenses = [Select name, Id, Licenses_Type__c, Role__c, Newly_License_Check__c 
        from BusinessLicense where AccountId =: accountId];

        return ListBusLicenses ;

    }
    @AuraEnabled
    public static List<Program_Question__c> ProgramQuestions(string accountId ,String Type){
        system.debug('here is acc id: '+accountId);

        List<Program_Question__c> AllProgramQuestions = [Select Id, Question__c ,Correct_Answer__c,
        Question__r.Question_Description__c,Business_License__r.Licenses_Type__c,  Question__r.Type__c, ReponseField__c from Program_Question__c where Business_License__r.AccountId =: accountId and Business_License__r.Licenses_Type__c =:Type ];

        return AllProgramQuestions;
    }

    @AuraEnabled
    public static List<String> getPickList(String objectName, String fieldName) {
        List<String> values = new List<String>();
        List<Schema.DescribeSobjectResult> results = Schema.describeSObjects(new List<String>{objectName});
        
        for(Schema.DescribeSobjectResult res : results) {
            for (Schema.PicklistEntry entry : res.fields.getMap().get(fieldName).getDescribe().getPicklistValues()) {
                if (entry.isActive()) {
                    values.add(entry.getValue());
                }
            }
        }
        return values;
    }

    @AuraEnabled
    public static List<Account> getPickListAccounts(String AccountName, String DevName, String [] NotIn){
        try {
            String qry = '%' + AccountName+'%';
            
            List<Account> names = new List<Account>();
            System.debug(AccountName);

            return [Select name,Id from Account where name like :qry and RecordType.DeveloperName=:DevName
                    and id not in :NotIn ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void CreateAccConRelation(AccountContactRelation [] AccountContactRel){
        try {
            
            Database.upsert(AccountContactRel, False);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static AccountContactRelation [] getAccConRelation(String ContactId){
        try {
            return [Select AccountId,ContactId, account.name from AccountContactRelation where ContactId=:ContactId limit 10];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static list<BusinessLicense> GetBusinessLicense(String accountId, String NameOfLicense){
    System.debug('Account ID ==> ' + accountId);
    System.debug('Name Of License ==> ' + NameOfLicense);
    List<BusinessLicense> LicenseData = 
    [Select AccountId,Name,Percentage_Of_Total_Income__c,Total_Annual_Earning__c,Provincial_Jurisdiction__c from BusinessLicense where AccountId =: accountId and Name =: NameOfLicense];
    System.debug('License Data ==> ' + LicenseData);
    return LicenseData;
    }

    @AuraEnabled
    public static List<BusinessLicense> getBuisnessLicenseData(String AccId){
        try {
            List<BusinessLicense> listOfBLicense = new List<BusinessLicense>();
            listOfBLicense = [Select Percentage_Of_Total_Income__c,Total_Annual_Earning__c,Provincial_Jurisdiction__c,Name
            from BusinessLicense where AccountId =: AccId and IsActive =True  ];
// and Status ='Verified'
            return listOfBLicense;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    Public static void UpdateBusinessLicense(
    BusinessLicense [] BusinessLicensArray, 
    string externalId,
    String Id,
    String ApplicableLicense,
    String AssignedLicense,
    List<Producer> InsuranceList
    ){
    try{
        System.debug('BUSINESSLICENSE RECEVED ' + BusinessLicensArray);
        List <BusinessLicense> AllBusinessLicense = new List<BusinessLicense>();
        AllBusinessLicense =[SELECT IsActive,EID__c FROM BusinessLicense WHERE AccountId=: Id];
        System.debug(' All Business Licenses are:::: ' + AllBusinessLicense);

            // INtialize
            map <String,BusinessLicense> AllBusLicMap = new map <String,BusinessLicense>();
            // Put data into map
            for(BusinessLicense BL: AllBusinessLicense)
            {
                BL.IsActive=false;
                AllBusLicMap.put(BL.EID__c, BL);
            }
            
        Account acc = new Account();
        acc.Id = Id;
        acc.Applicable_License__c = ApplicableLicense;
        acc.Assigned_License__c = AssignedLicense;
        for(BusinessLicense BL: BusinessLicensArray)
            {
                BL.IsActive=true;
                AllBusLicMap.put(BL.EID__c, BL);
            }
        
        
        //BusinessLicensArray.IsActive= true;
        upsert AllBusLicMap.values() EID__c;
        update acc;
        insert InsuranceList;
        //upsert BusinessLicensArray EID__c;
    }
    catch(exception e){
        System.debug('UpdateBusinessLicense error' + e);
    }
}
    @AuraEnabled
    Public static void InsertProgramApplication(
        String Name,
        String BrokerageAccount,
        String Broker,
        String Status,
        String Account,
        String [] quesArray,
        String [] ansByUser,
        String [] correctAns,
        String BusinessLicense
        // Program_Application__c obj
    ){
       
        Program_Application__c ProgramApplication = new Program_Application__c();
        ProgramApplication.Name = Name;
        ProgramApplication.Broker__c = Broker;
        ProgramApplication.Brokerage_Account__c=BrokerageAccount;
        ProgramApplication.Status__c=Status;
        ProgramApplication.Account__c=Account;
        ProgramApplication.Business_License__c = BusinessLicense;
        ProgramApplication.Submission_Date__c = Date.today();
        ProgramApplication.RecordTypeId = '012f0000000foonAAA';
        insert ProgramApplication;
        // System.debug('Program app Obj ' + obj);
        List<Applicant_Response__c> ListOfQuestions = new List<Applicant_Response__c>();
        for(integer i =0; i < quesArray.size();i++){
            Applicant_Response__c newRes = new Applicant_Response__c();
            newRes.Program_Application__c = ProgramApplication.Id;         
            newRes.Program_Question__c = quesArray[i];      
            newRes.Program_Question_Answer__c=correctAns[i];    
            newRes.Name=ansByUser[i];
            ListOfQuestions.add(newRes);
        }
        try{
            insert ListOfQuestions;
        }
        catch(exception e ){
            System.debug('InsertProgramApplication error ' + e);
        }
    }

    
    

    @AuraEnabled
    Public static void UpdateLicenseFields(
    String[] Licenses, 
    String[] Province,
    Double[] PercentageTotalIncome,
    Double[] totalAnualEarning,
    String ID,
    String ApplicableLicense,
    String AssignedLicense,
    String ProgramApplication_Name,
    String ProgramApplication_Status,
    String ProgramApplication_BrokerageAcc,
    String ProgramApplication_BrokerageCon,
    String [] Questions,
    String [] CorrectAns,
    String [] UserAns,
    String Role
    
    )
    {
        SYSTEM.debug('QUESTIONS + ANS ' );
        Account personAccount = new Account();
        Program_Application__c ProgramApplication = new Program_Application__c();
        ProgramApplication.Name = ProgramApplication_Name;
        ProgramApplication.Status__c = ProgramApplication_Status;
        ProgramApplication.Brokerage_Account__c = ProgramApplication_BrokerageAcc;
        ProgramApplication.Broker__c = ProgramApplication_BrokerageCon;
        ProgramApplication.RecordTypeId = '012f0000000foonAAA';
        ProgramApplication.Account__c = ID;
        // ProgramApplication.Submission_Date__c = DateTime.now();
        insert ProgramApplication;
        List<Applicant_Response__c> ListOfQuestions = new List<Applicant_Response__c>();

        SYSTEM.debug('LENGTH OF QUESTIONS ==== ' + Questions.size()) ;
        for(integer i =0; i < Questions.size(); i++){
            SYSTEM.debug('Questions LOOP RUNNING') ;
            Applicant_Response__c newRes = new Applicant_Response__c();
            SYSTEM.debug('Program_Application__c ===>' + ProgramApplication.Id) ;
            newRes.Program_Application__c = ProgramApplication.Id;
            SYSTEM.debug('Program_Question__c  ===>' + Questions[i]) ;
            newRes.Program_Question__c = Questions[i];
            SYSTEM.debug('Program_Question_Answer__c  ===>' + CorrectAns[i]) ;
            newRes.Program_Question_Answer__c=CorrectAns[i];
            SYSTEM.debug('Program_Question_Answer__c  ===>' + UserAns[i]) ;
            newRes.Name=UserAns[i];
            
            ListOfQuestions.add(newRes);
        }
        insert ListOfQuestions;

        personAccount.Applicable_License__c = ApplicableLicense;
        personAccount.Assigned_License__c = AssignedLicense;
        personAccount.Id = ID;
        System.debug('Size of LISTS RECIEVED:::::  '+Licenses.size());
        SYSTEM.DEBUG('Licnse ===>' + Licenses);
            System.DEBUG('PROVINCES===> '+ Province);
            SYSTEM.DEBUG('PercentageTotalIncome ===>' + PercentageTotalIncome);
            SYSTEM.DEBUG('totalAnualEarning ===>' + totalAnualEarning);
            SYSTEM.DEBUG('ID ===>' + ID);
            SYSTEM.DEBUG('Role ===>' + Role);
            
        List<BusinessLicense> ListOfUpdateLicense = new List<BusinessLicense>();
        
        SYSTEM.DEBUG('RUNNING FOR LOOP::::::::::::::');
        for(integer i=0 ; i<Licenses.size();i++){
            BusinessLicense temp = new BusinessLicense();
            temp.AccountId = ID;
            temp.Name= Licenses[i];
            temp.Percentage_Of_Total_Income__c= PercentageTotalIncome[i];
            temp.Total_Annual_Earning__c= totalAnualEarning[i];
            temp.Provincial_Jurisdiction__c = Province[i];
            temp.Role__c = Role;
            temp.RecordTypeId ='012f0000000lHalAAE';
            SYSTEM.DEBUG('temp.AccountId '+temp.AccountId );
           
            
            SYSTEM.DEBUG('temp.Name '+temp.Name );
            
            
            SYSTEM.DEBUG('temp.Percentage_Of_Total_Income__c '+temp.Percentage_Of_Total_Income__c );
            
            SYSTEM.DEBUG('temp.Total_Annual_Earning__c '+temp.Total_Annual_Earning__c );
            ListOfUpdateLicense.add(temp);

            
        }
        System.debug('LIST SIZE==> ' + ListOfUpdateLicense.size());
        for(integer i = 0; i < ListOfUpdateLicense.size(); i++){
            System.debug('LIST ====> '+ListOfUpdateLicense[i]);
        }
        insert ListOfUpdateLicense;
        update personAccount;
    } 

   


    
}