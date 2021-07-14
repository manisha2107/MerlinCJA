global class refundFromBrokerAccount {
    
    @InvocableMethod(label='Refund Process - Firm Policy Cancellation' description='Refund Process against Firm Policy Cancellation')
    global static void  refundInsurancePolicyCharge(List<InsurancePolicy> policyIds){
        
        set<Id> SetPolicyIds = new Set<id>(); //Set of Policy Ids to Be Cancelled
        Set<Id> MasterPolicyInvoicesSet = New Set<Id>(); //Set of Master Invoice Ids created at the First Time
        Set<Id> SetCancellationInvId = New Set<Id>(); //Set of Cancelled Invoice Ids whos Transaction is not Succesful
        
        //Loop to get the above SETS filled
        for(InsurancePolicy policy: policyIds){
            
            SetPolicyIds.add(policy.Id);
            MasterPolicyInvoicesSet.add(policy.Master_Invoice__c);
            SetCancellationInvId.add(policy.Cancellation_Invoice__c);      
        }
        
        system.debug('Master Policy Invoice Set ==> ' +   MasterPolicyInvoicesSet);
        
    
        //Pass Policies to be cancelled list and their associated Master Invoice and Cancellation Invoice (may have already created)            
        RefundInvoices(SetPolicyIds,MasterPolicyInvoicesSet,SetCancellationInvId);
        
    }
    
    @future(callout=true)
    public static void RefundInvoices(Set<Id> policyIds,Set<Id> MasterPolicyInvoicesSet,Set<Id> SetCancellationInvId){
        
        string DataToReturn;
        
        //Initialize maps
        Set<Id>SetofBrokerageIds = New Set<Id>();
        map<Id,InsurancePolicy>      	   policyMap        	= New Map<Id,InsurancePolicy>();
        map<Id,Invoice__c>      	   	InvoiceToInsert        	= New Map<Id,Invoice__c>();
        map<Id,Opportunity>            	OpportunityToInsert    	= New Map<Id,Opportunity>();
        map<Id,Payment_Transaction__c> 	PaymentReceiptToInsert 	= New Map<Id,Payment_Transaction__c>();
        map<Id,Invoice_Line_Items__c>  	InvLineToInsert    		= New Map<Id,Invoice_Line_Items__c>();
        map<Id,Invoice_Line_Items__c>  	InvLineAlreadyInserted    		= New Map<Id,Invoice_Line_Items__c>();
        map<Id,Opportunity>   		   	mapToAllowOpptoCreate   = New Map<Id,Opportunity>();
        map<String,Decimal>   		  	mapofTax    			= New Map<String,Decimal>();        
        List<InsurancePolicy> policyList = New List<InsurancePolicy>();
        
        boolean associateOppWtransaction; //True when stripe refund is successful so opp created and attached with LineItem
        
        map<Id,String> StripeAPIMap = New map  <Id,String>(); //To get Stripe key from Custom Meta Data by providing Brokerage Id
        
        //Payment Receipts of Master Invoice 
        List<Payment_Transaction__c> paymentReceipt = [Select Id,                                                    
                                                       Invoice__r.Policy__r.NameInsured.Id,
                                                       Invoice__r.Policy__r.NameInsured.Billingstate,
                                                       Invoice__c,
                                                       Invoice__r.Policy__r.Broker__c,
                                                       Invoice__r.Policy__r.PremiumAmount,
                                                       Invoice__r.Policy__r.ProductId,
                                                       Invoice__r.Policy__r.Commission__c,
                                                       Invoice__r.Policy__c,
                                                       Invoice__r.Policy__r.CancellationDate,
                                                       Invoice__r.Policy__r.Brokerage__c,
                                                       Invoice__r.Policy__r.Cancellation_Amount__c,
                                                       Invoice__r.CurrencyIsoCode,
                                                       Invoice__r.Currency__c,
                                                       Invoice__r.Policy__r.Status,
                                                       Status__c,
                                                       Invoice__r.Policy__r.Cancellation_Invoice__c,
                                                       Invoice__r.Policy__r.Name,
                                                       Invoice__r.Policy__r.Master_Invoice__c,
                                                       Payment_Transaction__c.Amount_Paid__c,
                                                       Payment_Transaction__c.Name,
                                                       Payment_Transaction__c.Reference_Number__c
                                                       from  Payment_Transaction__c
                                                       Where   Invoice__r.Policy__c IN: PolicyIds
                                                       AND Status__c = 'Successful'
                                                       AND Invoice__c IN: MasterPolicyInvoicesSet
                                                      ];
        
        List<Invoice_Line_Items__c> InvLineList = [Select Id,Invoice__c,Invoice__r.Policy__r.Cancellation_Invoice__c
                                                   from Invoice_Line_Items__c Where Invoice__c IN: SetCancellationInvId ]; 
        
        
        for(Invoice_Line_Items__c lines : InvLineList){
            
            InvLineAlreadyInserted.put(lines.invoice__c,lines);//Give Cancellation Invoice Id as Key and LineItem Records as Values
            
        }
        
        system.debug('masster policy payment receipt details ==>' + paymentReceipt);
        map<Id,Payment_Transaction__c> paymentReceiptMap = New Map <Id,Payment_Transaction__c>();    
        
        for (Payment_Transaction__c ptrans : paymentReceipt){
            
            system.debug('ptrans ==>' + ptrans);
            paymentReceiptMap.put(ptrans.Invoice__r.Policy__c,ptrans);
            
            InsurancePolicy insPolicy = New InsurancePolicy();
            insPolicy.Id = ptrans.Invoice__r.Policy__c;
            insPolicy.Status = ptrans.Invoice__r.Policy__r.Status;
            insPolicy.CancellationDate = ptrans.Invoice__r.Policy__r.CancellationDate;
            insPolicy.Cancellation_Invoice__c = ptrans.Invoice__r.Policy__r.Cancellation_Invoice__c;
            insPolicy.Master_Invoice__c  = ptrans.Invoice__r.Policy__r.Master_Invoice__c;
            
            
            policyMap.put(ptrans.Invoice__r.Policy__c,insPolicy);
            system.debug('policyMap ==>' + policyMap);
            
            SetofBrokerageIds.add(ptrans.Invoice__r.Policy__r.Brokerage__c);
            
            system.debug('Brokerage Ids ==>' + SetofBrokerageIds);
            
        }
        
        for (Id pId : PolicyIds) {
            
            // Invoice //
            Invoice__c inv = New Invoice__c();
            
            inv.Account__c        			  = paymentReceiptMap.get(pId).Invoice__r.Policy__r.NameInsuredId;
            inv.Policy__c                     = paymentReceiptMap.get(pId).Invoice__r.Policy__c;
            inv.Internal_Notes__c 			  = 'Refund Invoice';
            inv.Status__c           		  = 'Draft';
            inv.Invoice_Date__c               = date.today();
            inv.Currency__c        		  	  = paymentReceiptMap.get(pId).Invoice__r.Currency__c;
            
            Invoice_Line_Items__c invLine = New Invoice_Line_Items__c();  
            
            invLine.Rate__c        = paymentReceiptMap.get(pId).Invoice__r.Policy__r.Cancellation_Amount__c * -1;
            invLine.Quantity__c = 1;
            invLine.Comment__c     = 'Refunding Amount Line Item against Cancellation';            
            
            If(policyMap.get(pId).Cancellation_Invoice__c != Null ){
                
                system.debug('does inv.Id exist' + policyMap.get(pId).Cancellation_Invoice__c);
                inv.Id = policyMap.get(pId).Cancellation_Invoice__c;
                
                system.debug('does Inv Line Already Inserted' + InvLineAlreadyInserted.get(inv.Id));
                If(InvLineAlreadyInserted.get(inv.Id) != Null){
                    
                    invLine.id =  InvLineAlreadyInserted.get(Inv.Id).Id;
                }   
            }
            InvoiceToInsert.put(pId,inv);
            InvLineToInsert.put(pId,invLine);
            system.debug('invLine id exists? ==>' + InvLineToInsert.get(pId));
            system.debug('invLine id exists? ==>' + InvLineToInsert.get(pId).Invoice__c);
            
            // Cash Receipt//
            Payment_Transaction__c paymentRec = New Payment_Transaction__c();
            
            paymentRec.Amount_Paid__c    = paymentReceiptMap.get(pId).Invoice__r.Policy__r.Cancellation_Amount__c ;
            paymentRec.Payment_Date__c   = date.today();
            
            
            
            PaymentReceiptToInsert.put(pId,paymentRec);
            
            // Opportunity //
            Opportunity opp = New Opportunity();
            
            opp.Name = 'Cancellation Opportunity  '+ paymentReceiptMap.get(pId).Invoice__r.Policy__r.Name;
            opp.AccountId 		= paymentReceiptMap.get(pId).Invoice__r.Policy__r.NameInsuredId;
            opp.StageName 		= 'Closed Won';
            opp.CloseDate 		= date.today();
            opp.Policy__c 		= pId;
            // opp.Amount    		= paymentReceiptMap.get(pId).Invoice__r.Policy__r.Cancellation_Amount__c;
            opp.Product__c 		= paymentReceiptMap.get(pId).Invoice__r.Policy__r.ProductId;
            opp.RecordTypeId 	= '012f0000000guBwAAI';
            opp.Brokerage__c    = paymentReceiptMap.get(pId).Invoice__r.Policy__r.Brokerage__c;
            opp.Broker__c		= paymentReceiptMap.get(pId).Invoice__r.Policy__r.Broker__c;
            opp.Commission__c 	= paymentReceiptMap.get(pId).Invoice__r.Policy__r.Commission__c;
            opp.Transaction_Type__c = 'Firm Rider Certificate Cancellation';
            opp.Premium_Amount__c  = paymentReceiptMap.get(pId).Invoice__r.Policy__r.Cancellation_Amount__c;
            
            
            OpportunityToInsert.put(pId,opp);
            
            
            Payment_Metadata_Type__mdt[] metadatRecords = [select MasterLabel, DeveloperName, Value__c,Brokerage_Account_Id__c
                                                           from Payment_Metadata_Type__mdt where Brokerage_Account_Id__c IN: SetofBrokerageIds];
            
            
            for (Payment_Metadata_Type__mdt MetadataMapping : metadatRecords) {
                
                StripeAPIMap.put(MetadataMapping.Brokerage_Account_Id__c,MetadataMapping.Value__c);
            }
            
            
            for(Id InsurancePolicyId : PolicyIds){
                
                Stripe request = new Stripe(StripeAPIMap.get(paymentReceiptMap.get(InsurancePolicyId).Invoice__r.Policy__r.Brokerage__c));    
                
                system.debug('api key  ' + StripeAPIMap.get(paymentReceiptMap.get(InsurancePolicyId).Invoice__r.Policy__r.Brokerage__c));
                
                string chargeId     = paymentReceiptMap.get(InsurancePolicyId).Reference_Number__c;  
                system.debug('charge Id ==> ' + chargeId);
                
                string  amount      = string.valueof(paymentReceiptMap.get(InsurancePolicyId).Invoice__r.Policy__r.Cancellation_Amount__c);
                
                system.debug('Payment Receipt  ==>' + paymentReceiptMap.get(InsurancePolicyId));
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
                    //       decimal stripeFee = decimal.valueOf(response.stripefee)/100;
                    associateOppWtransaction = true;
                    
                    Payment_Transaction__c ptransaction = PaymentReceiptToInsert.get(InsurancePolicyId);
                    
                    ptransaction.status__c = 'Successful';
                    ptransaction.Reference_Number__c = response.id;
                    ptransaction.Stripe_Fee__c = 0;
                    system.debug('policy status under invoice ' + ptransaction.Invoice__r.Policy__r.Status);
                    PaymentReceiptToInsert.put(InsurancePolicyId,ptransaction);
                    
                    mapToAllowOpptoCreate.put(InsurancePolicyId,OpportunityToInsert.get(InsurancePolicyId));
                    
                    DataToReturn = 'SUCCESS';
                    system.debug('SUCESSSSSS!!!');
                    
                    Invoice__c invoice = InvoiceToInsert.get(InsurancePolicyId);
                    invoice.Status__c = 'Paid';
                    
                    
                }
                
                else{
                    mapToAllowOpptoCreate.put(InsurancePolicyId,OpportunityToInsert.get(InsurancePolicyId));
                    associateOppWtransaction = false;
                    Payment_Transaction__c ptransaction =  PaymentReceiptToInsert.get(InsurancePolicyId);
                    ptransaction.status__c = 'Failed';
                    ptransaction.Internal_Notes__c = 'Failure cause: ' + response.errorResponse.message;
                    ptransaction.Reference_Number__c = 'NONE';
                    ptransaction.Stripe_Fee__c = 0;
                    PaymentReceiptToInsert.put(InsurancePolicyId,ptransaction);
                    
                    Invoice__c invoice = InvoiceToInsert.get(InsurancePolicyId);
                    invoice.Status__c = 'Failed';
                    
                    system.debug('Error Message :: ' + response.errorResponse.message);
                    DataToReturn = response.errorResponse.message;
                    //   throw new AuraHandledException(response.errorResponse.message);
                    
                    
                }
                
            } 
            
            try {
                upsert InvoiceToInsert.values();
                system.debug(InvoiceToInsert.values());
            }
            
            catch (Exception e){
                
                system.debug('exception (error in creating billing) ==> ' + e);
            }
            
            try {
                insert mapToAllowOpptoCreate.values();
                system.debug(mapToAllowOpptoCreate.values());
            }
            
            catch (Exception e){
                system.debug('exception==> ' + e);
            }
            
            for(Id PolicyId: InvoiceToInsert.keySet()){
                
                system.debug('Is Invoice Really created or exist  ' + InvoiceToInsert.get(PolicyId).Id);
                system.debug('Invoice Line Item to inserted below');
                system.debug('InvoiceToInsert Id==>' + InvoiceToInsert.get(PolicyId).Id);
                system.debug('mapToAllowOpptoCreate Id' + mapToAllowOpptoCreate.get(PolicyId).Id);
                system.debug('should associate opportunity? ' + associateOppWtransaction);
                
                
                if(InvoiceToInsert.get(PolicyId).Id != null && mapToAllowOpptoCreate.get(PolicyId).Id !=null && associateOppWtransaction == True ){
                    
                    // Field Mapping of Billing Id
                    Invoice_Line_Items__c  invLineitem = InvLineToInsert.get(PolicyId);
                    invLineitem.Opportunity__c       = mapToAllowOpptoCreate.get(PolicyId).Id;
                    
                    If(InvLineToInsert.get(PolicyId).Id == Null){   
                        
                        invLineitem.Invoice__c = InvoiceToInsert.get(PolicyId).Id;
                        invLineitem.Opportunity__c       = mapToAllowOpptoCreate.get(PolicyId).Id;
                        system.debug('billing Line' + invLineitem);
                    }
                    InvLineToInsert.put(PolicyId,invLineitem);
                    
                    
                    InsurancePolicy ins =  policyMap.get(PolicyId);
                    
                    ins.Id = InvoiceToInsert.get(PolicyId).Policy__c;
                    ins.Status = 'Cancelled';
                    ins.Cancellation_Invoice__c = InvoiceToInsert.get(PolicyId).Id;
                    policyList.add(ins);
                    
                }
                
                else{
                    
                    Invoice_Line_Items__c  invLineitems = InvLineToInsert.get(PolicyId);
                    If(InvLineToInsert.get(PolicyId).Id == Null){   
                        invLineitems.Invoice__c = InvoiceToInsert.get(PolicyId).Id;
                    }
                    system.debug('Invoice Id ==>' + InvoiceToInsert.get(PolicyId).Id ); 
                    system.debug('b Line in else' + invLineitems);
                    InvLineToInsert.put(PolicyId,invLineitems);
                    
                    InsurancePolicy ins =  policyMap.get(PolicyId);
                    
                    ins.Id = InvoiceToInsert.get(PolicyId).Policy__c;
                    ins.Cancellation_Invoice__c = InvoiceToInsert.get(PolicyId).Id;
                    policyList.add(ins);
                    
                    
                }
                
            }    
            
            try {
                upsert InvLineToInsert.values();
            }
            
            catch (Exception e){
                system.debug('exception ==> ' + e);
            }
            
            for(Id PolicyId: InvoiceToInsert.keySet()){
                
                if(InvoiceToInsert.get(PolicyId).Id !=null & mapToAllowOpptoCreate.get(PolicyId).Id !=null){
                    
                    Payment_Transaction__c paymentitem  =  PaymentReceiptToInsert.get(PolicyId);
                    
                    paymentitem.Invoice__c = InvoiceToInsert.get(PolicyId).Id; 
                    
                    system.debug('Payment Transaction to be created' + paymentitem); 
                    PaymentReceiptToInsert.put(PolicyId,paymentitem);
                    
                    
                }
                
            } 
            
            try {
                insert PaymentReceiptToInsert.values();
            }
            
            catch (Exception e)	{
                system.debug('exception ==> ' + e);
            }
            
            finally{
                
                If(policyList.size()>0){
                    update  policyList;  
                    
                }  
            }
            
            
        }
    }
    
    
    
}