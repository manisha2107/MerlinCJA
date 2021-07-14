public without sharing class CoverageChoice {
    
    public static Account PersonAccount = new Account();
    







    


    @AuraEnabled
    public static List<Program_Question__c> getProductQuestions(String [] Ids, String Account,String Quote){

        List <Program_Question__c> ProgramQuestions =
                                                [Select Id, Question__r.Question_Description__c,ReponseField__c,
                                                Consequence__c,Error_Description__c, Product_Detail__c,Correct_Answer__c
                                                from 
                                                Program_Question__c Where Product_Detail__c IN : Ids ];
        

        System.debug('List of PD Ids::' + Ids);                                        
        System.debug('List of PQ::' +  ProgramQuestions);                                        

        Set<String> ListID = new Set<String>();
        for(Program_Question__c tempVar: ProgramQuestions){
            ListID.add(tempVar.Id);
        }

        SYstem.debug('List of PQ::' +  ListID);
        SYstem.debug('Account ID::' +  Account);
        SYstem.debug('Quote::' +  Quote);

        List <Applicant_Response__c> ApplicantResponse =
                            [Select Name,Program_Question__c from Applicant_Response__c 
                            where Program_Question__c in :ListID 
                            and Program_Application__r.Account__c =:Account
                            and Program_Application__r.Quote__c=:Quote];

        System.debug('Applicant Response:: ' + ApplicantResponse);

        
        Map<String, String> mapOfResponse =
            new Map<String, String>();

        for(Applicant_Response__c response: ApplicantResponse){
            mapOfResponse.put(response.Program_Question__c,response.Name);
        }

        for(Program_Question__c tempVar: ProgramQuestions){
            if(mapOfResponse.containsKey(tempVar.Id)){
                tempVar.ReponseField__c = mapOfResponse.get(tempVar.Id);
            }
        }
        
        return ProgramQuestions;
    }
    // @AuraEnabled
    // public static void makeFirmRider(String Name, String LicensedRep, String Provinces,String ParentID){
    //     try {
    //         Account firmRider = new Account();
    //         firmRider.RecordTypeId = '012f0000000lHC5AAM';
    //         firmRider.Name = Name;
    //         firmRider.Number_of_Licensed_Representatives__c=LicensedRep;
    //         firmRider.Provinces__c = Provinces;
    //         firmRider.ParentId = ParentID;
            
            
    //         insert firmRider;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
    @AuraEnabled
    public static LIST<InsurancePolicyCoverage> getPPDSForParentNav(String PolicyHolder, String NameInsured){
        try {
            LIST<InsurancePolicyCoverage> listOfPPD = [Select Product_Detail__c,Policy_Product_Name__c,CoverageTypeId,
            Status__c,EffectiveDate,Product__c,PremiumAmount,Policy_Limit__c,
            Aggregate__c,DeductibleAmount,Category,Quote_Product_Detail__c,EID__c,RecordTypeId 
            from InsurancePolicyCoverage where Status__c ='Draft' and InsurancePolicy.Policy_Holder__c =:PolicyHolder 
            and InsurancePolicy.NameInsuredId =:NameInsured ];
        
        
            return listOfPPD;
            
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<InsurancePolicyCoverage> makePolicy2(InsurancePolicy [] Policy,InsurancePolicyCoverage [] ppds,
                                                            String FirmRiderName,String numberOfFirms , 
                                                            String parentID, String OppId,String Midterm ,Decimal RecentPurchase){
                    //Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Firm Rider').getRecordTypeId();
                    if(Policy.size() > 1){
                        Account acc = new Account();
                        if(FirmRiderName != null){
                            acc.Name = FirmRiderName;
                        }
                        else{
                            acc.Name = 'Test Firm Rider';
                        }
                        
                        acc.RecordTypeId = '012f0000000lHC5AAM';
                        acc.OwnerId = '0056g000002jWvg';
                        // acc.ParentId = parentID;
                        acc.Number_of_Licensed_Representatives__c = numberOfFirms;
                        acc.External_Id__c = parentID + ' Firm Rider';
                        
                        upsert acc External_Id__c;
                        System.debug('Firm Rider account = '+ acc);
                        Policy[1].NameInsuredId = acc.Id;
                        System.debug('Firm Rider POLICY = '+  Policy[1]);
                    }
                    List<InsurancePolicy> updatedPolicyList = new List<InsurancePolicy>();
                    for(InsurancePolicy currPolicy : Policy){
                        currPolicy.SourceOpportunityId = OppId;
                        currPolicy.Renewal_Opportunity__c = OppId;
                        
                        updatedPolicyList.add(currPolicy);
                    }

                    Policy[0].Purchased_Premium__c = RecentPurchase;
                    System.debug('Design is ' );
                    //Add premium 

                    if(Midterm =='Mid-Term'){
                        List<InsurancePolicy> PPDPolicy = [Select ID,PremiumAmount from InsurancePolicy where ExternalId__c=:Policy[0].ExternalId__c limit 1];
                   
                        Policy[0].PremiumAmount = RecentPurchase + PPDPolicy[0].PremiumAmount;
                        
                    }

                    System.debug('Opportunity ==> ' + Policy[0].Renewal_Opportunity__c);
                    upsert updatedPolicyList ExternalId__c;
                    System.debug('updatedPolicyList ==> ' + updatedPolicyList);
                    
                    if(!ppds.isEmpty()){
                        for(InsurancePolicyCoverage ppd : ppds){
                            ppd.InsurancePolicyId= Policy[0].Id;
                        }
                        System.debug('updatedPolicyList ==> ' + ppds);
                        upsert ppds EID__c;
                        System.debug('Upsert Successfulll  ==> ' + ppds);
                        if(Policy.size() > 1){
                            InsurancePolicyCoverage firmPpd = new InsurancePolicyCoverage();
                            firmPpd.InsurancePolicyId = Policy[1].Id;
                            firmPpd.Policy_Product_Name__c= 'Firm Rider';
                            ppds.add(firmPpd);
                        }
                        
                    }
                    System.debug('ppds to return  ==> ' + ppds);
                    return ppds;
                }
    
    // @AuraEnabled
    //     Public static list<Program_Application__c> InsertProgramApplicationList(Program_Application__c [] arrayOfAplications){
    //         try{
    //             System.debug('InsertProgramApplicationList SRunning' + arrayOfAplications);
    //             upsert arrayOfAplications;
    
    //         }
    //         catch(exception e ){
    //             System.debug('InsertProgramApplicationList error' + e);
    //         }
    //         return arrayOfAplications;
    //     }
    
    @AuraEnabled
    Public static list<Applicant_Response__c> InsertProgramApplicationList(
        String [] Name,
        String Broker,
        String [] Status,
        String RecordTypeId,
        String [] ProdOpt,
        String [] ProdDetail,
        String Quote,
        String Account,
        String [] externalId,
        String [] arrayOfId,
        String [] arrayOfQuesId,
        String [] arrayOfAnsByUser,
        String [] arrayOfCorrAns
    ){
        SYSTEM.debug('InsertProgramApplicationList running');
        SYSTEM.debug('Broker ' +Broker);
        SYSTEM.debug('RecordTypeId '+RecordTypeId);
        SYSTEM.debug('ProdOpt '+ProdOpt);
        SYSTEM.debug('ProdDetail '+ProdDetail);
        SYSTEM.debug('Quote '+Quote);
        
        List<Program_Application__c> listOfProgApp_ToInsert = new list<Program_Application__c>();
        for(integer i=0; i< Name.size() ; i++){
            Program_Application__c ProgramApplication = new Program_Application__c();
            ProgramApplication.Name = Name[i];
            ProgramApplication.Broker__c = Broker;
            ProgramApplication.Product_Option__c=ProdOpt[i];
            ProgramApplication.Status__c=Status[i];
            ProgramApplication.Account__c=Account;
            ProgramApplication.External_Id__c=externalId[i];
            ProgramApplication.RecordTypeId = RecordTypeId;
            ProgramApplication.Product_Detail__c=ProdDetail[i];
            ProgramApplication.Quote__c=Quote;
            listOfProgApp_ToInsert.add(ProgramApplication);
        }
        SYSTEM.debug('PROGRAM APPLICATION LIST==> ' + listOfProgApp_ToInsert);
        
        upsert listOfProgApp_ToInsert External_Id__c;
        SYSTEM.debug('after UPSERT  ' + listOfProgApp_ToInsert);
        
        Map<String, String> tempMap = new Map<String, String>();
        for(integer i =0; i< listOfProgApp_ToInsert.size();i++){
            System.debug('PROGRAM APPLICATION NAME ' + listOfProgApp_ToInsert[i].Product_Option__c );
            
            System.debug('PROGRAM APPLICATION ID  ' + listOfProgApp_ToInsert[i].Id );
            tempMap.put(listOfProgApp_ToInsert[i].Product_Option__c,listOfProgApp_ToInsert[i].Id);
        }
        
        List<Applicant_Response__c> ListOfQuestions = new List<Applicant_Response__c>();
        for(integer i =0; i<arrayOfId.size(); i++ ){
            Applicant_Response__c newRes = new Applicant_Response__c();
            newRes.Program_Question__c =arrayOfQuesId[i];
            newRes.Program_Application__c=tempMap.get(arrayOfId[i]);
            newRes.Name=arrayOfAnsByUser[i];
            newRes.Program_Question_Answer__c=arrayOfCorrAns[i];
            System.debug('APPLICANT RESPONSE==> ' +newRes );
            ListOfQuestions.add(newRes);
            
        }
        insert(ListOfQuestions);
        return ListOfQuestions;
        
        
    }
    @AuraEnabled
    public static String makePolicy(
        String RecordTypeId,
        String PolicyName,
        String Name,
        String ProductId,
        String PolicyHolder,
        String NameInsuredId,
        String Brokerage,
        String Broker,
        Decimal Commission,
        String Quote,
        String ExId
    ){
        System.debug('POLICY RECIEVED = RecordTypeId '+RecordTypeId +' PolicyName '+PolicyName+' Name '+Name+' ProductId '+ProductId+' PolicyHolder '+PolicyHolder+' NameInsuredId '+NameInsuredId+' Commission ' +Commission+' Quote '+ Quote) ;
        
        InsurancePolicy policy = new InsurancePolicy();
        policy.RecordTypeId = RecordTypeId;
        policy.PolicyName = PolicyName;
        policy.Name = Name;
        policy.ProductId = ProductId;
        policy.Policy_Holder__c = PolicyHolder;
        policy.NameInsuredId = NameInsuredId;
        policy.Brokerage__c = Brokerage;
        policy.Broker__c = Broker;
        policy.Commission__c = Commission;
        policy.Quote__c = Quote;
        policy.Status = 'Draft'; 
        policy.ExternalId__c = ExId; 
        
        
        upsert policy ExternalId__c;
        return policy.Id;
    }
    
    @AuraEnabled
    public static List<Quote_Product_Details__c> getQPDs(string ClassSelectedLicense , String AccountId){
        try {
            List<Program_Application__c> failedQpds = [Select Product_Detail__c  from Program_Application__c  
                                                       where Product_Detail__c != null and (Status__c ='Auto-Fail'  )
                                                       and Account__c=:AccountId];

            // List<Program_Application__c> ApprovedQpds =[Select Product_Detail__c  from Program_Application__c  
            //                                            where Product_Detail__c != null and (Status__c ='Approved' )
            //                                            and Account__c=:AccountId];
            System.debug('Product_Detail__c in Coveragechoice.cls ==> ' + failedQpds);
            
            Set<String> setOfFailedQpd = new Set<String>();
            Set<String> setOfApprovedQpd = new Set<String>();
            for(Program_Application__c progApp : failedQpds){
                setOfFailedQpd.add(progApp.Product_Detail__c);
            }
            
            // for(Program_Application__c progApp : ApprovedQpds){
            //     setOfApprovedQpd.add(progApp.Product_Detail__c);
            // }

            List<InsurancePolicyCoverage> ppds = [Select Quote_Product_Detail__c,product_detail__c,Status__c from 
                                                  InsurancePolicyCoverage where (Status__c='Activated' or Status__c='Draft')
                                                   and
                                                  InsurancePolicy.NameInsured.Id =:AccountId];
                                                  
            // Set<String> setOfQpd = new Set<String>();
            Set<String> listOfApprovedPPD = new Set<String>();
            SYSTEM.debug('RESULT FROM QUERY IS is == ' +ppds);
            for(InsurancePolicyCoverage ppdId: ppds){
                if(ppdId.Status__c == 'Activated'){
                    setOfFailedQpd.add(ppdId.product_detail__c);
                }
                else{
                    listOfApprovedPPD.add(ppdId.Quote_Product_Detail__c);
                }
            }
            SYSTEM.debug('set Of Failed Qpd is == ' +setOfFailedQpd);
            List <String> firmRider = new List<String>();
            for(InsurancePolicy pol : [Select Quote_Product_Detail__c from InsurancePolicy where NameInsured.Id =:AccountId and Status ='Activated' and ExternalId__c like '%Firm Rider Certificate']){
                firmRider.add(pol.Quote_Product_Detail__c);
            }

            System.debug('ClassSelectedLicense' + ClassSelectedLicense);
            
            List<Quote_Product_Details__c> Qpds = 
                [Select 
                 Name, Category__c, Product__r.Name, ProductOption__r.Name,Product_Detail__c,Approved__c,
                 Quote_Product_Detail__c, Status__c ,Policy_Limit__c,Aggregate__c,Quote__r.Transaction_Fees__c,
                 Premium_Amount__c , Deductible_Amount__c,Type_of_QPD__c,Quote__r.Quote_Expiry_Date__c,Quote__r.Policy_Term__c,Quote__r.Quote_Term__c, 
                 Quote__r.Discount__c, Quote__r.Subjectivities__c,Quote__r.Master_Policy_Number__c,Quote__r.Opportunity__c,Quote__r.Expiration_Date__c,
                 Quote__r.Policy_Premium__c, Quote__r.Description_of_Project__c ,Quote__r.Name,Quote__r.Product__c,Quote__r.Commission__c
                 from Quote_Product_Details__c  where  
                 Quote__r.Status__c ='Activated' and Status__c='Activated' and  
                 Quote__r.RecordType.DeveloperName = 'Master_Policy' 
                 and (Business_License__r.Licenses_Type__c =: ClassSelectedLicense OR 
                      Business_License__c= null) and 
                 Product_Detail__c not in :setOfFailedQpd and Id not in :firmRider
                 and
                 Product_Detail__c != null and ProductOption__c  != null  and 
                 Quote__r.Account__c =: '00159000008Awy4AAC'
                 order by Type_of_QPD__c,Option_Number__c ];
            
            System.debug('Qpds in CoverageChoice.cls = > '  + Qpds);
            
            for(Quote_Product_Details__c CurrQPD: Qpds){
                if(listOfApprovedPPD.contains(CurrQPD.Id)){
                    CurrQPD.Approved__c = true;
                }
            }
            return Qpds;
            
            
            
        } catch (Exception e) {
            
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
    public class CustomExceptionData  {
        public String name;
        public String message;
        public Integer code;
        
        public CustomExceptionData(String name, String message, Integer code) {
            this.name = name;
            this.message = message;
            this.code = code;
        }
    }
    
    // @AuraEnabled
    // public static List<Quote_Product_Details__c> getQPDs(string ClassSelectedLicense , String AccountId){
    
    
    // }
    
    @AuraEnabled
    public static Account getFirmRider(String UserId){
        try {
            String id = UserId+' Firm Rider';

            return [select name,Number_of_Licensed_Representatives__c from Account where External_Id__c =:id limit 1];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    //Combing all methods and list of policy options
    @AuraEnabled
    public static List <Quote_Product_Details__c> getPOlst(){
        
        //Get Account Details of Running User
        PersonAccount = PersonInformation.getAccountRecord();
        
        system.debug('Person Account Details::' + PersonAccount);
        
        system.debug('Person Account Details::' + PersonAccount.HiddenAccount__c);
        
        //Get Activated Quote of Running User's Account 
        string QuoteId = getQuoteRecord(PersonAccount.HiddenAccount__c);
        
        //Get List of All Policy Options under Activated Quote
        List <Quote_Product_Details__c> POLst = getPolicyOptions(QuoteId ,PersonAccount );
        
        return POLst;
    }
    
    
    public static string getQuoteRecord(string AccountId){
        try{
            Quote2__c QuoteRecord = [Select id from Quote2__c WHERE Account__c =: AccountId AND Recordtype.Name = 'Master Policy' AND Status__c = 'Activated'   LIMIT 1];
            return QuoteRecord.Id;        
        } 
        catch (exception e) {
            system.debug('Error:' + e.getMessage());
            return null;   
        }
        
    } 
    public static List<Quote_Product_Details__c> getPolicyOptions(String QuoteId , Account PersonAccount){
        try{   
            List <Quote_Product_Details__c>  PolicyOptionslst  = [Select Id, name, Product__c, 
                                                                  Deductible_Amount__c, Aggregate__c, Policy_Limit__c,Premium_Amount__c , 
                                                                  Type_of_License_Holder__c, ProductOption__r.name From Quote_Product_Details__c 
                                                                  Where Quote__c =: QuoteId and 
                                                                  Type_of_License_Holder__c includes(:PersonAccount.Type_of_License_Holder__c)];
            
            return PolicyOptionslst;
        }
        catch (exception e){
            system.debug('Error' + e.getMessage());
            return null;
        }
    }  
    
    @AuraEnabled
    public static String createPolicy(String PSLValue, String VLValue, 
                                      String RIValue, String OBValue, 
                                      String FITValue, Decimal premium){
                                          
                                          System.debug('Quote Product Detail Values::' + PSLValue + '2: ' + VLValue
                                                       +'3: ' + RIValue + '4: ' + OBValue + '5: '+ FITValue + ' 6: ' + premium);                                        
                                          
                                          Set<Id> setOfQPDIds = new Set<Id>();
                                          
                                          if(PSLValue!=null){
                                              
                                              setOfQPDIds.add(PSLValue);
                                          }
                                          if(VLValue!=null){
                                              
                                              setOfQPDIds.add(VLValue);
                                          }
                                          if(RIValue!=null){
                                              
                                              setOfQPDIds.add(RIValue);
                                          }
                                          if(OBValue!=null){
                                              
                                              setOfQPDIds.add(OBValue);
                                          }
                                          if(FITValue!=null){
                                              
                                              setOfQPDIds.add(FITValue);
                                          }
                                          
                                          System.debug('Set of Quote Product Details::' + setOfQPDIds);
                                          
                                          try{   
                                              
                                              //Get Account Details of Running User
                                              PersonAccount = PersonInformation.getAccountRecord();
                                              
                                              system.debug('Person Account Details::' + PersonAccount);
                                              
                                              system.debug('Person Account Details::' + PersonAccount.HiddenAccount__c);
                                              
                                              
                                              Quote2__c  quote  = [Select id, Account__c,Brokerage_Account__c,Broker__c,
                                                                   Quote_Effective_Date__c, Quote_Expiry_Date__c, 
                                                                   Commission__c, CurrencyIsoCode,Master_Policy_Number__c,
                                                                   Opportunity__c,Policy_Term__c,Subjectivities__c,
                                                                   Product__r.Name
                                                                   from Quote2__c WHERE Account__c =: PersonAccount.HiddenAccount__c 
                                                                   AND Recordtype.Name = 'Master Policy'
                                                                   AND Status__c = 'Activated'   LIMIT 1];
                                              
                                              List <Quote_Product_Details__c>  QuoteProductlst  = [Select Id, name, Product__c, 
                                                                                                   Deductible_Amount__c, Aggregate__c, Policy_Limit__c, Premium_Amount__c , Category__c, 
                                                                                                   Type_of_License_Holder__c, ProductOption__r.name , CurrencyIsoCode, ProductOption__c 
                                                                                                   From Quote_Product_Details__c 
                                                                                                   Where Id IN: setOfQPDIds ];
                                              
                                              premium = 0;
                                              
                                              for( Quote_Product_Details__c qpd: QuoteProductlst){
                                                  
                                                  premium+=qpd.Premium_Amount__c;
                                              }
                                              
                                              
                                              InsurancePolicy certPolicy = new InsurancePolicy();
                                              certPolicy.name = PersonAccount.firstName + ' ' + PersonAccount.LastName + ' -' + quote.Product__r.Name;
                                              certPolicy.ProductId = quote.Product__c;
                                              certPolicy.Policy_Holder__c = quote.Account__c;
                                              certPolicy.NameInsuredId = PersonAccount.Id;
                                              certPolicy.Broker__c = quote.Broker__c;
                                              certPolicy.Brokerage__c = quote.Brokerage_Account__c;
                                              certPolicy.PremiumAmount= premium;
                                              certPolicy.Status = 'Draft';
                                              certPolicy.Billing_Contact__c = PersonAccount.PersonContactId;
                                              certPolicy.Commission__c = quote.Commission__c;
                                              certPolicy.CurrencyIsoCode = quote.CurrencyIsoCode;
                                              certPolicy.PolicyName = certPolicy.name;
                                              certPolicy.RecordTypeId = '012f0000000feEZAAY';
                                              certPolicy.Quote__c = quote.Id;
                                              certPolicy.SourceOpportunityId = quote.Opportunity__c;
                                              certPolicy.EffectiveDate = Quote.Quote_Effective_Date__c;
                                              certPolicy.ExpirationDate = quote.Quote_Expiry_Date__c;
                                              certPolicy.Category__c = 'Individual Insurance Certificate';
                                              certPolicy.Contact__c = PersonAccount.PersonContactId;
                                              
                                              insert certPolicy;
                                              
                                              System.debug('Created Insurance Certificate::' + certPolicy);
                                              
                                              
                                              List<InsurancePolicyCoverage> listOfPPDRecord =new List<InsurancePolicyCoverage>();
                                              
                                              for( Quote_Product_Details__c qpd: QuoteProductlst){
                                                  
                                                  InsurancePolicyCoverage ppdRecord =new InsurancePolicyCoverage();
                                                  ppdRecord.Category = qpd.Category__c;
                                                  ppdRecord.Parent_Product__c = qpd.ProductOption__c;
                                                  ppdRecord.Product__c= qpd.Product__c;
                                                  ppdRecord.DeductibleAmount = qpd.Deductible_Amount__c;
                                                  ppdRecord.PremiumAmount = qpd.Premium_Amount__c;
                                                  ppdRecord.Aggregate__c = qpd.Aggregate__c;
                                                  ppdRecord.Policy_Limit__c = qpd.Policy_Limit__c;
                                                  ppdRecord.InsurancePolicyId = certPolicy.Id;
                                                  ppdRecord.CurrencyIsoCode = qpd.CurrencyIsoCode;
                                                  ppdRecord.RecordTypeId ='012f0000000l9JkAAI';
                                                  ppdRecord.Quote_Product_Detail__c = qpd.Id;
                                                  
                                                  listOfPPDRecord.add(ppdRecord);
                                                  
                                              }
                                              
                                              System.debug('Related list of PPD Records::' + listOfPPDRecord);
                                              insert listOfPPDRecord;
                                              System.debug('Related list of PPD Records after creation::' + listOfPPDRecord);
                                              
                                              return 'Policy Created Successfully::' + certPolicy.Id;
                                          }
                                          catch (exception e){
                                              system.debug('Error' + e.getMessage());
                                              return e.getMessage();
                                          }
                                          
                                      }
}