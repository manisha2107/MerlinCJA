global class  refundPolicyPayment {
    
    @InvocableMethod(label='Refund Process' description='Refund Process against Policy Cancellation')
    global static void  refundInsurancePolicyCharge(List<Id> policyIds){
        
        set<Id> SetPolicyIds = new Set<id>();
        for(Id pId: policyIds){
            SetPolicyIds.add(pId);
            
        }
        
        RefundInvoices(SetPolicyIds);
    }
    
    @future(callout=true)
    public static void RefundInvoices(Set<Id> policyIds){
        
        string DataToReturn;
        
        //   List<InsurancePolicy> PolicyList = [Select Id, Name, Brokerage__c, Opportunity__c from InsurancePolicy];
        
        // Set<Id> PolicyIds = New Set <Id>();
        Set<Id>SetofBrokerageIds = New Set<Id>();
        map<Id,AcctSeed__Billing__c>      BillingToInsert     = New Map<Id,AcctSeed__Billing__c>();
        map<Id,Opportunity>               OpportunityToInsert = New Map<Id,Opportunity>();
        map<Id,AcctSeed__Cash_Receipt__c> CashReceiptToInsert = New Map<Id,AcctSeed__Cash_Receipt__c>();
        map<Id,AcctSeed__Billing_Line__c> BillingLineToInsert = New Map<Id,AcctSeed__Billing_Line__c>();
        map<Id,AcctSeed__Billing_Cash_Receipt__c> BillingCashReceiptToInsert = New Map<Id,AcctSeed__Billing_Cash_Receipt__c>();
        map<Id,String> StripeAPIMap = New map  <Id,String>();

        
        List<AcctSeed__Billing_Cash_Receipt__c> BCashReceipt = [Select Id,
                                                                AcctSeed__Billing__r.Policy__r.Name_Insured_Account_Id__c,
                                                                AcctSeed__Billing__r.Policy__r.NameInsuredId,
                                                                AcctSeed__Billing__c,
                                                                AcctSeed__Billing__r.Policy__c,
                                                                AcctSeed__Billing__r.Policy__r.Brokerage__c,
                                                                AcctSeed__Billing__r.Is_Master_Policy__c,
                                                                AcctSeed__Billing__r.Policy__r.Cancellation_Amount__c,
                                                                AcctSeed__Billing__r.CurrencyIsoCode,
                                                                AcctSeed__Billing__r.Currency__c,
                                                                AcctSeed__Billing__r.AcctSeed__Accounting_Period__c,
                                                                AcctSeed__Cash_Receipt__r.AcctSeed__Amount__c,
                                                                AcctSeed__Cash_Receipt__r.Name,
                                                                AcctSeed__Cash_Receipt__r.AcctSeed__Payment_Reference__c
                                                                
                                                                from  AcctSeed__Billing_Cash_Receipt__c
                                                                where AcctSeed__Billing__r.Is_Master_Policy__c = True
                                                                AND   AcctSeed__Billing__r.Policy__c =: PolicyIds];
        
        
        map<Id,AcctSeed__Billing_Cash_Receipt__c> bcrMap = New Map <Id,AcctSeed__Billing_Cash_Receipt__c>();    
        
        for (AcctSeed__Billing_Cash_Receipt__c bcr : BCashReceipt){
            
            bcrMap.put(bcr.AcctSeed__Billing__r.Policy__c,bcr);
            SetofBrokerageIds.add(bcr.AcctSeed__Billing__r.Policy__r.Brokerage__c);
            
        }
        
        
        for (Id pId : PolicyIds) {
            
            // Billing//
            AcctSeed__Billing__c inv = New AcctSeed__Billing__c();
            
            inv.AcctSeed__Customer__c         = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.NameInsuredId;
            inv.Policy__c                     = bcrMap.get(pId).AcctSeed__Billing__r.Policy__c;
            inv.AcctSeed__Billing_Comment__c  = 'Refund Invoice';
            inv.AcctSeed__Status__c           = 'Draft';
            inv.AcctSeed__Date__c             = date.today();
            inv.CurrencyIsoCode        		  = bcrMap.get(pId).AcctSeed__Billing__r.Currency__c;
            //inv.Billing_Contact_Email__c    = accEmail;  
            //inv.Invoice_Amount__c           = invamount;
            BillingToInsert.put(pId,inv);
            
            // Billing Line//
            AcctSeed__Billing_Line__c billingLine = New AcctSeed__Billing_Line__c();  
            
            // billingLine.AcctSeed__Billing__c = invoice.Id;
            billingLine.AcctSeed__Rate__c        = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.Cancellation_Amount__c * -1;
            billingLine.AcctSeed__Hours_Units__c = 1;
            billingLine.AcctSeed__Comment__c     = 'Refunding Amount Line Item against Cancellation';
            billingLine.AcctSeed__Date__c        = date.today();
            
            BillingLineToInsert.put(pId,billingLine);
            
            // Cash Receipt//
            AcctSeed__Cash_Receipt__c CashReceipt = New AcctSeed__Cash_Receipt__c();
            
            CashReceipt.AcctSeed__Amount__c          = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.Cancellation_Amount__c ;
            CashReceipt.AcctSeed__Account__c         = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.NameInsuredId; 
            CashReceipt.AcctSeed__Receipt_Date__c    = date.today();
            CashReceipt.AcctSeed__Purpose__c         = 'Customer Receipt';
            CashReceipt.AcctSeed__Accounting_Period__c = bcrMap.get(pId).AcctSeed__Billing__r.AcctSeed__Accounting_Period__c;            
            //CashReceipt.Billing_Contact_Email__c    = invoice.AcctSeed__Customer__r.PersonEmail;
            CashReceipt.Billing_Account__c           = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.NameInsuredId;
            
            CashReceiptToInsert.put(pId,CashReceipt);
            
            // Opportunity //
            
            Opportunity opp = New Opportunity();
            
            opp.Name = 'Cancellation Opportunity';
            opp.AccountId = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.NameInsuredId;
            opp.StageName = 'Qualification';
            opp.CloseDate = date.today();
            opp.Policy__c     = pId;
            opp.Amount    = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.Cancellation_Amount__c;
            
            OpportunityToInsert.put(pId,opp);
            
            AcctSeed__Billing_Cash_Receipt__c BillingCashReceipts = new AcctSeed__Billing_Cash_Receipt__c ();
            BillingCashReceipts.AcctSeed__Applied_Amount__c       = bcrMap.get(pId).AcctSeed__Billing__r.Policy__r.Cancellation_Amount__c;
            BillingCashReceipts.AcctSeed__Accounting_Period__c    = bcrMap.get(pId).AcctSeed__Billing__r.AcctSeed__Accounting_Period__c;  
            //BillingCashReceipt.AcctSeed__Cash_Receipt__c      = CashReceipt.Id;
            //BillingCashReceipt.AcctSeed__Billing__c             = invoice.Id;
            BillingCashReceiptToInsert.put(pId,BillingCashReceipts);
        }
        
         /*
        try {
            insert BillingToInsert.values();
        }
        
        catch (Exception e){
            
            system.debug('exception==> ' + e);
        }
        
        try {
            insert OpportunityToInsert.values();
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }
        
        try {
            insert CashReceiptToInsert.values();
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }
        
        */
        
        /*
        for(Id PolicyId: BillingToInsert.keySet()){
            
            if(BillingToInsert.get(PolicyId).Id !=null & OpportunityToInsert.get(PolicyId).Id !=null){
                
                // Field Mapping of Billing Id
                AcctSeed__Billing_Line__c  Bline = BillingLineToInsert.get(PolicyId);
                Bline.AcctSeed__Billing__c = BillingToInsert.get(PolicyId).Id;
                Bline.Opportunity__c       = OpportunityToInsert.get(PolicyId).Id;
                
                BillingLineToInsert.put(PolicyId,Bline);
                
            }
            
            
            if(BillingToInsert.get(policyId).Id !=null & CashReceiptToInsert.get(policyId).Id !=null){
                
                // Field Mapping of Billing Cash Receipt
                AcctSeed__Billing_Cash_Receipt__c BillingCashReceipt = BillingCashReceiptToInsert.get(PolicyId);
                BillingCashReceipt.AcctSeed__Cash_Receipt__c     = CashReceiptToInsert.get(PolicyId).Id;
                BillingCashReceipt.AcctSeed__Billing__c              = BillingToInsert.get(PolicyId).Id;
                
                BillingCashReceiptToInsert.put(PolicyId,BillingCashReceipt);
                
            }
            
        }

		*/
        
       /* 
        try {
            insert BillingLineToInsert.values();
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }
        
        try {    
            insert BillingCashReceiptToInsert.values();
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }        
        
        */
        
        Payment_Metadata_Type__mdt[] metadatRecords = [select MasterLabel, DeveloperName, Value__c,Brokerage_Account_Id__c
                                                       from Payment_Metadata_Type__mdt where Brokerage_Account_Id__c IN: SetofBrokerageIds];
        
        
        for (Payment_Metadata_Type__mdt MetadataMapping : metadatRecords) {
            
            StripeAPIMap.put(MetadataMapping.Brokerage_Account_Id__c,MetadataMapping.Value__c);
        }
        
        
        for(Id InsurancePolicyId : PolicyIds){
            
            Stripe request = new Stripe(StripeAPIMap.get(bcrMap.get(InsurancePolicyId).AcctSeed__Billing__r.Policy__r.Brokerage__c));    
            
            system.debug('api key  ' + StripeAPIMap.get(bcrMap.get(InsurancePolicyId).AcctSeed__Billing__r.Policy__r.Brokerage__c));
            
            string chargeId     = bcrMap.get(InsurancePolicyId).AcctSeed__Cash_Receipt__r.AcctSeed__Payment_Reference__c;
            string  amount      = string.valueof(bcrMap.get(InsurancePolicyId).AcctSeed__Billing__r.Policy__r.Cancellation_Amount__c);
            string  currencyval = 'CAD'; //bcrMap.get(InsurancePolicyId).AcctSeed__Billing__r.Currency__c;
        //    string  receipt     = 'Policy Cancellation refund against receipt # ' + bcrMap.get(InsurancePolicyId).AcctSeed__Cash_Receipt__r.Name;
        //    string  reason      = 'Cancellation reason';
            
            decimal centsAmount = decimal.valueOf(amount)*100;
            integer intcentsAmount = integer.valueOf(centsAmount);
            string strcentsAmount = string.valueOf(intcentsAmount);
            system.debug('centsAmount='+centsAmount);
            system.debug('strcentsAmount='+strcentsAmount);
            system.debug('amount='+amount);    
            
            StripeResponseModel response = request.refundCharge(chargeId,strcentsAmount);//,currencyval);//,receipt,reason);
            
            
            if(!response.isError){
                system.debug('Refund Status :: ' + response.status);
                system.debug('Transaction ID :: ' + response.id);
                system.debug('Transaction Fee :: ' + response.fee);
              //  string btID = response.balanceTransaction;
              //  btID = btID.replaceAll('"', '');
            //    StripeResponseModel response2 = request.retreiveBalanceTransactions(btID);
              //  system.debug('#response2='+response2);
             //   system.debug('#response2='+response2.stripefee);
                
                DataToReturn = 'SUCCESS';
                system.debug('SUCESSSSSS!!!');
                //      if(!response2.isError && !test.isRunningTest()){
                //       decimal stripeFee = decimal.valueOf(response2.stripefee)/100;
                //ptn.Stripe_Fee__c = stripeFee;
                
            }
            
            else{
                system.debug('Error Message :: ' + response.errorResponse.message);
                DataToReturn = response.errorResponse.message;
                throw new AuraHandledException(response.errorResponse.message);
            }
            
            //  return DataToReturn;
            
        }
        
		try {
            insert BillingToInsert.values();
            system.debug(BillingToInsert.values());
        }
        
        catch (Exception e){
            
            system.debug('exception (error in creating billing) ==> ' + e);
        }
        
        try {
            insert OpportunityToInsert.values();
            system.debug(OpportunityToInsert.values());
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }
        
        try {
            insert CashReceiptToInsert.values();
            system.debug(CashReceiptToInsert.values());
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }
        
        
        
        
        for(Id PolicyId: BillingToInsert.keySet()){
            
            if(BillingToInsert.get(PolicyId).Id !=null & OpportunityToInsert.get(PolicyId).Id !=null){
                
                // Field Mapping of Billing Id
                AcctSeed__Billing_Line__c  Bline = BillingLineToInsert.get(PolicyId);
                Bline.AcctSeed__Billing__c = BillingToInsert.get(PolicyId).Id;
                Bline.Opportunity__c       = OpportunityToInsert.get(PolicyId).Id;
                
                system.debug('b Lineeeeeeeeeeee' + Bline);
                
                BillingLineToInsert.put(PolicyId,Bline);
                
            }
            
            
            if(BillingToInsert.get(policyId).Id !=null & CashReceiptToInsert.get(policyId).Id !=null){
                
                // Field Mapping of Billing Cash Receipt
                AcctSeed__Billing_Cash_Receipt__c BillingCashReceipt = BillingCashReceiptToInsert.get(PolicyId);
                BillingCashReceipt.AcctSeed__Cash_Receipt__c     = CashReceiptToInsert.get(PolicyId).Id;
                BillingCashReceipt.AcctSeed__Billing__c              = BillingToInsert.get(PolicyId).Id;
                
                BillingCashReceiptToInsert.put(PolicyId,BillingCashReceipt);
                
            }
            
        }

        try {
            insert BillingLineToInsert.values();
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }
        
        try {    
            insert BillingCashReceiptToInsert.values();
        }
        
        catch (Exception e){
            system.debug('exception==> ' + e);
        }        
        
               
    }        
    
    public class policyWrapper  {
        @InvocableVariable
        public String policyId;
        
        @InvocableVariable
        public String policyNameInsured;
        
        @InvocableVariable
        public String opportunityId;    
        
    }
    
   /* global static createBillngObject(Set<Id> PolicyIds){
        
    }*/
    
    
}