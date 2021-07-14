public class ScheduleRollup {


    public static string  runBatch(){
    List<FinServ__RollupByLookupConfig__c> queriedRollups= new List<FinServ__RollupByLookupConfig__c>();
  queriedRollups =[Select Id From FinServ__RollupByLookupConfig__c Where FinServ__Active__c = true];
  
   List<Id> rollupsToRun = new List<Id>();
   for (FinServ__RollupByLookupConfig__c Rollup : queriedRollups) {
        RollupsToRun.add(Rollup.Id);
  }
  
  // Create an instance of FSC Class: RollupRecalculationBatchable
  FinServ.RollupRecalculationBatchable Job= new FinServ.RollupRecalculationBatchable(RollupsToRun);
  
  Database.executeBatch(Job);
        
        return 'Success';
}

}