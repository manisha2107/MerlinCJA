public with sharing class LookUpController {
    private final static Integer MAX_RESULTS = 6;

    public class LookupSearchResult {
        @AuraEnabled
        public String Id {get; set;}
        @AuraEnabled
        public String icon {get; set;}
        @AuraEnabled
        public String title {get; set;}
        @AuraEnabled
        public String name {get; set;}
        @AuraEnabled
        public String subtitle {get; set;}
        
        public LookupSearchResult(Id accId, String accTitle,String userIcon, String accName,String accSub ) {
            Id=accId;
            icon=userIcon;
            title = accTitle;
            name = accName;
            subtitle= accSub;
        }
    }

   

    @AuraEnabled(Cacheable=true)
    public static List<LookupSearchResult> search(String searchTerm, List<String> selectedIds) {
        // Prepare query paramters
        

        // Execute search query
        String searchFor = '%' + searchTerm +'%';
            
            System.debug(searchFor);
            // Execute search query
            List<Account> accounts =[
                SELECT
                NAME,
                ID,
                BillingCity
                FROM Account
                WHERE id NOT IN :selectedIds and Name like:searchFor
                
            ];
            

        // Prepare results
        List<LookupSearchResult> results = new List<LookupSearchResult>();

        // Extract Accounts & convert them into LookupSearchResult
        String accountIcon = 'standard:account';
        
        for (Account account : accounts) {
            String subtitle = account.BillingCity == null ? 'Account' : 'Account • ' + account.BillingCity;
            results.add(new LookupSearchResult(account.Id, 'Account', accountIcon, account.Name, subtitle));
        }
        return results;
    }

}