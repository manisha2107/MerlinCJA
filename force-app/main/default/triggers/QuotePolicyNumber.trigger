trigger QuotePolicyNumber on Quote2__c (before update ) {
    GeneratePolicyNumberController.PolicyNumberQuote(trigger.new, trigger.oldMap);
}