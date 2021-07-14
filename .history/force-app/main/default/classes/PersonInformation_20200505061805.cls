public with sharing class PersonInformation {
    
    
    public static User usr = new User();

    public PersonInformation() {

    }

    @AuraEnabled
    public static Account getAccountRecord(){

        String usrId = UserInfo.getUserId();

        if(usrId!=null){

            usr = [Select id, Contact.AccountId, AccountId, ContactId from User where Id =: usrId];
        
            System.debug('User Information::' + usr);    

            if(Contact.AccountId!=null){

                Account usrAcc = [Select id, Program_Audience__c, Program_Audience__r.Name ,HiddenAccount__r.Name , HiddenAccount__c, personmailingstreet, PersonMailingCity, PersonMailingCountry, PersonMailingPostalCode, PersonMailingState, firstName, lastname, PersonEmail from Account where Id =: usr.Contact.AccountId LIMIT 1];
        
                System.debug('Account Information::' + usrAcc );    

                return usrAcc;

            }

            return null;
        }

        return null;

    }

    @AuraEnabled
    public static string saveAccountRecord(Account acc){


        try{

        update acc;
        return 'Account Updated Successfully';

        
        }
        catch(Exception e){

            System.debug(Logginglevel.ERROR, e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        
    }
}