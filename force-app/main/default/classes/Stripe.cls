/*
@Name             : Stripe
@Author           : Aslam Bari/Sanjay Mankani (http://www.aslambari.com/stripe_apex_toolkit.html)
@Date             : 6 Oct, 2011
@Description      : This class is the stripe class used to call all Stripe methods.
                      
*/

public class Stripe{

    String API_KEY='';
    public Stripe(string apiKey){
        API_KEY = apiKey;
    }
    
    public StripeResponseModel createCharge(string cnumber, string exp_year, string exp_month, string cvc, string amount, string curncy, string description, string email){
        StripeCharge strChr=new StripeCharge(API_KEY);
        return strChr.CreateCharge(cnumber,exp_year,exp_month,cvc,amount,curncy,description,email);
    }
    
    public StripeResponseModel createCharge1(string customerId,string amount, string curncy, string description, string email){
        StripeCharge strChr=new StripeCharge(API_KEY);
        return strChr.CreateCharge1(customerId,amount,curncy,description,email);
    }
    
    public StripeResponseModel retrieveCharge(String chargeId){
        StripeCharge strChr=new StripeCharge(API_KEY);
        return strChr.retrieveCharge(chargeId);
    }
    
    public StripeResponseModel createCustomer(String cnumber,String exp_month,String exp_year,String cvc,String name,String addressLine1,String addressLine2,String zip,String state,String country,String email,String description){
        StripeCustomer strCust=new StripeCustomer(API_KEY); 
        return strCust.createCustomer(cnumber,exp_month,exp_year,cvc,name,addressLine1,addressLine2,zip,state,country,email,description);
        
    }
    
    public StripeResponseModel retrieveCustomer(String customerId){
        StripeCustomer strCust=new StripeCustomer(API_KEY);
        return strCust.retrieveCustomer(customerId);
    }    
    
    public StripeResponseModel createInvoice(String customer,String amount,String curency,String description){
        StripeInvoice strInv=new StripeInvoice(API_KEY);
        return strInv.createInvoice(customer,amount,curency,description);
    }
    
    public StripeResponseModel retreiveInvoice(String invoiceId){
        StripeInvoice strInv=new StripeInvoice(API_KEY);
        return strInv.retreiveInvoice(invoiceId);
    }
	
	
    public StripeResponseModel retreiveBalanceTransactions(String btID){
        StripeInvoice strInv=new StripeInvoice(API_KEY);
        return strInv.retreiveBalanceTransactions(btID);
    }
	    
    public StripeResponseModel createPlan(String planName,String amount,String curency,String interval,String planLabel){
        StripePlan strPlan=new StripePlan(API_KEY);
        return strPlan.createPlan(planName,amount,curency,interval,planLabel);
    }
    
    public StripeResponseModel retrievePlan(String planId){
        StripePlan strPlan=new StripePlan(API_KEY);
        return strPlan.retrievePlan(planId);
    }
    
    public StripeResponseModel refundCharge(String chargeId,string amount){//,string currencyval){//,string receipt,string reason){
   //     public StripeResponseModel refundCharge(String chargeId){
    
        StripeCharge strChr=new StripeCharge(API_KEY);
      return strChr.refundCharge(chargeId,amount);//,currencyval);//,receipt,reason);
       //         return strChr.refundCharge(chargeId);
    
    }
}