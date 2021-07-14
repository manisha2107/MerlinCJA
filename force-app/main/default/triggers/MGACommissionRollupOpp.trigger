trigger MGACommissionRollupOpp on Insurer__c (after insert, after update, after delete, after undelete) {
    
    Set<ID> setID = new Set<ID>();
    List<Opportunity> lstOpp = new List<Opportunity>();
    
    
    
    if(trigger.isinsert || trigger.isundelete){
        for(insurer__c c : trigger.new){
            setID.add(c.Opportunity__c);
        }
    }
    
    
    else if(trigger.isDelete){
        for(insurer__c c : trigger.old){
            setID.add(c.Opportunity__c);
        }
    }
    
    
    
    else if(trigger.isUpdate){
        for(insurer__c c : trigger.new){
            if(c.Opportunity__c != null){
                if(trigger.oldmap.get(c.id).Opportunity__c != c.Opportunity__c){
                    setID.add(c.Opportunity__c);     
                }
            } 
            setID.add(trigger.oldmap.get(c.id).Opportunity__c);
        }
    }
    
    
    
    if(setid.size() > 0){
        
        lstOpp = [Select id,Total_MGA_Commission__c, Premium_Amount__c, Transaction_Fees__c, Commission__c, (Select id,MGA_Commission_Amount__c from Insurers__r where RecordType.Name='Insurer Of Opportunity') from Opportunity where id IN : setID ];
    
    }
    
    
    
    for(Opportunity acc : lstOpp){
        decimal val = 0;
        for(insurer__c ins : acc.Insurers__r){
                        
            val += (ins.MGA_Commission_Amount__c != null ? ins.MGA_Commission_Amount__c : 0);
            
        }
        acc.Total_MGA_Commission__c = val;
        Decimal retailCommission = (acc.Premium_Amount__c * (acc.Commission__c != null ? acc.Commission__c : 0));
        Decimal retailCommissonAmount =  (retailCommission != 0 ? retailCommission/100 : 0);
        acc.Amount = (acc.Premium_Amount__c  - retailCommissonAmount) + (acc.Transaction_Fees__c !=null ? acc.Transaction_Fees__c : 0);
        System.debug('Amount::'+acc.amount);
    }
    
    
    
    try{
        update lstOpp;
    }
    
    catch (exception e){
        
        system.debug('exception==>' + e);
        
    }
    
}