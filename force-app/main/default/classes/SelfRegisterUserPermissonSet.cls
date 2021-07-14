public class SelfRegisterUserPermissonSet {
    
    @future 
    public static void AssignPermissionSetToUsers (Set<Id> usersId) {
        // Perform long-running code
        List<PermissionSetAssignment> permissionSetList = new List<PermissionSetAssignment>();
        System.debug('Users::' + usersId);
        PermissionSetGroup pmg = [SELECT Id, DeveloperName FROM PermissionSetGroup where DeveloperName='Community_Permission_Set_Group' limit 1];
        system.debug('perm id :'+ pmg);
        
        for (User u : [Select Id, Name FROM User Where Id IN : usersId]){ 
        
            System.debug('User instance::' + u);
            
            // Add fields as per your requirement...
            permissionSetList.add(new PermissionSetAssignment(PermissionSetGroupId = pmg.Id, AssigneeId = u.Id));
            //PermissionSetAssignment psa = new PermissionSetAssignment (PermissionSetId = pmg.Id, AssigneeId = listOfUsr.Id);
            //permissionSetList.add(psa);
            system.debug('perm set list :'+ permissionSetList);
        
        }
        upsert permissionSetList;
    }
}