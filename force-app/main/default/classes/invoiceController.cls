public class invoiceController {

    public static AcctSeed__Billing__c createInvoice(id accid, id policyid, List<AcctSeed__Billing_Line__c> BillingLinesList){
                
        AcctSeed__Billing__c invoice = new AcctSeed__Billing__c();
        invoice.AcctSeed__Status__c = 'Paid';
        insert invoice;
        return invoice;
           
    }
    
}