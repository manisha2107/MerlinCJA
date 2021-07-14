public without sharing class CheckoutProcess
{   
    
    public class invoiceobj {
        @AuraEnabled
        public String accid {get;set;}
        @AuraEnabled
        public String accEmail {get;set;}
        @AuraEnabled
        public String policyId {get;set;}
        @AuraEnabled
        public String curr {get;set;}
        @AuraEnabled
        public String invamount {get;set;}
        @AuraEnabled
        public String invnotes {get;set;}
        @AuraEnabled
        public String erpId {get;set;}
        @AuraEnabled
        public String invoicetype {get;set;}     
        @AuraEnabled
        public List<Invoiceline> listofInvLineItems {get;set;}
        
    }
    
    public class Invoiceline {
        @AuraEnabled
        public String invid {get;set;}
        @AuraEnabled
        public decimal rate {get;set;}
        @AuraEnabled
        public decimal quantity {get;set;}
        @AuraEnabled
        public string linenotes {get;set;}
        
    }
    
    @AuraEnabled
    public static Invoice__c getInvInstance(invoiceobj InvoiceInsObj) {
        
        Invoice__c invoice = New Invoice__c();
        
        invoice.Account__c                   = InvoiceInsObj.accid;
        invoice.Policy__c                    = InvoiceInsObj.policyid;
        invoice.Internal_Notes__c            = InvoiceInsObj.invnotes;
        invoice.Status__c                    = 'Paid';
        invoice.Invoice_Date__c              = date.today();
        invoice.Type__c                      = InvoiceInsObj.invoicetype;
        invoice.currency__c                  = InvoiceInsObj.curr;
        
        return invoice;
    }
    
    
    @AuraEnabled
    public static List<Invoice_Line_Items__c> getInvoiceLineList(invoiceobj InvoiceObj,id invoiceId) {
        
        List<Invoice_Line_Items__c> InvLItoInsert = New List<Invoice_Line_Items__c>();
        List<Invoiceline> invoiceLineList = invoiceObj.listofInvLineItems;
        
        
        for (Invoiceline invli : invoiceLineList){
            
            Invoice_Line_Items__c createIli = New Invoice_Line_Items__c();
            
            createili.invoice__c    = invoiceId;
            createili.rate__c       = invli.rate;
            createili.Quantity__c   = invli.quantity;
            createili.Description__c = invli.linenotes;
            
            InvLItoInsert.add(createIli);
        }
        
        return InvLItoInsert;
        
    }
    
    // Update Policy and PPD ( If Purchase Policy = assign Master Invoice = Given Invoice, else )
    
    @AuraEnabled
    public static String getChargeResponse(string amount,String holderName,String card,String cvv,String year, String month,
                                           String curr, String description, string notes, string email,string brokerageAccId,
                                           invoiceobj invoiceobjectFromLWC,
                                           createRenewalOpportunity.OppWrapper OpportunityObjFromLWC,
                                           List<InsurancePolicyCoverage> ppdtoExpire,
                                           List<InsurancePolicy> policiestoUpdate
                                          ){
                                              
                                              String DataToReturn;
                                              
                                              List<InsurancePolicy> policyListToUpdate = New List<InsurancePolicy>();                                      
                                              
                                              system.debug('brokerage id ---> ' + brokerageAccId);                                        
                                              
                                              //Get Secret Key matching Brokerage ID                                        
                                              Payment_Metadata_Type__mdt[] metadatRecords = [select MasterLabel, DeveloperName, Value__c,Brokerage_Account_Id__c
                                                                                             from Payment_Metadata_Type__mdt where Brokerage_Account_Id__c =: brokerageAccId LIMIT 1];
                                              
                                              //Return if no key specified against brokerage     
                                              if(metadatRecords.size() < 1){
                                                  
                                                  DataToReturn = 'No API key specified';
                                                  system.debug('DataToReturn ---> ' + DataToReturn); 
                                                  return DataToReturn;
                                                  
                                              }
                                              
                                              If(metadatRecords.size() > 0 && metadatRecords[0].Value__c != null) {                                     
                                                  
                                                  system.debug('DataToReturn ---> ' + 'Key Found'); 
                                                  
                                                  //Make callout based if invoice and invoice line already created
                                                  //If(inv.Id != null  ){
                                                  
                                                  //Store secret key and send in strip request    
                                                  String Secret_Key = metadatRecords[0].Value__c;
                                                  Stripe request = new Stripe(Secret_Key);
                                                  
                                                  decimal centsAmount = decimal.valueOf(amount)*100;
                                                  integer intcentsAmount = integer.valueOf(centsAmount);
                                                  string strcentsAmount = string.valueOf(intcentsAmount);
                                                  system.debug('centsAmount='+centsAmount);
                                                  system.debug('strcentsAmount='+strcentsAmount);
                                                  system.debug('amount='+amount);
                                                  system.debug('Resquest='+card+year+month+cvv+strcentsAmount+'=curr='+curr+description);
                                                  
                                                  StripeResponseModel response = request.createCharge(card, year, month, cvv, strcentsAmount, curr, description, email);
                                                  system.debug('#response='+ response);
                                                  system.debug('#bt='+ response.balanceTransaction);
                                                  
                                                  //    Invoice__c inv = createInvoice(invoiceobjectFromLWC);
                                                  
                                                  if(!response.isError){
                                                      
                                                      system.debug('Transaction ID :: ' + response.id);
                                                      //system.debug('Transaction Fee :: ' + response.fee);
                                                      string btID = response.balanceTransaction;
                                                      btID = btID.replaceAll('"', '');
                                                      StripeResponseModel response2 = request.retreiveBalanceTransactions(btID);
                                                      system.debug('#response2='+response2);
                                                      system.debug('#response2='+response2.stripefee);
                                                      DataToReturn = 'SUCCESS';
                                                      
                                                      //Calling Invoice & Line, Create Opportunity and update PPD
                                                      Invoice__c inv = createInvoice(invoiceobjectFromLWC);
                                                      DataToReturn = invoiceobjectFromLWC.invoicetype;
                                                      
                                                      system.debug('Data To Return with Invoice Type => ' + invoiceobjectFromLWC.invoicetype);    
                                                      //List<InsurancePolicyCoverage> ppdList = updatePPD(ppdtoExpire);
                                                      
                                                      Payment_Transaction__c ptransaction = New Payment_Transaction__c ();  
                                                      decimal stripeFee = decimal.valueOf(response2.stripefee)/100;
                                                      //ptn.Stripe_Fee__c = stripeFee;
                                                      ptransaction.status__c = 'Successful';
                                                      ptransaction.Reference_Number__c = response.id;
                                                      ptransaction.Stripe_Fee__c = stripeFee;
                                                      ptransaction.Invoice__c = inv.Id;
                                                      ptransaction.Card_Holder_Name__c = holderName;
                                                      ptransaction.Amount_Paid__c = decimal.valueOf(invoiceobjectFromLWC.invamount);
                                                      ptransaction.Payment_Date__c = date.today();
                                                      ptransaction.Mode_of_Payment__c = 'Credit Card';
                                                      
                                                      insert ptransaction;
                                                      
                                                      //Create Opportunity after payment successful
                                                      Opportunity opportoupdate =   createRenewalOpportunity.OppWhenPaymentSuccess(OpportunityObjFromLWC);
                                                      
                                                      System.debug('Policies List::' + policiestoUpdate);
                                                      System.debug('Policy S::' + policiestoUpdate.size());
                                                      System.debug('PPDS to Update::' + ppdtoExpire);
                                                      System.debug('PPD Size to Update::' + ppdtoExpire.size());
                                                      
                                                      
                                                      
                                                      If(inv.Type__c == 'Purchase Policy'){
                                                          
                                                          for(InsurancePolicy policies : policiestoUpdate ){
                                                              
                                                              policies.Status = 'Activated';
                                                              policies.Master_Invoice__c = inv.Id;
                                                              policyListToUpdate.add(policies);
                                                              
                                                          }
                                                          
                                                          for(InsurancePolicyCoverage ppd : ppdtoExpire){
                                                              
                                                              ppd.Status__c = 'Activated';
                                                              ppd.EffectiveDate = policyListToUpdate[0].EffectiveDate; 
                                                              ppd.ExpirationDate = policyListToUpdate[0].ExpirationDate;
                                                              system.debug('ppd in Purchase ' + ppd);
                                                              
                                                          }    
                                                          
                                                          string updatedUserStatus = updateCommunityStatus('Mid-Term Changes with Firm Rider');
                                                          string updatedAccStatus  =  updateAccountStatus(invoiceobjectFromLWC.accid,'Personal Information','Bound');
                                                      }    
                                                      
                                                      
                                                      
                                                      else if(inv.Type__c == 'Mid Term'){
                                                          
                                                          for(InsurancePolicy policies : policiestoUpdate ){
                                                              
                                                              policies.Status = 'Active';
                                                              policies.Master_Invoice__c = inv.id;
                                                              policyListToUpdate.add(policies);
                                                              
                                                              
                                                          }
                                                          
                                                          for(InsurancePolicyCoverage ppd : ppdtoExpire){
                                                              
                                                              ppd.Status__c = 'Activated';
                                                              ppd.EffectiveDate = date.today(); 
                                                              ppd.ExpirationDate = policyListToUpdate[0].ExpirationDate; 
                                                              system.debug('ppd in Mid Term ' + ppd);
                                                          }     
                                                          
                                                          
                                                          string updatedAccStatus  =  updateAccountStatus(invoiceobjectFromLWC.accid,'Mid-Term Changes with Firm Rider','Bound');
                                                          
                                                      }
                                                      
                                                      else if(inv.Type__c == 'Cancelled with Purchase ERP'){
                                                          
                                                          for(InsurancePolicy policies : policiestoUpdate ){
                                                              
                                                              policies.Status = 'Purchased ERP';
                                                              policies.Cancellation_Invoice__c = inv.id;
                                                              policies.ExpirationDate = date.today();
                                                              policies.CancellationDate = date.today();
                                                              policyListToUpdate.add(policies);
                                                              
                                                          }
                                                          
                                                          for(InsurancePolicyCoverage ppd : ppdtoExpire){
                                                              
                                                              ppd.Status__c = 'Expired';
                                                              ppd.ExpirationDate = date.today() ; //+ ERPDate            
                                                              
                                                          }   
                                                          
                                                          string updatedUserStatus = updateCommunityStatus('Purchased ERP');
                                                      }     
                                                      
                                                      if(inv.Type__c != 'Cancelled with Purchase ERP' ){
                                                          
                                                          
                                                          try {
                                                              
                                                              upsert policiestoUpdate ExternalId__c;
                                                              If(policiestoUpdate.size() > 1 ){
                                                                  
                                                                  integer ppdLastindex = ppdtoExpire.size() - 1; 
                                                                  ppdtoExpire.remove(ppdLastindex);
                                                                  upsert ppdtoExpire EID__c;
                                                                  
                                                              }
                                                              
                                                              else{
                                                                  upsert ppdtoExpire EID__c;    
                                                              }
                                                          }
                                                          
                                                          catch (exception e) {
                                                              system.debug('error while updating Policy => ' + e.getMessage());						
                                                              throw e;
                                                              
                                                          }
                                                          
                                                          
                                                      }
                                                      
                                                      else{
                                                          
                                                          
                                                          try {
                                                              
                                                              update policiestoUpdate;
                                                              If(policiestoUpdate.size() > 1 ){
                                                                  
                                                                  integer ppdLastindex = ppdtoExpire.size() - 1; 
                                                                  ppdtoExpire.remove(ppdLastindex);
                                                                  update ppdtoExpire;
                                                                  
                                                              }
                                                              
                                                              else{
                                                                  update ppdtoExpire;    
                                                              }
                                                          }
                                                          
                                                          catch (exception e) {
                                                              system.debug('error while updating Policy => ' + e.getMessage());						
                                                              throw e;
                                                              
                                                          }
                                                          
                                                          
                                                      }
                                                      
                                                  } 
                                                  
                                                  else{
                                                      
                                                      Payment_Transaction__c ptransaction =  New Payment_Transaction__c();
                                                      ptransaction.status__c = 'Failed';
                                                      ptransaction.Internal_Notes__c = 'Failure cause: ' + response.errorResponse.message;
                                                      ptransaction.Reference_Number__c = 'NONE';
                                                      ptransaction.Stripe_Fee__c = 0;
                                                      system.debug('Error Message :: ' + response.errorResponse.message);
                                                      DataToReturn = response.errorResponse.message;
                                                      throw new AuraHandledException(response.errorResponse.message);
                                                      
                                                  }
                                              }//closing bracket (if key found)
                                              
                                              system.debug('Data to Return ==>' + DatatoReturn);
                                              return DatatoReturn;                                            
                                              
                                          }
    
    public static string updateCommunityStatus(string communityStatus){
        
        
        System.debug('Update User Status');
        
        User UserRec = new User();
        //[Select Id,Customer_Community_Status__c from User where Id =: UserInfo.getUserId()];
        
        UserRec.Id = UserInfo.getUserId();
        UserRec.Customer_Community_Status__c = communityStatus;
        
        try {
            update UserRec;   
        }
        
        catch (exception e) {
            system.debug('error while user => ' + e.getMessage());						
            throw e;
            
        }
        
        return 'User Community Status Updated Succesfuly';
    }
    
    public static String updateAccountStatus(string AccId,string currentStage, string AccStatus){
        
        
        
        Account AccountRec = new Account();
        AccountRec.Id = AccId; 
        AccountRec.Application_Current_Stage__c = currentStage;
        AccountRec.FinServ__Status__c = AccStatus;  
        
        try {
            update AccountRec;   
        }
        
        catch (exception e) {
            system.debug('error while updating account record as bound => ' + e.getMessage());						
            throw e;
            
        }
        
        return 'Account Status and Application stage updated succesfully';  
        
    }
    
    public static List<InsurancePolicyCoverage> updatePPD( List<InsurancePolicyCoverage> ppdUpdated){
        
        If(ppdUpdated.size()>0){
            
            try{
                
                update ppdUpdated;
            }
            
            catch (exception e) {
                
                system.debug('error while updating PPD => ' + e.getMessage());
                throw e;
                
            }
        }
        
        return ppdUpdated;
    }
    
    public static Invoice__c createInvoice(invoiceobj invoiceobjectFromLWC){
        
        //Create invoice if secret key found    
        Invoice__c inv = getInvInstance(invoiceobjectFromLWC); 
        
        if(inv != null){
            try{
                
                insert inv;                                       
                system.debug('invoice details => ' + inv);
            }
            
            catch(exception e){
                
                system.debug('exception creating inv => ' + e.getMessage());
            }
        }
        //Check if invoice created and Id exists    
        If(inv.Id != null){  
            
            //Retrieve Invoice Line Items list calling another method    
            List<Invoice_Line_Items__c> LineItemsList = getInvoiceLineList(invoiceobjectFromLWC,inv.id);    
            
            If(LineItemsList.size() > 0){
                
                try{
                    
                    insert LineItemsList;                                     
                    system.debug('invoice line details => ' + LineItemsList);
                }
                
                catch(exception e){
                    
                    system.debug('exception creating invoice line items => ' + e.getMessage());
                }
                
                
            }    
            
            return inv;
        }
        
        return inv;
    }
    /*
//CreateCharge
//Parameters:card_number, exp_year, exp_month, cvc, amount, currency, description
@AuraEnabled
public static String getcreateCharge(string amount,String holderName,String card,String cvv,String year, String month, String curr, String description, string notes, string invoiceId, string email){
String DataToReturn;

Payment_Metadata_Type__mdt[] metadatRecords = [select MasterLabel, DeveloperName, Value__c
from Payment_Metadata_Type__mdt   where 
DeveloperName = 'Payment_Gateway_Key'];

if(metadatRecords.size() < 1){
DataToReturn = 'No API key specified';
return DataToReturn;
}

String Secret_Key = metadatRecords[0].Value__c;

//String Secret_Key = Label.StripeKey; //'sk_test_JXMctr4Q53Zev5QYDUrNsVUX'; // Replace it with Live_Key
Stripe request = new Stripe(Secret_Key);

list<AcctSeed__Billing__c> inv = [select id,AcctSeed__Accounting_Period__c,AcctSeed__Customer__r.PersonEmail,Currency__c,AcctSeed__Customer__c,AcctSeed__Customer__r.Name, AcctSeed__Billing_Contact__c, AcctSeed__Billing_Contact__r.Email, name, AcctSeed__Billing_Contact__r.Name,Billing_Contact_Email__c from AcctSeed__Billing__c where id=: invoiceId];

AcctSeed__Cash_Receipt__c ptn = new AcctSeed__Cash_Receipt__c();
ptn.AcctSeed__Amount__c  = decimal.valueOf(amount);
ptn.AcctSeed__Account__c  = inv[0].AcctSeed__Customer__c;
ptn.AcctSeed__Receipt_Date__c = date.today();
ptn.AcctSeed__Purpose__c = 'Customer Receipt';
ptn.AcctSeed__Accounting_Period__c = inv[0].AcctSeed__Accounting_Period__c;

if(inv.size() > 0 && inv[0].AcctSeed__Customer__c != null && !string.isBlank(inv[0].AcctSeed__Customer__r.PersonEmail)){
ptn.Billing_Contact_Email__c = inv[0].AcctSeed__Customer__r.PersonEmail;
ptn.Billing_Account__c = inv[0].AcctSeed__Customer__c;
}


decimal centsAmount = decimal.valueOf(amount)*100;
integer intcentsAmount = integer.valueOf(centsAmount);
string strcentsAmount = string.valueOf(intcentsAmount);
system.debug('centsAmount='+centsAmount);
system.debug('strcentsAmount='+strcentsAmount);
system.debug('amount='+amount);
system.debug('Resquest='+card+year+month+cvv+strcentsAmount+'=curr='+curr+description);

//StripeResponseModel response = request.createCharge(card, year, month, cvv, amount+'00', curr, description);
StripeResponseModel response = request.createCharge(card, year, month, cvv, strcentsAmount, curr, description, email);
system.debug('#response='+ response);
system.debug('#bt='+ response.balanceTransaction);
if(!response.isError){
system.debug('Transaction ID :: ' + response.id);
//system.debug('Transaction Fee :: ' + response.fee);
string btID = response.balanceTransaction;
btID = btID.replaceAll('"', '');
StripeResponseModel response2 = request.retreiveBalanceTransactions(btID);
system.debug('#response2='+response2);
system.debug('#response2='+response2.stripefee);

ptn.AcctSeed__Payment_Reference__c = response.id;
ptn.AcctSeed__Status__c = 'In Process';
DataToReturn = 'SUCCESS';
if(!response2.isError && !test.isRunningTest()){
//decimal stripeFee = decimal.valueOf(response2.stripefee)/100;
//ptn.Stripe_Fee__c = stripeFee;

}

} else{
system.debug('Error Message :: ' + response.errorResponse.message);
ptn.AcctSeed__Status__c = 'Failed';
DataToReturn = response.errorResponse.message;
throw new AuraHandledException(response.errorResponse.message);
}
try{
insert ptn;
system.debug('Cash Receipt Inserted');
}
catch(exception e)
{
DataToReturn=+''+e.getMessage();
system.debug('ptn insert exc::'+e.getMessage());
}
finally
{
AcctSeed__Billing_Cash_Receipt__c bcr = new AcctSeed__Billing_Cash_Receipt__c ();
bcr.AcctSeed__Cash_Receipt__c   = ptn.Id;
bcr.AcctSeed__Billing__c        = inv[0].id;
bcr.AcctSeed__Applied_Amount__c = ptn.AcctSeed__Amount__c;
bcr.AcctSeed__Accounting_Period__c = ptn.AcctSeed__Accounting_Period__c;
insert bcr;    
}

return DataToReturn;

}

//,list<AcctSeed__Billing_Line__c> billinglineitems
@AuraEnabled
public static AcctSeed__Billing__c createInvoice(id accid,string accEmail, id policyId,id personContactId, string curr, integer invamount, string invnotes,string erpId, List<AcctSeed__Billing_Line__c> LineItemsList){

AcctSeed__Billing__c invoice = new AcctSeed__Billing__c();

invoice.AcctSeed__Customer__c         = accid;
invoice.Billing_Contact_Email__c      = accEmail;
invoice.Policy__c                     = policyid;
invoice.Currency__c                   = curr;
//  invoice.Invoice_Amount__c             = invamount;
invoice.AcctSeed__Billing_Comment__c  = invnotes;
invoice.AcctSeed__Status__c           = 'Draft';
invoice.AcctSeed__Date__c             = date.today();
invoice.Extended_Report_Period__c     = erpId;
//   invoice.AcctSeed__Billing_Contact__c  = personContactId;  


try{    

insert invoice;   

for (AcctSeed__Billing_Line__c blines: LineItemsList){

blines.AcctSeed__Billing__c = invoice.id;


}

insert LineItemsList;

}

catch(exception e)
{

system.debug('ptn insert exc::'+e.getMessage());
throw e;
}

return invoice;
} 
*/
    //For Custom Object
    //
    /*
@AuraEnabled
public static Invoice__c createInvoiceCJA(List<Invoice_Line_Items__c>LineItemsList,id accid,string accEmail, id policyId,
id personContactId, string curr, integer invamount,
string invnotes,string erpId){


Invoice__c invoicecja = new Invoice__c();

invoicecja.Account__c        = accid;
invoicecja.Policy__c         = policyid;
invoicecja.Internal_Notes__c = invnotes;
invoicecja.Status__c         = 'Draft';
invoicecja.Invoice_Date__c   = date.today();       

try{    

insert invoicecja;   

for (Invoice_Line_Items__c blines: LineItemsList){

blines.Invoice__c = invoicecja.id;


}

insert LineItemsList;

}

catch(exception e){                                          

system.debug('ptn insert exc::'+e.getMessage());
throw e;

}

return invoicecja;
} 


@AuraEnabled
public static Invoice__c createInvoiceandLine(List<Invoiceline> invline,id accid,string accEmail, id policyId,
id personContactId, string curr, integer invamount,
string invnotes,string erpId) {

List<Invoice_Line_Items__c> InvLItoInsert = New List<Invoice_Line_Items__c>();

try {

Invoice__c invoicecja = new Invoice__c();

invoicecja.Account__c                    = accid;
invoicecja.Policy__c                     = policyid;
invoicecja.Internal_Notes__c             = invnotes;
invoicecja.Status__c                     = 'Draft';
invoicecja.Invoice_Date__c               = date.today();   

insert invoicecja;

for (Invoiceline invli : invline){

Invoice_Line_Items__c createIli = New Invoice_Line_Items__c();

createili.invoice__c    = invoicecja.id;
createili.rate__c       = invli.rate;
createili.Quantity__c   = invli.quantity;   

InvLItoInsert.add(createIli);
}

insert InvLItoInsert;
system.debug('Invoice line item list  => ' + invline);
return  invoicecja;               

}
catch (Exception e) {
throw new AuraHandledException(e.getMessage() + ' ' + e.getStackTraceString());
}
}
*/
    
    
    /*

@AuraEnabled
public static string getOldERPInvoice(string policyId, string accId) {

//       Invoice__c inv  = [Select id,Account__c,Policy__c,Internal_Notes__c,
//                         Status__c,Invoice_Date__c from Invoice__c limit 1 where Policy__c =: policyId
//             AND Account__c =: accId ];
//    

//     return inv;
return 'test';
}

@AuraEnabled
public static AcctSeed__Billing__c updateInvoice(id accid,string accEmail, id policyId,id personContactId, string curr, integer invamount, string invnotes,List<AcctSeed__Billing_Line__c> LineItemsList){

AcctSeed__Billing__c invoice = [Select Id,Name,AcctSeed__Customer__c,Billing_Contact_Email__c,Policy__c,Currency__c,AcctSeed__Billing_Comment__c,
AcctSeed__Status__c,AcctSeed__Date__c from AcctSeed__Billing__c WHERE AcctSeed__Customer__c =: accid
AND Policy__c =: policyid ];



invoice.AcctSeed__Customer__c         = accid;
invoice.Billing_Contact_Email__c      = accEmail;
invoice.Policy__c                     = policyid;
invoice.Currency__c                   = curr;
//  invoice.Invoice_Amount__c             = invamount;
invoice.AcctSeed__Billing_Comment__c  = invnotes;
invoice.AcctSeed__Status__c           = 'Draft';
invoice.AcctSeed__Date__c             = date.today();
//   invoice.AcctSeed__Billing_Contact__c  = personContactId;  


try{    

update invoice;  
system.debug('invoice details ===>' + invoice.Id);    

}

catch(exception e)
{

system.debug('ptn insert exc::'+e.getMessage());
throw e;
}


finally{
AcctSeed__Billing_Line__c billingLineId = [Select Id,Name from AcctSeed__Billing_Line__c where AcctSeed__Billing__c =: invoice.Id LIMIT 1];

for (AcctSeed__Billing_Line__c blines: LineItemsList){

blines.AcctSeed__Billing__c = invoice.id;
blines.Id = billingLineId.Id;                
}

update   LineItemsList[0];  
}


return invoice;
} 


public class BillingLineItems {
@AuraEnabled
public Id BillingId {get;set;}
@AuraEnabled
public date BillingDate {get;set;}
@AuraEnabled
public integer Quantity {get;set;}
@AuraEnabled
public integer UnitPrice {get;set;}
@AuraEnabled
public String Comment {get;set;}
}
*/
    
    /* 
RefundCharge
// Parameter : paymentId
@AuraEnabled
public static String refundCharge(String chargeId){
String DataToReturn;  

Payment_Metadata_Type__mdt[] metadatRecords = [select MasterLabel, DeveloperName, Value__c
from Payment_Metadata_Type__mdt  where 
DeveloperName = 'Payment_Gateway_Key'];

if(metadatRecords.size() < 1){
DataToReturn = 'No API key specified';
return DataToReturn;
}

String Secret_Key = metadatRecords[0].Value__c;

Stripe request = new Stripe(Secret_Key);

StripeResponseModel response = request.refundCharge(chargeId);



system.debug('#response='+ response);
system.debug('#bt='+ response.balanceTransaction);


if(!response.isError){
system.debug('Refund Status :: ' + response.status);
system.debug('Transaction ID :: ' + response.id);
system.debug('Transaction Fee :: ' + response.fee);
string btID = response.balanceTransaction;
//    btID = btID.replaceAll('"', '');
//      StripeResponseModel response2 = request.retreiveBalanceTransactions(btID);
//       system.debug('#response2='+response2);
//        system.debug('#response2='+response2.stripefee);

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


return DataToReturn;

}
*/
    /*  
public static string getChargeId(){

Set<AcctSeed__Cash_Receipt__c> cashReceipts = New Set   <AcctSeed__Cash_Receipt__c>([Select Id,Is_Policy_Purchasing_Receipt__c,AcctSeed__Payment_Reference__c from AcctSeed__Cash_Receipt__c]);

for (AcctSeed__Cash_Receipt__c cr : cashReceipts)  {

if(cr.Is_Policy_Purchasing_Receipt__c == True){

system.debug('cr' + cr);                  
} 
}
return 'cash receipts';

}


public CheckoutProcess(){}

//Invoice
@AuraEnabled
public static List<SObject> getInvoice(String invoiceId){

List<SObject> invoice = [SELECT Id, AcctSeed__Total__c,AcctSeed__Billing_Terms_Name__c, AcctSeed__Balance__c, AcctSeed__Status__c,AcctSeed__PDF_Email_Status__c, name, AcctSeed__Customer__c,AcctSeed__Customer__r.Name,Currency__c, Billing_Contact_Email__c,
AcctSeed__Opportunity__c,AcctSeed__Opportunity__r.Name, AcctSeed__Billing_Contact__c, AcctSeed__Billing_Contact__r.FirstName,AcctSeed__Billing_Contact__r.LastName, AcctSeed__Billing_Contact__r.Email
FROM AcctSeed__Billing__c where id=: invoiceId];
system.debug('Invoice Id ::'+ invoiceId);
system.debug('Invoice ::'+invoice);
return invoice;
}

//Update Invoice
@AuraEnabled
public static String updateInvoice(String invoiceId){        

AcctSeed__Billing__c invoice = new AcctSeed__Billing__c();
invoice.Id = invoiceId;
invoice.AcctSeed__Status__c = 'Paid';
update invoice;
return 'Success';
}

*/
}