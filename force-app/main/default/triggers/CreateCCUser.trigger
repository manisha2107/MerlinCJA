trigger CreateCCUser on Account (after insert) {
    
    List<User> listOfUsr = new List<User>();
    Set<Id> UserId =new Set<Id>();
    for(Account acc: Trigger.New){
        system.debug('Acccount matches for loop:'+ acc);
        
        if(acc.HiddenAccount__c != null && (acc.Username__c != null || acc.PersonEmail !=null)){
            system.debug('Acccount matches if condition: '+ acc);
            
            Profile pro = [Select id , name from Profile where Id =: '00ef0000000KvVhAAK'];
            
            
            User usr = new User(LastName = acc.LastName,
                                FirstName= acc.FirstName,
                                Email = acc.PersonEmail,
                                Username = acc.PersonEmail,
                                ProfileId = pro.id,
                                TimeZoneSidKey = 'GMT',
                                LanguageLocaleKey = 'en_US',
                                EmailEncodingKey = 'UTF-8',
                                LocaleSidKey = 'en_US',
                                ContactId = acc.PersonContactId,
                                Alias = acc.LastName,
                                //PortalRole = 'COO',
                                CommunityNickname = acc.PersonEmail
                                
                               );
            
            System.debug('User to be created::' + usr);  
            
            
            listOfUsr.add(usr);
            
        }
        
        // All your test code here
        insert listOfUsr;
        
        for(integer i=0 ;  i< listOfUsr.size(); i++){
            UserId.add(listOfUsr[i].Id);
        }
        
        if(listOfUsr.size()>0){
            
            SelfRegisterUserPermissonSet.AssignPermissionSetToUsers(UserId);
            System.debug('Insert List of Users::' + listOfUsr	);
        }
    }
    
    
    
}