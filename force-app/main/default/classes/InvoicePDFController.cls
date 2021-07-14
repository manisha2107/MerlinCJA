/*
@Name             : InvoicePDFControlller
@Author           : Zain Abbas @ CloudJunction
@Date             : 28 Oct, 2019
@Description      : This class retrieves data for Invoice and it's related Objects.
					It's is the primary controller for Invoice VF PDF Page. 
*/

public class InvoicePDFController {
    
    public Map<Invoice__c , List<Invoice_Line_Items__c> > InvoiceLITMapLinetems{get;  set;}
    public map<string, string> footerMap {get; set;}
    public List<Invoice_Line_Items__c> InvoiceLines {get;set;}
    public List<Payment_Transaction__c> PaymentTransaction {get;set;}
    public list<Invoice_Taxes__c> listOfTaxes {get; set;}
    
    
    public Invoice__c[]  Invoice{get; set;}
    public Decimal InvoieLineTotal{get;  set;}
    public Date dates {get;set;}
    public String dat{get;set;}
    public Decimal Tax1Amount{get;set;}
    public Decimal Tax2Amount{get;set;}
    public Decimal Tax3Amount{get;set;}
    public string imageURL {get; set;}
    public string invNotes {get; set;}
    public string dispBankData {get;set;}
    public string Receipt {get; set;}
    public boolean isRecp {get; set;}	
    
    public InvoicePDFController (){
        try{
            imageURL = '';
            String InvoiceId= '';
            string FooterPhone = '';
            string FooterEmail = '';
            string FooterWeb = '';
            string FooterBussID = '';
            Tax1Amount = 0.0;
            Tax2Amount = 0.0;
            Tax3Amount = 0.0;
            listOfTaxes = new list<Invoice_Taxes__c>();
            invNotes = '';
            InvoiceId= apexpages.currentPage().getParameters().get('InvId');
          	Receipt = apexpages.currentPage().getParameters().get('recp') != null? apexpages.currentPage().getParameters().get('recp') : '0';
            
            system.debug('Receipt='+Receipt);
          
            InvoiceLines = new List<Invoice_Line_Items__c>();
            
            system.Debug('::Invoice Id: '+ InvoiceId);
            
            if(Receipt != '0'){
                isRecp = true;
            	PaymentTransaction = [Select id,name,Amount_Paid__c,Invoice__c,Mode_of_Payment__c,Internal_Notes__c,Payment_Date__c,Reference_Number__c,Status__c from Payment_Transaction__c where id =:Receipt];
            	system.debug('inside if');
            }
            else
                isRecp = false;
            system.debug('PaymentTransaction='+PaymentTransaction);
            footerMap = new map<string, string>();
            
            /*string ref = ApexPages.currentPage().getHeaders().get('Referer');
            system.debug('ref='+ref);
            */
            Invoice = new Invoice__c[]{};
                
            Invoice=[Select id, name, Amount__c, Policy__c,Policy__R.Policy_Holder__c, Invoice_Notes__c, Account_Address__c,Total_Line_Items_Amount__c,Amount_Paid_Rollup__c,
                     CreatedById,Currency__c,Balance_Amount__c,Description__c,Due_Date__c,Invoice_Amount__c,Invoice_Date__c,Internal_Notes__c,Status__c, createddate,
                     Tax_1__c,Tax_2__c,Tax_3__c,Tax_Amount_Percent_1__c,Tax_Amount_Percent_2__c,Tax_Amount_Percent_3__c, Total_Amount__c from Invoice__c where id=:InvoiceId];
            
            InvoiceLines= [Select id, name, Amount__c,Rate__c,Quantity__c,Description__c,Invoice__c from Invoice_Line_items__c where Invoice__c =:InvoiceId ORDER BY createddate ASC];
            
            
            
            listOfTaxes = [select id, name, Tax__r.name, Amount__c, TaxPercent__c from Invoice_Taxes__c where Invoice__c =:InvoiceId];
            
            system.Debug('::InvoiceLines: '+ InvoiceLines);
            
            if(Invoice[0].Invoice_Notes__c != null)
                invNotes = Invoice[0].Invoice_Notes__c;
            
            if(Invoice.size() > 0){
                DateTime dt = Invoice[0].createdDate;
                dates = date.newinstance(dT.year(), dT.month(), dT.day());
                
                dat = dT.month()+ '-' + dT.day()+ '-' +dT.year();
            }
            
            String myGeneratedFileName = Invoice[0].name+'.pdf';
            
            Apexpages.currentPage().getHeaders().put('content-disposition', 'inline; filename='+myGeneratedFilename);
            
            list<Document> filesList = [select id, Name from Document where name = 'Logo' or name = 'logo'];
            if(filesList.size() > 0)
                imageURL = filesList[0].id;
            system.debug('imageURL='+imageURL);
            
            FooterPhone = label.PDF_Footer_Phone;
            FooterEmail = label.PDF_Footer_Email;
            FooterWeb = label.PDF_Footer_Web;
            FooterBussID = label.PDF_Footer_Business_Tax_ID;
            
            if(!string.isBlank(FooterPhone) && FooterPhone.contains(':')){
                string[] phoneArr = FooterPhone.split(':');
                footerMap.put(phoneArr[0], phoneArr[1]);
                
            }
            if(!string.isBlank(FooterEmail) && FooterEmail.contains(':')){
                string[] emailArr = FooterEmail.split(':');
                footerMap.put(emailArr[0], emailArr[1]);
                
            }
            if(!string.isBlank(FooterWeb) && FooterWeb.contains(':')){
                string[] webArr = FooterWeb.split(':');
                footerMap.put(webArr[0], webArr[1]);
                
            }
            if(!string.isBlank(FooterBussID) && FooterBussID.contains(':')){
                string[] bussIDArr = FooterBussID.split(':');
                footerMap.put(bussIDArr[0], bussIDArr[1]); 
                
            }
            
        }
        catch(Exception Ex){
            system.Debug('::Exception LineNumber: '+ex.getLineNumber());
            system.Debug('::Exception Message: ' +ex.getMessage());
            system.Debug('::Exception Cause: '+ex.getCause());
            system.Debug('::Exception Type Name:  '+ex.getTypeName());
        }
    }
}