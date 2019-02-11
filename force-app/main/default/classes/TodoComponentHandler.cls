public with sharing class TodoComponentHandler {
    // This handler will return a list of Todo Items
    @AuraEnabled(cacheable=true)
    public static List<Todo__c> getTodos(){
        //String searchTerm = '%' + searchKey + '%';
        //System.debug('search string is: ' + searchTerm);
        return [SELECT Id, Name, Todo__c, Completed__c FROM Todo__c LIMIT 50];
    }
}