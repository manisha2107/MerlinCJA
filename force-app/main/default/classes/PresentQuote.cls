public without sharing class PresentQuote {
    public PresentQuote() {

    }

    @AuraEnabled
    public static InsurancePolicy getInsurancePolicy(){


        Account acc = PersonInformation.getAccountRecord();

        InsurancePolicy certInfo = [Select id, name , NameInsuredId, NameInsured.FirstName, 
        NameInsured.LastName, NameInsured.PersonMailingAddress, Quote__c, 
        NameInsured.PersonEmail, Policy_Holder__r.Name, Product.Name,
        Quote__r.Name, Quote__r.Account__r.Name, 
        NameInsured.Phone,
        NameInsured.BillingState,
        Quote__r.Quote_Effective_Date__c,
        Discount,
        Quote__r.Quote_Expiry_Date__c ,
        PremiumAmount from InsurancePolicy where NameInsuredId=:acc.Id LIMIT 1];

        return certInfo;

    }

    @AuraEnabled
    public static List<InsurancePolicyCoverage> getPPD(Id insuranceId){



        System.debug('Insurance Id::' + insuranceId);

        List<InsurancePolicyCoverage> certInfo = [Select id, name , DeductibleAmount, PremiumAmount,
        Policy_Limit__c , Aggregate__c, Parent_Product__c from InsurancePolicyCoverage 
        where InsurancePolicyId =: insuranceId];


        System.debug('List of PPD::' + certInfo );

        return certInfo;

    }

    @AuraEnabled
    public static Decimal getTax(String BillingState){
        try {
 
            Tax__c taxOfBS = [Select id, name , Tax_Percent__c, Province__c from tax__c where Province__c =: BillingState LIMIT 1];

            return taxOfBS.Tax_Percent__c;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}