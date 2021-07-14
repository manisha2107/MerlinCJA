public with sharing class getAllExtenedReportPeriod {
    
    public static Account acc = new Account();
    
    @AuraEnabled(cacheable=true)
    public static List<OptionWrapper> getAllERP(){
        List<OptionWrapper> TypesList = new List<OptionWrapper>();       
        
        acc = PersonInformation.getAccountRecord(); 
        
        List<Extended_Report_Period__c> listofERP = [Select id, Name,
                                                     Additional_Premium__c,Extended_Report_Period__c,
                                                     Policy__c,
                                                     Extended_Reporting_Period_Category__c,
                                                     Policy__r.NameInsuredId, 
                                                     Policy__r.PremiumAmount,Policy__r.DateRenewed,
                                                     Policy__r.Status , policy__c                                                       
                                                     from Extended_Report_Period__c where 
                                                     Policy__r.NameInsuredId =: acc.id
                                                    AND Status__c = 'Activated']; 
        
        for( Extended_Report_Period__c pickListVal : listofERP){

            Decimal amount  = pickListVal.Policy__r.PremiumAmount * pickListVal.Additional_Premium__c;

            TypesList.add(new OptionWrapper(pickListVal.Policy__r.Status,pickListVal.id, amount/100 + ' (' + pickListVal.Additional_Premium__c +'% of '+ pickListVal.Policy__r.PremiumAmount + ' for ' + pickListVal.Extended_Report_Period__c + ' ' +pickListVal.Extended_Reporting_Period_Category__c + ')') );
        }
        
        If(TypesList.size() > 0){
        System.debug('List of extened report period::' + listofERP);
        return TypesList;     
       }
        
        else{
            
            return null;
        }
    } 
    
    
     
    @AuraEnabled(cacheable=true)
    public static Extended_Report_Period__c getSelectedERP(Id selectedOption){
        List<OptionWrapper> TypesList = new List<OptionWrapper>();       
        
        acc = PersonInformation.getAccountRecord();
        
        List<Extended_Report_Period__c> listofERP = [Select id, Name,Policy__r.Quote__r.Product__c,Policy__r.Broker__c,Policy__r.Brokerage__c,
                                                     Additional_Premium__c,Extended_Report_Period__c,Policy__r.ProductId,Policy__r.Quote__c,
                                                     Extended_Reporting_Period_Category__c,Policy__r.NameInsuredId,Policy__r.Commission__c, 
                                                     Policy__r.PremiumAmount,Policy__r.Status,Policy__r.DateRenewed,months_difference__c                                                           
                                                     from Extended_Report_Period__c where Id =: selectedOption]; 
        return listofERP[0];
        
    } 
    
    
    public class OptionWrapper {
        @AuraEnabled
        public String PolicyStatus {get; set;}
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public String value {get; set;}
        
        public OptionWrapper(String PolicyStatus,String value, String label) {
            this.PolicyStatus = PolicyStatus;
            this.label = label;
            this.value = value;
        }
    }
    
     @AuraEnabled
    public static string updatePolicyRecord(string policyId, id erpid){
  
    InsurancePolicy policy = new InsurancePolicy();
        
        policy = [Select name, Extended_Reporting_Period__c  from InsurancePolicy where id=: policyId];
    
        policy.Extended_Reporting_Period__c = erpid;
        policy.Status   = 'Cancelled';
        
        try{
        update policy;
        return 'Policy Updated Successfully';
        
        }
        catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        
    } 
    
    
    @AuraEnabled
    public static  AcctSeed__Billing__c getOldERPInvoice(string accountId){
  
    List<AcctSeed__Billing__c> billing = [Select Id,Name,Policy__c,AcctSeed__Customer__c,Extended_Report_Period__c
                                         From AcctSeed__Billing__c Where
                                         AcctSeed__Customer__c =: accountId 
                                         AND Extended_Report_Period__c != Null];
           
        system.debug(billing);
          
        
          if(billing.size()>0){               
          return billing[0];    
          }
          
           else{
          return null; 
       }
    
       }    
    
    
    
    
}