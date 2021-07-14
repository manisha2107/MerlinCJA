trigger GeneratePolicyNumber on InsurancePolicy (before insert , before update) {
    
   GeneratePolicyNumberController.gntPolicyNo(trigger.New , trigger.oldMap);
   
   /**   STEPS:
*  1- Get the last index.
*  2- Once we get the last index check the typeof Policy 
*  3- Increase the number by one and get initials of the Policy 
*  4- Append them together  
*  5- In the same Policy theres a field called Master Policy number
*  6- We need to Append MP-(Masterpolicy number)-policynumber
*   
*/
   
    /*
    String [] arrayOfPolicyNumber=new String[]{'000000','00000','0000','000','00','0',''};
   String [] arrayOfMasterPolicyNumber=new String[]{'0000','000','00','0',''};
         
   System.debug('TRIGGER');

   List<InsurancePolicy> LatestPolicy = [Select Policy_Index__c from InsurancePolicy where Policy_Index__c!=null 
                                       order by Policy_Index__c desc limit 1 ];
   
   List<InsurancePolicy> LatestMasterPolicy = [Select Master_Policy_Index__c,Quote__r.Master_Policy_Number__c from 
                                          InsurancePolicy where Quote__r.Master_Policy_Number__c!=null  
                                          order by Master_Policy_Index__c desc limit 1 ];
   
   //Select Master_Policy_Index__c,Quote__r.Master_Policy_Number__c from InsurancePolicy where Master_Policy_Index__c!=null  order by Master_Policy_Index__c desc limit 1
   
  
   Integer IndexToAdd;
   Integer PolicyIndexToAdd;
   if(!LatestPolicy.isEmpty()){
      System.debug('PolicyIndexToAdd' +LatestPolicy);
      if(LatestPolicy[0].Policy_Index__c!=Null){
         IndexToAdd = Integer.valueOf(LatestPolicy[0].Policy_Index__c) +1;
      }
      else{
         LatestPolicy[0].Policy_Index__c = 0;
         IndexToAdd = 1;
      }
   }
   else{
      IndexToAdd = 1;
   }

   if(!LatestMasterPolicy.isEmpty()){
      System.debug('PolicyIndexToAdd' +LatestMasterPolicy);
      if(LatestMasterPolicy[0].Master_Policy_Index__c != Null){
         PolicyIndexToAdd = Integer.valueOf(LatestMasterPolicy[0].Master_Policy_Index__c) +1;
      }
      else{
         LatestMasterPolicy[0].Master_Policy_Index__c = '';
         PolicyIndexToAdd =1;
      }
   }
   else {
      PolicyIndexToAdd =1;
   }
   
   
   
   System.debug('PolicyIndexToAdd' +PolicyIndexToAdd);
   System.debug('PolicyIndexToAdd' +IndexToAdd);
  
   for(InsurancePolicy curPolicy : Trigger.new){
       InsurancePolicy newVar = new InsurancePolicy();
      
       System.debug('curPolicy ' +curPolicy);
       System.debug('in loop: PolicyType  => '+curPolicy.PolicyType);
       String numb =  String.valueOf(IndexToAdd);
       if(curPolicy.PolicyType   == 'Financial Line'){
           System.debug('arrayOfPolicyNumber[numb.length()]  ' +arrayOfPolicyNumber[numb.length()] );
           curPolicy.PolicyName = 'FL-' +arrayOfPolicyNumber[numb.length()] +IndexToAdd;
           System.debug(' Name =>FL-' +arrayOfPolicyNumber[numb.length()] + ' Index '+IndexToAdd);
        curPolicy.Policy_Index__c = IndexToAdd;           
           System.debug(curPolicy.Name);
           IndexToAdd += 1;
       }
       else if(curPolicy.PolicyType  == 'Commercial Line'){
           
           curPolicy.PolicyName = 'CL-' +arrayOfPolicyNumber[numb.length()] +IndexToAdd;
           System.debug(' Name =>CL-' +arrayOfPolicyNumber[numb.length()] + ' Index '+IndexToAdd);
           curPolicy.Policy_Index__c = IndexToAdd;
           System.debug(curPolicy.Name);
           IndexToAdd += 1;
       }
       else if(curPolicy.PolicyType   == 'Professional Line'){
           
           curPolicy.PolicyName = 'PL-' +arrayOfPolicyNumber[numb.length()] +IndexToAdd;
           System.debug(' Name =>PL-' +arrayOfPolicyNumber[numb.length()] + ' Index '+IndexToAdd);
           curPolicy.Policy_Index__c = IndexToAdd;
           System.debug(curPolicy.Name);
           IndexToAdd += 1;
       }
       else{
            if(LatestMasterPolicy!=null){
               SYSTEM.debug('MASTER POLICY FOUND');
               String MasterPolicyNumber = String.valueOf(PolicyIndexToAdd);
               curPolicy.PolicyName = LatestMasterPolicy[0].Quote__r.Master_Policy_Number__c +arrayOfPolicyNumber[numb.length()] +IndexToAdd +'-'+ arrayOfMasterPolicyNumber[MasterPolicyNumber.length()] +PolicyIndexToAdd;
               curPolicy.Master_Policy_Index__c  = String.valueOf(PolicyIndexToAdd);
               PolicyIndexToAdd +=1;
               SYSTEM.debug('curPolicy '+curPolicy);
            }
            else{
               System.debug('NO MASTER POLICY FOUND');
               String MasterPolicyNumber = String.valueOf(PolicyIndexToAdd);
               curPolicy.PolicyName = 'MP000000' + arrayOfMasterPolicyNumber[MasterPolicyNumber.length()] +PolicyIndexToAdd;
               curPolicy.Master_Policy_Index__c  = String.valueOf(PolicyIndexToAdd);
               PolicyIndexToAdd +=1;
            }
       }
       
       
   }
*/
   
}