public without sharing class createRenewalOpportunity {

    @AuraEnabled
    public static Opportunity createERPOpp (string name,string broker, string brokerage, string accountid,string productId,string policyId, string quoteId){
        
        system.debug('entering in method');
        
        Opportunity opp = new Opportunity ();
           
        system.debug('in opp instance');
        
            opp.Name  = name;
        	opp.StageName    = 'Qualification';
        	opp.CloseDate    = date.today();
        	opp.recordTypeId = '012f0000000guBwAAI';
        	opp.Broker__c    = broker;
        	opp.Brokerage__c = brokerage;
        	opp.AccountId    = accountid;
        	opp.Product__c   = productId;
        	opp.Policy__c    = policyId;
        	opp.Master_Policy_Agreement__c     = quoteId;
        	opp.Transaction_Type__c = 'Purchase ERP';
        	
        	//opp.OwnerId = '2F0056g0000023VYD';
        
        try{
            insert opp;
            system.debug('opp inserted: ' + opp );
            
        }
        catch(Exception e){
            
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
        system.debug('return opp :' + opp);
        return opp;
        
    } 
    
    @AuraEnabled
  public static Opportunity OppWhenPaymentSuccess(OppWrapper oppObj){
        
       Opportunity opp =  getOppInstance(oppObj);
      
      if(opp != null){
      
        try{
            insert opp;
            system.debug('opportunity inserted against transaction type'+ opp.Transaction_Type__c + '=>' + opp );
            
        }
        catch(Exception e){
            
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        } 
      }
        system.debug('return opp :' + opp);
        return opp;
        
    }
    
    public static Opportunity getOppInstance(OppWrapper opportunityWrapper){
        
        Id OppRecTypeId = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get(opportunityWrapper.recordtypeDevName).getRecordTypeId();

        Opportunity opp = New Opportunity();
        
        opp.Name = opportunityWrapper.name;
        opp.StageName    = opportunityWrapper.stage;
        opp.Closedate    = date.today();
        opp.RecordTypeId = OppRecTypeId;
        opp.AccountId  = opportunityWrapper.accountid;
        opp.Type      = opportunityWrapper.type;
        opp.Policy__c = opportunityWrapper.policyId;
        opp.Product__c = opportunityWrapper.productId;
        //opp.Master_Policy_Agreement__c = opportunityWrapper.quoteId;
        opp.Broker__c = opportunityWrapper.broker;
        opp.Brokerage__c = opportunityWrapper.brokerage;
        opp.Commission__c = opportunityWrapper.commission;
        opp.Premium_Amount__c   = opportunityWrapper.amount;
        opp.Discount_Percentage__c = opportunityWrapper.discount;
        opp.Transaction_Fees__c = opportunityWrapper.policyfee;
        opp.CurrencyIsoCode = opportunityWrapper.curr;
        opp.transaction_type__c = opportunityWrapper.transactiontype;

        System.debug('Opportunity ::' + opp);
        return opp;        
    }
    
    public class OppWrapper{
        
        @AuraEnabled
        public string name {get;set;}
       	@AuraEnabled
        public string recordtypeDevName {get;set;}
        @AuraEnabled
        public string accountid {get;set;}
        @AuraEnabled
        public string type {get;set;}
        @AuraEnabled
        public string policyId {get;set;}
        @AuraEnabled
        public string productId {get;set;}
        @AuraEnabled
        public string quoteId {get;set;}
        @AuraEnabled
        public string broker {get;set;}
        @AuraEnabled
        public string brokerage {get;set;}
        @AuraEnabled
        public decimal commission {get;set;}
        @AuraEnabled
        public decimal amount {get;set;}
        @AuraEnabled
        public decimal discount {get;set;}
        @AuraEnabled
        public decimal policyfee {get;set;}
        @AuraEnabled
        public string curr {get;set;}
        @AuraEnabled
        public string stage {get;set;}
        @AuraEnabled
        public date closedate {get;set;}
        @AuraEnabled
        public string transactiontype {get;set;}
        
    }
    
    
    
       @AuraEnabled
    public static Opportunity updateOpportunity (string oppId, String stage){
        
         Opportunity OppList = [select id,StageName from Opportunity Where Id =: oppId ]; //AND Is_Firm_Insurance__c = True
           
        OppList.StageName = 'Closed Won';

            
        try{
            update OppList;
                        
        }
        catch(Exception e){
            
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
      
        return OppList;
        
    } 
    
     @AuraEnabled
    public static Opportunity updateOppAfterPaymentErr (string oppId){
        
         Opportunity OpList = [select id,StageName from Opportunity Where Id =: oppId ]; 
           
        OpList.StageName = 'Closed Lost';

            
        try{
            update OpList;
                        
        }
        catch(Exception e){
            
            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }  
      
        return OpList;
        
    } 
    
    
      @AuraEnabled
    public static String deleteOpportunity (string accountId){
        
     List<Opportunity> OpList = [select id,Policy__c,Transaction_Type__c,isClosed  from Opportunity Where AccountId =: accountId
                              AND Transaction_Type__c = 'Purchase ERP' AND isClosed != True]; 

          if(OpList.size()>0){               
          delete OpList;
          return 'Opportunity Deleted';
          }
          
          else{
              
          return null; 
              
       }
    
       }    
   
     @AuraEnabled
     public static Program_Application__c createPolicy (Program_Application__c policy){
     
         System.debug('Policy::' + policy);
         insert policy;
         
         System.debug('Policy After Creation' + policy);
         
         return policy;
     }
}