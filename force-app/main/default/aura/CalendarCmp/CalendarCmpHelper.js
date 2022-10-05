({
    loadDataToCalendar: function(component, data) {
        $('#calendar').fullCalendar({
            eventRender: function(event, element, view) {

                var theDate = event.start
                var endDate = event.dowend;
                var startDate = event.dowstart;

                if (theDate >= endDate) {
                    return false;
                }

                if (theDate <= startDate) {
                    return false;
                }
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            selectable: true,
            defaultDate: new Date(),
            editable: true,
            eventLimit: true,
            events: data
        });
    },
    formatFullCalendarData: function(component, events) {
        var josnDataArray = [];
        for (var i = 0; i < events.length; i++) {
            var startdate = $A.localizationService.formatDate(events[i].Permission_Start_Date__c);
            var enddate = $A.localizationService.formatDate(events[i].Permission_End_Date__c);
            josnDataArray.push({
                'title': '[OFF DUTY] ' + events[i].Name + ' ' + events[i].LastName__c + '\n' +
                    'Off Duty Reason : ' + events[i].Permission_Reason__c,
                start: '09:00',
                end: '18:00',
                dow: [0, 1, 2, 3, 4, 5, 6],
                dowstart: new Date(startdate),
                dowend: new Date(enddate)
            });
        }

        return josnDataArray;
    },
    fetchCalenderEvents: function(component) {
        var action = component.get("c.getEmployeesByPermission");

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();

                var josnArr = this.formatFullCalendarData(component, data);
                this.loadDataToCalendar(component, josnArr);
                component.set("v.Objectlist", josnArr);

            } else if (state === "ERROR") {

            }
        });
        $A.enqueueAction(action);
    }
})