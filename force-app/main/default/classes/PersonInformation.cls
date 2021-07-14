public without sharing class PersonInformation {
    
    
    public static User usr = new User();

    public PersonInformation() {

    }

    @AuraEnabled
    public static Account getAccountRecord(){

        String usrId = UserInfo.getUserId();

        if(usrId!=null){

            usr = [Select id,name,  Contact.AccountId, AccountId, ContactId from User where Id =: usrId];
        
            System.debug('User Information::' + usr);    

            if(Contact.AccountId!=null){

                Account usrAcc = [Select id,Name,PersonContactID__c, Application_Current_Stage__c,
                 Program_Audience__c,PersoncontactId , Program_Audience__r.Name ,
                HiddenAccount__r.Name, HiddenAccount__r.OwnerId , HiddenAccount__c,
                firstName, lastName, Brokerage_Account__c, Brokerage_Account__r.Name, Broker_Contact__c,
                Broker_Contact__r.Name, Applicable_License__r.Role__c,Applicable_License__r.Licenses_Type__c, Applicable_License__c,
                BillingCity, Suit__c, BillingCountry, BillingState, BillingStreet, BillingPostalCode,Phone,
                PersonEmail ,Assigned_License__c
                from Account where Id =: usr.Contact.AccountId and HiddenAccount__c!=null and Brokerage_Account__c != Null
                and Broker_Contact__c != null LIMIT 1];
        
                if(usrAcc.BillingState==null){
                    usrAcc.BillingState= '';
                }
                if(usrAcc.Suit__c==null){
                    usrAcc.Suit__c ='';
                }

                if(usrAcc.BillingPostalCode == null){
                    usrAcc.BillingPostalCode = '';
                }
                if(usrAcc.BillingCountry==null){
                    usrAcc.BillingCountry= '';
                }
                if(usrAcc.BillingCity==null){
                    usrAcc.BillingCity ='';
                }
                if(usrAcc.BillingStreet==null){
                    usrAcc.BillingStreet='';
                }
                if(usrAcc.BillingState == null){
                    usrAcc.BillingState = '';
                }

                System.debug('Account Information::' + usrAcc);    

                return usrAcc;

            }

            return null;
        }

        return null;

    }

    @AuraEnabled
    public static string saveAccountRecord(Account acc) 
    {


        System.debug(
        'Address Details::' + acc.BillingStreet + 'City:: ' + acc.BillingCity + 'State ::' + acc.BillingState + ' Postal Code:: ' +  acc.BillingPostalCode + ' Country:: ' + acc.BillingCountry
         );

        try{
    
        // Account acct = new Account();
        // acct.firstName = acc.firstName;
        // acct.lastname = acc.lastname;
        // acct.Personmailingstreet = acc.PersonmailingStreet;
        // acct.PersonMailingcity = acc.PersonMailingcity;
        // acct.PersonMailingPostalCode = acc.PersonMailingPostalcode;
        // acct.PersonMailingstate = acc.PersonMailingState;
        // acct.PersonMailingCountry = acc.PersonMailingCountry;
        // acct.PersonEmail = acc.Personemail;
        // acct.Type_of_License_Holder__c = 'Licensed Life Insurance and/or Accident and Sickness Insurance Agent (LLQP)';
        // acct.Id = acc.Id;   
        
        // System.debug('Account to be Updated::' + acct);

        update acc;
        return 'Account Updated Successfully';
        
        }
        catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

    }  

    
    
     @AuraEnabled
    public static  Account updateFirmAddress(Account acc){

    /*
        Account acc              =  New Account();
        acc.OwnerId              =  getAccountRecord().HiddenAccount__r.OwnerId;                          
        acc.ShippingStreet       =  acc.Mailingst;
        acc.ShippingCity         =  Mailingcity;
        acc.ShippingState        =  Mailingstate;
        acc.ShippingPostalCode   =  Mailingpostalcode;
        acc.Broker_Contact__c    =  Broker;
        acc.Brokerage_Account__c =  brokerage;
        acc.Firm_Owner__c        =  firmOwner;                                  
        acc.RecordTypeId         =  '0126g000000zIHSAA2';                                                                                      
        */                                    
        try{
        update acc;
        return acc;
        
        }
        catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        
    }
    
    
    
        
    @AuraEnabled
    public static  Account createFirmAccount(string accName, string Mailingst,string Mailingcity,string Mailingstate,string Mailingpostalcode,
                                            Id Broker, Id brokerage,string firmOwner){


        Account acc              =  New Account();
        acc.Name                 =  accName;
        acc.OwnerId              =  getAccountRecord().HiddenAccount__r.OwnerId;                          
        acc.ShippingStreet       =  Mailingst;
        acc.ShippingCity         =  Mailingcity;
        acc.ShippingState        =  Mailingstate;
        acc.ShippingPostalCode   =  Mailingpostalcode;
        acc.Broker_Contact__c    =  Broker;
        acc.Brokerage_Account__c =  brokerage;
        acc.Firm_Owner__c        =  firmOwner;                                  
        acc.RecordTypeId         =  '0126g000000zIHSAA2';                                                                                      
                                            
        try{
        insert acc;
        return acc;
        
        }
        catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        
    }
    
    
     @AuraEnabled
    public static  Account updateFirmAccount(string accName, string Mailingst,string Mailingcity,string Mailingstate,string Mailingpostalcode,
                                            Id Broker, Id brokerage,string personaccId){

       Account acc = [Select Id,Name,OwnerId,ShippingStreet,ShippingCity,ShippingState,ShippingPostalCode,Broker_Contact__c,
                      Brokerage_Account__c,RecordTypeId
                      From Account Where firm_owner__c =: personaccId];

        acc.Name                 =  accName;
        acc.OwnerId              =  getAccountRecord().HiddenAccount__r.OwnerId;                          
        acc.ShippingStreet       =  Mailingst;
        acc.ShippingCity         =  Mailingcity;
        acc.ShippingState        =  Mailingstate;
        acc.ShippingPostalCode   =  Mailingpostalcode;
        acc.Broker_Contact__c    =  Broker;
        acc.Brokerage_Account__c =  brokerage;
        acc.RecordTypeId         =  '0126g000000zIHSAA2';                                                                                      
                                            
        try{
        update acc;
        return acc;
        
        }
        catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        
    }

    
    @AuraEnabled
    public static  string cancelPolicy(string nameinsured, string personcontactid){
          
       List<InsurancePolicy> policy = [Select name,Status, Extended_Reporting_Period__c from InsurancePolicy
                                      where NameInsuredId=: nameinsured OR Contact__c =: personcontactid];
       
        List<InsurancePolicy> PolicytoUpdate = New List <InsurancePolicy>();            
        
        for (InsurancePolicy insurance : policy){
            
            insurance.Status = 'Send Cancellation Notice';
            PolicytoUpdate.add(insurance);
            
        }
        
        try {
            update PolicytoUpdate;
            return 'Both Insurance Certificates have been marked as Requested Cancellation';

        }
       
       catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        
    } 
    
    
    @AuraEnabled
    public static  string cancelFirmPolicy(string accID, string contactID,integer cancellationAmount){
          
       List<InsurancePolicy> Firmpolicy = [Select name,Status,CancellationDate,Category__c, Id,EffectiveDate,PremiumAmount,ExpirationDate from InsurancePolicy where NameInsuredId !=: accID
                                      AND Contact__c =: contactID  AND Category__c   =  'Firm Rider Insurance Certificate'];
        
            Firmpolicy[0].Status               = 'Requested Cancellation';
            Firmpolicy[0].CancellationDate = date.today();
        	Firmpolicy[0].Cancellation_Amount__c = cancellationAmount;
        
        
        try {
            update Firmpolicy;
            return 'Firm policy Cancelled';

        }
       
       catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        
    } 
    
    
     @AuraEnabled
    public static  string recallFirmCancellation(string accID, string contactID){
         
        List<Id> lstids= new List<Id>();
 
       List<InsurancePolicy> Firmpolicy = [Select name,Owner.Email,Status,Contact__c,Contact__r.Email,Cancellation_Amount__c,Category__c, Id,EffectiveDate,PremiumAmount,ExpirationDate from InsurancePolicy 
                                      Where NameInsuredId !=: accID
                                      AND Contact__c =: contactID
                                      AND Category__c   =  'Firm Rider Insurance Certificate' LIMIT 1];
        
            Firmpolicy[0].Status                 = 'Active';
            Firmpolicy[0].Cancellation_Amount__c = 0; 
            Firmpolicy[0].CancellationDate       = null;
            

        
            string recipient = firmpolicy[0].Contact__r.Email;
            string ownerEmail = firmpolicy[0].Owner.Email;
        
          /*
        for(InsurancePolicy ins : Firmpolicy ){
            
           lstids.add(ins.Contact__c);
        }
        
      
         EmailTemplate et=[Select id from EmailTemplate where name = 'EmailTemplatename' limit 1];
 
                Messaging.MassEmailMessage mail = new Messaging.MassEmailMessage();
                mail.setTargetObjectIds(lstids);
                mail.setSenderDisplayName('System Admin');
                mail.setTemplateId(et.id);
                 Messaging.sendEmail(new Messaging.MassEmailMessage[] { mail });

        */
        
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toAddresses = new String[] {recipient};
        message.ccaddresses = new String[] {ownerEmail};
        message.optOutPolicy = 'FILTER';
        message.subject = 'Cancellation Recalled - Firm Policy';
        message.plainTextBody = 'This is the message body.';
        Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {message};
            Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
        if (results[0].success) 
        {
            System.debug('The email was sent successfully.');
        } else 
        {
            System.debug('The email failed to send: ' + results[0].errors[0].message);
        }
        
        
        try {
            update Firmpolicy[0];
            system.debug('date' + Firmpolicy[0]);

            return 'Cancellation Request Recalled';

        }
       
       catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
    }
    
     @AuraEnabled
    public static  string recallBothCancellation(string accID, string contactID){
         
        List<Id> lstids= new List<Id>();
 
       List<InsurancePolicy> Firmpolicy = [Select name,Owner.Email,Status,Contact__c,Contact__r.Email,Cancellation_Amount__c,Category__c, Id,EffectiveDate,PremiumAmount,ExpirationDate from InsurancePolicy 
                                      Where (NameInsuredId =: accID OR Contact__c =: contactID)
                                      AND 	(Status = 'Requested Cancellation')];
        
        List<InsurancePolicy> PoliciestoUpdate = New List <InsurancePolicy>();
        
        for (InsurancePolicy Policies : Firmpolicy ){
            
            Policies.Status                 = 'Active';
            Policies.Cancellation_Amount__c = 0; 
            Policies.CancellationDate       = null;
            PoliciestoUpdate.add(Policies);
        }

            string recipient = getAccountRecord().PersonEmail;
            string ownerEmail = Firmpolicy[0].Owner.Email;
        
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toAddresses = new String[] {recipient};
        message.ccaddresses = new String[] {ownerEmail};
        message.optOutPolicy = 'FILTER';
        message.subject = 'Cancellation Recalled for Both Policies';
        message.plainTextBody = 'Both Policies have been cancelled successfully' ;
        Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {message};
            Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
        if (results[0].success) 
        {
            System.debug('The email was sent successfully.');
        } else 
        {
            System.debug('The email failed to send: ' + results[0].errors[0].message);
        }
        
        
        try {
            update PoliciestoUpdate;

            return 'Cancellation Request Recalled' + PoliciestoUpdate;

        }
       
       catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
    }
    
    
    
    @AuraEnabled
    public static InsurancePolicy getPolicy() {
        
       List<InsurancePolicy> policy = [Select name,Status, Id,EffectiveDate,PremiumAmount,
                                       ExpirationDate,Quote__c,Quote__r.Expiration_Date__c,
                                       Quote__r.Quote_Type__c,
                                       SourceOpportunityId,Policy_Holder__c,
                                       Policy_Holder__r.Name,Broker__c,
                                       Brokerage__c  from
                                       InsurancePolicy where NameInsuredId=: getAccountRecord().Id];
        
   try 	{
            return policy[0];

        }
       
       catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        } 
        
    }

   @AuraEnabled 
   public static InsurancePolicy getBusinessAccountPolicy() {
        
       List<InsurancePolicy> businessPolicy = [Select name,Status, Id,months_difference__c,EffectiveDate,PremiumAmount,ExpirationDate  from
                                         InsurancePolicy where Contact__c=: getAccountRecord().PersonContactID__c AND NameInsuredId !=: getAccountRecord().Id];
        
   try {
            return businessPolicy[0];

        }
       
       catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        } 
        
    }
    
    
    @AuraEnabled
    public static Policy_Wording_and_Endorsements__c getEndorsement (string quoteId, string province){
        
        string provinceForSOQL = '';
        set<string> setOfSpecificStates = new set<string>();
        string SpecificStates = Label.SpecificStates;
        Policy_Wording_and_Endorsements__c Endorsements = new Policy_Wording_and_Endorsements__c();
        
        if(SpecificStates.contains(','))
        {
            list<string> tempListOfSpecStates = SpecificStates.split(',');
            setOfSpecificStates.addAll(tempListOfSpecStates);
        }
        else
        {
            setOfSpecificStates.add(SpecificStates);
        }
    
        if(province != null && !string.isBlank(province) && setOfSpecificStates.contains(province))
        {
            provinceForSOQL+= ' Province__c   =: province limit 1';
        }
        else
        {
            provinceForSOQL+= ' Province__c   NOT IN : setOfSpecificStates limit 1';
        }
                
        string query = 'Select Id,Name,Province__c,Quote_Expiry_Date_Today_in_Months__c,Premium_Per_Month__c from Policy_Wording_and_Endorsements__c Where Firm_Rider__c = True AND Category__c   = \'Endorsement\' AND Quote__c =: quoteId AND';
        
        query += provinceForSOQL;
        
    system.debug('query =' + query);
        
        list<Policy_Wording_and_Endorsements__c> listOfEndors = database.query(query);
        
        if(listOfEndors.size() > 0)
            Endorsements = listOfEndors[0];
        
        system.debug('Endoresement Record ==>' +  Endorsements);
        return Endorsements;
        
        }
     /*  
    @AuraEnabled
    public static InsurancePolicy createFirmInsurance(string policyName,string quoteType,string insuredAccount,string policyHolder,string broker,string brokerage, string contactId, string quoteId,string opportunityId, decimal premium,datetime expiryDate){
        
        InsurancePolicy FirmPolicy               =  New InsurancePolicy();
     
          FirmPolicy.Status = 'Pending Payment';
          FirmPolicy.PolicyType  = quoteType;
          FirmPolicy.Contact__c = contactId;
          FirmPolicy.NameInsuredId = insuredAccount;
          FirmPolicy.Name   = policyName;
          FirmPolicy.Master_Policy_Number__c = policyName;
          FirmPolicy.Quote__c = quoteId;
          FirmPolicy.SourceOpportunityId = opportunityId;
          FirmPolicy.PremiumAmount = premium;
    //    FirmPolicy.EffectiveDate = effectiveDate;
          FirmPolicy.Broker__c = broker;
          FirmPolicy.Brokerage__c = brokerage;
          FirmPolicy.Policy_Holder__c = policyHolder;
          FirmPolicy.RecordTypeId = '012f0000000feEZAAY';
          FirmPolicy.ExpirationDate = expiryDate;
          
        try{
        insert FirmPolicy;
        return FirmPolicy;
        
        }
        catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        
        
        
        
    }
    
   */
    
       @AuraEnabled    
       public static Account GetFirmAccount (string personaccId){
        
        List<Account> firmAccount = [Select Id,Name,ShippingStreet,ShippingState,ShippingCity,ShippingCountry,ShippingPostalCode,Broker_Contact__c,Brokerage_Account__c
                                     From Account Where firm_owner__c =: personaccId];
           
        system.debug(firmAccount);
          
        
          if(firmAccount.size()>0){               
          return firmAccount[0];    
          }
          
           else{
          return null; 
       }
    
       }
    
       @AuraEnabled    
       public static InsurancePolicy GetFirmPolicy (string personaConId, string personAccountId){
        
        List<InsurancePolicy> firmPolicy = [Select Id,Name,Status,PolicyType,Contact__c,NameInsuredId,Master_Policy_Number__c,Quote__c,SourceOpportunityId,
                                            PremiumAmount,Broker__c,Brokerage__c,Policy_Holder__c,RecordTypeId,ExpirationDate
                                            From InsurancePolicy Where Contact__c =: personaconId AND Is_Firm_Insurance__c = True AND NameInsuredId !=: personAccountId];
           
        system.debug(firmPolicy);
        
          if(firmPolicy.size()>0){               
          return firmPolicy[0];    
          }
          
           else{
          return null; 
       }
    
       }
    
     @AuraEnabled (cacheable=true)
    public static List<Account> getBrokerageAccounts(){
        
        List <Account> accList = [SELECT Id, Name,website FROM Account WHERE RecordType.DeveloperName = 'Brokerage'];     
        system.debug (accList);
        
        return accList;
      //  return [SELECT Id, Name FROM Contact WHERE RecordType.DeveloperName = 'Brokerage'];        
    }
    
    @AuraEnabled
    public static List<InsurancePolicyCoverage> getPPDList(string policyId){
        
        List<InsurancePolicyCoverage> PPDList = [Select ID,Status__c,ExpirationDate from InsurancePolicyCoverage
                                                where InsurancePolicyId =: policyId];
        
        return PPDList;
    }
	
    @AuraEnabled
    public static List<Contact> contactList(string AccountId){
        
        System.debug('AccountID::' + AccountId);
    
        List<Contact> ListofContacts = [SELECT Id, FirstName, LastName FROM Contact WHERE AccountId =: AccountId ];       
        return ListofContacts;
    }
    
    
    
    
    
    
    
    
}