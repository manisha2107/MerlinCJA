trigger storeTemplateIDS on Policy_Wording_and_Endorsements__c (after insert,after update,after delete) {
    
    if (trigger.isUpdate || trigger.isInsert || trigger.isUndelete)
    { 
        
        Set<ID> policyIds = new Set<ID>();
        
        for (Policy_Wording_and_Endorsements__c pwd : trigger.new) {
            
            if(pwd.Conga_Template__c != null){
                
                System.debug('PWD::' + pwd);
                
                policyIds.add(pwd.Policy__c);
                
            }
        }
        
        If(policyIds.size()>0){
            
            Map<ID, Policy_Wording_and_Endorsements__c> PWDForPolicies = new Map<ID, Policy_Wording_and_Endorsements__c>([select Id,Policy__c ,Conga_Template__c from Policy_Wording_and_Endorsements__c where Policy__c in :policyIds and Status__c = 'Activated' and Conga_Template__c != null ORDER BY Sorting_Order__c ASC]);
            Map<ID, InsurancePolicy> policiesToUpdate = new Map<ID, InsurancePolicy>([select Id ,Conga_Template__c,PolicyDescription from InsurancePolicy where Id in :policyIds]);
            
            for (InsurancePolicy pol : policiesToUpdate.values()) {
                List<String> pwdValues = new List<String>();
                
                System.debug('PWDForPolicies::' + PWDForPolicies);
                
                string seperator = ',';
                
                for (Policy_Wording_and_Endorsements__c pw : PWDForPolicies.values()) {
                
                    System.debug('PW::' + pw);
                    
                    if (pw.Policy__c == pol.Id)
                        pwdValues.add(pw.Conga_Template__c);
                }
        
                If(pol.Conga_Template__c != Null){
                    
                    System.debug('pol.Conga_Template__c::' + pol.Conga_Template__c);
                    
                    System.debug('pwdValues Size::' + pwdValues.size());
                    
                    pol.PolicyDescription = pol.Conga_Template__c + ',' + String.join(pwdValues, seperator);
                    pol.Template_Ids2__c = '';
                    pol.Template_Ids__c = '';
                    pol.Template_Ids3__c = '';
                    
                    
                    System.debug('Policy Description::' + pol.PolicyDescription);
                    
                   //   pol.Template_ids__c = pol.Conga_Template__c + ',' + String.join(pwdValues, seperator);
               
                    if(pol.PolicyDescription.length() > 254){
                   
                        pol.Template_Ids__c = pol.PolicyDescription.substring(0,254);
                        
                        if(pol.PolicyDescription.length() > 509){
                            
                            pol.Template_Ids2__c = pol.PolicyDescription.substring(254,509);

                        if(pol.PolicyDescription.length() >= 510+254){
                                                        
                            
                            pol.Template_Ids3__c = pol.PolicyDescription.substring(509,510+254);
                        }else{
                            
                            pol.Template_Ids3__c = pol.PolicyDescription.substring(509,pol.PolicyDescription.length());
                        }   
                           
                 
                        }
                        else{
                            
                              pol.Template_Ids2__c = pol.PolicyDescription.substring(254,pol.PolicyDescription.length());
                 
                        }
                   
                    }   
                    else{
                        
                        pol.Template_Ids__c = pol.PolicyDescription.substring(0,pol.PolicyDescription.length());
                    }

                }
                
                else{
                    
                    System.debug('pwdValues Size::' + pwdValues.size());
                    
                    pol.Template_Ids2__c = '';
                    pol.Template_Ids__c = '';
                    pol.Template_Ids3__c = '';
                    
                    pol.PolicyDescription =  String.join(pwdValues, seperator);
                    if(pol.PolicyDescription.length() > 254){
                   
                        pol.Template_Ids__c = pol.PolicyDescription.substring(0,254);
                        
                        if(pol.PolicyDescription.length() > 509){
                            
                            pol.Template_Ids2__c = pol.PolicyDescription.substring(254,509);
                              if(pol.PolicyDescription.length() > 510+254){
                                                        
                            
                            pol.Template_Ids3__c = pol.PolicyDescription.substring(509,510+254);
                        }else{
                            
                            pol.Template_Ids3__c = pol.PolicyDescription.substring(509,pol.PolicyDescription.length());
                        } 
                           
                 
                        }
                        else{
                            
                              pol.Template_Ids2__c = pol.PolicyDescription.substring(254,pol.PolicyDescription.length());
                 
                        }
                   
                    }   
                    else{
                        
                        pol.Template_Ids__c = pol.PolicyDescription.substring(0,pol.PolicyDescription.length());
                    }                  
    
                }
        
            }
            

            update policiesToUpdate.values();
            
        }
    }
    
    if(trigger.isDelete)
    {
        Set<ID> deletedpolicyIds = new Set<ID>();
        
        for (Policy_Wording_and_Endorsements__c pwd : trigger.old) 
        {
            system.debug('in for loop'+pwd);
            
            if(pwd.Conga_Template__c != null && pwd.Status__c == 'Activated')
            {
                  
                system.debug('in if loop'+pwd);
          
            
                deletedpolicyIds.add(pwd.Policy__c);
                system.debug(' new'+trigger.new);
                system.debug('old'+trigger.old);
                
            }
        }
        
        If(deletedpolicyIds.size()>0){
            
              system.debug('in second if loop');
          
            Map<ID, Policy_Wording_and_Endorsements__c> PWDForPolicies = new Map<ID, Policy_Wording_and_Endorsements__c>([select Id,Policy__c ,Conga_Template__c from Policy_Wording_and_Endorsements__c where Policy__c in :deletedpolicyIds]);
            Map<ID, InsurancePolicy> policiesToUpdate = new Map<ID, InsurancePolicy>([select Id ,PolicyDescription from InsurancePolicy where Id in :deletedpolicyIds]);
            
           system.debug('in some if loop'+policiesToUpdate.values());
            for (InsurancePolicy pol : policiesToUpdate.values()) {
                List<String> pwdValues = new List<String>();
                
                 system.debug('in second if loop'+pol);
                string seperator = ',';
                
                for (Policy_Wording_and_Endorsements__c pw : PWDForPolicies.values()) {
                    if (pw.Policy__c == pol.Id)
                        pwdValues.add(pw.Conga_Template__c);
                }
                
                pol.PolicyDescription = String.join(pwdValues, seperator);
                pol.Template_Ids2__c = '';
                    pol.Template_Ids__c = '';
                    pol.Template_Ids3__c = '';
               // pol.Template_ids__c = String.join(pwdValues, seperator);

               if(pol.PolicyDescription.length() > 245){
                   
                        pol.Template_Ids__c = pol.PolicyDescription.substring(0,254);
                        
                        if(pol.PolicyDescription.length() > 509){
                            
                            pol.Template_Ids2__c = pol.PolicyDescription.substring(255,509);
                          if(pol.PolicyDescription.length() > 510+254){
                                                        
                            
                            pol.Template_Ids3__c = pol.PolicyDescription.substring(510,510+255);
                        }else{
                            
                            pol.Template_Ids3__c = pol.PolicyDescription.substring(510,pol.PolicyDescription.length());
                        } 
                           
                 
                        }
                        else{
                            
                              pol.Template_Ids2__c = pol.PolicyDescription.substring(255,pol.PolicyDescription.length());
                 
                        }
                   
                    }   
                    else{
                        
                        pol.Template_Ids__c = pol.PolicyDescription.substring(0,pol.PolicyDescription.length());
                    }
            }
            
            update policiesToUpdate.values();
            
        }
    }
    
}