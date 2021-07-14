public class Testing_Class {
    
    public static string  test(){
        Short_Rate__mdt[] shortRate = 
        [Select Days_Policy_In_Force__c,Percentage_of_Premium_Retained__c from Short_Rate__mdt];
    Set<decimal> SortRateData = new Set<decimal>();
    for(Short_Rate__mdt record:shortRate)
    {
        SortRateData.add(record.Days_Policy_In_Force__c);
    }   
    
    System.debug(SortRateData);
    return 'success';    
    }
    
  
    
}