import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import getEmployeesPermission from '@salesforce/apex/EmployeesController.getEmployeesByPermission';

export default class Calendar extends LightningElement {

    @track employees;
    @track error;
    @track finalEmployees;
    fullCalendarJsInitialised = false;
    handleLoad() {
        getEmployeesPermission()
            .then(result => {
                this.employees = result;
            })
            .catch(error => {
                this.error = error;
            });
    }

    renderedCallback() {


        if (this.fullCalendarJsInitialised) {
            return;
        }
        this.fullCalendarJsInitialised = true;
        Promise.all([
                loadScript(this, FullCalendarJS + '/jquery.min.js'),
                loadScript(this, FullCalendarJS + '/moment.min.js'),
                loadScript(this, FullCalendarJS + '/fullcalendar.min.js'),
                loadStyle(this, FullCalendarJS + '/fullcalendar.min.css'),
            ])
            .then(() => {
                // Initialise the calendar configuration
                this.initialiseFullCalendarJs();
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                //this.handleLoad();
                console.error({
                    message: 'Error occured on FullCalendarJS',
                    error
                });
            })
    }


    initialiseFullCalendarJs() {

        const ele = this.template.querySelector('div.fullcalendarjs');
        for (var i = 0; i < this.employees.length; i++) {
            this.finalEmployees.push({
                start: this.employees[i].Permission_Start_Date__c,
                end: this.employees[i].Permission_End_Date__c,
                title: this.employees[i].Name + this.employees[i].LastName__c
            });
        }
        // eslint-disable-next-line no-undef
        $(ele).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            defaultDate: new Date(),
            navLinks: true,
            editable: true,
            eventLimit: true,
            events: this.finalEmployees
        });
    }
}