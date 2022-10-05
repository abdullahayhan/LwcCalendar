public with sharing class EmployeesController {
    @AuraEnabled(cacheable=true)
    public static String getEmployeesByPermissionJson() {
        List<Employees__c> employees= new List<Employees__c>();
        employees =[ SELECT Name, LastName__c, Permission_Start_Date__c,Permission_End_Date__c,Permission_Reason__c
        FROM Employees__c
        WHERE Permission__c=true
        ORDER BY Name];
    return JSON.serialize(employees);
}

@AuraEnabled(cacheable=true)
public static String getColor(){
    List<String> colors = new List<String>();
    colors.add('#010040');
    colors.add('#011840');
    colors.add('#012740');
    colors.add('#013940');
    colors.add('#233940');
    colors.add('#000345');
    colors.add('#000355');
    colors.add('#005a55');
    colors.add('#005983');
    colors.add('#006455');
    colors.add('#006479');
    colors.add('#003840');
    colors.add('#3d0000');
    colors.add('#403D39');
    colors.add('#015d3b');
    colors.add('#01313b');
    colors.add('#055B4A');
    colors.add('#202D54');
    colors.add('#262626');
    return JSON.serialize(colors);
}
}
