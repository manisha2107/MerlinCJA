trigger OnQuoteDelete_Del_Related on Quote2__c (before delete) {
    if(Trigger.isBefore){
        if(Trigger.isDelete){
            System.debug('Delete Trigger Running');
            /*
            Set<ID> Quote_IDs = new Set<ID>();
            
            for(Integer i = 0 ; i < Trigger.new.size(); i++ ){
                Quote_IDs.add(Trigger.new[i].Id);
            }//For
            */
            for(Integer i = 0 ; i < Trigger.old.size(); i++ ){
            	System.debug('Quote IDs'+Trigger.old[i].Id);
            }
            
            
        }// if(Trigger.isDelete)
    }//if(Trigger.isAfter)
}