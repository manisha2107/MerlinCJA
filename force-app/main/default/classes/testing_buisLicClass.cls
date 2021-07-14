public class testing_buisLicClass {
    
    Public static void UpdateBusinessLicense(
        BusinessLicense [] BusinessLicensArray, //--->acc id---person acc, this is a list without insertion
        String Id //accId----> person acc
        
    ){
        try{
            
            System.debug('BUSINESSLICENSE RECEVED ' + BusinessLicensArray);
            System.debug('ID ' + Id);
            
            List <BusinessLicense> AllBusinessLicense =[SELECT IsActive,EID__c FROM BusinessLicense WHERE AccountId=: Id];
            
            //there are no business licenses since we didnt insert the licenses for person acc
            
            System.debug(' All Business Licenses are:::: ' + AllBusinessLicense);
            
            // INtialize
            map <String,BusinessLicense> AllBusLicMap = new map <String,BusinessLicense>();
            // Put data into map
            for(BusinessLicense BL: AllBusinessLicense)
            {
                //test class no covering this probably because AllBusinessLicense has no data
                BL.IsActive=false;
                AllBusLicMap.put(BL.EID__c, BL);
            }
            
            
            
            for(BusinessLicense BL: BusinessLicensArray)
            {
                //not sure why this isnt being covered
                BL.IsActive=true;
                AllBusLicMap.put(BL.EID__c, BL);
            }
            
            
            //BusinessLicensArray.IsActive= true;
            //not covered 
            //
            System.debug('AllBusLicMap.values() ' + AllBusLicMap.values());
            upsert AllBusLicMap.values() EID__c;
            
            
        }
        catch(exception e){
            
        }
    }
    
    
    public static void getBuisnessLicenseData(String AccId){
        try {
            List<BusinessLicense> listOfBLicense = new List<BusinessLicense>();
            listOfBLicense = [Select Percentage_Of_Total_Income__c,Total_Annual_Earning__c,Provincial_Jurisdiction__c,Name
                              from BusinessLicense where ContactId =: AccId and IsActive = True  ];
            
            SYSTEM.debug('listOfBLicense' +listOfBLicense);
            
        } catch (Exception e) {
            
        }
    }
}