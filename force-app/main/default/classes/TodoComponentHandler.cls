public with sharing class TodoComponentHandler {
    // This handler will return a list of Todo Items
    @AuraEnabled(cacheable=true)
    public static List<Todo__c> getTodos(String searchKey){
        // For including a search later on
        String searchTerm = '%' + searchKey + '%';
        // System.debug('search string is: ' + searchTerm);
        return [SELECT Id, Name, Todo__c, Completed__c FROM Todo__c WHERE (Todo__c LIKE :searchTerm) LIMIT 50];
    }
}