public class GeneratePolicyNumberController {
    
 
   /**   STEPS:
*  1- Get the last index.
*  2- Once we get the last index check the typeof Policy 
*  3- Increase the number by one and get initials of the Policy 
*  4- Append them together  
*  5- In the same Policy theres a field called Master Policy number
*  6- We need to Append MP-(Masterpolicy number)-policynumber
*   
*/

    public static Integer IndexToAdd;
    public static Integer PolicyIndexToAdd;
    public static String [] arrayOfPolicyNumber=new String[]{'000000','00000','0000','000','00','0',''};
    public static String [] arrayOfMasterPolicyNumber=new String[]{'000','00','0',''};
    public static RecordType NPRecordType = [Select id , name , developername from RecordType where developername=:'Non_Program_Policy' LIMIT 1];
    public static Set<string> setOfMasterPolicyNum = new Set<string>();
   

    public static void gntPolicyNo(List<InsurancePolicy> listOfPolicies , Map<Id,InsurancePolicy> oldMap){
                
        setPolicyIndexNo();
        for(InsurancePolicy curPolicy : listOfPolicies){
            
            if(NPRecordType.Id == curPolicy.RecordTypeId && curPolicy.PolicyType!=null){
                
                if(curPolicy.Policy_Index__c!=null){
                    
                    System.debug('Policy Name to be Updated::' + curPolicy.Name);
                    curPolicy.Name = getNPPolicyNumber(Integer.valueOf(curPolicy.Policy_Index__c) , curPolicy);
                    System.debug('Policy Name Updated::' + curPolicy.Name);
                    

                }
                else {
                    
                    System.debug('Policy Name to be Updated::' + curPolicy.Name);
                    curPolicy.Name = getNPPolicyNumber(IndexToAdd , curPolicy);
                    System.debug('Policy Name Updated::' + curPolicy.Name);
                    curPolicy.Policy_Index__c = IndexToAdd;                    
                    IndexToAdd+=1;

                }
            }
            
            else{
                
                setOfMasterPolicyNum.add(curPolicy.Master_Policy_Number__c);
            }
          
            
        }

        if(setOfMasterPolicyNum>0){



        }
    }
    public static void setPolicyIndexNo(){
        
        System.debug('TRIGGER');
        
        List<InsurancePolicy> LatestPolicy = [Select Policy_Index__c from InsurancePolicy where Policy_Index__c!=null 
                                              and RecordType.DeveloperName =: 'Non_Program_Policy' order by Policy_Index__c desc limit 1 ];
        
        List<InsurancePolicy> LatestMasterPolicy = [Select Master_Policy_Index__c,Quote__r.Master_Policy_Number__c from 
                                                    InsurancePolicy where Quote__r.Master_Policy_Number__c!=null
                                                    and (RecordType.DeveloperName =: 'Insurance_Certificate' OR 
                                                         RecordType.DeveloperName =: 'Open_Market_Program')
                                                    order by Master_Policy_Index__c desc limit 1 ];
        
        
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
        
        
        System.debug('PolicyIndexToAdd' +PolicyIndexToAdd);
        System.debug('PolicyIndexToAdd' +IndexToAdd);
        
    }
    
    public static String getNPPolicyNumber(Integer policyIndex , InsurancePolicy curPolicy){
        
        	String policyNumber = '';
        
			System.debug('curPolicy ' +curPolicy);
            System.debug('in loop: PolicyType  => '+curPolicy.PolicyType);
            String numb =  String.valueOf(policyIndex);
            if(curPolicy.PolicyType   == 'Financial Line'){
                
				System.debug('arrayOfPolicyNumber[numb.length()]  ' +arrayOfPolicyNumber[numb.length()] );
                policyNumber = 'FL-' +arrayOfPolicyNumber[numb.length()] +policyIndex;
                System.debug(' Name =>FL-' +arrayOfPolicyNumber[numb.length()] + ' Index '+policyIndex);
                System.debug(curPolicy.Name);
                
            }
            else if(curPolicy.PolicyType  == 'Commercial Line'){
                
                policyNumber = 'CL-' +arrayOfPolicyNumber[numb.length()] +policyIndex;
                System.debug(' Name =>CL-' +arrayOfPolicyNumber[numb.length()] + ' Index '+policyIndex);
                System.debug(curPolicy.Name);
               
            }
            else if(curPolicy.PolicyType   == 'Professional Line'){
                
                policyNumber = 'PL-' +arrayOfPolicyNumber[numb.length()] +policyIndex;
                System.debug(' Name =>PL-' +arrayOfPolicyNumber[numb.length()] + ' Index '+policyIndex);
                System.debug(curPolicy.Name);
               
            }
        
        return policyNumber;
    }
    
    public static String getSPPolicyNumber(Integer policyIndex , InsurancePolicy curPolicy){
        
        
        String policyNumber = '';
        
		return policyNumber;
    }

    public static List<InsurancePolicy> getLatestPolicyByMPN(Set<String> setOfMasterPolicyNum){

        return [Select id , name , policy_index__c from InsurancePolicy where Master_Policy_Number__c In: setOfMasterPolicyNum];
                
    }
}