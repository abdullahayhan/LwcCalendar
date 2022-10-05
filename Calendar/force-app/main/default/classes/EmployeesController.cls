public with sharing class EmployeesController {
    @AuraEnabled(cacheable=true)
    public static List<Employees__c> getEmployeesByPermission() {
        return
        [
        SELECT Name, LastName__c, Permission_Start_Date__c,Permission_End_Date__c,Permission_Reason__c
        FROM Employees__c
        WHERE Permission__c=true
        ORDER BY Name
    ];
}
}
