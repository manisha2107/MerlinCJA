trigger shareEventFilesWithCommunityUsers on ContentDocumentLink (before insert, after insert) {
    Schema.DescribeSObjectResult r = Account.sObjectType.getDescribe();
    String keyPrefix = r.getKeyPrefix();
    if(Trigger.isBefore)
    {
        for(ContentDocumentLink cdl:trigger.new){
            if((String.valueOf(cdl.LinkedEntityId)).startsWith(keyPrefix)){
                cdl.ShareType = 'I';
                cdl.Visibility = 'AllUsers';
            }
        }
    }
}