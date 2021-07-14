public class UpdatePolicy {
    @auraenabled
    public static void UpdatePolicyRecord ()
    {
        List<InsurancePolicy> records = [SELECT Id , status FROM InsurancePolicy WHERE NameInsured.FirstName =: 'Amy'];
        
        for (InsurancePolicy record : records)
        {
            record.Status	 = 'Applied';
        }
        
        update records;

        
        String usrId = UserInfo.getUserId();

        if(usrId!=null){

            User usr = new User();

            usr = [Select id,name,  Contact.AccountId, AccountId, Customer_Community_Status__c, ContactId from User where Id =: usrId];
       
            usr.Customer_Community_Status__c = 'Mid-Term Changes without Firm Rider';

            update usr;
        }


    }
}