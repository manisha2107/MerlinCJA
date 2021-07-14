public class BillingNAccountPayableCreationFromOpp {
    Public static Date StartRange = date.today()-30;
    Public static Date EndRange = date.today();
    Public static Opportunity opp = new Opportunity();
    Public static Map<id,list<Opportunity>> brokerageOppByAccMap = new Map<id,list<Opportunity>>();
    Public static Map<id,list<Insurer__c>> InsurerOppByAccMap = new Map<id,list<Insurer__c>>();
    Public static Map<Id, AcctSeed__Billing__c> MapOfBillingWithBro = new Map<Id, AcctSeed__Billing__c>();
    Public static Map<Id, AcctSeed__Account_Payable__c> MapOfAPWithInsu = new Map<Id, AcctSeed__Account_Payable__c>();
    Public static Map<Id, List<AcctSeed__Account_Payable_Line__c>> MapOfAPIwithInsu = new Map<Id, List<AcctSeed__Account_Payable_Line__c>>();
    Public static Map<Id, List<AcctSeed__Billing_Line__c>> MapOfBLWithBrok = new Map<Id, List<AcctSeed__Billing_Line__c>>();
    Public static List<AcctSeed__Billing_Line__c> lstBL = new List<AcctSeed__Billing_Line__c>();
    Public static List<AcctSeed__Account_Payable_Line__c> lstAPL = new List<AcctSeed__Account_Payable_Line__c>();
    Public static Set<id> OppIds = new Set<id>();
       
    public static void getFilteredOpportunity()
    {
        for(Opportunity opp : [select id , Brokerage__c, Broker__c,Account_Receivable__c, name from Opportunity where CloseDate <=: EndRange AND CloseDate >=: StartRange AND IsClosed = TRUE])
        {
            OppIds.add(opp.Id);
            
            if(brokerageOppByAccMap.get(opp.Brokerage__c)!=null)
            {
                list<Opportunity> oppLst = brokerageOppByAccMap.get(opp.Brokerage__c);
                oppLst.add(opp);
                System.debug('Opp Brokerage::' + opp.Brokerage__c + 'Size::' + brokerageOppByAccMap.get(opp.Brokerage__c).size());
                brokerageOppByAccMap.put(opp.Brokerage__c, oppLst);
            }else
            {
                list<Opportunity> oppLst = new list<Opportunity>();
                oppLst.add(opp);
                brokerageOppByAccMap.put(opp.Brokerage__c, oppLst);
            }
            
        }
        
        for(Insurer__c insu : [select id, Opportunity__c, Account__c,Account__r.Name, Net_Revenue__c from Insurer__c where Opportunity__c =: OppIds])
        {
            if(InsurerOppByAccMap.containsKey(insu.Account__c))
            {
                list<Insurer__c> insuLst = InsurerOppByAccMap.get(insu.Account__c);
                insuLst.add(insu);
                InsurerOppByAccMap.put(insu.Account__c, insuLst);
            }else
            {
                list<Insurer__c> insuLst = new list<Insurer__c>();
                insuLst.add(insu);
                InsurerOppByAccMap.put(insu.Account__c, insuLst);
            }
            
        }

		// Billing & Billing Line Items        
        for(Id bId: brokerageOppByAccMap.keySet()){
            
            AcctSeed__Billing__c accBilling = new AcctSeed__Billing__c();
            accBilling.AcctSeed__Customer__c = bId;
            accBilling.AcctSeed__Accounting_Period__c = 'a1Ff0000003g8ggEAA';
            
	        // Field Mapping of BL
	        MapOfBillingWithBro.put(bId,accBilling );
            
            for(Opportunity opp: brokerageOppByAccMap.get(bId)){
                
                if(MapOfBLWithBrok.containsKey(bId))
                {
                    list<AcctSeed__Billing_Line__c> blLst = MapOfBLWithBrok.get(bId);
                    AcctSeed__Billing_Line__c bl = new AcctSeed__Billing_Line__c();
                    bl.Opportunity__c = opp.Id;
                    bl.AcctSeed__Hours_Units__c = 1;
                    bl.AcctSeed__Rate__c = opp.Account_Receivable__c;
                    blLst.add(bl);
                    MapOfBLWithBrok.put(bId, blLst);
                }else
                {
                    list<AcctSeed__Billing_Line__c> blLst = new list<AcctSeed__Billing_Line__c>();
                    AcctSeed__Billing_Line__c bl = new AcctSeed__Billing_Line__c();
                    bl.Opportunity__c = opp.Id;
                    bl.AcctSeed__Hours_Units__c = 1;
                    bl.AcctSeed__Rate__c = opp.Account_Receivable__c;
                    blLst.add(bl);
                    MapOfBLWithBrok.put(bId, blLst);
                }
                
            }
           
        }
        
        insert MapOfBillingWithBro.values();
        
        for(Id bId: MapOfBillingWithBro.keySet()){
            
            if(MapOfBLWithBrok.get(bId)!=null){
                
            
            System.debug('Size of BL::' + MapOfBLWithBrok.get(bId).size());    
            for(AcctSeed__Billing_Line__c bline: MapOfBLWithBrok.get(bId)){
                
                bline.AcctSeed__Billing__c = MapOfBillingWithBro.get(bId).Id;
                lstBL.add(bline);
                
            }
                
                    
            }
            
        }
        
        insert lstBL;
        
        // Account Payable and Lines       
        for(Id IId: InsurerOppByAccMap.keySet()){
            
            AcctSeed__Account_Payable__c accPay = new AcctSeed__Account_Payable__c();
            accPay.AcctSeed__Vendor__c = IId;
            accPay.AcctSeed__Accounting_Period__c = 'a1Ff0000003g8ggEAA';
            accPay.AcctSeed__Payee_Reference__c = 'Account Payable for ' +InsurerOppByAccMap.get(IId)[0].Account__r.Name;
            
	        // Field Mapping of PL
	        MapOfAPWithInsu.put(IId,accPay );
            
            for(Insurer__c insu: InsurerOppByAccMap.get(IId)){
                
                if(MapOfAPIwithInsu.containsKey(IId))
                {
                    list<AcctSeed__Account_Payable_Line__c> APILst = MapOfAPIwithInsu.get(IId);
                    AcctSeed__Account_Payable_Line__c AP = new AcctSeed__Account_Payable_Line__c();
                    AP.Insurer__c = insu.Id;
                    AP.AcctSeed__Quantity__c = 1;
                    AP.AcctSeed__Unit_Cost__c = insu.Net_Revenue__c;
                    APILst.add(AP);
                    MapOfAPIwithInsu.put(IId, APILst);
                }else
                {
                    list<AcctSeed__Account_Payable_Line__c> APILst = new list<AcctSeed__Account_Payable_Line__c>();
                    AcctSeed__Account_Payable_Line__c AP = new AcctSeed__Account_Payable_Line__c();
                    AP.Insurer__c = insu.Id;
                    AP.AcctSeed__Quantity__c = 1;
                    AP.AcctSeed__Unit_Cost__c =  insu.Net_Revenue__c;
                    APILst.add(AP);
                    MapOfAPIwithInsu.put(IId, APILst);
                }
                
            }
           
        }
        
        insert MapOfAPWithInsu.values();
        
        for(Id IId: MapOfAPWithInsu.keySet()){
            
            if(MapOfAPIwithInsu.get(IId)!=null){
                
            
            System.debug('Size of APL::' + MapOfAPIwithInsu.get(IId).size());    
            for(AcctSeed__Account_Payable_Line__c APline: MapOfAPIwithInsu.get(IId)){
                
                APline.AcctSeed__Account_Payable__c = MapOfAPWithInsu.get(IId).Id;
                lstAPL.add(APline);
                
            }
                
                    
            }
            
        }
        
        insert lstAPL;
    }
    
   
    
}