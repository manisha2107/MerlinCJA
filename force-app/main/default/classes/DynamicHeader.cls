public without sharing class DynamicHeader {
    
    public static Account PersonAccount = new Account();
    
    @AuraEnabled
    public static Account getPLogoLink() {
        
        PersonAccount = PersonInformation.getAccountRecord();
        
        System.debug('Person Account ID:' + PersonAccount);
        System.debug('PersonAccount Parent Record Name' + PersonAccount.HiddenAccount__r.Name);
        
        System.debug('PersonAccount Parent Record Id' + PersonAccount.HiddenAccount__c);
        
        
        Account PAccount  = [Select id, Name,  Brokerage_Account__c	from Account where Id =: PersonAccount.HiddenAccount__c LIMIT 1];
        
        System.debug('PAccount::' + PAccount);
        
        return PAccount;
    }

    @AuraEnabled
    public static Account getBrokerLogoLink() {
        
        PersonAccount = PersonInformation.getAccountRecord();
        
        System.debug('Person Account ID:' + PersonAccount);
        System.debug('PersonAccount Parent Record Name' + PersonAccount.Brokerage_Account__r.Name);
        
        System.debug('PersonAccount Parent Record Id' + PersonAccount.HiddenAccount__c);
        
        
        Account BrokerageAcc  = [Select id, Name,  HiddenAccount__c from Account where Id =: PersonAccount.Brokerage_account__c LIMIT 1];
        
        System.debug('BrokerAcc::' + BrokerageAcc);
        
        return BrokerageAcc;
    }


    
    public class AccountWrapper{
        @AuraEnabled
        public Account account {get; set;}
        @AuraEnabled
        public String imageUrl {get; set;}
        
    }
    
    @AuraEnabled(cacheable=true)
    public static String getAccountlogo(String accountId) {
        system.debug('account ID = ' + accountId);
       // List<RecordType> accountRecordType = [SELECT Id, DeveloperName from RecordType where DeveloperName = 'IndustriesBusiness' Limit 1];
        if(accountId != null)
        {
            //RecordType accountRecordTypeRecord = accountRecordType[0];
            //String accountRtId = accountRecordTypeRecord.Id;
            Map<Id ,Account> mapOfAccount =  new Map<Id, Account>([Select Id, Name FROM Account where Id =: accountId]);
            
            Map<String, String> mapOfCdIdAndAccountId = new Map<String, String>();
            
            List<ContentDocumentLink> cdlList = [SELECT ContentDocumentId, LinkedEntityId FROM ContentDocumentLink 
                                                 WHERE LinkedEntityId IN : mapOfAccount.keySet()]; 
                                                // and ContentDocument.FileType!= 'SNOTE'];
            
            for(ContentDocumentLink cdl : cdlList)
            {
                mapOfCdIdAndAccountId.put(cdl.ContentDocumentId, cdl.LinkedEntityId);
            }
            //On production, we have to remove first and second part that is '-' '-'
            List<Domain> domainList = [SELECT Domain FROM Domain];
            String domainString = 'https://merlinunderwriting1--uat--c.documentforce.com'; //'merlinunderwriting1--cja.my.salesforce.com'; //domainList[0].Domain;
            //system.debug('Domain is:  ' + domainlist[0].Domain);
            system.debug('Domain string:  ' + domainString);
            //String domainNameSubstring = domainString.substringBefore('.');
            //String secondPart = domainNameSubstring.substringBefore('-');
            //String firstPart = domainNameSubstring.substringAfter('-');
            //String customDomainName = 'https://' + firstPart + '--' + secondPart + '--c.documentforce.com';
            //String customDomainName = 'https://' + firstPart  + secondPart + '--c.documentforce.com';
			String customDomainName = domainString; //+ firstPart + '--' + secondPart + '--c.documentforce.com';

            system.debug('domain :' + customDomainName);
            
            Map<String, String> accountID_ImageUrlMap = new Map<String, String>();
            
            List<ContentVersion> contentVersionList = [select id,FileType, Title,FileExtension, Versiondata,ContentDocumentId 
                                                       from ContentVersion 
                                                       where islatest=true
                                                       and Title = 'logo'
                                                       and ContentDocumentId IN : mapOfCdIdAndAccountId.keySet()
                                                       ];
            Map<String, String> contentDocId_contentVersionMap = new Map<String, String>();
            for(ContentVersion cv : contentVersionList)
            {
                contentDocId_contentVersionMap.put(cv.ContentDocumentId, cv.id);
            }
            //--------------------------------------------------------------------------------------------------------------------------------
            List<ContentDistribution> cdList = [select DistributionPublicUrl, ContentDocumentId from ContentDistribution 
                                                where ContentDocumentId =: mapOfCdIdAndAccountId.keySet()];
            List<Organization> orgDetailsList = [SELECT Id from Organization];
            String orgId = orgDetailsList[0].Id;
            for(ContentDistribution cd : cdList)
            {
                String distributionPublicUrl = cd.DistributionPublicUrl;
                List<String> splitUrlStringList = distributionPublicUrl.split('/');
                //system.debug('Delimitted String = ' + splitUrlStringList);
                String imageUrl = customDomainName +'/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Jpg&versionId=';
                imageUrl += contentDocId_contentVersionMap.get(cd.ContentDocumentId);
                imageUrl += '&operationContext=DELIVERY&contentId=';
                imageUrl += cd.ContentDocumentId;
                imageUrl += '&page=0&d=/a/';
                imageUrl += splitUrlStringList[7];
                imageUrl += '/';
                imageUrl += splitUrlStringList[8];
                imageUrl += '&oid=';
                imageUrl += orgId;
                imageUrl += '&dpt=null&viewId=';
                system.debug('public image url = ' + imageUrl);
                accountID_ImageUrlMap.put(mapOfCdIdAndAccountId.get(cd.ContentDocumentId), imageUrl);
            }
            
            AccountWrapper returnWrapper = new AccountWrapper();
            returnWrapper.imageUrl = accountID_ImageUrlMap.get(accountId);
            returnWrapper.account = mapOfAccount.get(accountId);
            //returnWrapperList.add(returnWrapper);
           // system.debug('returnWrapper :' + returnWrapper.imageUrl);            
            system.debug('Wrapper return = ' + returnWrapper.account);
            system.debug('Wrapper image URl = ' + returnWrapper.imageUrl);

            return returnWrapper.imageUrl;

        }
            
            else{
                return null;
            }
        
            
        }
        
    }