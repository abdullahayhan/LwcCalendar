import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import getEmployees from '@salesforce/apex/EmployeesController.getEmployeesByPermissionJson';
import getColors from '@salesforce/apex/EmployeesController.getColor';

export default class FullCalendarJs extends LightningElement {

    @track returnedEmployees = [];
    @track finalEmployees = [];
    @track returnedColors = [];
    @track finalColors = [];
    fullCalendarJsInitialised = false;
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
                this.getTasks();
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.error({
                    message: 'Error occured on FullCalendarJS',
                    error
                });
            })
    }

    initialiseFullCalendarJs() {
        for (var i = 0; i < this.returnedEmployees.length; i++) {
            var startHours = new Date(this.returnedEmployees[i].Permission_Start_Date__c).getUTCHours();
            var startMinute = new Date(this.returnedEmployees[i].Permission_Start_Date__c).getMinutes();
            this.finalEmployees.push({
                start: startHours + ':' + startMinute,
                //end: endHours + ':' + endMinute,
                dow: [0, 1, 2, 3, 4, 5, 6],
                dowstart: new Date(this.returnedEmployees[i].Permission_Start_Date__c).setDate((new Date(this.returnedEmployees[i].Permission_Start_Date__c).getDate() - 1)),
                dowend: new Date(this.returnedEmployees[i].Permission_End_Date__c),
                title: '[OFF DUTY] ' + this.returnedEmployees[i].Name + ' ' + this.returnedEmployees[i].LastName__c + '\n' +
                    'Reason : ' + this.returnedEmployees[i].Permission_Reason__c + '\n',
                color: this.returnedColors[Math.floor(Math.random() * this.returnedColors.length)]
            });

        }

        const ele = this.template.querySelector('div.fullcalendarjs');
        // eslint-disable-next-line no-undef
        $(ele).fullCalendar({
            eventRender: function(event) {
                var theDate = event.start;
                var endDate = event.dowend;
                var startDate = event.dowstart;
                if (theDate >= endDate) {
                    return false;
                }
                if (theDate <= startDate) {
                    return false;
                }
                var eventEnd = moment(new Date(event.dowend).setDate((new Date(event.dowend).getDate() + 31)));
                var NOW = moment();
                if (eventEnd.diff(NOW, 'seconds') <= 0) {
                    return false;
                }
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            defaultDate: new Date(),
            displayEventTime: false,
            navLinks: true,
            editable: true,
            eventLimit: 5,
            allday: true,
            events: this.finalEmployees
        });
    }

    getTasks() {
        getEmployees()
            .then(result => {
                this.returnedEmployees = JSON.parse(result);
                this.initialiseFullCalendarJs();
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.outputResult = undefined;
            });
        getColors()
            .then(result => {
                this.returnedColors = JSON.parse(result);
            })
            .catch(error => {
                this.error = error;
                this.outputResult = undefined;
            });
    }
}