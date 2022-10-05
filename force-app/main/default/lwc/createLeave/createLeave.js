import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import employeesObject from '@salesforce/schema/Employees__c';
import startDate from '@salesforce/schema/Employees__c.Permission_Start_Date__c';
import endDate from '@salesforce/schema/Employees__c.Permission_End_Date__c';
import description from '@salesforce/schema/Employees__c.Permission_Reason__c';
import First_Name from '@salesforce/schema/Employees__c.Name';
import Last_Name from '@salesforce/schema/Employees__c.LastName__c';
import Off_Duty from '@salesforce/schema/Employees__c.Permission__c';
export default class CreateLeave extends LightningElement {
    objectApiName = employeesObject;
    fields = [First_Name, Last_Name, startDate, endDate, description, Off_Duty];
    @track clickedButtonLabel = 'Add Off Duty Employee';
    @track addOffDutyEmployee = false;
    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Permission granted",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        window.location.reload();
    }

    showcomp(event) {
        const label = event.target.label;
        if (label === 'Add Off Duty Employee') {
            this.clickedButtonLabel = 'Hide Record Page';
            this.addOffDutyEmployee = true;
        } else if (label === 'Hide Record Page') {
            this.clickedButtonLabel = 'Add Off Duty Employee';
            this.addOffDutyEmployee = false;
        }
    }
}