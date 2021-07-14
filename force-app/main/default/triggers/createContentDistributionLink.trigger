trigger createContentDistributionLink on ContentVersion (after insert) {
    Schema.DescribeSObjectResult r = Account.sObjectType.getDescribe();
    String keyPrefix = r.getKeyPrefix();
    if(Trigger.isAfter){
  for(ContentVersion cv:trigger.new){
        system.debug('CV = ' + cv);
        List<ContentDocumentLink> cdlList = [select id, LinkedEntityId from ContentDocumentLink where ContentDocumentId  = :cv.contentdocumentid];
        system.debug('content document links = ' + cdlList);  
        for(ContentDocumentLink cdl : cdlList)
        {
            if((String.valueOf(cdl.LinkedEntityId)).startsWith(keyPrefix)){
                system.debug('in condition');
                ContentDistribution cd = new ContentDistribution();
                cd.Name = cv.id + 'logo';
                cd.ContentVersionId = cv.id;
                cd.PreferencesAllowViewInBrowser= true;
                cd.PreferencesLinkLatestVersion=true;
                cd.PreferencesNotifyOnVisit=false;
                cd.PreferencesPasswordRequired=false;
                cd.PreferencesAllowOriginalDownload= true;
                insert cd;
                system.debug('Distribution = ' + cd);
            } 
        }
        }
    }
        
}